import axios from "@/utils/axios";

import type { Elemento } from "../domain/types";

interface ElementosImportUploadResponse {
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

export interface UploadedElementosExcelFile {
  id: string;
  fileName: string;
  originalFileName: string;
  url: string;
  importedCount: number;
  skippedCount: number;
  duplicates: string[];
}

export async function getElementos(): Promise<Elemento[]> {
  const { data } = await axios.get<{ items?: Elemento[] }>("/elementos");
  return data.items ?? [];
}

export async function uploadElementosExcel(file: File): Promise<UploadedElementosExcelFile> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axios.post<ElementosImportUploadResponse>(
    "/elementos/importar-excel",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return {
    id: data.data.id,
    fileName: data.data.fileName,
    originalFileName: data.data.originalName,
    url: data.data.url,
    importedCount: data.data.importedCount ?? 0,
    skippedCount: data.data.skippedCount ?? 0,
    duplicates: data.data.duplicates ?? [],
  };
}
