import { httpClient } from "@/shared/api/http-client";

import { Municipio, MunicipioFormValues } from "../municipios.types";

interface MunicipioApiModel {
  idMunicipio: number;
  idProvincia: number;
  provinciaNombre: string;
  municipio: string;
  latitud: number | null;
  longitud: number | null;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

interface MunicipiosListResponse {
  items: MunicipioApiModel[];
}

interface MunicipioItemResponse {
  item: MunicipioApiModel;
}

function mapMunicipioFromApi(item: MunicipioApiModel): Municipio {
  return {
    id: String(item.idMunicipio),
    idProvincia: item.idProvincia,
    provinciaNombre: item.provinciaNombre,
    municipio: item.municipio,
    latitud: item.latitud,
    longitud: item.longitud,
    activo: item.activo,
    fechaCreacion: item.fechaCreacion,
    fechaActualizacion: item.fechaActualizacion,
    creadoPor: item.creadoPor,
    actualizadoPor: item.actualizadoPor,
  };
}

function toPayload(values: MunicipioFormValues) {
  return {
    idProvincia: Number(values.idProvincia),
    municipio: values.municipio.trim(),
    latitud: values.latitud.trim() ? Number(values.latitud) : null,
    longitud: values.longitud.trim() ? Number(values.longitud) : null,
    activo: values.activo,
  };
}

export const municipiosApi = {
  async getMunicipios(): Promise<Municipio[]> {
    const response = await httpClient.get<MunicipiosListResponse>("/municipios");
    return (response.data.items ?? []).map(mapMunicipioFromApi);
  },

  async createMunicipio(values: MunicipioFormValues): Promise<Municipio> {
    const response = await httpClient.post<MunicipioItemResponse>("/municipios", {
      ...toPayload(values),
    });

    return mapMunicipioFromApi(response.data.item);
  },

  async updateMunicipio(id: string, values: MunicipioFormValues): Promise<Municipio> {
    const response = await httpClient.patch<MunicipioItemResponse>(`/municipios/${id}`, {
      ...toPayload(values),
    });

    return mapMunicipioFromApi(response.data.item);
  },

  async deleteMunicipio(id: string): Promise<void> {
    await httpClient.delete(`/municipios/${id}`);
  },
};
