import { httpClient } from "@/shared/api/http-client";

import { Anunciante, AnuncianteFormValues } from "../anunciantes.types";

interface AnuncianteApiModel {
  idAnunciante: number;
  idSectorIndustrial: number;
  sectorIndustrial: string;
  idSubSectorIndustrial: number;
  subSectorIndustrial: string;
  idCategoriaAnunciante: number;
  categoriaAnunciante: string;
  anunciante: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

interface ListResponse {
  items: AnuncianteApiModel[];
}

interface ItemResponse {
  item: AnuncianteApiModel;
}

interface GenericOptionModel {
  idSectorIndustrial?: number;
  sectorIndustrial?: string;
  idSubSectorIndustrial?: number;
  subSectorIndustrial?: string;
  idCategoriaAnunciante?: number;
  categoriaAnunciante?: string;
}

interface OptionsResponse {
  items: GenericOptionModel[];
}

export interface SelectOption {
  id: string;
  label: string;
}

function mapFromApi(item: AnuncianteApiModel): Anunciante {
  return {
    id: String(item.idAnunciante),
    idSectorIndustrial: item.idSectorIndustrial,
    sectorIndustrial: item.sectorIndustrial,
    idSubSectorIndustrial: item.idSubSectorIndustrial,
    subSectorIndustrial: item.subSectorIndustrial,
    idCategoriaAnunciante: item.idCategoriaAnunciante,
    categoriaAnunciante: item.categoriaAnunciante,
    anunciante: item.anunciante,
    activo: item.activo,
    fechaCreacion: item.fechaCreacion,
    fechaActualizacion: item.fechaActualizacion,
    creadoPor: item.creadoPor,
    actualizadoPor: item.actualizadoPor,
  };
}

function toPayload(values: AnuncianteFormValues) {
  return {
    idSectorIndustrial: Number(values.idSectorIndustrial),
    idSubSectorIndustrial: Number(values.idSubSectorIndustrial),
    idCategoriaAnunciante: Number(values.idCategoriaAnunciante),
    anunciante: values.anunciante.trim(),
    activo: values.activo,
  };
}

export const anunciantesApi = {
  async getAnunciantes(): Promise<Anunciante[]> {
    const response = await httpClient.get<ListResponse>("/anunciantes");
    return (response.data.items ?? []).map(mapFromApi);
  },

  async getSectoresOptions(): Promise<SelectOption[]> {
    const response = await httpClient.get<OptionsResponse>("/anunciantes/options/sectores-industriales");
    return (response.data.items ?? []).map((item) => ({
      id: String(item.idSectorIndustrial),
      label: item.sectorIndustrial ?? "",
    }));
  },

  async getSubSectoresOptions(idSectorIndustrial?: string): Promise<SelectOption[]> {
    const response = await httpClient.get<OptionsResponse>(
      "/anunciantes/options/sub-sectores-industriales",
      {
        params: idSectorIndustrial
          ? { idSectorIndustrial: Number(idSectorIndustrial) }
          : undefined,
      },
    );

    return (response.data.items ?? []).map((item) => ({
      id: String(item.idSubSectorIndustrial),
      label: item.subSectorIndustrial ?? "",
    }));
  },

  async getCategoriasOptions(idSubSectorIndustrial?: string): Promise<SelectOption[]> {
    const response = await httpClient.get<OptionsResponse>(
      "/anunciantes/options/categorias-anunciantes",
      {
        params: idSubSectorIndustrial
          ? { idSubSectorIndustrial: Number(idSubSectorIndustrial) }
          : undefined,
      },
    );

    return (response.data.items ?? []).map((item) => ({
      id: String(item.idCategoriaAnunciante),
      label: item.categoriaAnunciante ?? "",
    }));
  },

  async createAnunciante(values: AnuncianteFormValues): Promise<Anunciante> {
    const response = await httpClient.post<ItemResponse>("/anunciantes", {
      ...toPayload(values),
    });
    return mapFromApi(response.data.item);
  },

  async updateAnunciante(id: string, values: AnuncianteFormValues): Promise<Anunciante> {
    const response = await httpClient.patch<ItemResponse>(`/anunciantes/${id}`, {
      ...toPayload(values),
    });
    return mapFromApi(response.data.item);
  },

  async deleteAnunciante(id: string): Promise<void> {
    await httpClient.delete(`/anunciantes/${id}`);
  },
};
