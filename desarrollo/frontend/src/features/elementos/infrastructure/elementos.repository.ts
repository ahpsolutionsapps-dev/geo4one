import axios from "@/utils/axios";

import type { Elemento } from "../domain/types";

export async function getElementos(): Promise<Elemento[]> {
  const { data } = await axios.get<{ items?: Elemento[] }>('/elementos');
  return data.items ?? [];
}
