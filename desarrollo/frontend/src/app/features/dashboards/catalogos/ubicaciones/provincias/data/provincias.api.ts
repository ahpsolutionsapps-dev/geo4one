import { httpClient } from "@/shared/api/http-client";

import { Provincia, ProvinciaFormValues } from "../provincias.types";

interface ProvinciaApiModel {
  idProvincia: number;
  provincia: string;
  latitud: number | null;
  longitud: number | null;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

interface ProvinciasListResponse {
  items: ProvinciaApiModel[];
}

interface ProvinciaItemResponse {
  item: ProvinciaApiModel;
}

function mapProvinciaFromApi(item: ProvinciaApiModel): Provincia {
  return {
    id: String(item.idProvincia),
    provincia: item.provincia,
    latitud: item.latitud,
    longitud: item.longitud,
    activo: item.activo,
    fechaCreacion: item.fechaCreacion,
    fechaActualizacion: item.fechaActualizacion,
  };
}

function toPayload(values: ProvinciaFormValues) {
  return {
    provincia: values.provincia.trim(),
    latitud: values.latitud.trim() ? Number(values.latitud) : null,
    longitud: values.longitud.trim() ? Number(values.longitud) : null,
    activo: values.activo,
  };
}

export const provinciasApi = {
  async getProvincias(): Promise<Provincia[]> {
    const response = await httpClient.get<ProvinciasListResponse>("/provincias");
    return (response.data.items ?? []).map(mapProvinciaFromApi);
  },

  async createProvincia(values: ProvinciaFormValues): Promise<Provincia> {
    const response = await httpClient.post<ProvinciaItemResponse>("/provincias", {
      ...toPayload(values),
    });

    return mapProvinciaFromApi(response.data.item);
  },

  async updateProvincia(id: string, values: ProvinciaFormValues): Promise<Provincia> {
    const response = await httpClient.patch<ProvinciaItemResponse>(
      `/provincias/${id}`,
      {
        ...toPayload(values),
      },
    );

    return mapProvinciaFromApi(response.data.item);
  },

  async deleteProvincia(id: string): Promise<void> {
    await httpClient.delete(`/provincias/${id}`);
  },
};
