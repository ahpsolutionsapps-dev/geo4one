import { httpClient } from "@/shared/api/http-client";

import { Sector, SectorFormValues } from "../sectores.types";

interface SectorApiModel {
  idSectorBarrio: number;
  idMunicipio: number;
  municipioNombre: string;
  provinciaNombre: string;
  sectorBarrio: string;
  circunscripcion: string | null;
  latitud: number | null;
  longitud: number | null;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

interface SectoresListResponse {
  items: SectorApiModel[];
}

interface SectorItemResponse {
  item: SectorApiModel;
}

function mapSectorFromApi(item: SectorApiModel): Sector {
  return {
    id: String(item.idSectorBarrio),
    idMunicipio: item.idMunicipio,
    municipioNombre: item.municipioNombre,
    provinciaNombre: item.provinciaNombre,
    sectorBarrio: item.sectorBarrio,
    circunscripcion: item.circunscripcion,
    latitud: item.latitud,
    longitud: item.longitud,
    activo: item.activo,
    fechaCreacion: item.fechaCreacion,
    fechaActualizacion: item.fechaActualizacion,
    creadoPor: item.creadoPor,
    actualizadoPor: item.actualizadoPor,
  };
}

function toPayload(values: SectorFormValues) {
  return {
    idMunicipio: Number(values.idMunicipio),
    sectorBarrio: values.sectorBarrio.trim(),
    circunscripcion: values.circunscripcion.trim() ? values.circunscripcion.trim() : null,
    latitud: values.latitud.trim() ? Number(values.latitud) : null,
    longitud: values.longitud.trim() ? Number(values.longitud) : null,
    activo: values.activo,
  };
}

export const sectoresApi = {
  async getSectores(): Promise<Sector[]> {
    const response = await httpClient.get<SectoresListResponse>("/sectores");
    return (response.data.items ?? []).map(mapSectorFromApi);
  },

  async createSector(values: SectorFormValues): Promise<Sector> {
    const response = await httpClient.post<SectorItemResponse>("/sectores", {
      ...toPayload(values),
    });

    return mapSectorFromApi(response.data.item);
  },

  async updateSector(id: string, values: SectorFormValues): Promise<Sector> {
    const response = await httpClient.patch<SectorItemResponse>(`/sectores/${id}`, {
      ...toPayload(values),
    });

    return mapSectorFromApi(response.data.item);
  },

  async deleteSector(id: string): Promise<void> {
    await httpClient.delete(`/sectores/${id}`);
  },
};
