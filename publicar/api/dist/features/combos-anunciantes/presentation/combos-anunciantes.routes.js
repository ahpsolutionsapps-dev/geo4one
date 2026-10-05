"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCombosAnunciantesRouter = buildCombosAnunciantesRouter;
const express_1 = require("express");
const env_1 = require("../../../core/config/env");
const prisma_1 = require("../../../core/database/prisma");
const async_handler_1 = require("../../../core/http/async-handler");
const jwt_token_service_1 = require("../../auth/infrastructure/services/jwt-token.service");
const auth_middleware_1 = require("../../auth/presentation/middlewares/auth.middleware");
const create_combo_anunciante_use_case_1 = require("../application/use-cases/create-combo-anunciante.use-case");
const deactivate_combo_anunciante_use_case_1 = require("../application/use-cases/deactivate-combo-anunciante.use-case");
const get_combo_anunciante_by_id_use_case_1 = require("../application/use-cases/get-combo-anunciante-by-id.use-case");
const get_combo_marcas_options_use_case_1 = require("../application/use-cases/get-combo-marcas-options.use-case");
const get_combos_anunciantes_use_case_1 = require("../application/use-cases/get-combos-anunciantes.use-case");
const update_combo_anunciante_use_case_1 = require("../application/use-cases/update-combo-anunciante.use-case");
const prisma_combo_anunciante_repository_1 = require("../infrastructure/repositories/prisma-combo-anunciante.repository");
const combos_anunciantes_controller_1 = require("./controllers/combos-anunciantes.controller");
function buildCombosAnunciantesRouter() {
    const repository = new prisma_combo_anunciante_repository_1.PrismaComboAnuncianteRepository(prisma_1.prisma);
    const getCombosAnunciantes = new get_combos_anunciantes_use_case_1.GetCombosAnunciantesUseCase(repository);
    const getComboAnuncianteById = new get_combo_anunciante_by_id_use_case_1.GetComboAnuncianteByIdUseCase(repository);
    const getComboMarcasOptions = new get_combo_marcas_options_use_case_1.GetComboMarcasOptionsUseCase(repository);
    const createComboAnunciante = new create_combo_anunciante_use_case_1.CreateComboAnuncianteUseCase(repository);
    const updateComboAnunciante = new update_combo_anunciante_use_case_1.UpdateComboAnuncianteUseCase(repository);
    const deactivateComboAnunciante = new deactivate_combo_anunciante_use_case_1.DeactivateComboAnuncianteUseCase(repository);
    const controller = new combos_anunciantes_controller_1.CombosAnunciantesController(getCombosAnunciantes, getComboAnuncianteById, getComboMarcasOptions, createComboAnunciante, updateComboAnunciante, deactivateComboAnunciante);
    const tokenService = new jwt_token_service_1.JwtTokenService(env_1.env.jwt.secret, env_1.env.jwt.expiresIn);
    const requireAuth = (0, auth_middleware_1.authMiddleware)(tokenService);
    const router = (0, express_1.Router)();
    router.get('/', requireAuth, (0, async_handler_1.asyncHandler)(controller.list));
    router.get('/options/marcas-productos', requireAuth, (0, async_handler_1.asyncHandler)(controller.listMarcasOptions));
    router.get('/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.getById));
    router.post('/', requireAuth, (0, async_handler_1.asyncHandler)(controller.create));
    router.patch('/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.update));
    router.delete('/:id', requireAuth, (0, async_handler_1.asyncHandler)(controller.remove));
    return router;
}
//# sourceMappingURL=combos-anunciantes.routes.js.map