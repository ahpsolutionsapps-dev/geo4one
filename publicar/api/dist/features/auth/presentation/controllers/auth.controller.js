"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_schemas_1 = require("../validators/auth.schemas");
const app_error_1 = require("../../../../core/errors/app-error");
class AuthController {
    registerUser;
    loginUser;
    resetPassword;
    requestPasswordResetCode;
    confirmPasswordResetCode;
    getCurrentUser;
    getUserMenu;
    getUserPreferences;
    updateUserPreferences;
    createQrLoginSession;
    getQrLoginSessionStatus;
    approveQrLoginSession;
    constructor(registerUser, loginUser, resetPassword, requestPasswordResetCode, confirmPasswordResetCode, getCurrentUser, getUserMenu, getUserPreferences, updateUserPreferences, createQrLoginSession, getQrLoginSessionStatus, approveQrLoginSession) {
        this.registerUser = registerUser;
        this.loginUser = loginUser;
        this.resetPassword = resetPassword;
        this.requestPasswordResetCode = requestPasswordResetCode;
        this.confirmPasswordResetCode = confirmPasswordResetCode;
        this.getCurrentUser = getCurrentUser;
        this.getUserMenu = getUserMenu;
        this.getUserPreferences = getUserPreferences;
        this.updateUserPreferences = updateUserPreferences;
        this.createQrLoginSession = createQrLoginSession;
        this.getQrLoginSessionStatus = getQrLoginSessionStatus;
        this.approveQrLoginSession = approveQrLoginSession;
    }
    register = async (req, res) => {
        const data = auth_schemas_1.registerSchema.parse(req.body);
        const result = await this.registerUser.execute(data);
        res.status(201).json(result);
    };
    login = async (req, res) => {
        const data = auth_schemas_1.loginSchema.parse(req.body);
        const result = await this.loginUser.execute(data);
        res.status(200).json(result);
    };
    resetPasswordHandler = async (req, res) => {
        const data = auth_schemas_1.resetPasswordSchema.parse(req.body);
        const result = await this.resetPassword.execute(data);
        res.status(200).json(result);
    };
    requestPasswordResetCodeHandler = async (req, res) => {
        const data = auth_schemas_1.requestPasswordResetCodeSchema.parse(req.body);
        const result = await this.requestPasswordResetCode.execute(data.email);
        res.status(200).json(result);
    };
    confirmPasswordResetCodeHandler = async (req, res) => {
        const data = auth_schemas_1.confirmPasswordResetCodeSchema.parse(req.body);
        const result = await this.confirmPasswordResetCode.execute(data);
        res.status(200).json(result);
    };
    me = async (req, res) => {
        const idUsuario = this.resolveUserId(req);
        const result = await this.getCurrentUser.execute(idUsuario);
        res.status(200).json(result);
    };
    menu = async (req, res) => {
        const idUsuario = this.resolveUserId(req);
        const menu = await this.getUserMenu.execute(idUsuario);
        res.status(200).json(menu);
    };
    getPreferences = async (req, res) => {
        const idUsuario = this.resolveUserId(req);
        const item = await this.getUserPreferences.execute(idUsuario);
        res.status(200).json({ item });
    };
    updatePreferences = async (req, res) => {
        const idUsuario = this.resolveUserId(req);
        const data = auth_schemas_1.updatePreferencesSchema.parse(req.body);
        const item = await this.updateUserPreferences.execute(idUsuario, data);
        res.status(200).json({ item });
    };
    createQrSession = async (req, res) => {
        const data = auth_schemas_1.createQrLoginSessionSchema.parse(req.body ?? {});
        const result = await this.createQrLoginSession.execute(data);
        res.status(201).json(result);
    };
    getQrSessionStatus = async (req, res) => {
        const code = String(req.params.code ?? '').trim();
        const result = await this.getQrLoginSessionStatus.execute(code);
        res.status(200).json(result);
    };
    approveQrSession = async (req, res) => {
        const idUsuario = this.resolveUserId(req);
        const data = auth_schemas_1.approveQrLoginSessionSchema.parse(req.body);
        const result = await this.approveQrLoginSession.execute(idUsuario, data.code);
        res.status(200).json(result);
    };
    resolveUserId(req) {
        const sub = req.auth?.sub;
        if (!sub) {
            throw new app_error_1.UnauthorizedError();
        }
        const idUsuario = Number(sub);
        if (!Number.isInteger(idUsuario)) {
            throw new app_error_1.UnauthorizedError('Token inválido');
        }
        return idUsuario;
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map