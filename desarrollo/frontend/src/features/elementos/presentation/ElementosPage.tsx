import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Page } from '@/components/shared/Page';
import {
  Badge,
  Button,
  Card,
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '@/components/ui';

import { useElementos } from '../application/use-elementos';
import type { Elemento } from '../domain/types';

const fallbackRows: Elemento[] = [
  {
    id: 'ELM-0001',
    elemento: 'Valla Winston Churchill',
    tipo: 'Estático',
    formato: 'Media Group SRL',
    tamaño: '14 x 48',
    proveedor: 'Valla Estilo',
    ubicacion: 'Santo Domingo',
    licencia: 'LIC-2025-001',
    costo: '15,000.00',
    status: 'Activo',
    imagen:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ELM-0002',
    elemento: 'Pantalla Ágora Mall',
    tipo: 'Digital',
    formato: 'Vision Publicidad',
    tamaño: '8 x 14',
    proveedor: 'Pantalla LED',
    ubicacion: 'Santo Domingo',
    licencia: 'LIC-2025-002',
    costo: '25,000.00',
    status: 'Activo',
    imagen:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ELM-0003',
    elemento: 'Mupi Blue Mall',
    tipo: 'Estático',
    formato: 'Outdoor Caribe',
    tamaño: '4 x 6',
    proveedor: 'Mupi',
    ubicacion: 'Santo Domingo',
    licencia: 'LIC-2025-003',
    costo: '8,500.00',
    status: 'Activo',
    imagen:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ELM-0004',
    elemento: 'Valla 27 de Febrero',
    tipo: 'Estático',
    formato: 'Media Group SRL',
    tamaño: '12 x 36',
    proveedor: 'Valla Estilo',
    ubicacion: 'Santo Domingo',
    licencia: 'LIC-2024-015',
    costo: '12,000.00',
    status: 'Inactivo',
    imagen:
      'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=80',
  },
];

const statusColors = {
  Activo: 'success',
  Inactivo: 'error',
  Anulado: 'neutral',
} as const;

export default function ElementosPage() {
  const { items, loading, error } = useElementos();
  const rows = items.length > 0 ? items : fallbackRows;

  return (
    <Page title="Elementos">
      <div className="transition-content w-full px-(--margin-x) pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-primary-500">
              Inventario / Publicidad
            </p>
            <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
              Elementos
            </h2>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-sm text-gray-500 dark:text-dark-300">
            Total de registros del inventario
          </div>

          <Button color="primary" className="w-full sm:w-auto">
            + Nuevo elemento
          </Button>
        </div>

        {error ? (
          <Card className="mb-6 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </Card>
        ) : null}

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Total', value: '248', hint: '+12% vs mes anterior', tone: 'primary' },
            { label: 'Activos', value: '192', hint: '78% del inventario', tone: 'success' },
            { label: 'Inactivos', value: '38', hint: 'Revisión requerida', tone: 'error' },
            { label: 'Anulados', value: '18', hint: 'Últimos 30 días', tone: 'neutral' },
          ].map((stat) => (
            <Card key={stat.label} className="p-4 shadow-sm ring-1 ring-gray-200/70 dark:ring-dark-500">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-dark-300">{stat.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-dark-50">
                    {stat.value}
                  </p>
                </div>
                <Badge color={stat.tone as any} variant="soft" className="rounded-full px-2.5 py-1">
                  {stat.hint}
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-3 p-4 sm:p-5">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <input
                className="h-10 min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-primary-500 focus:bg-white dark:border-dark-500 dark:bg-dark-700 dark:text-dark-50"
                placeholder="Buscar por nombre, licencia o ID..."
              />
              <select className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none dark:border-dark-500 dark:bg-dark-700 dark:text-dark-50">
                <option>Proveedor</option>
              </select>
              <select className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none dark:border-dark-500 dark:bg-dark-700 dark:text-dark-50">
                <option>Tipo</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button variant="outlined">Limpiar</Button>
              <Button color="primary">Buscar</Button>
            </div>
          </div>

          <div className="min-w-full overflow-x-auto">
            <Table className="w-full text-left rtl:text-right" hoverable zebra>
              <THead>
                <Tr>
                  <Th className="dark:bg-dark-800 dark:text-dark-100 w-10 bg-gray-200 font-semibold uppercase text-gray-800 first:ltr:rounded-tl-lg last:ltr:rounded-tr-lg first:rtl:rounded-tr-lg last:rtl:rounded-tl-lg"> </Th>
                  <Th className="dark:bg-dark-800 dark:text-dark-100 bg-gray-200 font-semibold uppercase text-gray-800">ID</Th>
                  <Th className="dark:bg-dark-800 dark:text-dark-100 bg-gray-200 font-semibold uppercase text-gray-800">Elemento</Th>
                  <Th className="dark:bg-dark-800 dark:text-dark-100 bg-gray-200 font-semibold uppercase text-gray-800">Tipo</Th>
                  <Th className="dark:bg-dark-800 dark:text-dark-100 bg-gray-200 font-semibold uppercase text-gray-800">Formato</Th>
                  <Th className="dark:bg-dark-800 dark:text-dark-100 bg-gray-200 font-semibold uppercase text-gray-800">Tamaño</Th>
                  <Th className="dark:bg-dark-800 dark:text-dark-100 bg-gray-200 font-semibold uppercase text-gray-800">Proveedor</Th>
                  <Th className="dark:bg-dark-800 dark:text-dark-100 bg-gray-200 font-semibold uppercase text-gray-800">Ubicación</Th>
                  <Th className="dark:bg-dark-800 dark:text-dark-100 bg-gray-200 font-semibold uppercase text-gray-800">Licencia</Th>
                  <Th className="dark:bg-dark-800 dark:text-dark-100 bg-gray-200 font-semibold uppercase text-gray-800">Costo</Th>
                  <Th className="dark:bg-dark-800 dark:text-dark-100 bg-gray-200 font-semibold uppercase text-gray-800">Estatus</Th>
                  <Th className="dark:bg-dark-800 dark:text-dark-100 bg-gray-200 font-semibold uppercase text-gray-800">Imagen</Th>
                  <Th className="dark:bg-dark-800 dark:text-dark-100 bg-gray-200 font-semibold uppercase text-gray-800">Acciones</Th>
                </Tr>
              </THead>
              <TBody>
                {loading ? (
                  <Tr>
                    <Td colSpan={13} className="py-8 text-center text-gray-500">
                      Cargando elementos...
                    </Td>
                  </Tr>
                ) : (
                  rows.map((row, index) => (
                    <Tr key={row.id ?? row.idElemento ?? `${row.licencia}-${index}`} className="border-y border-transparent border-b-gray-200 last:border-none dark:border-b-dark-500">
                      <Td>
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                      </Td>
                      <Td>{row.id ?? row.idElemento ?? '—'}</Td>
                      <Td>
                        <div className="flex items-center gap-3">
                          <img
                            src={row.imagen ?? fallbackRows[0].imagen}
                            alt={row.elemento ?? 'Elemento'}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                          <span className="font-medium text-gray-800 dark:text-dark-100">
                            {row.elemento ?? 'Sin nombre'}
                          </span>
                        </div>
                      </Td>
                      <Td>{row.tipo ?? '—'}</Td>
                      <Td>{row.formato ?? '—'}</Td>
                      <Td>{row.tamaño ?? '—'}</Td>
                      <Td>{row.proveedor ?? '—'}</Td>
                      <Td>{row.ubicacion ?? '—'}</Td>
                      <Td>{row.licencia ?? '—'}</Td>
                      <Td>{row.costo ?? '—'}</Td>
                      <Td>
                        <Badge variant="soft" color={statusColors[(row.status as keyof typeof statusColors) ?? 'Anulado'] as any}>
                          {row.status ?? 'Sin estado'}
                        </Badge>
                      </Td>
                      <Td>
                        <img
                          src={row.imagen ?? fallbackRows[0].imagen}
                          alt={row.elemento ?? 'Elemento'}
                          className="h-12 w-16 rounded-md object-cover"
                        />
                      </Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <Button variant="flat" isIcon className="size-7 rounded-full" aria-label="Ver elemento">
                            <EyeIcon className="size-4.5" />
                          </Button>
                          <Button variant="flat" isIcon className="size-7 rounded-full" aria-label="Editar elemento">
                            <PencilIcon className="size-4.5" />
                          </Button>
                          <Button variant="flat" isIcon className="size-7 rounded-full" aria-label="Eliminar elemento">
                            <TrashIcon className="size-4.5" />
                          </Button>
                        </div>
                      </Td>
                    </Tr>
                  ))
                )}
              </TBody>
            </Table>
          </div>
        </Card>
      </div>
    </Page>
  );
}
