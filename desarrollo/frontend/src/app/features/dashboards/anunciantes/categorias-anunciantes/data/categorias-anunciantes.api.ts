import { httpClient } from "@/shared/api/http-client";

import {
  CategoriaAnunciante,
  CategoriaAnuncianteFormValues,
} from "../categorias-anunciantes.types";

interface CategoriaAnuncianteApiModel {
  idCategoriaAnunciante: number;
  idSectorIndustrial: number;
  sectorIndustrial: string;
  idSubSectorIndustrial: number;
  subSectorIndustrial: string;
  categoriaAnunciante: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

interface CategoriasAnunciantesListResponse {
  items: CategoriaAnuncianteApiModel[];
}

interface CategoriaAnuncianteItemResponse {
  item: CategoriaAnuncianteApiModel;
}

function mapCategoriaAnuncianteFromApi(item: CategoriaAnuncianteApiModel): CategoriaAnunciante {
  return {
    id: String(item.idCategoriaAnunciante),
    idSectorIndustrial: item.idSectorIndustrial,
    sectorIndustrial: item.sectorIndustrial,
    idSubSectorIndustrial: item.idSubSectorIndustrial,
    subSectorIndustrial: item.subSectorIndustrial,
    categoriaAnunciante: item.categoriaAnunciante,
    activo: item.activo,
    fechaCreacion: item.fechaCreacion,
    fechaActualizacion: item.fechaActualizacion,
    creadoPor: item.creadoPor,
    actualizadoPor: item.actualizadoPor,
  };
}

function toPayload(values: CategoriaAnuncianteFormValues) {
  return {
    idSectorIndustrial: Number(values.idSectorIndustrial),
    idSubSectorIndustrial: Number(values.idSubSectorIndustrial),
    categoriaAnunciante: values.categoriaAnunciante.trim(),
    activo: values.activo,
  };
}

export const categoriasAnunciantesApi = {
  async getCategoriasAnunciantes(): Promise<CategoriaAnunciante[]> {
    const response = await httpClient.get<CategoriasAnunciantesListResponse>(
      "/categorias-anunciantes",
    );
    return (response.data.items ?? []).map(mapCategoriaAnuncianteFromApi);
  },

  async createCategoriaAnunciante(
    values: CategoriaAnuncianteFormValues,
  ): Promise<CategoriaAnunciante> {
    const response = await httpClient.post<CategoriaAnuncianteItemResponse>(
      "/categorias-anunciantes",
      {
        ...toPayload(values),
      },
    );

    return mapCategoriaAnuncianteFromApi(response.data.item);
  },

  async updateCategoriaAnunciante(
    id: string,
    values: CategoriaAnuncianteFormValues,
  ): Promise<CategoriaAnunciante> {
    const response = await httpClient.patch<CategoriaAnuncianteItemResponse>(
      `/categorias-anunciantes/${id}`,
      {
        ...toPayload(values),
      },
    );

    return mapCategoriaAnuncianteFromApi(response.data.item);
  },

  async deleteCategoriaAnunciante(id: string): Promise<void> {
    await httpClient.delete(`/categorias-anunciantes/${id}`);
  },
};