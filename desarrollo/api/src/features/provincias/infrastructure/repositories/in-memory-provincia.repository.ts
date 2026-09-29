import { Provincia, ProvinciaProps } from '../../domain/entities/provincia';
import {
  CreateProvinciaInput,
  ProvinciaRepository,
  UpdateProvinciaInput,
} from '../../domain/repositories/provincia-repository';

export class InMemoryProvinciaRepository implements ProvinciaRepository {
  private readonly items: Provincia[] = [];

  seed(items: Array<Omit<ProvinciaProps, 'fechaCreacion' | 'fechaActualizacion'> & { fechaCreacion?: Date; fechaActualizacion?: Date }>) {
    this.items.length = 0;
    this.items.push(
      ...items.map(
        (item) =>
          new Provincia({
            idProvincia: item.idProvincia,
            provincia: item.provincia,
            latitud: item.latitud,
            longitud: item.longitud,
            activo: item.activo,
            fechaCreacion: item.fechaCreacion ?? new Date(),
            fechaActualizacion: item.fechaActualizacion ?? new Date(),
            creadoPor: item.creadoPor ?? null,
            actualizadoPor: item.actualizadoPor ?? null,
          }),
      ),
    );
  }

  async findMany(): Promise<Provincia[]> {
    return [...this.items];
  }

  async findById(idProvincia: number): Promise<Provincia | null> {
    const item = this.items.find((provincia) => {
      const props = provincia.toPrimitives();
      return props.idProvincia === idProvincia;
    });

    return item ?? null;
  }

  async findByNombre(provincia: string): Promise<Provincia | null> {
    const item = this.items.find((entity) => {
      const props = entity.toPrimitives();
      return props.provincia.toLowerCase() === provincia.toLowerCase();
    });

    return item ?? null;
  }

  async create(input: CreateProvinciaInput): Promise<Provincia> {
    const idProvincia = this.items.length + 1;
    const created = new Provincia({
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

  async update(idProvincia: number, input: UpdateProvinciaInput): Promise<Provincia> {
    const index = this.items.findIndex((provincia) => {
      const props = provincia.toPrimitives();
      return props.idProvincia === idProvincia;
    });

    if (index === -1) {
      throw new Error('Provincia no encontrada');
    }

    const current = this.items[index].toPrimitives();
    const updated = new Provincia({
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

  async deactivate(idProvincia: number, actualizadoPor: number): Promise<void> {
    await this.update(idProvincia, {
      activo: false,
      actualizadoPor,
    });
  }
}
