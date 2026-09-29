import { httpClient } from "@/shared/api/http-client";

import {
  CatalogoSimpleFormValues,
  CatalogoSimpleItem,
  FormatoCatalogoFormValues,
  FormatoCatalogoItem,
  TipoElementoOption,
} from "./catalogos-elementos.types";

interface ListResponse<T> {
  items: T[];
}

interface ItemResponse<T> {
  item: T;
}

interface CatalogImportUploadResponse {
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

export interface UploadedCatalogoExcelFile {
  id: string;
  fileName: string;
  originalFileName: string;
  url: string;
  importedCount: number;
  skippedCount: number;
  duplicates: string[];
}

interface CatalogoSimpleApiModel {
  id: number;
  nombre: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

interface FormatoCatalogoApiModel extends CatalogoSimpleApiModel {
  idTipoElemento: number;
  tipoElemento: string;
}

function mapSimpleItem(item: CatalogoSimpleApiModel): CatalogoSimpleItem {
  return {
    id: String(item.id),
    nombre: item.nombre,
    activo: item.activo,
    fechaCreacion: item.fechaCreacion,
    fechaActualizacion: item.fechaActualizacion,
  };
}

function mapFormatoItem(item: FormatoCatalogoApiModel): FormatoCatalogoItem {
  return {
    id: String(item.id),
    idTipoElemento: String(item.idTipoElemento),
    tipoElemento: item.tipoElemento,
    formato: item.nombre,
    activo: item.activo,
    fechaCreacion: item.fechaCreacion,
    fechaActualizacion: item.fechaActualizacion,
  };
}

function mapUploadResponse(response: CatalogImportUploadResponse): UploadedCatalogoExcelFile {
  return {
    id: response.data.id,
    fileName: response.data.fileName,
    originalFileName: response.data.originalName,
    url: response.data.url,
    importedCount: response.data.importedCount ?? 0,
    skippedCount: response.data.skippedCount ?? 0,
    duplicates: response.data.duplicates ?? [],
  };
}

function buildSimpleCatalogApi(endpoint: string, importEndpoint?: string) {
  return {
    async list(): Promise<CatalogoSimpleItem[]> {
      const response = await httpClient.get<ListResponse<CatalogoSimpleApiModel>>(endpoint);
      return (response.data.items ?? []).map(mapSimpleItem);
    },

    async create(values: CatalogoSimpleFormValues): Promise<CatalogoSimpleItem> {
      const response = await httpClient.post<ItemResponse<CatalogoSimpleApiModel>>(endpoint, {
        nombre: values.nombre.trim(),
      });

      return mapSimpleItem(response.data.item);
    },

    async update(id: string, values: CatalogoSimpleFormValues): Promise<CatalogoSimpleItem> {
      const response = await httpClient.patch<ItemResponse<CatalogoSimpleApiModel>>(
        `${endpoint}/${id}`,
        {
          nombre: values.nombre.trim(),
          activo: values.activo,
        },
      );

      return mapSimpleItem(response.data.item);
    },

    async remove(id: string): Promise<void> {
      await httpClient.delete(`${endpoint}/${id}`);
    },

    async uploadExcel(file: File): Promise<UploadedCatalogoExcelFile> {
      if (!importEndpoint) {
        throw new Error("La importacion no esta habilitada para este catalogo");
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await httpClient.post<CatalogImportUploadResponse>(
        importEndpoint,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return mapUploadResponse(response.data);
    },
  };
}

export const catalogosElementosApi = {
  tiposElementos: buildSimpleCatalogApi(
    "/elementos/catalogos/tipos-elementos",
    "/elementos/catalogos/tipos-elementos/importar-excel",
  ),
  orientaciones: buildSimpleCatalogApi(
    "/elementos/catalogos/orientaciones",
    "/elementos/catalogos/orientaciones/importar-excel",
  ),
  dimensiones: buildSimpleCatalogApi(
    "/elementos/catalogos/dimensiones",
    "/elementos/catalogos/dimensiones/importar-excel",
  ),

  async getTiposElementosOptions(): Promise<TipoElementoOption[]> {
    const response = await httpClient.get<ListResponse<CatalogoSimpleApiModel>>(
      "/elementos/catalogos/tipos-elementos",
    );

    return (response.data.items ?? []).map((item) => ({
      id: String(item.id),
      nombre: item.nombre,
    }));
  },

  async getFormatos(): Promise<FormatoCatalogoItem[]> {
    const response = await httpClient.get<ListResponse<FormatoCatalogoApiModel>>(
      "/elementos/catalogos/tipos-formatos",
    );
    return (response.data.items ?? []).map(mapFormatoItem);
  },

  async createFormato(values: FormatoCatalogoFormValues): Promise<FormatoCatalogoItem> {
    const response = await httpClient.post<ItemResponse<FormatoCatalogoApiModel>>(
      "/elementos/catalogos/tipos-formatos",
      {
        idTipoElemento: Number(values.idTipoElemento),
        formato: values.formato.trim(),
      },
    );

    return mapFormatoItem(response.data.item);
  },

  async updateFormato(id: string, values: FormatoCatalogoFormValues): Promise<FormatoCatalogoItem> {
    const response = await httpClient.patch<ItemResponse<FormatoCatalogoApiModel>>(
      `/elementos/catalogos/tipos-formatos/${id}`,
      {
        idTipoElemento: Number(values.idTipoElemento),
        formato: values.formato.trim(),
        activo: values.activo,
      },
    );

    return mapFormatoItem(response.data.item);
  },

  async removeFormato(id: string): Promise<void> {
    await httpClient.delete(`/elementos/catalogos/tipos-formatos/${id}`);
  },

  async uploadFormatosExcel(file: File): Promise<UploadedCatalogoExcelFile> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await httpClient.post<CatalogImportUploadResponse>(
      "/elementos/catalogos/tipos-formatos/importar-excel",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return mapUploadResponse(response.data);
  },
};
