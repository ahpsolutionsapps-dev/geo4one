import { httpClient } from "@/shared/api/http-client";

import { Colocacion, ColocacionFormValues } from "../colocaciones.types";

interface ColocacionApiModel {
  idColocacion: number;
  codigoSeguimiento: string;
  idElemento: number;
  elemento: string;
  idVersionCampana: number;
  versionCampana: string;
  anunciante: string;
  idPeriodoColocacion: number;
  periodo: string;
  observaciones: string | null;
  activo: boolean;
  anulado: boolean;
  fechaAnulacion: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

interface ListResponse {
  items: ColocacionApiModel[];
}

interface ItemResponse {
  item: ColocacionApiModel;
}

interface ElementoOptionApiModel {
  idElemento: number;
  elemento: string;
}

interface VersionCampanaOptionApiModel {
  idVersionCampana: number;
  versionCampana: string;
  anunciante: string;
}

interface PeriodoOptionApiModel {
  idPeriodoColocacion: number;
  fechaInicial: string;
  fechaFinal: string;
}

interface OptionsResponse<T> {
  items: T[];
}

export interface SelectOption {
  id: string;
  label: string;
}

export interface ColocacionesApi {
  getColocaciones: () => Promise<Colocacion[]>;
  getElementosOptions: () => Promise<SelectOption[]>;
  getVersionesCampanaOptions: () => Promise<SelectOption[]>;
  getPeriodosOptions: () => Promise<SelectOption[]>;
  createColocacion: (values: ColocacionFormValues) => Promise<Colocacion>;
  updateColocacion: (id: string, values: ColocacionFormValues) => Promise<Colocacion>;
  deleteColocacion: (id: string) => Promise<void>;
}

function mapColocacionFromApi(item: ColocacionApiModel): Colocacion {
  return {
    id: String(item.idColocacion),
    codigoSeguimiento: item.codigoSeguimiento,
    idElemento: item.idElemento,
    elemento: item.elemento,
    idVersionCampana: item.idVersionCampana,
    versionCampana: item.versionCampana,
    anunciante: item.anunciante,
    idPeriodoColocacion: item.idPeriodoColocacion,
    periodo: item.periodo,
    observaciones: item.observaciones,
    activo: item.activo,
    anulado: item.anulado,
    fechaAnulacion: item.fechaAnulacion,
    fechaCreacion: item.fechaCreacion,
    fechaActualizacion: item.fechaActualizacion,
    creadoPor: item.creadoPor,
    actualizadoPor: item.actualizadoPor,
  };
}

function toPayload(values: ColocacionFormValues) {
  return {
    codigoSeguimiento: values.codigoSeguimiento.trim(),
    idElemento: Number(values.idElemento),
    idVersionCampana: Number(values.idVersionCampana),
    idPeriodoColocacion: Number(values.idPeriodoColocacion),
    observaciones: values.observaciones.trim() || null,
    activo: values.activo,
  };
}

export function createColocacionesApi(basePath = "/colocaciones"): ColocacionesApi {
  return {
    async getColocaciones(): Promise<Colocacion[]> {
      const response = await httpClient.get<ListResponse>(basePath);
      return (response.data.items ?? []).map(mapColocacionFromApi);
    },

    async getElementosOptions(): Promise<SelectOption[]> {
      const response = await httpClient.get<OptionsResponse<ElementoOptionApiModel>>(
        `${basePath}/options/elementos`,
      );

      return (response.data.items ?? []).map((item) => ({
        id: String(item.idElemento),
        label: item.elemento,
      }));
    },

    async getVersionesCampanaOptions(): Promise<SelectOption[]> {
      const response = await httpClient.get<OptionsResponse<VersionCampanaOptionApiModel>>(
        `${basePath}/options/versiones-campanas`,
      );

      return (response.data.items ?? []).map((item) => ({
        id: String(item.idVersionCampana),
        label: `${item.versionCampana} - ${item.anunciante}`,
      }));
    },

    async getPeriodosOptions(): Promise<SelectOption[]> {
      const response = await httpClient.get<OptionsResponse<PeriodoOptionApiModel>>(
        `${basePath}/options/periodos-colocacion`,
      );

      return (response.data.items ?? []).map((item) => ({
        id: String(item.idPeriodoColocacion),
        label: `${item.fechaInicial.slice(0, 10)} - ${item.fechaFinal.slice(0, 10)}`,
      }));
    },

    async createColocacion(values: ColocacionFormValues): Promise<Colocacion> {
      const response = await httpClient.post<ItemResponse>(basePath, {
        ...toPayload(values),
      });
      return mapColocacionFromApi(response.data.item);
    },

    async updateColocacion(id: string, values: ColocacionFormValues): Promise<Colocacion> {
      const response = await httpClient.patch<ItemResponse>(`${basePath}/${id}`, {
        ...toPayload(values),
      });
      return mapColocacionFromApi(response.data.item);
    },

    async deleteColocacion(id: string): Promise<void> {
      await httpClient.delete(`${basePath}/${id}`);
    },
  };
}

export const colocacionesApi = createColocacionesApi();
