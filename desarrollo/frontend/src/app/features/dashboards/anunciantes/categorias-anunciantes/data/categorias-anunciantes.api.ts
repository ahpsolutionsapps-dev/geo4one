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

interface CategoriaAnuncianteImportUploadResponse {
  success: boolean;
  message?: string;
  data: {
    id: string;
    fileName: string;
    originalName: string;
    mimeType: string;
    fileSize: number;
    hash: string;
    url: string;
    importedCount?: number;
    skippedCount?: number;
    duplicates?: string[];
  };
}

export interface UploadedCategoriaAnuncianteExcelFile {
  id: string;
  fileName: string;
  originalFileName: string;
  url: string;
  importedCount: number;
  skippedCount: number;
  duplicates: string[];
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

  async uploadExcel(file: File): Promise<UploadedCategoriaAnuncianteExcelFile> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await httpClient.post<CategoriaAnuncianteImportUploadResponse>(
      "/categorias-anunciantes/importar-excel",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return {
      id: response.data.data.id,
      fileName: response.data.data.fileName,
      originalFileName: response.data.data.originalName,
      url: response.data.data.url,
      importedCount: response.data.data.importedCount ?? 0,
      skippedCount: response.data.data.skippedCount ?? 0,
      duplicates: response.data.data.duplicates ?? [],
    };
  },
};