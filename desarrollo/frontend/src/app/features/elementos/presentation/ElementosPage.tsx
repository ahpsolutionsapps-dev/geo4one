import { Dialog, DialogPanel, Tab, TabGroup, TabList, Transition, TransitionChild } from '@headlessui/react';
import {
  DocumentPlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Fragment, useState } from 'react';
import { Page } from '@/components/shared/Page';
import {
  Badge,
  Button,
  Card,
  Input,
  Radio,
  Select,
  Table,
  TBody,
  Td,
  Textarea,
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
  const [showCreateModal, setShowCreateModal] = useState(false);
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

          <Button
            color="primary"
            className="w-full sm:w-auto"
            onClick={() => setShowCreateModal(true)}
          >
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

        <ElementoFormModal
          show={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      </div>
    </Page>
  );
}

const modalTabs = [
  'Información General',
  'Ubicación',
  'Licencia y Costos',
  'Archivos y Observaciones',
];

function RequiredLabel({ text }: { text: string }) {
  return (
    <>
      {text} <span className="text-error">*</span>
    </>
  );
}

function ElementoFormModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  return (
    <Transition show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-5"
        onClose={onClose}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-[2px]" />
        </TransitionChild>

        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <DialogPanel className="scrollbar-sm relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-dark-700">
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400">
                  <DocumentPlusIcon className="size-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-dark-100">
                    Crear Nuevo Elemento
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                    Complete la información para registrar un nuevo elemento publicitario.
                  </p>
                </div>
              </div>

              <Button
                variant="flat"
                isIcon
                className="mt-0.5 size-8 rounded-full"
                aria-label="Cerrar modal"
                onClick={onClose}
              >
                <XMarkIcon className="size-5" />
              </Button>
            </div>

            <div className="max-h-[calc(100vh-10rem)] overflow-y-auto px-5 pb-5 sm:px-6 sm:pb-6">
              <TabGroup>
                <TabList className="hide-scrollbar mt-2 flex overflow-x-auto border-b border-gray-200 dark:border-dark-500">
                  {modalTabs.map((tab) => (
                    <Tab
                      key={tab}
                      className="-mb-px shrink-0 border-b-2 border-transparent px-3 py-3 text-sm text-gray-500 outline-hidden transition hover:text-primary-600 data-selected:border-primary-500 data-selected:font-medium data-selected:text-primary-600 dark:text-dark-300 dark:hover:text-primary-400 dark:data-selected:text-primary-400"
                    >
                      {tab}
                    </Tab>
                  ))}
                </TabList>
              </TabGroup>

              <div className="space-y-5 pt-5">
                <section className="space-y-3">
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-dark-100">Proveedor</h4>
                  <div className="grid gap-3 md:grid-cols-12">
                    <Select
                      classNames={{ root: 'md:col-span-8' }}
                      label={<RequiredLabel text="Suplidor / Proveedor" />}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Seleccione un suplidor
                      </option>
                      <option value="vallas-estilo">Vallas Estilo</option>
                      <option value="media-group">Media Group SRL</option>
                      <option value="vision-publicidad">Vision Publicidad</option>
                    </Select>

                    <Input
                      classNames={{ root: 'md:col-span-4' }}
                      label="ID-Suplidor"
                      placeholder="Se generará automáticamente"
                      readOnly
                      disabled
                    />
                  </div>
                </section>

                <section className="space-y-3 border-t border-gray-200 pt-5 dark:border-dark-500">
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-dark-100">Datos del Elemento</h4>
                  <div className="grid gap-3 md:grid-cols-12">
                    <Select
                      classNames={{ root: 'md:col-span-4' }}
                      label={<RequiredLabel text="Tipo de Elemento" />}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Seleccione un tipo
                      </option>
                      <option value="estatico">Estático</option>
                      <option value="digital">Digital</option>
                      <option value="movil">Móvil</option>
                    </Select>

                    <Select
                      classNames={{ root: 'md:col-span-4' }}
                      label={<RequiredLabel text="Formato" />}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Seleccione un formato
                      </option>
                      <option value="valla">Valla</option>
                      <option value="mupi">Mupi</option>
                      <option value="pantalla">Pantalla</option>
                    </Select>

                    <Select
                      classNames={{ root: 'md:col-span-4' }}
                      label={<RequiredLabel text="Tamaño" />}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Seleccione un tamaño
                      </option>
                      <option value="4x6">4 x 6</option>
                      <option value="8x14">8 x 14</option>
                      <option value="12x36">12 x 36</option>
                    </Select>

                    <Select
                      classNames={{ root: 'md:col-span-5' }}
                      label="Orientación"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Seleccione una orientación
                      </option>
                      <option value="norte">Norte</option>
                      <option value="sur">Sur</option>
                      <option value="este">Este</option>
                      <option value="oeste">Oeste</option>
                    </Select>

                    <div className="md:col-span-7">
                      <label className="input-label">
                        <span className="input-label">
                          <RequiredLabel text="Estatus" />
                        </span>
                      </label>
                      <div className="mt-3 flex flex-wrap items-center gap-5">
                        <Radio name="status" label="Sí (Activo)" defaultChecked />
                        <Radio name="status" label="No (Inactivo)" />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-3 border-t border-gray-200 pt-5 dark:border-dark-500">
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-dark-100">Información Básica</h4>
                  <div className="grid gap-3 md:grid-cols-12">
                    <Input
                      classNames={{ root: 'md:col-span-8' }}
                      label={<RequiredLabel text="Nombre / Referencia del Elemento" />}
                      placeholder="Ej. ELM-0011"
                    />

                    <Input
                      classNames={{ root: 'md:col-span-4' }}
                      label="ID-Seguimiento"
                      placeholder="Ej. SEG-2025-001"
                    />

                    <Textarea
                      classNames={{ root: 'md:col-span-12' }}
                      label={<RequiredLabel text="Dirección" />}
                      rows={2}
                      placeholder="Ingrese la dirección exacta del elemento"
                    />
                  </div>
                </section>

                <section className="space-y-3 border-t border-gray-200 pt-5 dark:border-dark-500">
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-dark-100">Ubicación</h4>
                  <div className="grid gap-3 md:grid-cols-12">
                    <Select
                      classNames={{ root: 'md:col-span-4' }}
                      label={<RequiredLabel text="Provincia" />}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Seleccione una provincia
                      </option>
                      <option value="santo-domingo">Santo Domingo</option>
                      <option value="santiago">Santiago</option>
                    </Select>

                    <Select
                      classNames={{ root: 'md:col-span-4' }}
                      label={<RequiredLabel text="Municipio" />}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Seleccione un municipio
                      </option>
                      <option value="distrito-nacional">Distrito Nacional</option>
                      <option value="santo-domingo-este">Santo Domingo Este</option>
                    </Select>

                    <Select
                      classNames={{ root: 'md:col-span-4' }}
                      label={<RequiredLabel text="Sector / Barrio" />}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Seleccione un sector
                      </option>
                      <option value="naco">Naco</option>
                      <option value="piantini">Piantini</option>
                    </Select>

                    <Input
                      classNames={{ root: 'md:col-span-5' }}
                      label="Circunscripción"
                      placeholder="Ingrese la circunscripción"
                    />

                    <Input
                      classNames={{ root: 'md:col-span-3.5' }}
                      label="Latitud"
                      placeholder="Ej. 18.4861"
                    />

                    <Input
                      classNames={{ root: 'md:col-span-3.5' }}
                      label="Longitud"
                      placeholder="Ej. -69.9312"
                    />
                  </div>
                </section>
              </div>

              <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-5 dark:border-dark-500">
                <Button variant="outlined" className="min-w-[9rem]" onClick={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" className="min-w-[12rem]">
                  Guardar Elemento
                </Button>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}
