"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMarcasAguaSeguimientoRouter = buildMarcasAguaSeguimientoRouter;
const express_1 = require("express");
const env_1 = require("../../../core/config/env");
const prisma_1 = require("../../../core/database/prisma");
const async_handler_1 = require("../../../core/http/async-handler");
const jwt_token_service_1 = require("../../auth/infrastructure/services/jwt-token.service");
const auth_middleware_1 = require("../../auth/presentation/middlewares/auth.middleware");
const create_marca_agua_seguimiento_use_case_1 = require("../application/use-cases/create-marca-agua-seguimiento.use-case");
const deactivate_marca_agua_seguimiento_use_case_1 = require("../application/use-cases/deactivate-marca-agua-seguimiento.use-case");
const get_marca_agua_seguimiento_by_id_use_case_1 = require("../application/use-cases/get-marca-agua-seguimiento-by-id.use-case");
const get_marcas_agua_seguimiento_use_case_1 = require("../application/use-cases/get-marcas-agua-seguimiento.use-case");
const get_versiones_campana_options_use_case_1 = require("../application/use-cases/get-versiones-campana-options.use-case");
const update_marca_agua_seguimiento_use_case_1 = require("../application/use-cases/update-marca-agua-seguimiento.use-case");
const prisma_marca_agua_seguimiento_repository_1 = require("../infrastructure/repositories/prisma-marca-agua-seguimiento.repository");
const marcas_agua_seguimiento_controller_1 = require("./controllers/marcas-agua-seguimiento.controller");
function buildMarcasAguaSeguimientoRouter() {
    const repository = new prisma_marca_agua_seguimiento_repository_1.PrismaMarcaAguaSeguimientoRepository(prisma_1.prisma);
    const getMarcasAguaSeguimiento = new get_marcas_agua_seguimiento_use_case_1.GetMarcasAguaSeguimientoUseCase(repository);
    const getMarcaAguaSeguimientoById = new get_marca_agua_seguimiento_by_id_use_case_1.GetMarcaAguaSeguimientoByIdUseCase(repository);
    const getVersionesCampanaOptions = new get_versiones_campana_options_use_case_1.GetVersionesCampanaOptionsUseCase(repository);
    const createMarcaAguaSeguimiento = new create_marca_agua_seguimiento_use_case_1.CreateMarcaAguaSeguimientoUseCase(repository);
    const updateMarcaAguaSeguimiento = new update_marca_agua_seguimiento_use_case_1.UpdateMarcaAguaSeguimientoUseCase(repository);
    const deactivateMarcaAguaSeguimiento = new deactivate_marca_agua_seguimiento_use_case_1.DeactivateMarcaAguaSeguimientoUseCase(repository);
    const controller = new marcas_agua_seguimiento_controller_1.MarcasAguaSeguimientoController(getMarcasAguaSeguimiento, getMarcaAguaSeguimientoById, getVersionesCampanaOptions, createMarcaAguaSeguimiento, updateMarcaAguaSeguimiento, deactivateMarcaAguaSeguimiento);
    const tokenService = new jwt_token_service_1.JwtTokenService(env_1.env.jwt.secret, env_1.env.jwt.expiresIn);
    const requireAuth = (0, auth_middleware_1.authMiddleware)(tokenService);
    const router = (0, express_1.Router)();
    router.get('/', requireAuth, (0, async_handler_1.asyncHandler)(controller.list));
    router.get('/options/versiones-campanas', requireAuth, (0, async_handler_1.asyncHandler)(controller.listVersionesOptions));
    router.get('/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.getById));
    router.post('/', requireAuth, (0, async_handler_1.asyncHandler)(controller.create));
    router.patch('/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.update));
    router.delete('/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.remove));
    return router;
}
//# sourceMappingURL=marcas-agua-seguimiento.routes.js.map