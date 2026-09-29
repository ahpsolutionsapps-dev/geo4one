import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { Button, Input, InputErrorMsg, Switch } from "@/components/ui";
import { typedYupResolver } from "@/utils/typedYupResolver";

import { SectorIndustrial, SectorIndustrialFormValues } from "../sectores-industriales.types";

const sectorIndustrialSchema = Yup.object().shape({
  sectorIndustrial: Yup.string()
    .trim()
    .min(2, "Debe tener al menos 2 caracteres")
    .max(150, "Máximo 150 caracteres")
    .required("El sector industrial es requerido"),
  activo: Yup.boolean().required(),
});

interface SectoresIndustrialesFormModalProps {
  open: boolean;
  sectorIndustrial?: SectorIndustrial | null;
  onClose: () => void;
  onSaved: (values: SectorIndustrialFormValues) => Promise<void> | void;
}

export function SectoresIndustrialesFormModal({
  open,
  sectorIndustrial,
  onClose,
  onSaved,
}: SectoresIndustrialesFormModalProps) {
  const isEditMode = Boolean(sectorIndustrial);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SectorIndustrialFormValues>({
    resolver: typedYupResolver(sectorIndustrialSchema),
    defaultValues: {
      sectorIndustrial: "",
      activo: true,
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      sectorIndustrial: sectorIndustrial?.sectorIndustrial ?? "",
      activo: sectorIndustrial?.activo ?? true,
    });
  }, [open, sectorIndustrial, reset]);

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
                  {isEditMode ? "Editar sector industrial" : "Nuevo sector industrial"}
                </Dialog.Title>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                  Registra el nombre del sector industrial y su estado.
                </p>

                <form className="mt-5 space-y-4" onSubmit={submit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Input
                        label="Sector industrial"
                        placeholder="Ej. Publicidad exterior"
                        {...register("sectorIndustrial")}
                        error={errors.sectorIndustrial?.message}
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
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={onClose}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" color="primary" disabled={isSubmitting}>
                      {isSubmitting
                        ? "Guardando..."
                        : isEditMode
                          ? "Guardar cambios"
                          : "Crear sector industrial"}
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