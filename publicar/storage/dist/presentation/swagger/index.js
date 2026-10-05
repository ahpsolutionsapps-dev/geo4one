"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const env_1 = require("../../config/env");
exports.swaggerSpec = (0, swagger_jsdoc_1.default)({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Upload Service API',
            version: '1.0.0',
            description: 'Microservicio de gestión de archivos con autenticación por API Key',
        },
        servers: [{ url: env_1.env.publicUrl }],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: env_1.env.apiKeyHeader,
                },
                AdminToken: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'X-Admin-Token',
                },
            },
        },
        security: [{ ApiKeyAuth: [] }],
        paths: {
            '/api/files/upload': {
                post: {
                    tags: ['Files'],
                    summary: 'Subir archivo',
                    security: [{ ApiKeyAuth: [] }],
                    requestBody: {
                        content: {
                            'multipart/form-data': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        file: { type: 'string', format: 'binary' },
                                    },
                                    required: ['file'],
                                },
                            },
                        },
                    },
                    responses: {
                        201: { description: 'Archivo cargado correctamente' },
                        401: { description: 'API Key inválida' },
                        422: { description: 'Validación fallida' },
                    },
                },
            },
            '/api/files': {
                get: {
                    tags: ['Files'],
                    summary: 'Listar archivos paginados',
                    parameters: [
                        { name: 'page', in: 'query', schema: { type: 'integer' } },
                        { name: 'limit', in: 'query', schema: { type: 'integer' } },
                        { name: 'fileName', in: 'query', schema: { type: 'string' } },
                        { name: 'mimeType', in: 'query', schema: { type: 'string' } },
                        { name: 'category', in: 'query', schema: { type: 'string' } },
                        { name: 'tag', in: 'query', schema: { type: 'string' } },
                    ],
                    responses: { 200: { description: 'Listado obtenido' } },
                },
            },
            '/api/files/{id}': {
                get: {
                    tags: ['Files'],
                    summary: 'Obtener metadata',
                    parameters: [
                        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
                    ],
                    responses: { 200: { description: 'Metadata del archivo' }, 404: { description: 'No encontrado' } },
                },
                delete: {
                    tags: ['Files'],
                    summary: 'Eliminar archivo (soft delete)',
                    parameters: [
                        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
                    ],
                    responses: { 200: { description: 'Eliminado' } },
                },
            },
            '/api/files/download/{id}': {
                get: {
                    tags: ['Files'],
                    summary: 'Descargar archivo',
                    parameters: [
                        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
                    ],
                    responses: { 200: { description: 'Archivo binario' } },
                },
            },
            '/health': {
                get: {
                    tags: ['System'],
                    summary: 'Health check',
                    security: [],
                    responses: { 200: { description: 'Servicio saludable' } },
                },
            },
            '/api/admin/apikeys': {
                post: {
                    tags: ['Admin'],
                    summary: 'Crear API Key',
                    security: [{ AdminToken: [] }],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: { name: { type: 'string' } },
                                    required: ['name'],
                                },
                            },
                        },
                    },
                    responses: { 201: { description: 'API Key creada' } },
                },
                get: {
                    tags: ['Admin'],
                    summary: 'Listar API Keys',
                    security: [{ AdminToken: [] }],
                    responses: { 200: { description: 'Listado de API Keys' } },
                },
            },
        },
    },
    apis: [],
});
//# sourceMappingURL=index.js.map