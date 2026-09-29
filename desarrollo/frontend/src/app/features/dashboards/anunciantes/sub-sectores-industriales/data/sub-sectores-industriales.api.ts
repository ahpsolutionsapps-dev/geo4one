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
};