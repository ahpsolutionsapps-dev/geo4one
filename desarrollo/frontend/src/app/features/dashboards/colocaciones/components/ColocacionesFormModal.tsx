import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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

import { Colocacion, ColocacionFormValues } from "../colocaciones.types";
import { ColocacionesApi, colocacionesApi, SelectOption } from "../data/colocaciones.api";

const colocacionSchema = Yup.object().shape({
  codigoSeguimiento: Yup.string()
    .trim()
    .min(2, "Debe tener al menos 2 caracteres")
    .max(50, "Maximo 50 caracteres")
    .required("El codigo de seguimiento es requerido"),
  idElemento: Yup.string().required("El elemento es requerido"),
  idVersionCampana: Yup.string().required("La campana es requerida"),
  idPeriodoColocacion: Yup.string().required("El periodo es requerido"),
  observaciones: Yup.string().trim().max(5000, "Maximo 5000 caracteres"),
  activo: Yup.boolean().required(),
});

interface ColocacionesFormModalProps {
  open: boolean;
  colocacion?: Colocacion | null;
  api?: ColocacionesApi;
  onClose: () => void;
  onSaved: (values: ColocacionFormValues) => Promise<void> | void;
}

export function ColocacionesFormModal({
  open,
  colocacion,
  api = colocacionesApi,
  onClose,
  onSaved,
}: ColocacionesFormModalProps) {
  const isEditMode = Boolean(colocacion);
  const [elementoOptions, setElementoOptions] = useState<SelectOption[]>([]);
  const [versionOptions, setVersionOptions] = useState<SelectOption[]>([]);
  const [periodoOptions, setPeriodoOptions] = useState<SelectOption[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ColocacionFormValues>({
    resolver: typedYupResolver(colocacionSchema),
    defaultValues: {
      codigoSeguimiento: "",
      idElemento: "",
      idVersionCampana: "",
      idPeriodoColocacion: "",
      observaciones: "",
      activo: true,
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    void (async () => {
      setIsLoadingOptions(true);
      try {
        const [elementos, versiones, periodos] = await Promise.all([
          api.getElementosOptions(),
          api.getVersionesCampanaOptions(),
          api.getPeriodosOptions(),
        ]);
        setElementoOptions(elementos);
        setVersionOptions(versiones);
        setPeriodoOptions(periodos);
      } finally {
        setIsLoadingOptions(false);
      }
    })();
  }, [api, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      codigoSeguimiento: colocacion?.codigoSeguimiento ?? "",
      idElemento: colocacion?.idElemento ? String(colocacion.idElemento) : "",
      idVersionCampana: colocacion?.idVersionCampana ? String(colocacion.idVersionCampana) : "",
      idPeriodoColocacion: colocacion?.idPeriodoColocacion
        ? String(colocacion.idPeriodoColocacion)
        : "",
      observaciones: colocacion?.observaciones ?? "",
      activo: colocacion?.activo ?? true,
    });
  }, [open, colocacion, reset]);

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
                  {isEditMode ? "Editar colocacion" : "Nueva colocacion"}
                </Dialog.Title>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                  Registra una colocacion vinculada a elemento, campana y periodo.
                </p>

                <form className="mt-5 space-y-4" onSubmit={submit}>
                  <Input
                    label="Codigo de seguimiento"
                    placeholder="Ej. COL-0001"
                    {...register("codigoSeguimiento")}
                    error={errors.codigoSeguimiento?.message}
                  />

                  <Controller
                    control={control}
                    name="idElemento"
                    render={({ field }) => (
                      <Select
                        label="Elemento"
                        data={[
                          { label: "Seleccione un elemento", value: "", disabled: true },
                          ...elementoOptions.map((item) => ({
                            label: item.label,
                            value: item.id,
                          })),
                        ]}
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        disabled={isLoadingOptions}
                        error={errors.idElemento?.message}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="idVersionCampana"
                    render={({ field }) => (
                      <Select
                        label="Campana"
                        data={[
                          { label: "Seleccione una campana", value: "", disabled: true },
                          ...versionOptions.map((item) => ({
                            label: item.label,
                            value: item.id,
                          })),
                        ]}
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        disabled={isLoadingOptions}
                        error={errors.idVersionCampana?.message}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="idPeriodoColocacion"
                    render={({ field }) => (
                      <Select
                        label="Periodo de colocacion"
                        data={[
                          { label: "Seleccione un periodo", value: "", disabled: true },
                          ...periodoOptions.map((item) => ({
                            label: item.label,
                            value: item.id,
                          })),
                        ]}
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        disabled={isLoadingOptions}
                        error={errors.idPeriodoColocacion?.message}
                      />
                    )}
                  />

                  <Textarea
                    label="Observaciones"
                    placeholder="Notas del seguimiento"
                    rows={3}
                    {...register("observaciones")}
                    error={errors.observaciones?.message}
                  />

                  <Switch label="Activo" {...register("activo")} />
                  <InputErrorMsg when={Boolean(errors.activo?.message)}>
                    {errors.activo?.message}
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
                          : "Crear colocacion"}
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
