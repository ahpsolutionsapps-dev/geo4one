import { Link } from "react-router";

import { Page } from "@/components/shared/Page";
import { Card } from "@/components/ui";

const modules = [
  {
    title: "Provincias",
    description:
      "Catálogo de provincias con latitud, longitud y estado activo.",
    href: "/dashboards/catalogos/ubicaciones/provincias",
  },
  {
    title: "Municipios",
    description:
      "Catálogo de municipios vinculados a su provincia principal.",
    href: "/dashboards/catalogos/ubicaciones/municipios",
  },
  {
    title: "Sectores",
    description:
      "Sectores y barrios asociados a un municipio, con circunscripción.",
    href: "/dashboards/catalogos/ubicaciones/sectores",
  },
];

export default function UbicacionesPage() {
  return (
    <Page title="Ubicaciones">
      <div className="transition-content flex h-full min-h-0 w-full flex-col pb-5 supports-[height:1dvh]:min-h-[calc(100dvh-4.5rem)]">
        <div className="transition-content flex min-h-0 flex-1 flex-col pt-3">
          <div className="px-(--margin-x) pb-4">
            <Card className="flex flex-col gap-4 p-6">
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-dark-50">
                  Ubicaciones
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-gray-500 dark:text-dark-200">
                  Estructura geográfica del catálogo para provincias, municipios
                  y sectores. La jerarquía se mantiene como Provincia →
                  Municipio → Sector.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {modules.map((module) => (
                  <Link
                    key={module.title}
                    to={module.href}
                    className="rounded-2xl border border-gray-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md dark:border-dark-500 dark:bg-dark-750 dark:hover:border-primary-500"
                  >
                    <span className="block text-base font-semibold text-gray-900 dark:text-dark-50">
                      {module.title}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-gray-500 dark:text-dark-200">
                      {module.description}
                    </span>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Page>
  );
}
