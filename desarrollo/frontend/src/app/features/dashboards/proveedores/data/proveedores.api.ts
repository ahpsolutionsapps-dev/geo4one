import { httpClient } from "@/shared/api/http-client";

import {
  Proveedor,
  ProveedorFormValues,
  ProveedorTelefono,
  ProveedorTelefonoFormValues,
} from "../proveedores.types";

interface ProveedorImportUploadResponse {
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

export interface UploadedProveedoresExcelFile {
  id: string;
  fileName: string;
  originalFileName: string;
  url: string;
  importedCount: number;
  skippedCount: number;
  duplicates: string[];
}

interface ProveedorApiModel {
  idProveedor: number;
  proveedor: string;
  rnc: string | null;
  personaContacto: string | null;
  cargo: string | null;
  email: string | null;
  paginaWeb: string | null;
  direccion: string | null;
  idProvincia: number | null;
  idMunicipio: number | null;
  idSectorBarrio: number | null;
  provinciaNombre: string | null;
  municipioNombre: string | null;
  sectorBarrioNombre: string | null;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

interface ProveedoresListResponse {
  items: ProveedorApiModel[];
}

interface ProveedorItemResponse {
  item: ProveedorApiModel;
}

interface ProveedorTelefonoApiModel {
  idProveedorTelefono: number;
  idProveedor: number;
  telefono: string;
  tipo: string | null;
  principal: boolean;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

interface ProveedoresTelefonosListResponse {
  items: ProveedorTelefonoApiModel[];
}

interface ProveedorTelefonoItemResponse {
  item: ProveedorTelefonoApiModel;
}

function mapProveedorFromApi(item: ProveedorApiModel): Proveedor {
  return {
    id: String(item.idProveedor),
    proveedor: item.proveedor,
    rnc: item.rnc,
    personaContacto: item.personaContacto,
    cargo: item.cargo,
    email: item.email,
    paginaWeb: item.paginaWeb,
    direccion: item.direccion,
    idProvincia: item.idProvincia,
    idMunicipio: item.idMunicipio,
    idSectorBarrio: item.idSectorBarrio,
    provinciaNombre: item.provinciaNombre,
    municipioNombre: item.municipioNombre,
    sectorBarrioNombre: item.sectorBarrioNombre,
    activo: item.activo,
    fechaCreacion: item.fechaCreacion,
    fechaActualizacion: item.fechaActualizacion,
  };
}

function mapTelefonoFromApi(item: ProveedorTelefonoApiModel): ProveedorTelefono {
  return {
    idProveedorTelefono: item.idProveedorTelefono,
    idProveedor: item.idProveedor,
    telefono: item.telefono,
    tipo: item.tipo,
    principal: item.principal,
    activo: item.activo,
    fechaCreacion: item.fechaCreacion,
    fechaActualizacion: item.fechaActualizacion,
  };
}

function toPayload(values: ProveedorFormValues) {
  return {
    proveedor: values.proveedor.trim(),
    rnc: values.rnc.trim() || null,
    personaContacto: values.personaContacto.trim() || null,
    cargo: values.cargo.trim() || null,
    email: values.email.trim() || null,
    paginaWeb: values.paginaWeb.trim() || null,
    direccion: values.direccion.trim() || null,
    idProvincia: values.idProvincia ? Number(values.idProvincia) : null,
    idMunicipio: values.idMunicipio ? Number(values.idMunicipio) : null,
    idSectorBarrio: values.idSectorBarrio ? Number(values.idSectorBarrio) : null,
    activo: values.activo,
  };
}

export const proveedoresApi = {
  async getProveedores(): Promise<Proveedor[]> {
    const response = await httpClient.get<ProveedoresListResponse>("/proveedores");
    return (response.data.items ?? []).map(mapProveedorFromApi);
  },

  async createProveedor(values: ProveedorFormValues): Promise<Proveedor> {
    const response = await httpClient.post<ProveedorItemResponse>("/proveedores", {
      ...toPayload(values),
    });

    return mapProveedorFromApi(response.data.item);
  },

  async updateProveedor(id: string, values: ProveedorFormValues): Promise<Proveedor> {
    const response = await httpClient.patch<ProveedorItemResponse>(`/proveedores/${id}`, {
      ...toPayload(values),
    });

    return mapProveedorFromApi(response.data.item);
  },

  async deleteProveedor(id: string): Promise<void> {
    await httpClient.delete(`/proveedores/${id}`);
  },

  async getTelefonos(idProveedor: string): Promise<ProveedorTelefono[]> {
    const response = await httpClient.get<ProveedoresTelefonosListResponse>(
      `/proveedores/${idProveedor}/telefonos`,
    );

    return (response.data.items ?? []).map(mapTelefonoFromApi);
  },

  async createTelefono(
    idProveedor: string,
    values: ProveedorTelefonoFormValues,
  ): Promise<ProveedorTelefono> {
    const response = await httpClient.post<ProveedorTelefonoItemResponse>(
      `/proveedores/${idProveedor}/telefonos`,
      {
        telefono: values.telefono.trim(),
        tipo: values.tipo.trim() || null,
        principal: values.principal,
      },
    );

    return mapTelefonoFromApi(response.data.item);
  },

  async updateTelefono(
    idProveedor: string,
    idTelefono: number,
    values: ProveedorTelefonoFormValues,
  ): Promise<ProveedorTelefono> {
    const response = await httpClient.patch<ProveedorTelefonoItemResponse>(
      `/proveedores/${idProveedor}/telefonos/${idTelefono}`,
      {
        telefono: values.telefono.trim(),
        tipo: values.tipo.trim() || null,
        principal: values.principal,
      },
    );

    return mapTelefonoFromApi(response.data.item);
  },

  async deleteTelefono(idProveedor: string, idTelefono: number): Promise<void> {
    await httpClient.delete(`/proveedores/${idProveedor}/telefonos/${idTelefono}`);
  },

  async uploadExcel(file: File): Promise<UploadedProveedoresExcelFile> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await httpClient.post<ProveedorImportUploadResponse>(
      "/proveedores/importar-excel",
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
