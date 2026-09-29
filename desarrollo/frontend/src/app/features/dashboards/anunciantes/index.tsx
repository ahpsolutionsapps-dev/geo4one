import { Link } from "react-router";

import { Page } from "@/components/shared/Page";
import { Card } from "@/components/ui";

const modules = [
  {
    title: "Sector Industrial",
    description: "Catálogo base de sectores industriales activos.",
    href: "/dashboards/anunciantes/sectores-industriales",
  },
  {
    title: "Sub Sector Industrial",
    description: "Subsectores asociados a cada sector industrial.",
    href: "/dashboards/anunciantes/sub-sectores-industriales",
  },
  {
    title: "Categoría",
    description: "Categorías de anunciantes vinculadas a sector y sub sector.",
    href: "/dashboards/anunciantes/categorias-anunciantes",
  },
  {
    title: "Anunciante",
    description: "Registro de anunciantes vinculados a sector, sub sector y categoría.",
    href: "/dashboards/anunciantes/listado",
  },
  {
    title: "Marca",
    description: "Marcas de producto vinculadas a anunciante y categoría.",
    href: "/dashboards/anunciantes/marcas-productos",
  },
  {
    title: "Combo de Anunciantes",
    description: "Combinación ordenada de marcas para campañas y seguimientos.",
    href: "/dashboards/anunciantes/combos-anunciantes",
  },
  {
    title: "Marcas de Agua",
    description: "Firmas visuales vinculadas a versiones de campaña.",
    href: "/dashboards/anunciantes/marcas-agua",
  },
];

export default function AnunciantesPage() {
  return (
    <Page title="Anunciantes">
      <div className="transition-content flex h-full min-h-0 w-full flex-col pb-5 supports-[height:1dvh]:min-h-[calc(100dvh-4.5rem)]">
        <div className="transition-content flex min-h-0 flex-1 flex-col pt-3">
          <div className="px-(--margin-x) pb-4">
            <Card className="flex flex-col gap-4 p-6">
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-dark-50">
                  Anunciantes
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-gray-500 dark:text-dark-200">
                  Administración de la jerarquía comercial para sectores,
                  subsectores, categorías y marcas de producto.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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
