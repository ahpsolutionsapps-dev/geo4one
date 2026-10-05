"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPeriodosColocacionRouter = buildPeriodosColocacionRouter;
const express_1 = require("express");
const env_1 = require("../../../core/config/env");
const prisma_1 = require("../../../core/database/prisma");
const async_handler_1 = require("../../../core/http/async-handler");
const jwt_token_service_1 = require("../../auth/infrastructure/services/jwt-token.service");
const auth_middleware_1 = require("../../auth/presentation/middlewares/auth.middleware");
const create_periodo_colocacion_use_case_1 = require("../application/use-cases/create-periodo-colocacion.use-case");
const deactivate_periodo_colocacion_use_case_1 = require("../application/use-cases/deactivate-periodo-colocacion.use-case");
const get_periodo_colocacion_by_id_use_case_1 = require("../application/use-cases/get-periodo-colocacion-by-id.use-case");
const get_periodos_colocacion_use_case_1 = require("../application/use-cases/get-periodos-colocacion.use-case");
const update_periodo_colocacion_use_case_1 = require("../application/use-cases/update-periodo-colocacion.use-case");
const prisma_periodo_colocacion_repository_1 = require("../infrastructure/repositories/prisma-periodo-colocacion.repository");
const periodos_colocacion_controller_1 = require("./controllers/periodos-colocacion.controller");
function buildPeriodosColocacionRouter() {
    const repository = new prisma_periodo_colocacion_repository_1.PrismaPeriodoColocacionRepository(prisma_1.prisma);
    const getPeriodosColocacion = new get_periodos_colocacion_use_case_1.GetPeriodosColocacionUseCase(repository);
    const getPeriodoColocacionById = new get_periodo_colocacion_by_id_use_case_1.GetPeriodoColocacionByIdUseCase(repository);
    const createPeriodoColocacion = new create_periodo_colocacion_use_case_1.CreatePeriodoColocacionUseCase(repository);
    const updatePeriodoColocacion = new update_periodo_colocacion_use_case_1.UpdatePeriodoColocacionUseCase(repository);
    const deactivatePeriodoColocacion = new deactivate_periodo_colocacion_use_case_1.DeactivatePeriodoColocacionUseCase(repository);
    const controller = new periodos_colocacion_controller_1.PeriodosColocacionController(getPeriodosColocacion, getPeriodoColocacionById, createPeriodoColocacion, updatePeriodoColocacion, deactivatePeriodoColocacion);
    const tokenService = new jwt_token_service_1.JwtTokenService(env_1.env.jwt.secret, env_1.env.jwt.expiresIn);
    const requireAuth = (0, auth_middleware_1.authMiddleware)(tokenService);
    const router = (0, express_1.Router)();
    router.get('/', requireAuth, (0, async_handler_1.asyncHandler)(controller.list));
    router.get('/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.getById));
    router.post('/', requireAuth, (0, async_handler_1.asyncHandler)(controller.create));
    router.patch('/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.update));
    router.delete('/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.remove));
    return router;
}
//# sourceMappingURL=periodos-colocacion.routes.js.map