import {
  Dialog,
  DialogPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  CheckCircleIcon,
  CurrencyDollarIcon,
  DocumentPlusIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";

import { DatePicker } from "@/components/shared/form/Datepicker";
import {
  Badge,
  Button,
  Input,
  Radio,
  Select,
  Textarea,
} from "@/components/ui";
import { formatDateInput, toDateInputValue } from "@/utils/date";
import { typedYupResolver } from "@/utils/typedYupResolver";

import type {
  Elemento,
  ElementoFormOptions,
  ElementoFormValues,
} from "../../domain/types";

const elementoSchema = Yup.object().shape({
  idProveedor: Yup.string().required("El proveedor es requerido"),
  idTipoElemento: Yup.string().required("El tipo de elemento es requerido"),
  idFormato: Yup.string(),
  idTamano: Yup.string(),
  activo: Yup.boolean().required(),
  licencia: Yup.string().trim().max(100, "Máximo 100 caracteres"),
  fechaEmision: Yup.string(),
  fechaVencimiento: Yup.string(),
  idSeguimiento: Yup.string().trim().max(100, "Máximo 100 caracteres"),
  direccion: Yup.string().trim().max(500, "Máximo 500 caracteres"),
  idProvincia: Yup.string().required("La provincia es requerida"),
  idMunicipio: Yup.string(),
  idSectorBarrio: Yup.string(),
  circunscripcion: Yup.string().trim().max(50, "Máximo 50 caracteres"),
  idOrientacion: Yup.string(),
  latitud: Yup.string()
    .trim()
    .test(
      "latitud",
      "Latitud inválida (rango -90 a 90)",
      (value) =>
        !value || (!Number.isNaN(Number(value)) && Number(value) >= -90 && Number(value) <= 90),
    ),
  longitud: Yup.string()
    .trim()
    .test(
      "longitud",
      "Longitud inválida (rango -180 a 180)",
      (value) =>
        !value || (!Number.isNaN(Number(value)) && Number(value) >= -180 && Number(value) <= 180),
    ),
  costoAlquiler: Yup.string()
    .trim()
    .test(
      "costoAlquiler",
      "El costo debe ser un número mayor o igual a 0",
      (value) => !value || (!Number.isNaN(Number(value)) && Number(value) >= 0),
    ),
  imagenUrl: Yup.string().trim().max(500, "Máximo 500 caracteres"),
});

const tabs = [
  "General",
  "Licencia y Seguimiento",
  "Ubicación",
  "Ubicación en Mapa",
  "Características",
  "Imagenes",
] as const;

function RequiredLabel({ text }: { text: string }) {
  return (
    <>
      {text} <span className="text-error">*</span>
    </>
  );
}

function buildDefaultValues(elemento?: Elemento | null): ElementoFormValues {
  return {
    idProveedor: elemento?.idProveedor ? String(elemento.idProveedor) : "",
    idTipoElemento: elemento?.idTipoElemento ? String(elemento.idTipoElemento) : "",
    idFormato: elemento?.idFormato ? String(elemento.idFormato) : "",
    idTamano: elemento?.idTamano ? String(elemento.idTamano) : "",
    activo: elemento?.activo ?? true,
    licencia: elemento?.licencia ?? "",
    fechaEmision: toDateInputValue(elemento?.fechaEmision),
    fechaVencimiento: toDateInputValue(elemento?.fechaVencimiento),
    idSeguimiento: elemento?.idSeguimiento ?? "",
    direccion: elemento?.direccion ?? "",
    idProvincia: elemento?.idProvincia ? String(elemento.idProvincia) : "",
    idMunicipio: elemento?.idMunicipio ? String(elemento.idMunicipio) : "",
    idSectorBarrio: elemento?.idSectorBarrio ? String(elemento.idSectorBarrio) : "",
    circunscripcion: elemento?.circunscripcion ?? "",
    idOrientacion: elemento?.idOrientacion ? String(elemento.idOrientacion) : "",
    latitud: elemento?.latitud != null ? String(elemento.latitud) : "",
    longitud: elemento?.longitud != null ? String(elemento.longitud) : "",
    costoAlquiler: elemento?.costoAlquiler != null ? String(elemento.costoAlquiler) : "",
    imagenUrl: elemento?.imagenUrl ?? "",
  };
}

interface ElementoFormModalProps {
  open: boolean;
  elemento?: Elemento | null;
  options: ElementoFormOptions;
  optionsLoading?: boolean;
  onClose: () => void;
  onSave: (values: ElementoFormValues) => Promise<void>;
}

export function ElementoFormModal({
  open,
  elemento,
  options,
  optionsLoading = false,
  onClose,
  onSave,
}: ElementoFormModalProps) {
  const isEditMode = Boolean(elemento);

  const {
    control,
    register,
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ElementoFormValues>({
    resolver: typedYupResolver<ElementoFormValues>(elementoSchema),
    defaultValues: buildDefaultValues(),
  });

  const selectedTipoElemento = watch("idTipoElemento");
  const selectedFormato = watch("idFormato");
  const selectedTamano = watch("idTamano");
  const selectedProvincia = watch("idProvincia");
  const selectedMunicipio = watch("idMunicipio");
  const selectedOrientacion = watch("idOrientacion");
  const fechaVencimiento = watch("fechaVencimiento");
  const activo = watch("activo");

  const formatoOptions = useMemo(
    () =>
      options.formatos
        .filter(
          (item) => !selectedTipoElemento || item.idTipoElemento === selectedTipoElemento,
        )
        .map((item) => ({ label: item.label, value: item.value })),
    [options.formatos, selectedTipoElemento],
  );

  const municipioOptions = useMemo(
    () =>
      options.municipios
        .filter((item) => !selectedProvincia || item.idProvincia === selectedProvincia)
        .map((item) => ({ label: item.label, value: item.value })),
    [options.municipios, selectedProvincia],
  );

  const sectorOptions = useMemo(
    () =>
      options.sectores
        .filter((item) => !selectedMunicipio || item.idMunicipio === selectedMunicipio)
        .map((item) => ({ label: item.label, value: item.value })),
    [options.sectores, selectedMunicipio],
  );

  const tipoLabel = useMemo(
    () =>
      options.tiposElementos.find((item) => item.value === selectedTipoElemento)?.label ??
      "—",
    [options.tiposElementos, selectedTipoElemento],
  );
  const formatoLabel = useMemo(
    () => options.formatos.find((item) => item.value === selectedFormato)?.label ?? "—",
    [options.formatos, selectedFormato],
  );
  const tamanoLabel = useMemo(
    () => options.tamanos.find((item) => item.value === selectedTamano)?.label ?? "—",
    [options.tamanos, selectedTamano],
  );
  const orientacionLabel = useMemo(
    () =>
      options.orientaciones.find((item) => item.value === selectedOrientacion)?.label ?? "—",
    [options.orientaciones, selectedOrientacion],
  );

  const licenciaStatus = useMemo(() => {
    if (!fechaVencimiento) {
      return { label: "Sin licencia", color: "neutral" as const };
    }

    const vencimiento = new Date(`${fechaVencimiento}T23:59:59`);
    const ahora = new Date();

    if (Number.isNaN(vencimiento.getTime())) {
      return { label: "Sin licencia", color: "neutral" as const };
    }

    if (vencimiento < ahora) {
      return { label: "Vencida", color: "error" as const };
    }

    const enTreintasDias = new Date();
    enTreintasDias.setDate(enTreintasDias.getDate() + 30);

    if (vencimiento <= enTreintasDias) {
      return { label: "Por vencer", color: "warning" as const };
    }

    return { label: "Vigente", color: "success" as const };
  }, [fechaVencimiento]);

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(buildDefaultValues(elemento));
  }, [open, elemento, reset]);

  useEffect(() => {
    if (!open || !selectedTipoElemento) {
      return;
    }

    const isValid = formatoOptions.some((item) => item.value === watch("idFormato"));
    if (!isValid) {
      setValue("idFormato", "");
    }
  }, [open, selectedTipoElemento, formatoOptions, setValue, watch]);

  useEffect(() => {
    if (!open || !selectedProvincia) {
      return;
    }

    const isValid = municipioOptions.some((item) => item.value === watch("idMunicipio"));
    if (!isValid) {
      setValue("idMunicipio", "");
      setValue("idSectorBarrio", "");
    }
  }, [open, selectedProvincia, municipioOptions, setValue, watch]);

  useEffect(() => {
    if (!open || !selectedMunicipio) {
      return;
    }

    const isValid = sectorOptions.some((item) => item.value === watch("idSectorBarrio"));
    if (!isValid) {
      setValue("idSectorBarrio", "");
    }
  }, [open, selectedMunicipio, sectorOptions, setValue, watch]);

  const submit = handleSubmit(async (values) => {
    await onSave(values);
    onClose();
  });

  const handleMapPlaceholder = () => {
    toast.info("La selección en mapa estará disponible próximamente.");
  };

  return (
    <Transition show={open} as={Fragment}>
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
                    {isEditMode ? "Editar elemento" : "Crear nuevo elemento"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                    {isEditMode
                      ? "Actualiza la información del registro seleccionado."
                      : "Complete la información para registrar un nuevo elemento publicitario."}
                  </p>
                </div>
              </div>

              <Button
                variant="flat"
                isIcon
                className="mt-0.5 size-8 rounded-full"
                aria-label="Cerrar modal"
                onClick={onClose}
                disabled={isSubmitting}
              >
                <XMarkIcon className="size-5" />
              </Button>
            </div>

            <form onSubmit={submit}>
              <TabGroup key={elemento?.idElemento ?? "nuevo"}>
                <TabList className="hide-scrollbar flex overflow-x-auto border-b border-gray-200 px-3 pt-2 sm:px-5 dark:border-dark-500">
                  {tabs.map((tab) => (
                    <Tab
                      key={tab}
                      className="-mb-px shrink-0 border-b-2 border-transparent px-3 py-3 text-sm text-gray-500 outline-hidden transition hover:text-primary-600 data-selected:border-primary-500 data-selected:font-medium data-selected:text-primary-600 dark:text-dark-300 dark:hover:text-primary-400 dark:data-selected:text-primary-400"
                    >
                      {tab}
                    </Tab>
                  ))}
                </TabList>

                <div className="h-[calc(100vh-16rem)] min-h-[30rem] overflow-y-auto px-5 pb-5 sm:px-6 sm:pb-6">
                  <TabPanels>
                    {/* GENERAL */}
                    <TabPanel className="space-y-5 pt-5 outline-hidden">
                      <div className="grid gap-4 md:grid-cols-12">
                        <div className="md:col-span-12">
                          <Controller
                            control={control}
                            name="idProveedor"
                            render={({ field }) => (
                              <Select
                                label={<RequiredLabel text="Proveedor" />}
                                data={[
                                  { label: "Seleccionar proveedor", value: "", disabled: true },
                                  ...options.proveedores,
                                ]}
                                value={field.value}
                                onChange={(event) => field.onChange(event.target.value)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                error={errors.idProveedor?.message}
                                disabled={optionsLoading || isSubmitting}
                              />
                            )}
                          />
                        </div>

                        <div className="md:col-span-12">
                          <Controller
                            control={control}
                            name="idTipoElemento"
                            render={({ field }) => (
                              <Select
                                label={<RequiredLabel text="Tipo de Elemento" />}
                                data={[
                                  { label: "Seleccionar tipo", value: "", disabled: true },
                                  ...options.tiposElementos,
                                ]}
                                value={field.value}
                                onChange={(event) => field.onChange(event.target.value)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                error={errors.idTipoElemento?.message}
                                disabled={optionsLoading || isSubmitting}
                              />
                            )}
                          />
                        </div>

                        <div className="md:col-span-6">
                          <Controller
                            control={control}
                            name="idFormato"
                            render={({ field }) => (
                              <Select
                                label="Formato"
                                data={[
                                  { label: "Seleccionar formato", value: "", disabled: true },
                                  ...formatoOptions,
                                ]}
                                value={field.value}
                                onChange={(event) => field.onChange(event.target.value)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                error={errors.idFormato?.message}
                                disabled={optionsLoading || isSubmitting}
                              />
                            )}
                          />
                        </div>

                        <div className="md:col-span-6">
                          <Controller
                            control={control}
                            name="idTamano"
                            render={({ field }) => (
                              <Select
                                label="Tamaño"
                                data={[
                                  { label: "Seleccionar tamaño", value: "", disabled: true },
                                  ...options.tamanos,
                                ]}
                                value={field.value}
                                onChange={(event) => field.onChange(event.target.value)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                error={errors.idTamano?.message}
                                disabled={optionsLoading || isSubmitting}
                              />
                            )}
                          />
                        </div>

                        <div className="md:col-span-12">
                          <span className="input-label">
                            <RequiredLabel text="Estado" />
                          </span>
                          <div className="mt-3 flex flex-wrap items-center gap-5">
                            <Controller
                              control={control}
                              name="activo"
                              render={({ field }) => (
                                <>
                                  <Radio
                                    name="activo"
                                    label="Sí (Activo)"
                                    checked={field.value === true}
                                    onChange={() => field.onChange(true)}
                                    disabled={isSubmitting}
                                  />
                                  <Radio
                                    name="activo"
                                    label="No (Inactivo)"
                                    checked={field.value === false}
                                    onChange={() => field.onChange(false)}
                                    disabled={isSubmitting}
                                  />
                                </>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </TabPanel>

                    {/* LICENCIA Y SEGUIMIENTO */}
                    <TabPanel className="space-y-5 pt-5 outline-hidden">
                      <div className="grid gap-4 md:grid-cols-12">
                        <div className="md:col-span-12">
                          <Input
                            label="Número / Código de Licencia"
                            placeholder="Ej. LIC-2025-001"
                            {...register("licencia")}
                            error={errors.licencia?.message}
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="md:col-span-6">
                          <Controller
                            control={control}
                            name="fechaEmision"
                            render={({ field }) => (
                              <DatePicker
                                label="Fecha de Emisión"
                                options={{ dateFormat: "Y-m-d" }}
                                value={field.value}
                                onChange={(dates) =>
                                  field.onChange(dates.length ? formatDateInput(dates[0]) : "")
                                }
                                error={errors.fechaEmision?.message}
                                disabled={isSubmitting}
                              />
                            )}
                          />
                        </div>

                        <div className="md:col-span-6">
                          <Controller
                            control={control}
                            name="fechaVencimiento"
                            render={({ field }) => (
                              <DatePicker
                                label="Fecha de Vencimiento"
                                options={{ dateFormat: "Y-m-d" }}
                                value={field.value}
                                onChange={(dates) =>
                                  field.onChange(dates.length ? formatDateInput(dates[0]) : "")
                                }
                                error={errors.fechaVencimiento?.message}
                                disabled={isSubmitting}
                              />
                            )}
                          />
                        </div>

                        <div className="md:col-span-12">
                          <Input
                            label="ID Seguimiento"
                            placeholder="Ej. SEG-2025-001"
                            {...register("idSeguimiento")}
                            error={errors.idSeguimiento?.message}
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="md:col-span-12">
                          <span className="input-label">Estado de licencia</span>
                          <div className="mt-2">
                            <Badge variant="soft" color={licenciaStatus.color} className="gap-1.5">
                              {licenciaStatus.color === "error" ? (
                                <ExclamationTriangleIcon className="size-4" />
                              ) : (
                                <CheckCircleIcon className="size-4" />
                              )}
                              {licenciaStatus.label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </TabPanel>

                    {/* UBICACIÓN */}
                    <TabPanel className="space-y-5 pt-5 outline-hidden">
                      <div className="grid gap-4 md:grid-cols-12">
                        <div className="md:col-span-12">
                          <Textarea
                            label="Dirección"
                            rows={2}
                            placeholder="Ingrese la dirección exacta del elemento"
                            {...register("direccion")}
                            error={errors.direccion?.message}
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="md:col-span-6">
                          <Controller
                            control={control}
                            name="idProvincia"
                            render={({ field }) => (
                              <Select
                                label={<RequiredLabel text="Provincia" />}
                                data={[
                                  { label: "Seleccionar provincia", value: "", disabled: true },
                                  ...options.provincias,
                                ]}
                                value={field.value}
                                onChange={(event) => field.onChange(event.target.value)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                error={errors.idProvincia?.message}
                                disabled={optionsLoading || isSubmitting}
                              />
                            )}
                          />
                        </div>

                        <div className="md:col-span-6">
                          <Controller
                            control={control}
                            name="idMunicipio"
                            render={({ field }) => (
                              <Select
                                label="Municipio"
                                data={[
                                  { label: "Seleccionar municipio", value: "", disabled: true },
                                  ...municipioOptions,
                                ]}
                                value={field.value}
                                onChange={(event) => field.onChange(event.target.value)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                error={errors.idMunicipio?.message}
                                disabled={optionsLoading || isSubmitting}
                              />
                            )}
                          />
                        </div>

                        <div className="md:col-span-6">
                          <Controller
                            control={control}
                            name="idSectorBarrio"
                            render={({ field }) => (
                              <Select
                                label="Sector / Barrio"
                                data={[
                                  { label: "Seleccionar sector", value: "", disabled: true },
                                  ...sectorOptions,
                                ]}
                                value={field.value}
                                onChange={(event) => field.onChange(event.target.value)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                error={errors.idSectorBarrio?.message}
                                disabled={optionsLoading || isSubmitting}
                              />
                            )}
                          />
                        </div>

                        <div className="md:col-span-6">
                          <Input
                            label="Circunscripción"
                            placeholder="Ingrese la circunscripción"
                            {...register("circunscripcion")}
                            error={errors.circunscripcion?.message}
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="md:col-span-12">
                          <Controller
                            control={control}
                            name="idOrientacion"
                            render={({ field }) => (
                              <Select
                                label="Orientación"
                                data={[
                                  { label: "Seleccionar orientación", value: "", disabled: true },
                                  ...options.orientaciones,
                                ]}
                                value={field.value}
                                onChange={(event) => field.onChange(event.target.value)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                error={errors.idOrientacion?.message}
                                disabled={optionsLoading || isSubmitting}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </TabPanel>

                    {/* UBICACIÓN EN MAPA */}
                    <TabPanel className="space-y-5 pt-5 outline-hidden">
                      <div className="relative h-64 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-dark-500 dark:bg-dark-800">
                        <div
                          className="absolute inset-0 opacity-70"
                          style={{
                            backgroundImage:
                              "linear-gradient(to right, rgba(148,163,184,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.25) 1px, transparent 1px)",
                            backgroundSize: "32px 32px",
                          }}
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-dark-300">
                          <MapPinIcon className="size-10 text-primary-500" />
                          <p className="text-sm font-medium">Vista previa del mapa</p>
                          <p className="text-xs">
                            La selección interactiva en el mapa estará disponible próximamente.
                          </p>
                        </div>
                        <span className="absolute bottom-2 left-3 text-xs text-gray-400 dark:text-dark-400">
                          {watch("latitud") || "—"}, {watch("longitud") || "—"}
                        </span>
                      </div>

                      <div className="grid gap-4 md:grid-cols-12">
                        <div className="md:col-span-5">
                          <Input
                            label="Latitud"
                            placeholder="Ej. 19.0000000"
                            inputMode="decimal"
                            {...register("latitud")}
                            error={errors.latitud?.message}
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="md:col-span-5">
                          <Input
                            label="Longitud"
                            placeholder="Ej. -70.0000000"
                            inputMode="decimal"
                            {...register("longitud")}
                            error={errors.longitud?.message}
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="flex items-end md:col-span-2">
                          <Button
                            type="button"
                            variant="outlined"
                            className="h-9 w-full gap-1.5"
                            onClick={handleMapPlaceholder}
                            disabled={isSubmitting}
                          >
                            <MapPinIcon className="size-4" />
                            Seleccionar
                          </Button>
                        </div>
                      </div>
                    </TabPanel>

                    {/* CARACTERÍSTICAS */}
                    <TabPanel className="space-y-5 pt-5 outline-hidden">
                      <div className="grid gap-4 md:grid-cols-12">
                        <div className="md:col-span-12">
                          <Input
                            label="Costo de Alquiler"
                            placeholder="0.00"
                            inputMode="decimal"
                            prefix={<CurrencyDollarIcon className="size-4.5" />}
                            {...register("costoAlquiler")}
                            error={errors.costoAlquiler?.message}
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="md:col-span-12">
                          <div className="rounded-xl border border-gray-200 p-4 dark:border-dark-500">
                            <h4 className="mb-3 text-sm font-semibold text-gray-800 dark:text-dark-100">
                              Información del elemento
                            </h4>
                            <dl className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <dt className="text-xs text-gray-500 dark:text-dark-300">Tipo</dt>
                                <dd className="text-sm text-gray-800 dark:text-dark-100">
                                  {tipoLabel}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-xs text-gray-500 dark:text-dark-300">
                                  Formato
                                </dt>
                                <dd className="text-sm text-gray-800 dark:text-dark-100">
                                  {formatoLabel}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-xs text-gray-500 dark:text-dark-300">
                                  Tamaño
                                </dt>
                                <dd className="text-sm text-gray-800 dark:text-dark-100">
                                  {tamanoLabel}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-xs text-gray-500 dark:text-dark-300">
                                  Orientación
                                </dt>
                                <dd className="text-sm text-gray-800 dark:text-dark-100">
                                  {orientacionLabel}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </div>

                        <div className="md:col-span-12">
                          <span className="input-label">Estado</span>
                          <div className="mt-2">
                            <Badge variant="soft" color={activo ? "success" : "error"}>
                              {activo ? "Activo" : "Inactivo"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </TabPanel>

                    {/* IMAGENES */}
                    <TabPanel className="space-y-5 pt-5 outline-hidden">
                      <div className="grid gap-4 md:grid-cols-12">
                        <div className="md:col-span-12">
                          <Input
                            label="URL de la imagen"
                            placeholder="Ej. https://ejemplo.com/imagen.jpg"
                            {...register("imagenUrl")}
                            error={errors.imagenUrl?.message}
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="md:col-span-6">
                          <div className="rounded-xl border border-gray-200 p-4 dark:border-dark-500">
                            <img
                              src={watch("imagenUrl") || "/placeholder.jpg"}
                              alt="Vista previa"
                              className="w-full h-48 object-cover rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                  </TabPanels>
                </div>
              </TabGroup>

              <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 px-5 py-4 sm:px-6 dark:border-dark-500">
                {optionsLoading ? (
                  <span className="mr-auto self-center text-xs text-gray-500 dark:text-dark-300">
                    Cargando catálogos...
                  </span>
                ) : null}
                <Button
                  type="button"
                  variant="outlined"
                  className="min-w-[9rem]"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  className="min-w-[12rem]"
                  disabled={isSubmitting || optionsLoading}
                >
                  {isSubmitting
                    ? "Guardando..."
                    : isEditMode
                      ? "Guardar cambios"
                      : "Guardar elemento"}
                </Button>
              </div>
            </form>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}
