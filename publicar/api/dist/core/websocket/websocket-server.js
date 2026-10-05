"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachWebSocketServer = attachWebSocketServer;
const node_url_1 = require("node:url");
const ws_1 = __importStar(require("ws"));
const app_error_1 = require("../errors/app-error");
const env_1 = require("../config/env");
const prisma_1 = require("../database/prisma");
const jwt_token_service_1 = require("../../features/auth/infrastructure/services/jwt-token.service");
const domain_event_bus_1 = require("../../shared/infrastructure/events/domain-event-bus");
const domain_event_1 = require("../../shared/infrastructure/events/domain-event");
const publish_realtime_event_1 = require("../../shared/infrastructure/events/publish-realtime-event");
const presence_1 = require("./presence");
const WS_PATH = '/ws';
function attachWebSocketServer(server) {
    const tokenService = new jwt_token_service_1.JwtTokenService(env_1.env.jwt.secret, env_1.env.jwt.expiresIn);
    const wss = new ws_1.WebSocketServer({ server, path: WS_PATH });
    wss.on('connection', (ws, req) => {
        try {
            const payload = authenticateConnection(req, tokenService);
            applyAuth(ws, payload);
        }
        catch {
            ws.close(4401, 'Unauthorized');
            return;
        }
        const authed = ws;
        if (authed.actor === 'cliente' && authed.clienteId != null) {
            if ((0, presence_1.addClientePresence)(authed.clienteId)) {
                (0, publish_realtime_event_1.publishRealtimeEvent)(domain_event_1.RealtimeEvents.CHAT_PRESENCIA_ACTUALIZADA, {
                    idCliente: authed.clienteId,
                    isOnline: true,
                });
            }
        }
        else if (authed.userId != null && (0, presence_1.addUserPresence)(authed.userId)) {
            (0, publish_realtime_event_1.publishRealtimeEvent)(domain_event_1.RealtimeEvents.CHAT_PRESENCIA_ACTUALIZADA, {
                idUsuario: authed.userId,
                isOnline: true,
            });
        }
        ws.on('message', (raw) => {
            void handleClientMessage(wss, authed, raw);
        });
        ws.on('close', () => {
            if (authed.actor === 'cliente' && authed.clienteId != null) {
                if ((0, presence_1.removeClientePresence)(authed.clienteId)) {
                    (0, publish_realtime_event_1.publishRealtimeEvent)(domain_event_1.RealtimeEvents.CHAT_PRESENCIA_ACTUALIZADA, {
                        idCliente: authed.clienteId,
                        isOnline: false,
                    });
                }
                return;
            }
            if (authed.userId != null && (0, presence_1.removeUserPresence)(authed.userId)) {
                (0, publish_realtime_event_1.publishRealtimeEvent)(domain_event_1.RealtimeEvents.CHAT_PRESENCIA_ACTUALIZADA, {
                    idUsuario: authed.userId,
                    isOnline: false,
                });
            }
        });
        ws.on('error', () => {
            ws.terminate();
        });
    });
    domain_event_bus_1.domainEventBus.on('event', (event) => {
        broadcastEvent(wss, event);
    });
    return wss;
}
function applyAuth(ws, payload) {
    if (payload.actor === 'plataforma') {
        throw new app_error_1.UnauthorizedError('Token de plataforma no admite websocket');
    }
    if (payload.actor === 'cliente') {
        const idCliente = payload.idCliente ??
            Number(/^c:(\d+)$/.exec(payload.sub)?.[1] ?? Number.NaN);
        if (!Number.isInteger(idCliente) || idCliente <= 0) {
            throw new app_error_1.UnauthorizedError('Token de cliente inválido');
        }
        ws.actor = 'cliente';
        ws.clienteId = idCliente;
        return;
    }
    const userId = Number(payload.sub);
    if (!Number.isInteger(userId) || userId <= 0) {
        throw new app_error_1.UnauthorizedError('Token inválido');
    }
    ws.actor = 'usuario';
    ws.userId = userId;
}
async function handleClientMessage(wss, sender, raw) {
    const text = normalizeRawMessage(raw);
    if (!text) {
        return;
    }
    let parsed;
    try {
        parsed = JSON.parse(text);
    }
    catch {
        return;
    }
    const type = typeof parsed.type === 'string' ? parsed.type.trim() : '';
    if (!type) {
        return;
    }
    if (domain_event_1.SignalingRealtimeEvents.has(type)) {
        await relayWebrtcSignal(wss, sender, parsed.payload);
        return;
    }
    if (!domain_event_1.ClientRelayRealtimeEvents.has(type)) {
        return;
    }
    if (sender.actor !== 'usuario' || sender.userId == null || Number.isNaN(sender.userId)) {
        return;
    }
    broadcastEvent(wss, {
        type,
        payload: parsed.payload ?? {},
        targetUserId: sender.userId,
    }, sender);
}
async function relayWebrtcSignal(wss, sender, rawPayload) {
    if (!rawPayload || typeof rawPayload !== 'object') {
        return;
    }
    const payload = rawPayload;
    const idConversacion = Number(payload.idConversacion);
    if (!Number.isInteger(idConversacion) || idConversacion <= 0) {
        return;
    }
    const kind = typeof payload.kind === 'string' ? payload.kind.trim() : '';
    if (!kind) {
        return;
    }
    const prismaChat = prisma_1.prisma;
    const participants = await prismaChat.chatParticipante.findMany({
        where: { idConversacion, anulado: false },
        select: { idUsuario: true, idCliente: true },
    });
    if (participants.length === 0) {
        return;
    }
    const isParticipant = sender.actor === 'cliente'
        ? participants.some((item) => item.idCliente === sender.clienteId)
        : participants.some((item) => item.idUsuario === sender.userId);
    if (!isParticipant) {
        return;
    }
    const from = sender.actor === 'cliente'
        ? { actor: 'cliente', id: sender.clienteId }
        : { actor: 'usuario', id: sender.userId };
    const relayPayload = {
        ...payload,
        from,
    };
    const userIds = participants
        .map((item) => item.idUsuario)
        .filter((id) => id != null && id !== sender.userId);
    const clienteIds = participants
        .map((item) => item.idCliente)
        .filter((id) => id != null && id !== sender.clienteId);
    for (const userId of new Set(userIds)) {
        broadcastEvent(wss, {
            type: domain_event_1.RealtimeEvents.WEBRTC_SIGNAL,
            payload: relayPayload,
            targetUserId: userId,
        });
    }
    for (const clienteId of new Set(clienteIds)) {
        broadcastEvent(wss, {
            type: domain_event_1.RealtimeEvents.WEBRTC_SIGNAL,
            payload: relayPayload,
            targetClienteId: clienteId,
        });
    }
}
function broadcastEvent(wss, event, excludeClient) {
    const message = JSON.stringify({
        type: event.type,
        payload: event.payload,
    });
    for (const client of wss.clients) {
        const authed = client;
        if (authed.readyState !== ws_1.default.OPEN) {
            continue;
        }
        if (excludeClient && authed === excludeClient) {
            continue;
        }
        if (event.targetClienteId != null) {
            if (authed.actor !== 'cliente' || authed.clienteId !== event.targetClienteId) {
                continue;
            }
        }
        else if (event.targetUserId != null) {
            if (authed.actor === 'cliente' || authed.userId !== event.targetUserId) {
                continue;
            }
        }
        authed.send(message);
    }
}
function normalizeRawMessage(raw) {
    if (typeof raw === 'string') {
        return raw;
    }
    if (Buffer.isBuffer(raw)) {
        return raw.toString('utf8');
    }
    if (Array.isArray(raw)) {
        return Buffer.concat(raw).toString('utf8');
    }
    if (raw instanceof ArrayBuffer) {
        return Buffer.from(raw).toString('utf8');
    }
    return null;
}
function authenticateConnection(req, tokenService) {
    const requestUrl = req.url ?? '';
    const tokenFromQuery = new node_url_1.URL(requestUrl, 'http://localhost').searchParams.get('token');
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.slice('Bearer '.length).trim()
        : null;
    const token = tokenFromQuery ?? tokenFromHeader;
    if (!token) {
        throw new app_error_1.UnauthorizedError('Token no provisto');
    }
    return tokenService.verify(token);
}
//# sourceMappingURL=websocket-server.js.map