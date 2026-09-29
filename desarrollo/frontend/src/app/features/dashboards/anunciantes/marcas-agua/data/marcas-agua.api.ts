import { httpClient } from "@/shared/api/http-client";

import {
  MarcaAguaSeguimiento,
  MarcaAguaSeguimientoFormValues,
} from "../marcas-agua.types";

interface MarcaAguaSeguimientoApiModel {
  idFirmaMarcaAguaSeguimiento: number;
  idVersionCampana: number;
  versionCampana: string;
  anunciante: string;
  imagenMuestra: string | null;
  videoMuestra: string | null;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

interface MarcasAguaListResponse {
  items: MarcaAguaSeguimientoApiModel[];
}

interface MarcaAguaItemResponse {
  item: MarcaAguaSeguimientoApiModel;
}

interface VersionCampanaOptionApiModel {
  idVersionCampana: number;
  versionCampana: string;
  anunciante: string;
}

interface VersionCampanaOptionsResponse {
  items: VersionCampanaOptionApiModel[];
}

export interface VersionCampanaOption {
  id: string;
  label: string;
}

function mapFromApi(item: MarcaAguaSeguimientoApiModel): MarcaAguaSeguimiento {
  return {
    id: String(item.idFirmaMarcaAguaSeguimiento),
    idVersionCampana: item.idVersionCampana,
    versionCampana: item.versionCampana,
    anunciante: item.anunciante,
    imagenMuestra: item.imagenMuestra,
    videoMuestra: item.videoMuestra,
    activo: item.activo,
    fechaCreacion: item.fechaCreacion,
    fechaActualizacion: item.fechaActualizacion,
    creadoPor: item.creadoPor,
    actualizadoPor: item.actualizadoPor,
  };
}

function toPayload(values: MarcaAguaSeguimientoFormValues) {
  return {
    idVersionCampana: Number(values.idVersionCampana),
    imagenMuestra: values.imagenMuestra.trim() || null,
    videoMuestra: values.videoMuestra.trim() || null,
    activo: values.activo,
  };
}

export const marcasAguaApi = {
  async getMarcasAguaSeguimiento(): Promise<MarcaAguaSeguimiento[]> {
    const response = await httpClient.get<MarcasAguaListResponse>("/marcas-agua-seguimiento");
    return (response.data.items ?? []).map(mapFromApi);
  },

  async getVersionesCampanaOptions(): Promise<VersionCampanaOption[]> {
    const response = await httpClient.get<VersionCampanaOptionsResponse>(
      "/marcas-agua-seguimiento/options/versiones-campanas",
    );

    return (response.data.items ?? []).map((item) => ({
      id: String(item.idVersionCampana),
      label: `${item.versionCampana} - ${item.anunciante}`,
    }));
  },

  async createMarcaAguaSeguimiento(
    values: MarcaAguaSeguimientoFormValues,
  ): Promise<MarcaAguaSeguimiento> {
    const response = await httpClient.post<MarcaAguaItemResponse>("/marcas-agua-seguimiento", {
      ...toPayload(values),
    });

    return mapFromApi(response.data.item);
  },

  async updateMarcaAguaSeguimiento(
    id: string,
    values: MarcaAguaSeguimientoFormValues,
  ): Promise<MarcaAguaSeguimiento> {
    const response = await httpClient.patch<MarcaAguaItemResponse>(`/marcas-agua-seguimiento/${id}`, {
      ...toPayload(values),
    });

    return mapFromApi(response.data.item);
  },

  async deleteMarcaAguaSeguimiento(id: string): Promise<void> {
    await httpClient.delete(`/marcas-agua-seguimiento/${id}`);
  },
};
