import { httpClient } from "@/shared/api/http-client";

import {
  SectorIndustrial,
  SectorIndustrialFormValues,
} from "../sectores-industriales.types";

interface SectorIndustrialApiModel {
  idSectorIndustrial: number;
  sectorIndustrial: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

interface SectoresIndustrialesListResponse {
  items: SectorIndustrialApiModel[];
}

interface SectorIndustrialItemResponse {
  item: SectorIndustrialApiModel;
}

interface SectorIndustrialImportUploadResponse {
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

export interface UploadedSectorIndustrialExcelFile {
  id: string;
  fileName: string;
  originalFileName: string;
  url: string;
  importedCount: number;
  skippedCount: number;
  duplicates: string[];
}

function mapSectorIndustrialFromApi(item: SectorIndustrialApiModel): SectorIndustrial {
  return {
    id: String(item.idSectorIndustrial),
    sectorIndustrial: item.sectorIndustrial,
    activo: item.activo,
    fechaCreacion: item.fechaCreacion,
    fechaActualizacion: item.fechaActualizacion,
    creadoPor: item.creadoPor,
    actualizadoPor: item.actualizadoPor,
  };
}

function toPayload(values: SectorIndustrialFormValues) {
  return {
    sectorIndustrial: values.sectorIndustrial.trim(),
    activo: values.activo,
  };
}

export const sectoresIndustrialesApi = {
  async getSectoresIndustriales(): Promise<SectorIndustrial[]> {
    const response = await httpClient.get<SectoresIndustrialesListResponse>("/sectores-industriales");
    return (response.data.items ?? []).map(mapSectorIndustrialFromApi);
  },

  async createSectorIndustrial(values: SectorIndustrialFormValues): Promise<SectorIndustrial> {
    const response = await httpClient.post<SectorIndustrialItemResponse>("/sectores-industriales", {
      ...toPayload(values),
    });

    return mapSectorIndustrialFromApi(response.data.item);
  },

  async updateSectorIndustrial(
    id: string,
    values: SectorIndustrialFormValues,
  ): Promise<SectorIndustrial> {
    const response = await httpClient.patch<SectorIndustrialItemResponse>(
      `/sectores-industriales/${id}`,
      {
        ...toPayload(values),
      },
    );

    return mapSectorIndustrialFromApi(response.data.item);
  },

  async deleteSectorIndustrial(id: string): Promise<void> {
    await httpClient.delete(`/sectores-industriales/${id}`);
  },

  async uploadExcel(file: File): Promise<UploadedSectorIndustrialExcelFile> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await httpClient.post<SectorIndustrialImportUploadResponse>(
      "/sectores-industriales/importar-excel",
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