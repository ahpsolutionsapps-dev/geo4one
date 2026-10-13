import { useEffect, useState } from "react";

import { catalogosElementosApi } from "@/app/features/dashboards/catalogos/shared/catalogos-elementos.api";
import { municipiosApi } from "@/app/features/dashboards/catalogos/ubicaciones/municipios/data/municipios.api";
import { provinciasApi } from "@/app/features/dashboards/catalogos/ubicaciones/provincias/data/provincias.api";
import { sectoresApi } from "@/app/features/dashboards/catalogos/ubicaciones/sectores/data/sectores.api";
import { proveedoresApi } from "@/app/features/dashboards/proveedores/data/proveedores.api";

import {
  ElementoFormOptions,
  EMPTY_ELEMENTO_FORM_OPTIONS,
} from "../domain/types";

export function useElementoFormOptions() {
  const [options, setOptions] = useState<ElementoFormOptions>(
    EMPTY_ELEMENTO_FORM_OPTIONS,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void (async () => {
      setLoading(true);
      setError(null);

      try {
        const [
          proveedores,
          tiposElementos,
          formatos,
          tamanos,
          orientaciones,
          provincias,
          municipios,
          sectores,
        ] = await Promise.all([
          proveedoresApi.getProveedores(),
          catalogosElementosApi.getTiposElementosOptions(),
          catalogosElementosApi.getFormatos(),
          catalogosElementosApi.dimensiones.list(),
          catalogosElementosApi.orientaciones.list(),
          provinciasApi.getProvincias(),
          municipiosApi.getMunicipios(),
          sectoresApi.getSectores(),
        ]);

        if (!active) {
          return;
        }

        setOptions({
          proveedores: proveedores.map((item) => ({
            label: item.proveedor,
            value: item.id,
          })),
          tiposElementos: tiposElementos.map((item) => ({
            label: item.nombre,
            value: item.id,
          })),
          formatos: formatos.map((item) => ({
            label: item.formato,
            value: item.id,
            idTipoElemento: item.idTipoElemento,
          })),
          tamanos: tamanos.map((item) => ({
            label: item.nombre,
            value: item.id,
          })),
          orientaciones: orientaciones.map((item) => ({
            label: item.nombre,
            value: item.id,
          })),
          provincias: provincias.map((item) => ({
            label: item.provincia,
            value: item.id,
          })),
          municipios: municipios.map((item) => ({
            label: `${item.municipio} - ${item.provinciaNombre}`,
            value: item.id,
            idProvincia: String(item.idProvincia),
          })),
          sectores: sectores.map((item) => ({
            label: `${item.sectorBarrio} - ${item.municipioNombre}`,
            value: item.id,
            idMunicipio: String(item.idMunicipio),
          })),
        });
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar los catálogos del formulario",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { options, loading, error };
}
