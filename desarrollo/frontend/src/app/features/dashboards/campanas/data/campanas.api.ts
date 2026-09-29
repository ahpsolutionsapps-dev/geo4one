import { httpClient } from "@/shared/api/http-client";

import { Campana, CampanaFormValues } from "../campanas.types";

interface CampanaApiModel {
  idVersionCampana: number;
  idAnunciante: number;
  anunciante: string;
  idMarcaProducto: number | null;
  marcaProducto: string | null;
  idComboAnunciante: number | null;
  comboAnunciante: string | null;
  versionCampana: string;
  leyendaSeguimiento: string | null;
  activo: boolean;
  anulado: boolean;
  fechaAnulacion: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

interface CampanasListResponse {
  items: CampanaApiModel[];
}

interface CampanaItemResponse {
  item: CampanaApiModel;
}

interface OptionApiModel {
  idAnunciante?: number;
  anunciante?: string;
  idMarcaProducto?: number;
  marcaProducto?: string;
  idComboAnunciante?: number;
  comboAnunciante?: string;
}

interface OptionsResponse {
  items: OptionApiModel[];
}

export interface SelectOption {
  id: string;
  label: string;
}

function mapCampanaFromApi(item: CampanaApiModel): Campana {
  return {
    id: String(item.idVersionCampana),
    idAnunciante: item.idAnunciante,
    anunciante: item.anunciante,
    idMarcaProducto: item.idMarcaProducto,
    marcaProducto: item.marcaProducto,
    idComboAnunciante: item.idComboAnunciante,
    comboAnunciante: item.comboAnunciante,
    versionCampana: item.versionCampana,
    leyendaSeguimiento: item.leyendaSeguimiento,
    activo: item.activo,
    anulado: item.anulado,
    fechaAnulacion: item.fechaAnulacion,
    fechaCreacion: item.fechaCreacion,
    fechaActualizacion: item.fechaActualizacion,
    creadoPor: item.creadoPor,
    actualizadoPor: item.actualizadoPor,
  };
}

function toPayload(values: CampanaFormValues) {
  return {
    idAnunciante: Number(values.idAnunciante),
    idMarcaProducto: values.idMarcaProducto ? Number(values.idMarcaProducto) : null,
    idComboAnunciante: values.idComboAnunciante ? Number(values.idComboAnunciante) : null,
    versionCampana: values.versionCampana.trim(),
    leyendaSeguimiento: values.leyendaSeguimiento.trim() || null,
    activo: values.activo,
  };
}

export const campanasApi = {
  async getCampanas(): Promise<Campana[]> {
    const response = await httpClient.get<CampanasListResponse>("/versiones-campanas");
    return (response.data.items ?? []).map(mapCampanaFromApi);
  },

  async getAnunciantesOptions(): Promise<SelectOption[]> {
    const response = await httpClient.get<OptionsResponse>("/versiones-campanas/options/anunciantes");
    return (response.data.items ?? []).map((item) => ({
      id: String(item.idAnunciante),
      label: item.anunciante ?? "",
    }));
  },

  async getMarcasProductosOptions(idAnunciante?: string): Promise<SelectOption[]> {
    const response = await httpClient.get<OptionsResponse>("/versiones-campanas/options/marcas-productos", {
      params: idAnunciante ? { idAnunciante: Number(idAnunciante) } : undefined,
    });

    return (response.data.items ?? []).map((item) => ({
      id: String(item.idMarcaProducto),
      label: item.marcaProducto ?? "",
    }));
  },

  async getCombosAnunciantesOptions(): Promise<SelectOption[]> {
    const response = await httpClient.get<OptionsResponse>(
      "/versiones-campanas/options/combos-anunciantes",
    );

    return (response.data.items ?? []).map((item) => ({
      id: String(item.idComboAnunciante),
      label: item.comboAnunciante ?? "",
    }));
  },

  async createCampana(values: CampanaFormValues): Promise<Campana> {
    const response = await httpClient.post<CampanaItemResponse>("/versiones-campanas", {
      ...toPayload(values),
    });

    return mapCampanaFromApi(response.data.item);
  },

  async updateCampana(id: string, values: CampanaFormValues): Promise<Campana> {
    const response = await httpClient.patch<CampanaItemResponse>(`/versiones-campanas/${id}`, {
      ...toPayload(values),
    });

    return mapCampanaFromApi(response.data.item);
  },

  async deleteCampana(id: string): Promise<void> {
    await httpClient.delete(`/versiones-campanas/${id}`);
  },
};
