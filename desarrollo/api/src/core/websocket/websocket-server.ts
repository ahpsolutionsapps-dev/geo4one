import http from 'node:http';
import { URL } from 'node:url';

import WebSocket, { WebSocketServer } from 'ws';

import { UnauthorizedError } from '../errors/app-error';
import { env } from '../config/env';
import { prisma } from '../database/prisma';
import { JwtTokenService } from '../../features/auth/infrastructure/services/jwt-token.service';
import { TokenPayload } from '../../features/auth/domain/services/token-service';
import { domainEventBus } from '../../shared/infrastructure/events/domain-event-bus';
import {
  ClientRelayRealtimeEvents,
  DomainEvent,
  RealtimeEvents,
  SignalingRealtimeEvents,
} from '../../shared/infrastructure/events/domain-event';
import { publishRealtimeEvent } from '../../shared/infrastructure/events/publish-realtime-event';
import {
  addClientePresence,
  addUserPresence,
  removeClientePresence,
  removeUserPresence,
} from './presence';

const WS_PATH = '/ws';

type AuthedWebSocket = WebSocket & {
  actor?: 'usuario' | 'cliente';
  userId?: number;
  clienteId?: number;
};

export function attachWebSocketServer(server: http.Server): WebSocketServer {
  const tokenService = new JwtTokenService(env.jwt.secret, env.jwt.expiresIn);

  const wss = new WebSocketServer({ server, path: WS_PATH });

  wss.on('connection', (ws, req) => {
    try {
      const payload = authenticateConnection(req, tokenService);
      applyAuth(ws as AuthedWebSocket, payload);
    } catch {
      ws.close(4401, 'Unauthorized');
      return;
    }

    const authed = ws as AuthedWebSocket;
    if (authed.actor === 'cliente' && authed.clienteId != null) {
      if (addClientePresence(authed.clienteId)) {
        publishRealtimeEvent(RealtimeEvents.CHAT_PRESENCIA_ACTUALIZADA, {
          idCliente: authed.clienteId,
          isOnline: true,
        });
      }
    } else if (authed.userId != null && addUserPresence(authed.userId)) {
      publishRealtimeEvent(RealtimeEvents.CHAT_PRESENCIA_ACTUALIZADA, {
        idUsuario: authed.userId,
        isOnline: true,
      });
    }

    ws.on('message', (raw) => {
      void handleClientMessage(wss, authed, raw);
    });

    ws.on('close', () => {
      if (authed.actor === 'cliente' && authed.clienteId != null) {
        if (removeClientePresence(authed.clienteId)) {
          publishRealtimeEvent(RealtimeEvents.CHAT_PRESENCIA_ACTUALIZADA, {
            idCliente: authed.clienteId,
            isOnline: false,
          });
        }
        return;
      }

      if (authed.userId != null && removeUserPresence(authed.userId)) {
        publishRealtimeEvent(RealtimeEvents.CHAT_PRESENCIA_ACTUALIZADA, {
          idUsuario: authed.userId,
          isOnline: false,
        });
      }
    });

    ws.on('error', () => {
      ws.terminate();
    });
  });

  domainEventBus.on('event', (event: DomainEvent) => {
    broadcastEvent(wss, event);
  });

  return wss;
}

function applyAuth(ws: AuthedWebSocket, payload: TokenPayload): void {
  if (payload.actor === 'plataforma') {
    throw new UnauthorizedError('Token de plataforma no admite websocket');
  }

  if (payload.actor === 'cliente') {
    const idCliente =
      payload.idCliente ??
      Number(/^c:(\d+)$/.exec(payload.sub)?.[1] ?? Number.NaN);
    if (!Number.isInteger(idCliente) || idCliente <= 0) {
      throw new UnauthorizedError('Token de cliente inválido');
    }
    ws.actor = 'cliente';
    ws.clienteId = idCliente;
    return;
  }

  const userId = Number(payload.sub);
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new UnauthorizedError('Token inválido');
  }
  ws.actor = 'usuario';
  ws.userId = userId;
}

async function handleClientMessage(
  wss: WebSocketServer,
  sender: AuthedWebSocket,
  raw: WebSocket.RawData,
) {
  const text = normalizeRawMessage(raw);
  if (!text) {
    return;
  }

  let parsed: { type?: unknown; payload?: unknown };
  try {
    parsed = JSON.parse(text) as { type?: unknown; payload?: unknown };
  } catch {
    return;
  }

  const type = typeof parsed.type === 'string' ? parsed.type.trim() : '';
  if (!type) {
    return;
  }

  if (SignalingRealtimeEvents.has(type)) {
    await relayWebrtcSignal(wss, sender, parsed.payload);
    return;
  }

  if (!ClientRelayRealtimeEvents.has(type)) {
    return;
  }

  if (sender.actor !== 'usuario' || sender.userId == null || Number.isNaN(sender.userId)) {
    return;
  }

  broadcastEvent(
    wss,
    {
      type,
      payload: parsed.payload ?? {},
      targetUserId: sender.userId,
    },
    sender,
  );
}

async function relayWebrtcSignal(
  wss: WebSocketServer,
  sender: AuthedWebSocket,
  rawPayload: unknown,
) {
  if (!rawPayload || typeof rawPayload !== 'object') {
    return;
  }

  const payload = rawPayload as Record<string, unknown>;
  const idConversacion = Number(payload.idConversacion);
  if (!Number.isInteger(idConversacion) || idConversacion <= 0) {
    return;
  }

  const kind = typeof payload.kind === 'string' ? payload.kind.trim() : '';
  if (!kind) {
    return;
  }

  const prismaChat = prisma as any;

  const participants: Array<{ idUsuario: number | null; idCliente: number | null }> =
    await prismaChat.chatParticipante.findMany({
      where: { idConversacion, anulado: false },
      select: { idUsuario: true, idCliente: true },
    });
  if (participants.length === 0) {
    return;
  }

  const isParticipant =
    sender.actor === 'cliente'
      ? participants.some(
          (item: { idUsuario: number | null; idCliente: number | null }) =>
            item.idCliente === sender.clienteId,
        )
      : participants.some(
          (item: { idUsuario: number | null; idCliente: number | null }) =>
            item.idUsuario === sender.userId,
        );
  if (!isParticipant) {
    return;
  }

  const from =
    sender.actor === 'cliente'
      ? { actor: 'cliente' as const, id: sender.clienteId }
      : { actor: 'usuario' as const, id: sender.userId };

  const relayPayload = {
    ...payload,
    from,
  };

  const userIds = participants
    .map((item: { idUsuario: number | null; idCliente: number | null }) => item.idUsuario)
    .filter((id: number | null): id is number => id != null && id !== sender.userId);
  const clienteIds = participants
    .map((item: { idUsuario: number | null; idCliente: number | null }) => item.idCliente)
    .filter((id: number | null): id is number => id != null && id !== sender.clienteId);

  for (const userId of new Set(userIds)) {
    broadcastEvent(wss, {
      type: RealtimeEvents.WEBRTC_SIGNAL,
      payload: relayPayload,
      targetUserId: userId,
    });
  }
  for (const clienteId of new Set(clienteIds)) {
    broadcastEvent(wss, {
      type: RealtimeEvents.WEBRTC_SIGNAL,
      payload: relayPayload,
      targetClienteId: clienteId,
    });
  }
}

function broadcastEvent(
  wss: WebSocketServer,
  event: DomainEvent,
  excludeClient?: WebSocket,
) {
  const message = JSON.stringify({
    type: event.type,
    payload: event.payload,
  });

  for (const client of wss.clients) {
    const authed = client as AuthedWebSocket;
    if (authed.readyState !== WebSocket.OPEN) {
      continue;
    }

    if (excludeClient && authed === excludeClient) {
      continue;
    }

    if (event.targetClienteId != null) {
      if (authed.actor !== 'cliente' || authed.clienteId !== event.targetClienteId) {
        continue;
      }
    } else if (event.targetUserId != null) {
      if (authed.actor === 'cliente' || authed.userId !== event.targetUserId) {
        continue;
      }
    }

    authed.send(message);
  }
}

function normalizeRawMessage(raw: WebSocket.RawData): string | null {
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

function authenticateConnection(
  req: http.IncomingMessage,
  tokenService: JwtTokenService,
) {
  const requestUrl = req.url ?? '';
  const tokenFromQuery = new URL(requestUrl, 'http://localhost').searchParams.get('token');

  const authHeader = req.headers.authorization;
  const tokenFromHeader =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length).trim()
      : null;

  const token = tokenFromQuery ?? tokenFromHeader;
  if (!token) {
    throw new UnauthorizedError('Token no provisto');
  }

  return tokenService.verify(token);
}
