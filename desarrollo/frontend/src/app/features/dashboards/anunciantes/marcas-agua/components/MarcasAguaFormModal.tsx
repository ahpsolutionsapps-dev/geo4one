import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";

import { Button, Input, InputErrorMsg, Select, Switch } from "@/components/ui";
import { typedYupResolver } from "@/utils/typedYupResolver";

import {
  MarcaAguaSeguimiento,
  MarcaAguaSeguimientoFormValues,
} from "../marcas-agua.types";
import { marcasAguaApi, VersionCampanaOption } from "../data/marcas-agua.api";

const schema = Yup.object().shape({
  idVersionCampana: Yup.string().required("La version de campana es requerida"),
  imagenMuestra: Yup.string().trim().max(500, "Maximo 500 caracteres"),
  videoMuestra: Yup.string().trim().max(500, "Maximo 500 caracteres"),
  activo: Yup.boolean().required(),
}).test(
  "atLeastOneMedia",
  "Debes enviar al menos una ruta de imagen o video",
  (value) => {
    const imagen = value?.imagenMuestra?.trim();
    const video = value?.videoMuestra?.trim();
    return Boolean(imagen || video);
  },
);

interface MarcasAguaFormModalProps {
  open: boolean;
  item?: MarcaAguaSeguimiento | null;
  onClose: () => void;
  onSaved: (values: MarcaAguaSeguimientoFormValues) => Promise<void> | void;
}

export function MarcasAguaFormModal({ open, item, onClose, onSaved }: MarcasAguaFormModalProps) {
  const isEditMode = Boolean(item);
  const [versionOptions, setVersionOptions] = useState<VersionCampanaOption[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MarcaAguaSeguimientoFormValues>({
    resolver: typedYupResolver(schema),
    defaultValues: {
      idVersionCampana: "",
      imagenMuestra: "",
      videoMuestra: "",
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
        const options = await marcasAguaApi.getVersionesCampanaOptions();
        setVersionOptions(options);
      } finally {
        setIsLoadingOptions(false);
      }
    })();
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      idVersionCampana: item?.idVersionCampana ? String(item.idVersionCampana) : "",
      imagenMuestra: item?.imagenMuestra ?? "",
      videoMuestra: item?.videoMuestra ?? "",
      activo: item?.activo ?? true,
    });
  }, [open, item, reset]);

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
              <DialogPanel className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl dark:bg-dark-700">
                <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-dark-50">
                  {isEditMode ? "Editar marca de agua" : "Nueva marca de agua"}
                </Dialog.Title>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                  Vincula la firma visual a una version de campana.
                </p>

                <form className="mt-5 space-y-4" onSubmit={submit}>
                  <Controller
                    control={control}
                    name="idVersionCampana"
                    render={({ field }) => (
                      <Select
                        label="Version de campana"
                        data={[
                          { label: "Seleccione una version", value: "", disabled: true },
                          ...versionOptions.map((option) => ({
                            label: option.label,
                            value: option.id,
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

                  <Input
                    label="Imagen de muestra"
                    placeholder="https://..."
                    {...register("imagenMuestra")}
                    error={errors.imagenMuestra?.message}
                  />

                  <Input
                    label="Video de muestra"
                    placeholder="https://..."
                    {...register("videoMuestra")}
                    error={errors.videoMuestra?.message}
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
                          : "Crear marca de agua"}
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
