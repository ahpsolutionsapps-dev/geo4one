import { Link } from "react-router";

import { Page } from "@/components/shared/Page";
import { Card, Table, TBody, Td, Th, THead, Tr } from "@/components/ui";

export interface UbicacionesField {
  name: string;
  description: string;
  required?: boolean;
}

interface UbicacionesModulePageProps {
  title: string;
  description: string;
  fields: UbicacionesField[];
  backHref?: string;
}

export default function UbicacionesModulePage({
  title,
  description,
  fields,
  backHref = "/dashboards/catalogos/ubicaciones",
}: UbicacionesModulePageProps) {
  return (
    <Page title={title}>
      <div className="transition-content flex h-full min-h-0 w-full flex-col pb-5 supports-[height:1dvh]:min-h-[calc(100dvh-4.5rem)]">
        <div className="transition-content flex min-h-0 flex-1 flex-col pt-3">
          <div className="px-(--margin-x) pb-4">
            <Card className="flex flex-col gap-4 p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-dark-50">
                    {title}
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm text-gray-500 dark:text-dark-200">
                    {description}
                  </p>
                </div>

                <Link
                  to={backHref}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-dark-500 dark:bg-dark-700 dark:text-dark-100 dark:hover:bg-dark-600"
                >
                  Volver a Ubicaciones
                </Link>
              </div>
            </Card>
          </div>

          <div className="px-(--margin-x) pb-5">
            <Card className="overflow-hidden">
              <Table className="w-full text-left rtl:text-right">
                <THead>
                  <Tr>
                    <Th className="dark:bg-dark-800 dark:text-dark-100 bg-gray-200 font-semibold text-gray-800 uppercase">
                      Campo
                    </Th>
                    <Th className="dark:bg-dark-800 dark:text-dark-100 bg-gray-200 font-semibold text-gray-800 uppercase">
                      Descripción
                    </Th>
                    <Th className="dark:bg-dark-800 dark:text-dark-100 bg-gray-200 font-semibold text-gray-800 uppercase">
                      Requerido
                    </Th>
                  </Tr>
                </THead>

                <TBody>
                  {fields.map((field) => (
                    <Tr
                      key={field.name}
                      className="dark:border-b-dark-500 border-y border-transparent border-b-gray-200"
                    >
                      <Td className="font-medium text-gray-900 dark:text-dark-50">
                        {field.name}
                      </Td>
                      <Td className="text-gray-600 dark:text-dark-200">
                        {field.description}
                      </Td>
                      <Td className="text-gray-600 dark:text-dark-200">
                        {field.required ? "Sí" : "No"}
                      </Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>
            </Card>
          </div>
        </div>
      </div>
    </Page>
  );
}
