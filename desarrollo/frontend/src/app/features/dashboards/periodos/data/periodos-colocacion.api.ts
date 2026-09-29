import { httpClient } from "@/shared/api/http-client";

import {
  PeriodoColocacion,
  PeriodoColocacionFormValues,
} from "../periodos-colocacion.types";

interface PeriodoColocacionApiModel {
  idPeriodoColocacion: number;
  fechaInicial: string;
  fechaFinal: string;
  generalesSeguimiento: string | null;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

interface PeriodosColocacionListResponse {
  items: PeriodoColocacionApiModel[];
}

interface PeriodoColocacionItemResponse {
  item: PeriodoColocacionApiModel;
}

function toDateInputValue(value: string): string {
  return value.slice(0, 10);
}

function mapPeriodoColocacionFromApi(item: PeriodoColocacionApiModel): PeriodoColocacion {
  return {
    id: String(item.idPeriodoColocacion),
    fechaInicial: toDateInputValue(item.fechaInicial),
    fechaFinal: toDateInputValue(item.fechaFinal),
    generalesSeguimiento: item.generalesSeguimiento,
    activo: item.activo,
    fechaCreacion: item.fechaCreacion,
    fechaActualizacion: item.fechaActualizacion,
    creadoPor: item.creadoPor,
    actualizadoPor: item.actualizadoPor,
  };
}

function toPayload(values: PeriodoColocacionFormValues) {
  return {
    fechaInicial: values.fechaInicial,
    fechaFinal: values.fechaFinal,
    generalesSeguimiento: values.generalesSeguimiento.trim() || null,
    activo: values.activo,
  };
}

export const periodosColocacionApi = {
  async getPeriodosColocacion(): Promise<PeriodoColocacion[]> {
    const response = await httpClient.get<PeriodosColocacionListResponse>("/periodos-colocacion");
    return (response.data.items ?? []).map(mapPeriodoColocacionFromApi);
  },

  async createPeriodoColocacion(values: PeriodoColocacionFormValues): Promise<PeriodoColocacion> {
    const response = await httpClient.post<PeriodoColocacionItemResponse>("/periodos-colocacion", {
      ...toPayload(values),
    });

    return mapPeriodoColocacionFromApi(response.data.item);
  },

  async updatePeriodoColocacion(
    id: string,
    values: PeriodoColocacionFormValues,
  ): Promise<PeriodoColocacion> {
    const response = await httpClient.patch<PeriodoColocacionItemResponse>(
      `/periodos-colocacion/${id}`,
      {
        ...toPayload(values),
      },
    );

    return mapPeriodoColocacionFromApi(response.data.item);
  },

  async deletePeriodoColocacion(id: string): Promise<void> {
    await httpClient.delete(`/periodos-colocacion/${id}`);
  },
};
