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
};