"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryProvinciaRepository = void 0;
const provincia_1 = require("../../domain/entities/provincia");
class InMemoryProvinciaRepository {
    items = [];
    seed(items) {
        this.items.length = 0;
        this.items.push(...items.map((item) => new provincia_1.Provincia({
            idProvincia: item.idProvincia,
            provincia: item.provincia,
            latitud: item.latitud,
            longitud: item.longitud,
            activo: item.activo,
            fechaCreacion: item.fechaCreacion ?? new Date(),
            fechaActualizacion: item.fechaActualizacion ?? new Date(),
            creadoPor: item.creadoPor ?? null,
            actualizadoPor: item.actualizadoPor ?? null,
        })));
    }
    async findMany() {
        return [...this.items];
    }
    async findById(idProvincia) {
        const item = this.items.find((provincia) => {
            const props = provincia.toPrimitives();
            return props.idProvincia === idProvincia;
        });
        return item ?? null;
    }
    async findByNombre(provincia) {
        const item = this.items.find((entity) => {
            const props = entity.toPrimitives();
            return props.provincia.toLowerCase() === provincia.toLowerCase();
        });
        return item ?? null;
    }
    async create(input) {
        const idProvincia = this.items.length + 1;
        const created = new provincia_1.Provincia({
            idProvincia,
            provincia: input.provincia,
            latitud: input.latitud ?? null,
            longitud: input.longitud ?? null,
            activo: true,
            fechaCreacion: new Date(),
            fechaActualizacion: new Date(),
            creadoPor: input.creadoPor,
            actualizadoPor: input.creadoPor,
        });
        this.items.push(created);
        return created;
    }
    async update(idProvincia, input) {
        const index = this.items.findIndex((provincia) => {
            const props = provincia.toPrimitives();
            return props.idProvincia === idProvincia;
        });
        if (index === -1) {
            throw new Error('Provincia no encontrada');
        }
        const current = this.items[index].toPrimitives();
        const updated = new provincia_1.Provincia({
            ...current,
            provincia: input.provincia ?? current.provincia,
            latitud: input.latitud ?? current.latitud,
            longitud: input.longitud ?? current.longitud,
            activo: input.activo ?? current.activo,
            fechaActualizacion: new Date(),
            actualizadoPor: input.actualizadoPor,
        });
        this.items[index] = updated;
        return updated;
    }
    async deactivate(idProvincia, actualizadoPor) {
        await this.update(idProvincia, {
            activo: false,
            actualizadoPor,
        });
    }
}
exports.InMemoryProvinciaRepository = InMemoryProvinciaRepository;
//# sourceMappingURL=in-memory-provincia.repository.js.map