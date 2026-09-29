import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as Yup from "yup";

import {
  Button,
  Input,
  InputErrorMsg,
  Select,
  Switch,
  Textarea,
} from "@/components/ui";
import { typedYupResolver } from "@/utils/typedYupResolver";

import { Campana, CampanaFormValues } from "../campanas.types";
import { campanasApi, SelectOption } from "../data/campanas.api";

const campanaSchema = Yup.object().shape({
  idAnunciante: Yup.string().required("El anunciante es requerido"),
  idMarcaProducto: Yup.string(),
  idComboAnunciante: Yup.string(),
  versionCampana: Yup.string()
    .trim()
    .min(2, "Debe tener al menos 2 caracteres")
    .max(250, "Maximo 250 caracteres")
    .required("La version de campana es requerida"),
  leyendaSeguimiento: Yup.string().trim().max(500, "Maximo 500 caracteres"),
  activo: Yup.boolean().required(),
})
  .test(
    "marca-or-combo",
    "Debes seleccionar una marca/producto o un combo",
    (value) => Boolean(value?.idMarcaProducto || value?.idComboAnunciante),
  );

interface CampanasFormModalProps {
  open: boolean;
  campana?: Campana | null;
  onClose: () => void;
  onSaved: (values: CampanaFormValues) => Promise<void> | void;
}

export function CampanasFormModal({ open, campana, onClose, onSaved }: CampanasFormModalProps) {
  const isEditMode = Boolean(campana);
  const [anuncianteOptions, setAnuncianteOptions] = useState<SelectOption[]>([]);
  const [marcaOptions, setMarcaOptions] = useState<SelectOption[]>([]);
  const [comboOptions, setComboOptions] = useState<SelectOption[]>([]);
  const [isLoadingAnunciantes, setIsLoadingAnunciantes] = useState(false);
  const [isLoadingMarcas, setIsLoadingMarcas] = useState(false);
  const [isLoadingCombos, setIsLoadingCombos] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CampanaFormValues>({
    resolver: typedYupResolver(campanaSchema),
    defaultValues: {
      idAnunciante: "",
      idMarcaProducto: "",
      idComboAnunciante: "",
      versionCampana: "",
      leyendaSeguimiento: "",
      activo: true,
    },
  });

  const selectedAnunciante = useWatch({ control, name: "idAnunciante" });

  useEffect(() => {
    if (!open) {
      return;
    }

    void (async () => {
      setIsLoadingAnunciantes(true);
      setIsLoadingCombos(true);

      try {
        const [anunciantes, combos] = await Promise.all([
          campanasApi.getAnunciantesOptions(),
          campanasApi.getCombosAnunciantesOptions(),
        ]);
        setAnuncianteOptions(anunciantes);
        setComboOptions(combos);
      } finally {
        setIsLoadingAnunciantes(false);
        setIsLoadingCombos(false);
      }
    })();
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      idAnunciante: campana?.idAnunciante ? String(campana.idAnunciante) : "",
      idMarcaProducto: campana?.idMarcaProducto ? String(campana.idMarcaProducto) : "",
      idComboAnunciante: campana?.idComboAnunciante ? String(campana.idComboAnunciante) : "",
      versionCampana: campana?.versionCampana ?? "",
      leyendaSeguimiento: campana?.leyendaSeguimiento ?? "",
      activo: campana?.activo ?? true,
    });
  }, [open, campana, reset]);

  useEffect(() => {
    if (!open || !selectedAnunciante) {
      setMarcaOptions([]);
      return;
    }

    void (async () => {
      setIsLoadingMarcas(true);
      try {
        const marcas = await campanasApi.getMarcasProductosOptions(selectedAnunciante);
        setMarcaOptions(marcas);
        if (!marcas.some((item) => item.id === String(campana?.idMarcaProducto ?? ""))) {
          setValue("idMarcaProducto", "");
        }
      } finally {
        setIsLoadingMarcas(false);
      }
    })();
  }, [open, selectedAnunciante, setValue, campana?.idMarcaProducto]);

  const submit = handleSubmit(async (values) => {
    await onSaved(values);
    onClose();
  });

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
                  {isEditMode ? "Editar campana" : "Nueva campana"}
                </Dialog.Title>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                  Gestiona la version de campana vinculada al anunciante y su marca/combo.
                </p>

                <form className="mt-5 space-y-4" onSubmit={submit}>
                  <Controller
                    control={control}
                    name="idAnunciante"
                    render={({ field }) => (
                      <Select
                        label="Anunciante"
                        data={[
                          { label: "Seleccione un anunciante", value: "", disabled: true },
                          ...anuncianteOptions.map((item) => ({
                            label: item.label,
                            value: item.id,
                          })),
                        ]}
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        disabled={isLoadingAnunciantes}
                        error={errors.idAnunciante?.message}
                      />
                    )}
                  />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Controller
                      control={control}
                      name="idMarcaProducto"
                      render={({ field }) => (
                        <Select
                          label="Marca / Producto"
                          data={[
                            { label: "Sin marca", value: "" },
                            ...marcaOptions.map((item) => ({
                              label: item.label,
                              value: item.id,
                            })),
                          ]}
                          value={field.value ?? ""}
                          onChange={(event) => field.onChange(event.target.value)}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          disabled={!selectedAnunciante || isLoadingMarcas}
                          error={errors.idMarcaProducto?.message}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="idComboAnunciante"
                      render={({ field }) => (
                        <Select
                          label="Combo de Anunciantes"
                          data={[
                            { label: "Sin combo", value: "" },
                            ...comboOptions.map((item) => ({
                              label: item.label,
                              value: item.id,
                            })),
                          ]}
                          value={field.value ?? ""}
                          onChange={(event) => field.onChange(event.target.value)}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          disabled={isLoadingCombos}
                          error={errors.idComboAnunciante?.message}
                        />
                      )}
                    />
                  </div>

                  <Input
                    label="Version de campana"
                    placeholder="Ej. Verano 2026"
                    {...register("versionCampana")}
                    error={errors.versionCampana?.message}
                  />

                  <Textarea
                    label="Leyenda de seguimiento"
                    placeholder="Texto para seguimiento"
                    rows={3}
                    {...register("leyendaSeguimiento")}
                    error={errors.leyendaSeguimiento?.message}
                  />

                  <Switch label="Activo" {...register("activo")} />
                  <InputErrorMsg when={Boolean(errors.activo?.message)}>
                    {errors.activo?.message}
                  </InputErrorMsg>

                  <InputErrorMsg when={Boolean(errors.root?.message)}>
                    {errors.root?.message}
                  </InputErrorMsg>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outlined" onClick={onClose} disabled={isSubmitting}>
                      Cancelar
                    </Button>
                    <Button type="submit" color="primary" disabled={isSubmitting}>
                      {isSubmitting
                        ? "Guardando..."
                        : isEditMode
                          ? "Guardar cambios"
                          : "Crear campana"}
                    </Button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
