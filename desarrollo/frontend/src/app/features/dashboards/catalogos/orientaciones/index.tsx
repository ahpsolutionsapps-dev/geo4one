import { SimpleCatalogModulePage } from "../shared/SimpleCatalogModulePage";
import { catalogosElementosApi } from "../shared/catalogos-elementos.api";

export default function OrientacionesPage() {
  return (
    <SimpleCatalogModulePage
      title="Orientaciones"
      singularLabel="orientacion"
      createLabel="Nueva orientacion"
      searchPlaceholder="Buscar orientacion..."
      loadErrorMessage="No se pudieron cargar las orientaciones"
      api={catalogosElementosApi.orientaciones}
    />
  );
}
