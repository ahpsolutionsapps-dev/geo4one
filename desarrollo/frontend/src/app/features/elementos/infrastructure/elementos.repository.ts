import axios from "@/utils/axios";

import type { Elemento, ElementoFormValues } from "../domain/types";

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

interface ElementoApiModel {
  idElemento: number;
  idProveedor: number;
  licencia: string | null;
  fechaEmision: string | null;
  fechaVencimiento: string | null;
  idSeguimiento: string | null;
  idTipoElemento: number;
  idFormato: number | null;
  idTamano: number | null;
  activo: boolean;
  costoAlquiler: number | string | null;
  direccion: string | null;
  idOrientacion: number | null;
  idProvincia: number | null;
  idMunicipio: number | null;
  idSectorBarrio: number | null;
  circunscripcion: string | null;
  latitud: number | string | null;
  longitud: number | string | null;
  anulado: boolean;
  comentarioAnulado: string | null;
  fechaAnulacion: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
  imagenUrl: string | null;
}

interface ElementosListResponse {
  items: ElementoApiModel[];
}

interface ElementoItemResponse {
  item: ElementoApiModel;
}

function mapElementoFromApi(item: ElementoApiModel): Elemento {
  return {
    idElemento: item.idElemento,
    idProveedor: item.idProveedor,
    licencia: item.licencia,
    fechaEmision: item.fechaEmision,
    fechaVencimiento: item.fechaVencimiento,
    idSeguimiento: item.idSeguimiento,
    idTipoElemento: item.idTipoElemento,
    idFormato: item.idFormato,
    idTamano: item.idTamano,
    activo: item.activo,
    costoAlquiler: item.costoAlquiler,
    direccion: item.direccion,
    idOrientacion: item.idOrientacion,
    idProvincia: item.idProvincia,
    idMunicipio: item.idMunicipio,
    idSectorBarrio: item.idSectorBarrio,
    circunscripcion: item.circunscripcion,
    latitud: item.latitud,
    longitud: item.longitud,
    anulado: item.anulado,
    comentarioAnulado: item.comentarioAnulado,
    fechaAnulacion: item.fechaAnulacion,
    fechaCreacion: item.fechaCreacion,
    fechaActualizacion: item.fechaActualizacion,
    creadoPor: item.creadoPor,
    actualizadoPor: item.actualizadoPor,
    imagenUrl: item.imagenUrl,
  };
}

function toPayload(values: ElementoFormValues) {
  return {
    idProveedor: Number(values.idProveedor),
    idTipoElemento: Number(values.idTipoElemento),
    idFormato: values.idFormato ? Number(values.idFormato) : null,
    idTamano: values.idTamano ? Number(values.idTamano) : null,
    activo: values.activo,
    licencia: values.licencia.trim() || null,
    fechaEmision: values.fechaEmision || null,
    fechaVencimiento: values.fechaVencimiento || null,
    idSeguimiento: values.idSeguimiento.trim() || null,
    direccion: values.direccion.trim() || null,
    idProvincia: values.idProvincia ? Number(values.idProvincia) : null,
    idMunicipio: values.idMunicipio ? Number(values.idMunicipio) : null,
    idSectorBarrio: values.idSectorBarrio ? Number(values.idSectorBarrio) : null,
    circunscripcion: values.circunscripcion.trim() || null,
    idOrientacion: values.idOrientacion ? Number(values.idOrientacion) : null,
    latitud: values.latitud.trim() ? Number(values.latitud) : null,
    longitud: values.longitud.trim() ? Number(values.longitud) : null,
    costoAlquiler: values.costoAlquiler.trim() ? Number(values.costoAlquiler) : null,
    imagenUrl: values.imagenUrl?.trim() || null,
  };
}

export async function getElementos(): Promise<Elemento[]> {
  const { data } = await axios.get<ElementosListResponse>("/elementos");
  return (data.items ?? []).map(mapElementoFromApi);
}

export async function getElementoById(id: number | string): Promise<Elemento> {
  const { data } = await axios.get<ElementoItemResponse>(`/elementos/${id}`);
  return mapElementoFromApi(data.item);
}

export async function createElemento(values: ElementoFormValues): Promise<Elemento> {
  const { data } = await axios.post<ElementoItemResponse>("/elementos", toPayload(values));
  return mapElementoFromApi(data.item);
}

export async function updateElemento(
  id: number | string,
  values: ElementoFormValues,
): Promise<Elemento> {
  const { data } = await axios.patch<ElementoItemResponse>(
    `/elementos/${id}`,
    toPayload(values),
  );

  return mapElementoFromApi(data.item);
}

export async function deleteElemento(id: number | string): Promise<void> {
  await axios.delete(`/elementos/${id}`);
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
