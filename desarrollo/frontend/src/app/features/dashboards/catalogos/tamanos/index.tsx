import { SimpleCatalogModulePage } from "../shared/SimpleCatalogModulePage";
import { catalogosElementosApi } from "../shared/catalogos-elementos.api";

export default function TamanosPage() {
  return (
    <SimpleCatalogModulePage
      title="Dimensiones"
      singularLabel="dimension"
      createLabel="Nueva dimension"
      searchPlaceholder="Buscar dimension..."
      loadErrorMessage="No se pudieron cargar las dimensiones"
      api={catalogosElementosApi.dimensiones}
    />
  );
}
