"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProveedoresController = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
const get_auth_user_id_1 = require("../../../../shared/presentation/get-auth-user-id");
const proveedores_schemas_1 = require("../validators/proveedores.schemas");
class ProveedoresController {
    getProveedores;
    getProveedorById;
    createProveedor;
    updateProveedor;
    deactivateProveedor;
    proveedorRepository;
    uploadService;
    importProveedoresExcel;
    constructor(getProveedores, getProveedorById, createProveedor, updateProveedor, deactivateProveedor, proveedorRepository, uploadService, importProveedoresExcel) {
        this.getProveedores = getProveedores;
        this.getProveedorById = getProveedorById;
        this.createProveedor = createProveedor;
        this.updateProveedor = updateProveedor;
        this.deactivateProveedor = deactivateProveedor;
        this.proveedorRepository = proveedorRepository;
        this.uploadService = uploadService;
        this.importProveedoresExcel = importProveedoresExcel;
    }
    list = async (_req, res) => {
        const items = await this.getProveedores.execute();
        res.status(200).json({ items });
    };
    getById = async (req, res) => {
        const params = proveedores_schemas_1.proveedorIdParamsSchema.parse(req.params);
        const item = await this.getProveedorById.execute(params.id);
        res.status(200).json({ item });
    };
    create = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const data = proveedores_schemas_1.createProveedorSchema.parse(req.body);
        const item = await this.createProveedor.execute({
            proveedor: data.proveedor,
            rnc: data.rnc ?? null,
            personaContacto: data.personaContacto ?? null,
            cargo: data.cargo ?? null,
            email: data.email ?? null,
            paginaWeb: data.paginaWeb ?? null,
            direccion: data.direccion ?? null,
            idProvincia: data.idProvincia ?? null,
            idMunicipio: data.idMunicipio ?? null,
            idSectorBarrio: data.idSectorBarrio ?? null,
            creadoPor: idUsuario,
        });
        res.status(201).json({ item });
    };
    update = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = proveedores_schemas_1.proveedorIdParamsSchema.parse(req.params);
        const data = proveedores_schemas_1.updateProveedorSchema.parse(req.body);
        const item = await this.updateProveedor.execute(params.id, {
            proveedor: data.proveedor,
            rnc: data.rnc,
            personaContacto: data.personaContacto,
            cargo: data.cargo,
            email: data.email,
            paginaWeb: data.paginaWeb,
            direccion: data.direccion,
            idProvincia: data.idProvincia,
            idMunicipio: data.idMunicipio,
            idSectorBarrio: data.idSectorBarrio,
            activo: data.activo,
            actualizadoPor: idUsuario,
        });
        res.status(200).json({ item });
    };
    remove = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = proveedores_schemas_1.proveedorIdParamsSchema.parse(req.params);
        await this.deactivateProveedor.execute(params.id, idUsuario);
        res.status(204).send();
    };
    importExcel = async (req, res) => {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'Archivo requerido' });
            return;
        }
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const uploaded = await this.uploadService.uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);
        const importResult = await this.importProveedoresExcel.execute(req.file.buffer, req.file.originalname, idUsuario);
        res.status(201).json({
            success: true,
            message: importResult.importedCount > 0
                ? `Se importaron ${importResult.importedCount} suplidores correctamente`
                : 'No se importaron suplidores nuevos',
            data: {
                id: uploaded.id,
                fileName: uploaded.fileName,
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                fileSize: req.file.size,
                hash: '',
                url: uploaded.url,
                importedCount: importResult.importedCount,
                skippedCount: importResult.skippedCount,
                duplicates: importResult.duplicates,
            },
        });
    };
    listTelefonos = async (req, res) => {
        const params = proveedores_schemas_1.proveedorIdParamsSchema.parse(req.params);
        const proveedor = await this.proveedorRepository.findById(params.id);
        if (!proveedor) {
            throw new app_error_1.NotFoundError('Suplidor no encontrado');
        }
        const items = await this.proveedorRepository.findTelefonos(params.id);
        res.status(200).json({ items });
    };
    createTelefono = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = proveedores_schemas_1.proveedorIdParamsSchema.parse(req.params);
        const data = proveedores_schemas_1.createProveedorTelefonoSchema.parse(req.body);
        const proveedor = await this.proveedorRepository.findById(params.id);
        if (!proveedor) {
            throw new app_error_1.NotFoundError('Suplidor no encontrado');
        }
        const item = await this.proveedorRepository.createTelefono({
            idProveedor: params.id,
            telefono: data.telefono,
            tipo: data.tipo ?? null,
            principal: data.principal ?? false,
            creadoPor: idUsuario,
        });
        res.status(201).json({ item });
    };
    updateTelefono = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = proveedores_schemas_1.proveedorTelefonoParamsSchema.parse(req.params);
        const data = proveedores_schemas_1.updateProveedorTelefonoSchema.parse(req.body);
        const telefono = await this.proveedorRepository.findTelefonoById(params.telefonoId);
        if (!telefono || telefono.idProveedor !== params.id) {
            throw new app_error_1.NotFoundError('Telefono de suplidor no encontrado');
        }
        const item = await this.proveedorRepository.updateTelefono(params.telefonoId, {
            telefono: data.telefono,
            tipo: data.tipo,
            principal: data.principal,
            activo: data.activo,
            actualizadoPor: idUsuario,
        });
        res.status(200).json({ item });
    };
    removeTelefono = async (req, res) => {
        const idUsuario = (0, get_auth_user_id_1.getAuthUserId)(req);
        const params = proveedores_schemas_1.proveedorTelefonoParamsSchema.parse(req.params);
        const telefono = await this.proveedorRepository.findTelefonoById(params.telefonoId);
        if (!telefono || telefono.idProveedor !== params.id) {
            throw new app_error_1.NotFoundError('Telefono de suplidor no encontrado');
        }
        await this.proveedorRepository.deactivateTelefono(params.telefonoId, idUsuario);
        res.status(204).send();
    };
}
exports.ProveedoresController = ProveedoresController;
//# sourceMappingURL=proveedores.controller.js.map