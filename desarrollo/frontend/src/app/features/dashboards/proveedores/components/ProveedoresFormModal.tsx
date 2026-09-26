import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";

import { Button, Input, InputErrorMsg, Select, Switch } from "@/components/ui";
import { typedYupResolver } from "@/utils/typedYupResolver";

import { municipiosApi } from "../../catalogos/ubicaciones/municipios/data/municipios.api";
import { provinciasApi } from "../../catalogos/ubicaciones/provincias/data/provincias.api";
import { sectoresApi } from "../../catalogos/ubicaciones/sectores/data/sectores.api";
import { proveedoresApi } from "../data/proveedores.api";
import {
  Proveedor,
  ProveedorFormValues,
  ProveedorTelefono,
  ProveedorTelefonoFormValues,
} from "../proveedores.types";

const proveedorSchema = Yup.object().shape({
  proveedor: Yup.string()
    .trim()
    .min(2, "Debe tener al menos 2 caracteres")
    .max(200, "Máximo 200 caracteres")
    .required("El suplidor es requerido"),
  rnc: Yup.string().trim().max(20, "Máximo 20 caracteres"),
  personaContacto: Yup.string().trim().max(150, "Máximo 150 caracteres"),
  cargo: Yup.string().trim().max(100, "Máximo 100 caracteres"),
  email: Yup.string().trim().email("Correo inválido").max(150, "Máximo 150 caracteres"),
  paginaWeb: Yup.string().trim().max(255, "Máximo 255 caracteres"),
  direccion: Yup.string().trim().max(500, "Máximo 500 caracteres"),
  idProvincia: Yup.string(),
  idMunicipio: Yup.string(),
  idSectorBarrio: Yup.string(),
  activo: Yup.boolean().required(),
});

interface Option {
  label: string;
  value: string;
}

interface ProveedoresFormModalProps {
  open: boolean;
  proveedor?: Proveedor | null;
  onClose: () => void;
  onSaved: (values: ProveedorFormValues) => Promise<void> | void;
}

type ProveedoresTab = "general" | "telefonos";

const telefonoTipoOptions: Option[] = [
  { label: "Movil", value: "Movil" },
  { label: "Oficina", value: "Oficina" },
  { label: "Casa", value: "Casa" },
  { label: "Whatsapp", value: "Whatsapp" },
  { label: "Otro", value: "Otro" },
];

const defaultTelefonoForm: ProveedorTelefonoFormValues = {
  telefono: "",
  tipo: "",
  principal: false,
};

export function ProveedoresFormModal({
  open,
  proveedor,
  onClose,
  onSaved,
}: ProveedoresFormModalProps) {
  const isEditMode = Boolean(proveedor);
  const [provinceOptions, setProvinceOptions] = useState<Option[]>([]);
  const [municipioOptions, setMunicipioOptions] = useState<Option[]>([]);
  const [sectorOptions, setSectorOptions] = useState<Option[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [activeTab, setActiveTab] = useState<ProveedoresTab>("general");
  const [telefonos, setTelefonos] = useState<ProveedorTelefono[]>([]);
  const [isLoadingTelefonos, setIsLoadingTelefonos] = useState(false);
  const [isSavingTelefono, setIsSavingTelefono] = useState(false);
  const [editingTelefonoId, setEditingTelefonoId] = useState<number | null>(null);
  const [telefonoForm, setTelefonoForm] = useState<ProveedorTelefonoFormValues>(defaultTelefonoForm);

  const {
    control,
    register,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProveedorFormValues>({
    resolver: typedYupResolver(proveedorSchema),
    defaultValues: {
      proveedor: "",
      rnc: "",
      personaContacto: "",
      cargo: "",
      email: "",
      paginaWeb: "",
      direccion: "",
      idProvincia: "",
      idMunicipio: "",
      idSectorBarrio: "",
      activo: true,
    },
  });

  const selectedProvincia = watch("idProvincia");
  const selectedMunicipio = watch("idMunicipio");

  const proveedorId = proveedor?.id ?? null;

  const filteredMunicipios = useMemo(() => {
    if (!selectedProvincia) {
      return municipioOptions;
    }

    return municipioOptions.filter((item) => item.value.startsWith(`${selectedProvincia}:`));
  }, [municipioOptions, selectedProvincia]);

  const normalizedMunicipioOptions = useMemo(
    () =>
      filteredMunicipios.map((item) => ({
        label: item.label,
        value: item.value.split(":")[1] ?? "",
      })),
    [filteredMunicipios],
  );

  const filteredSectores = useMemo(() => {
    if (!selectedMunicipio) {
      return sectorOptions;
    }

    return sectorOptions.filter((item) => item.value.startsWith(`${selectedMunicipio}:`));
  }, [sectorOptions, selectedMunicipio]);

  const normalizedSectorOptions = useMemo(
    () =>
      filteredSectores.map((item) => ({
        label: item.label,
        value: item.value.split(":")[1] ?? "",
      })),
    [filteredSectores],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    void (async () => {
      setIsLoadingOptions(true);
      try {
        const [provincias, municipios, sectores] = await Promise.all([
          provinciasApi.getProvincias(),
          municipiosApi.getMunicipios(),
          sectoresApi.getSectores(),
        ]);

        setProvinceOptions(
          provincias.map((item) => ({ label: item.provincia, value: item.id })),
        );
        setMunicipioOptions(
          municipios.map((item) => ({
            label: `${item.municipio} - ${item.provinciaNombre}`,
            value: `${item.idProvincia}:${item.id}`,
          })),
        );
        setSectorOptions(
          sectores.map((item) => ({
            label: `${item.sectorBarrio} - ${item.municipioNombre}`,
            value: `${item.idMunicipio}:${item.id}`,
          })),
        );
      } finally {
        setIsLoadingOptions(false);
      }
    })();
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setActiveTab("general");
    setEditingTelefonoId(null);
    setTelefonoForm(defaultTelefonoForm);

    reset({
      proveedor: proveedor?.proveedor ?? "",
      rnc: proveedor?.rnc ?? "",
      personaContacto: proveedor?.personaContacto ?? "",
      cargo: proveedor?.cargo ?? "",
      email: proveedor?.email ?? "",
      paginaWeb: proveedor?.paginaWeb ?? "",
      direccion: proveedor?.direccion ?? "",
      idProvincia: proveedor?.idProvincia ? String(proveedor.idProvincia) : "",
      idMunicipio: proveedor?.idMunicipio ? String(proveedor.idMunicipio) : "",
      idSectorBarrio: proveedor?.idSectorBarrio ? String(proveedor.idSectorBarrio) : "",
      activo: proveedor?.activo ?? true,
    });
  }, [open, proveedor, reset]);

  useEffect(() => {
    if (!selectedProvincia) {
      return;
    }

    const validMunicipio = normalizedMunicipioOptions.some(
      (item) => item.value === watch("idMunicipio"),
    );

    if (!validMunicipio) {
      setValue("idMunicipio", "");
      setValue("idSectorBarrio", "");
    }
  }, [normalizedMunicipioOptions, selectedProvincia, setValue, watch]);

  useEffect(() => {
    if (!selectedMunicipio) {
      return;
    }

    const validSector = normalizedSectorOptions.some(
      (item) => item.value === watch("idSectorBarrio"),
    );

    if (!validSector) {
      setValue("idSectorBarrio", "");
    }
  }, [normalizedSectorOptions, selectedMunicipio, setValue, watch]);

  useEffect(() => {
    if (!open || !proveedorId) {
      setTelefonos([]);
      return;
    }

    void (async () => {
      setIsLoadingTelefonos(true);
      try {
        const items = await proveedoresApi.getTelefonos(proveedorId);
        setTelefonos(items);
      } finally {
        setIsLoadingTelefonos(false);
      }
    })();
  }, [open, proveedorId]);

  const submit = handleSubmit(async (values) => {
    await onSaved(values);
    onClose();
  });

  const resetTelefonoForm = () => {
    setTelefonoForm(defaultTelefonoForm);
    setEditingTelefonoId(null);
  };

  const submitTelefono = async () => {
    if (!proveedorId || !telefonoForm.telefono.trim()) {
      return;
    }

    setIsSavingTelefono(true);
    try {
      if (editingTelefonoId) {
        const updated = await proveedoresApi.updateTelefono(proveedorId, editingTelefonoId, telefonoForm);
        setTelefonos((current) =>
          current.map((item) =>
            item.idProveedorTelefono === updated.idProveedorTelefono ? updated : item,
          ),
        );
      } else {
        const created = await proveedoresApi.createTelefono(proveedorId, telefonoForm);
        setTelefonos((current) => [created, ...current]);
      }

      resetTelefonoForm();

      if (telefonoForm.principal) {
        const refreshed = await proveedoresApi.getTelefonos(proveedorId);
        setTelefonos(refreshed);
      }
    } finally {
      setIsSavingTelefono(false);
    }
  };

  const startEditTelefono = (telefono: ProveedorTelefono) => {
    setEditingTelefonoId(telefono.idProveedorTelefono);
    setTelefonoForm({
      telefono: telefono.telefono,
      tipo: telefono.tipo ?? "",
      principal: telefono.principal,
    });
  };

  const removeTelefono = async (idTelefono: number) => {
    if (!proveedorId) {
      return;
    }

    setIsSavingTelefono(true);
    try {
      await proveedoresApi.deleteTelefono(proveedorId, idTelefono);
      setTelefonos((current) => current.filter((item) => item.idProveedorTelefono !== idTelefono));

      if (editingTelefonoId === idTelefono) {
        resetTelefonoForm();
      }
    } finally {
      setIsSavingTelefono(false);
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-100" onClose={() => undefined}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm dark:bg-black/40" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl dark:bg-dark-700">
                <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-dark-50">
                  {isEditMode ? "Editar suplidor" : "Nuevo suplidor"}
                </Dialog.Title>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                  Registra los datos generales y ubicación del suplidor.
                </p>

                <div className="mt-5 border-b border-gray-200 dark:border-dark-500">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`rounded-t-lg px-4 py-2 text-sm font-medium ${
                        activeTab === "general"
                          ? "bg-gray-100 text-gray-900 dark:bg-dark-600 dark:text-dark-50"
                          : "text-gray-500 hover:text-gray-700 dark:text-dark-300 dark:hover:text-dark-100"
                      }`}
                      onClick={() => setActiveTab("general")}
                    >
                      General
                    </button>
                    <button
                      type="button"
                      className={`rounded-t-lg px-4 py-2 text-sm font-medium ${
                        activeTab === "telefonos"
                          ? "bg-gray-100 text-gray-900 dark:bg-dark-600 dark:text-dark-50"
                          : "text-gray-500 hover:text-gray-700 dark:text-dark-300 dark:hover:text-dark-100"
                      }`}
                      onClick={() => setActiveTab("telefonos")}
                    >
                      Telefonos
                    </button>
                  </div>
                </div>

                {activeTab === "general" ? (
                  <form className="mt-5 space-y-4" onSubmit={submit}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Input
                          label="Suplidor"
                          placeholder="Ej. Media Group"
                          {...register("proveedor")}
                          error={errors.proveedor?.message}
                        />
                      </div>

                      <div>
                        <Input label="RNC" placeholder="Ej. 101234567" {...register("rnc")} error={errors.rnc?.message} />
                      </div>

                      <div>
                        <Input
                          label="Persona contacto"
                          placeholder="Ej. Juan Perez"
                          {...register("personaContacto")}
                          error={errors.personaContacto?.message}
                        />
                      </div>

                      <div>
                        <Input label="Cargo" placeholder="Ej. Gerente" {...register("cargo")} error={errors.cargo?.message} />
                      </div>

                      <div>
                        <Input label="Correo" placeholder="correo@empresa.com" {...register("email")} error={errors.email?.message} />
                      </div>

                      <div className="sm:col-span-2">
                        <Input
                          label="Pagina web"
                          placeholder="https://empresa.com"
                          {...register("paginaWeb")}
                          error={errors.paginaWeb?.message}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <Input
                          label="Direccion"
                          placeholder="Direccion física"
                          {...register("direccion")}
                          error={errors.direccion?.message}
                        />
                      </div>

                      <div>
                        <Controller
                          control={control}
                          name="idProvincia"
                          render={({ field }) => (
                            <Select
                              label="Provincia"
                              data={[
                                { label: "Seleccione una provincia", value: "", disabled: true },
                                ...provinceOptions,
                              ]}
                              disabled={isLoadingOptions}
                              value={field.value ?? ""}
                              onChange={(event) => field.onChange(event.target.value)}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                              error={errors.idProvincia?.message}
                            />
                          )}
                        />
                      </div>

                      <div>
                        <Controller
                          control={control}
                          name="idMunicipio"
                          render={({ field }) => (
                            <Select
                              label="Municipio"
                              data={[
                                { label: "Seleccione un municipio", value: "", disabled: true },
                                ...normalizedMunicipioOptions,
                              ]}
                              disabled={isLoadingOptions}
                              value={field.value ?? ""}
                              onChange={(event) => field.onChange(event.target.value)}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                              error={errors.idMunicipio?.message}
                            />
                          )}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <Controller
                          control={control}
                          name="idSectorBarrio"
                          render={({ field }) => (
                            <Select
                              label="Sector"
                              data={[
                                { label: "Seleccione un sector", value: "", disabled: true },
                                ...normalizedSectorOptions,
                              ]}
                              disabled={isLoadingOptions}
                              value={field.value ?? ""}
                              onChange={(event) => field.onChange(event.target.value)}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                              error={errors.idSectorBarrio?.message}
                            />
                          )}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <Switch label="Activo" {...register("activo")} />
                        <InputErrorMsg when={Boolean(errors.activo?.message)}>
                          {errors.activo?.message}
                        </InputErrorMsg>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button type="button" variant="outlined" onClick={onClose} disabled={isSubmitting}>
                        Cancelar
                      </Button>
                      <Button type="submit" color="primary" disabled={isSubmitting}>
                        {isSubmitting
                          ? "Guardando..."
                          : isEditMode
                            ? "Guardar cambios"
                            : "Crear suplidor"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-5 space-y-5">
                    {!isEditMode ? (
                      <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-600 dark:border-dark-500 dark:text-dark-200">
                        Debes crear el suplidor primero para agregar telefonos.
                      </div>
                    ) : (
                      <>
                        <div className="grid gap-3 sm:grid-cols-12">
                          <div className="sm:col-span-5">
                            <Input
                              label="Telefono"
                              placeholder="Ej. 809-555-0000"
                              value={telefonoForm.telefono}
                              onChange={(event) =>
                                setTelefonoForm((current) => ({
                                  ...current,
                                  telefono: event.target.value,
                                }))
                              }
                            />
                          </div>

                          <div className="sm:col-span-4">
                            <Select
                              label="Tipo"
                              data={[
                                { label: "Sin tipo", value: "" },
                                ...telefonoTipoOptions,
                              ]}
                              value={telefonoForm.tipo}
                              onChange={(event) =>
                                setTelefonoForm((current) => ({ ...current, tipo: event.target.value }))
                              }
                            />
                          </div>

                          <div className="sm:col-span-3 flex items-end">
                            <div className="w-full">
                              <Switch
                                label="Principal"
                                checked={telefonoForm.principal}
                                onChange={(event) =>
                                  setTelefonoForm((current) => ({
                                    ...current,
                                    principal: event.target.checked,
                                  }))
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          {editingTelefonoId ? (
                            <Button
                              type="button"
                              variant="outlined"
                              onClick={resetTelefonoForm}
                              disabled={isSavingTelefono}
                            >
                              Cancelar edicion
                            </Button>
                          ) : null}
                          <Button
                            type="button"
                            color="primary"
                            onClick={submitTelefono}
                            disabled={isSavingTelefono || !telefonoForm.telefono.trim()}
                          >
                            {isSavingTelefono
                              ? "Guardando..."
                              : editingTelefonoId
                                ? "Actualizar telefono"
                                : "Agregar telefono"}
                          </Button>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-dark-500">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-500">
                            <thead className="bg-gray-50 dark:bg-dark-600">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-dark-200">
                                  Telefono
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-dark-200">
                                  Tipo
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-dark-200">
                                  Estado
                                </th>
                                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-dark-200">
                                  Acciones
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-dark-500 dark:bg-dark-700">
                              {isLoadingTelefonos ? (
                                <tr>
                                  <td
                                    className="px-3 py-3 text-sm text-gray-500 dark:text-dark-200"
                                    colSpan={4}
                                  >
                                    Cargando telefonos...
                                  </td>
                                </tr>
                              ) : telefonos.length === 0 ? (
                                <tr>
                                  <td
                                    className="px-3 py-3 text-sm text-gray-500 dark:text-dark-200"
                                    colSpan={4}
                                  >
                                    Sin telefonos registrados.
                                  </td>
                                </tr>
                              ) : (
                                telefonos.map((item) => (
                                  <tr key={item.idProveedorTelefono}>
                                    <td className="px-3 py-2 text-sm text-gray-800 dark:text-dark-50">
                                      {item.telefono}
                                    </td>
                                    <td className="px-3 py-2 text-sm text-gray-600 dark:text-dark-200">
                                      {item.tipo || "-"}
                                    </td>
                                    <td className="px-3 py-2 text-sm text-gray-600 dark:text-dark-200">
                                      {item.principal ? "Principal" : "Secundario"}
                                    </td>
                                    <td className="px-3 py-2 text-right text-sm">
                                      <button
                                        type="button"
                                        className="mr-3 text-primary-600 hover:text-primary-700 dark:text-primary-400"
                                        onClick={() => startEditTelefono(item)}
                                        disabled={isSavingTelefono}
                                      >
                                        Editar
                                      </button>
                                      <button
                                        type="button"
                                        className="text-red-600 hover:text-red-700 dark:text-red-400"
                                        onClick={() => void removeTelefono(item.idProveedorTelefono)}
                                        disabled={isSavingTelefono}
                                      >
                                        Eliminar
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}

                    <div className="flex justify-end gap-2 pt-1">
                      <Button type="button" variant="outlined" onClick={onClose}>
                        Cerrar
                      </Button>
                    </div>
                  </div>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
