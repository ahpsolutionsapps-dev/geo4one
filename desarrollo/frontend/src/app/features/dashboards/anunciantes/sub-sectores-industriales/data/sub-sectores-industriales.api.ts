import { httpClient } from "@/shared/api/http-client";

import {
  SubSectorIndustrial,
  SubSectorIndustrialFormValues,
} from "../sub-sectores-industriales.types";

interface SubSectorIndustrialApiModel {
  idSubSectorIndustrial: number;
  idSectorIndustrial: number;
  sectorIndustrial: string;
  subSectorIndustrial: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

interface SubSectoresIndustrialesListResponse {
  items: SubSectorIndustrialApiModel[];
}

interface SubSectorIndustrialItemResponse {
  item: SubSectorIndustrialApiModel;
}

interface SubSectorIndustrialImportUploadResponse {
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

export interface UploadedSubSectorIndustrialExcelFile {
  id: string;
  fileName: string;
  originalFileName: string;
  url: string;
  importedCount: number;
  skippedCount: number;
  duplicates: string[];
}

function mapSubSectorIndustrialFromApi(item: SubSectorIndustrialApiModel): SubSectorIndustrial {
  return {
    id: String(item.idSubSectorIndustrial),
    idSectorIndustrial: item.idSectorIndustrial,
    sectorIndustrial: item.sectorIndustrial,
    subSectorIndustrial: item.subSectorIndustrial,
    activo: item.activo,
    fechaCreacion: item.fechaCreacion,
    fechaActualizacion: item.fechaActualizacion,
    creadoPor: item.creadoPor,
    actualizadoPor: item.actualizadoPor,
  };
}

function toPayload(values: SubSectorIndustrialFormValues) {
  return {
    idSectorIndustrial: Number(values.idSectorIndustrial),
    subSectorIndustrial: values.subSectorIndustrial.trim(),
    activo: values.activo,
  };
}

export const subSectoresIndustrialesApi = {
  async getSubSectoresIndustriales(): Promise<SubSectorIndustrial[]> {
    const response = await httpClient.get<SubSectoresIndustrialesListResponse>(
      "/sub-sectores-industriales",
    );
    return (response.data.items ?? []).map(mapSubSectorIndustrialFromApi);
  },

  async createSubSectorIndustrial(
    values: SubSectorIndustrialFormValues,
  ): Promise<SubSectorIndustrial> {
    const response = await httpClient.post<SubSectorIndustrialItemResponse>(
      "/sub-sectores-industriales",
      {
        ...toPayload(values),
      },
    );

    return mapSubSectorIndustrialFromApi(response.data.item);
  },

  async updateSubSectorIndustrial(
    id: string,
    values: SubSectorIndustrialFormValues,
  ): Promise<SubSectorIndustrial> {
    const response = await httpClient.patch<SubSectorIndustrialItemResponse>(
      `/sub-sectores-industriales/${id}`,
      {
        ...toPayload(values),
      },
    );

    return mapSubSectorIndustrialFromApi(response.data.item);
  },

  async deleteSubSectorIndustrial(id: string): Promise<void> {
    await httpClient.delete(`/sub-sectores-industriales/${id}`);
  },

  async uploadExcel(file: File): Promise<UploadedSubSectorIndustrialExcelFile> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await httpClient.post<SubSectorIndustrialImportUploadResponse>(
      "/sub-sectores-industriales/importar-excel",
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