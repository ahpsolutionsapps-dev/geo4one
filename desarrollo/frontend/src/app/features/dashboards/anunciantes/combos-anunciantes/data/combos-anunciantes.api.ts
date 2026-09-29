import { httpClient } from "@/shared/api/http-client";

import {
  ComboAnunciante,
  ComboAnuncianteFormValues,
  ComboMarca,
} from "../combos-anunciantes.types";

interface ComboMarcaApiModel {
  idMarcaProducto: number;
  marcaProducto: string;
  anunciante: string;
  orden: number;
}

interface ComboAnuncianteApiModel {
  idComboAnunciante: number;
  comboAnunciante: string;
  marcas: ComboMarcaApiModel[];
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

interface ComboAnuncianteListResponse {
  items: ComboAnuncianteApiModel[];
}

interface ComboAnuncianteItemResponse {
  item: ComboAnuncianteApiModel;
}

interface MarcaProductoOptionApiModel {
  idMarcaProducto: number;
  marcaProducto: string;
  anunciante: string;
}

interface MarcaProductoOptionResponse {
  items: MarcaProductoOptionApiModel[];
}

export interface MarcaProductoOption {
  id: string;
  label: string;
}

function mapMarca(item: ComboMarcaApiModel): ComboMarca {
  return {
    idMarcaProducto: item.idMarcaProducto,
    marcaProducto: item.marcaProducto,
    anunciante: item.anunciante,
    orden: item.orden,
  };
}

function mapComboFromApi(item: ComboAnuncianteApiModel): ComboAnunciante {
  return {
    id: String(item.idComboAnunciante),
    comboAnunciante: item.comboAnunciante,
    marcas: (item.marcas ?? []).map(mapMarca),
    activo: item.activo,
    fechaCreacion: item.fechaCreacion,
    fechaActualizacion: item.fechaActualizacion,
    creadoPor: item.creadoPor,
    actualizadoPor: item.actualizadoPor,
  };
}

function toPayload(values: ComboAnuncianteFormValues) {
  return {
    comboAnunciante: values.comboAnunciante.trim(),
    marcas: values.marcas.map((item) => ({
      idMarcaProducto: Number(item.idMarcaProducto),
      orden: Number(item.orden),
    })),
    activo: values.activo,
  };
}

export const combosAnunciantesApi = {
  async getCombosAnunciantes(): Promise<ComboAnunciante[]> {
    const response = await httpClient.get<ComboAnuncianteListResponse>("/combos-anunciantes");
    return (response.data.items ?? []).map(mapComboFromApi);
  },

  async getMarcasProductoOptions(): Promise<MarcaProductoOption[]> {
    const response = await httpClient.get<MarcaProductoOptionResponse>(
      "/combos-anunciantes/options/marcas-productos",
    );

    return (response.data.items ?? []).map((item) => ({
      id: String(item.idMarcaProducto),
      label: `${item.marcaProducto} - ${item.anunciante}`,
    }));
  },

  async createComboAnunciante(values: ComboAnuncianteFormValues): Promise<ComboAnunciante> {
    const response = await httpClient.post<ComboAnuncianteItemResponse>("/combos-anunciantes", {
      ...toPayload(values),
    });

    return mapComboFromApi(response.data.item);
  },

  async updateComboAnunciante(
    id: string,
    values: ComboAnuncianteFormValues,
  ): Promise<ComboAnunciante> {
    const response = await httpClient.patch<ComboAnuncianteItemResponse>(
      `/combos-anunciantes/${id}`,
      {
        ...toPayload(values),
      },
    );

    return mapComboFromApi(response.data.item);
  },

  async deleteComboAnunciante(id: string): Promise<void> {
    await httpClient.delete(`/combos-anunciantes/${id}`);
  },
};
