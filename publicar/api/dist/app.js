"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const env_1 = require("./core/config/env");
const prisma_1 = require("./core/database/prisma");
const error_handler_1 = require("./core/http/error-handler");
const jwt_token_service_1 = require("./features/auth/infrastructure/services/jwt-token.service");
const prisma_user_repository_1 = require("./features/auth/infrastructure/repositories/prisma-user.repository");
const auth_routes_1 = require("./features/auth/presentation/auth.routes");
const auth_middleware_1 = require("./features/auth/presentation/middlewares/auth.middleware");
const require_verified_middleware_1 = require("./features/auth/presentation/middlewares/require-verified.middleware");
const roles_routes_1 = require("./features/roles/presentation/roles.routes");
const provincias_routes_1 = require("./features/provincias/presentation/provincias.routes");
const municipios_routes_1 = require("./features/municipios/presentation/municipios.routes");
const sectores_routes_1 = require("./features/sectores/presentation/sectores.routes");
const sectores_industriales_routes_1 = require("./features/sectores-industriales/presentation/sectores-industriales.routes");
const sub_sectores_industriales_routes_1 = require("./features/sub-sectores-industriales/presentation/sub-sectores-industriales.routes");
const categorias_anunciantes_routes_1 = require("./features/categorias-anunciantes/presentation/categorias-anunciantes.routes");
const anunciantes_routes_1 = require("./features/anunciantes/presentation/anunciantes.routes");
const marcas_productos_routes_1 = require("./features/marcas-productos/presentation/marcas-productos.routes");
const periodos_colocacion_routes_1 = require("./features/periodos-colocacion/presentation/periodos-colocacion.routes");
const combos_anunciantes_routes_1 = require("./features/combos-anunciantes/presentation/combos-anunciantes.routes");
const marcas_agua_seguimiento_routes_1 = require("./features/marcas-agua-seguimiento/presentation/marcas-agua-seguimiento.routes");
const versiones_campanas_routes_1 = require("./features/versiones-campanas/presentation/versiones-campanas.routes");
const colocaciones_routes_1 = require("./features/colocaciones/presentation/colocaciones.routes");
const usuarios_routes_1 = require("./features/usuarios/presentation/usuarios.routes");
const elementos_routes_1 = require("./features/elementos/presentation/elementos.routes");
const proveedores_routes_1 = require("./features/proveedores/presentation/proveedores.routes");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.get('/health', (_req, res) => {
        res.json({ status: 'ok' });
    });
    app.use('/auth', (0, auth_routes_1.buildAuthRouter)());
    // Los módulos de negocio exigen sesión y cuenta verificada.
    // /auth (me, menu, preferences) queda fuera para permitir login sin módulos.
    const tokenService = new jwt_token_service_1.JwtTokenService(env_1.env.jwt.secret, env_1.env.jwt.expiresIn);
    const userRepository = new prisma_user_repository_1.PrismaUserRepository(prisma_1.prisma);
    app.use((0, auth_middleware_1.authMiddleware)(tokenService), (0, require_verified_middleware_1.requireVerifiedMiddleware)(userRepository));
    app.use('/usuarios', (0, usuarios_routes_1.buildUsuariosRouter)());
    app.use('/roles', (0, roles_routes_1.buildRolesRouter)());
    app.use('/provincias', (0, provincias_routes_1.buildProvinciasRouter)());
    app.use('/municipios', (0, municipios_routes_1.buildMunicipiosRouter)());
    app.use('/sectores', (0, sectores_routes_1.buildSectoresRouter)());
    app.use('/sectores-industriales', (0, sectores_industriales_routes_1.buildSectoresIndustrialesRouter)());
    app.use('/sub-sectores-industriales', (0, sub_sectores_industriales_routes_1.buildSubSectoresIndustrialesRouter)());
    app.use('/categorias-anunciantes', (0, categorias_anunciantes_routes_1.buildCategoriasAnunciantesRouter)());
    app.use('/anunciantes', (0, anunciantes_routes_1.buildAnunciantesRouter)());
    app.use('/marcas-productos', (0, marcas_productos_routes_1.buildMarcasProductosRouter)());
    app.use('/periodos-colocacion', (0, periodos_colocacion_routes_1.buildPeriodosColocacionRouter)());
    app.use('/combos-anunciantes', (0, combos_anunciantes_routes_1.buildCombosAnunciantesRouter)());
    app.use('/marcas-agua-seguimiento', (0, marcas_agua_seguimiento_routes_1.buildMarcasAguaSeguimientoRouter)());
    app.use('/versiones-campanas', (0, versiones_campanas_routes_1.buildVersionesCampanasRouter)());
    app.use('/colocaciones', (0, colocaciones_routes_1.buildColocacionesRouter)());
    app.use('/seguimientos', (0, colocaciones_routes_1.buildColocacionesRouter)());
    app.use('/proveedores', (0, proveedores_routes_1.buildProveedoresRouter)());
    app.use('/elementos', (0, elementos_routes_1.buildElementosRouter)());
    app.use(error_handler_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map