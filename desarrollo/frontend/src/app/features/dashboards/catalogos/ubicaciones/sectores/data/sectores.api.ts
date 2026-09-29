import { httpClient } from "@/shared/api/http-client";

import { Sector, SectorFormValues } from "../sectores.types";

interface SectorImportUploadResponse {
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

export interface UploadedSectoresExcelFile {
  id: string;
  fileName: string;
  originalFileName: string;
  url: string;
  importedCount: number;
  skippedCount: number;
  duplicates: string[];
}

interface SectorApiModel {
  idSectorBarrio: number;
  idMunicipio: number;
  municipioNombre: string;
  provinciaNombre: string;
  sectorBarrio: string;
  circunscripcion: string | null;
  latitud: number | null;
  longitud: number | null;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

interface SectoresListResponse {
  items: SectorApiModel[];
}

interface SectorItemResponse {
  item: SectorApiModel;
}

function mapSectorFromApi(item: SectorApiModel): Sector {
  return {
    id: String(item.idSectorBarrio),
    idMunicipio: item.idMunicipio,
    municipioNombre: item.municipioNombre,
    provinciaNombre: item.provinciaNombre,
    sectorBarrio: item.sectorBarrio,
    circunscripcion: item.circunscripcion,
    latitud: item.latitud,
    longitud: item.longitud,
    activo: item.activo,
    fechaCreacion: item.fechaCreacion,
    fechaActualizacion: item.fechaActualizacion,
    creadoPor: item.creadoPor,
    actualizadoPor: item.actualizadoPor,
  };
}

function toPayload(values: SectorFormValues) {
  return {
    idMunicipio: Number(values.idMunicipio),
    sectorBarrio: values.sectorBarrio.trim(),
    circunscripcion: values.circunscripcion.trim() ? values.circunscripcion.trim() : null,
    latitud: values.latitud.trim() ? Number(values.latitud) : null,
    longitud: values.longitud.trim() ? Number(values.longitud) : null,
    activo: values.activo,
  };
}

export const sectoresApi = {
  async getSectores(): Promise<Sector[]> {
    const response = await httpClient.get<SectoresListResponse>("/sectores");
    return (response.data.items ?? []).map(mapSectorFromApi);
  },

  async createSector(values: SectorFormValues): Promise<Sector> {
    const response = await httpClient.post<SectorItemResponse>("/sectores", {
      ...toPayload(values),
    });

    return mapSectorFromApi(response.data.item);
  },

  async updateSector(id: string, values: SectorFormValues): Promise<Sector> {
    const response = await httpClient.patch<SectorItemResponse>(`/sectores/${id}`, {
      ...toPayload(values),
    });

    return mapSectorFromApi(response.data.item);
  },

  async deleteSector(id: string): Promise<void> {
    await httpClient.delete(`/sectores/${id}`);
  },

  async uploadExcel(file: File): Promise<UploadedSectoresExcelFile> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await httpClient.post<SectorImportUploadResponse>(
      "/sectores/importar-excel",
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
