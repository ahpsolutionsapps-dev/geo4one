import { SimpleCatalogModulePage } from "../shared/SimpleCatalogModulePage";
import { catalogosElementosApi } from "../shared/catalogos-elementos.api";

export default function TiposPage() {
  return (
    <SimpleCatalogModulePage
      title="Tipos de elementos"
      singularLabel="tipo de elemento"
      createLabel="Nuevo tipo"
      searchPlaceholder="Buscar tipo..."
      loadErrorMessage="No se pudieron cargar los tipos de elementos"
      api={catalogosElementosApi.tiposElementos}
    />
  );
}
