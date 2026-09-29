import { httpClient } from "@/shared/api/http-client";

interface AnuncianteApiModel {
  idAnunciante: number;
  anunciante: string;
  activo: boolean;
}

interface AnunciantesListResponse {
  items: AnuncianteApiModel[];
}

export interface AnuncianteOption {
  id: string;
  anunciante: string;
}

export const anunciantesApi = {
  async getAnunciantes(): Promise<AnuncianteOption[]> {
    const response = await httpClient.get<AnunciantesListResponse>("/anunciantes");

    return (response.data.items ?? [])
      .filter((item) => item.activo)
      .map((item) => ({
        id: String(item.idAnunciante),
        anunciante: item.anunciante,
      }));
  },
};