import { httpClient } from "@/shared/api/http-client";

import { MarcaProducto, MarcaProductoFormValues } from "../marcas-productos.types";

interface MarcaProductoApiModel {
  idMarcaProducto: number;
  idAnunciante: number;
  anunciante: string;
  idCategoriaAnunciante: number;
  categoriaAnunciante: string;
  marcaProducto: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

interface MarcasProductosListResponse {
  items: MarcaProductoApiModel[];
}

interface MarcaProductoItemResponse {
  item: MarcaProductoApiModel;
}

function mapMarcaProductoFromApi(item: MarcaProductoApiModel): MarcaProducto {
  return {
    id: String(item.idMarcaProducto),
    idAnunciante: item.idAnunciante,
    anunciante: item.anunciante,
    idCategoriaAnunciante: item.idCategoriaAnunciante,
    categoriaAnunciante: item.categoriaAnunciante,
    marcaProducto: item.marcaProducto,
    activo: item.activo,
    fechaCreacion: item.fechaCreacion,
    fechaActualizacion: item.fechaActualizacion,
    creadoPor: item.creadoPor,
    actualizadoPor: item.actualizadoPor,
  };
}

function toPayload(values: MarcaProductoFormValues) {
  return {
    idAnunciante: Number(values.idAnunciante),
    idCategoriaAnunciante: Number(values.idCategoriaAnunciante),
    marcaProducto: values.marcaProducto.trim(),
    activo: values.activo,
  };
}

export const marcasProductosApi = {
  async getMarcasProductos(): Promise<MarcaProducto[]> {
    const response = await httpClient.get<MarcasProductosListResponse>("/marcas-productos");
    return (response.data.items ?? []).map(mapMarcaProductoFromApi);
  },

  async createMarcaProducto(values: MarcaProductoFormValues): Promise<MarcaProducto> {
    const response = await httpClient.post<MarcaProductoItemResponse>("/marcas-productos", {
      ...toPayload(values),
    });

    return mapMarcaProductoFromApi(response.data.item);
  },

  async updateMarcaProducto(id: string, values: MarcaProductoFormValues): Promise<MarcaProducto> {
    const response = await httpClient.patch<MarcaProductoItemResponse>(`/marcas-productos/${id}`, {
      ...toPayload(values),
    });

    return mapMarcaProductoFromApi(response.data.item);
  },

  async deleteMarcaProducto(id: string): Promise<void> {
    await httpClient.delete(`/marcas-productos/${id}`);
  },
};