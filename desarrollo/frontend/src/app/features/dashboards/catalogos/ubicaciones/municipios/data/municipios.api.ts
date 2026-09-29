import { httpClient } from "@/shared/api/http-client";

import { Municipio, MunicipioFormValues } from "../municipios.types";

interface MunicipioImportUploadResponse {
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

export interface UploadedMunicipiosExcelFile {
  id: string;
  fileName: string;
  originalFileName: string;
  url: string;
  importedCount: number;
  skippedCount: number;
  duplicates: string[];
}

interface MunicipioApiModel {
  idMunicipio: number;
  idProvincia: number;
  provinciaNombre: string;
  municipio: string;
  latitud: number | null;
  longitud: number | null;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

interface MunicipiosListResponse {
  items: MunicipioApiModel[];
}

interface MunicipioItemResponse {
  item: MunicipioApiModel;
}

function mapMunicipioFromApi(item: MunicipioApiModel): Municipio {
  return {
    id: String(item.idMunicipio),
    idProvincia: item.idProvincia,
    provinciaNombre: item.provinciaNombre,
    municipio: item.municipio,
    latitud: item.latitud,
    longitud: item.longitud,
    activo: item.activo,
    fechaCreacion: item.fechaCreacion,
    fechaActualizacion: item.fechaActualizacion,
    creadoPor: item.creadoPor,
    actualizadoPor: item.actualizadoPor,
  };
}

function toPayload(values: MunicipioFormValues) {
  return {
    idProvincia: Number(values.idProvincia),
    municipio: values.municipio.trim(),
    latitud: values.latitud.trim() ? Number(values.latitud) : null,
    longitud: values.longitud.trim() ? Number(values.longitud) : null,
    activo: values.activo,
  };
}

export const municipiosApi = {
  async getMunicipios(): Promise<Municipio[]> {
    const response = await httpClient.get<MunicipiosListResponse>("/municipios");
    return (response.data.items ?? []).map(mapMunicipioFromApi);
  },

  async createMunicipio(values: MunicipioFormValues): Promise<Municipio> {
    const response = await httpClient.post<MunicipioItemResponse>("/municipios", {
      ...toPayload(values),
    });

    return mapMunicipioFromApi(response.data.item);
  },

  async updateMunicipio(id: string, values: MunicipioFormValues): Promise<Municipio> {
    const response = await httpClient.patch<MunicipioItemResponse>(`/municipios/${id}`, {
      ...toPayload(values),
    });

    return mapMunicipioFromApi(response.data.item);
  },

  async deleteMunicipio(id: string): Promise<void> {
    await httpClient.delete(`/municipios/${id}`);
  },

  async uploadExcel(file: File): Promise<UploadedMunicipiosExcelFile> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await httpClient.post<MunicipioImportUploadResponse>(
      "/municipios/importar-excel",
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
