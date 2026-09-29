import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { Button, Input, InputErrorMsg, Switch, Textarea } from "@/components/ui";
import { typedYupResolver } from "@/utils/typedYupResolver";

import {
  PeriodoColocacion,
  PeriodoColocacionFormValues,
} from "../periodos-colocacion.types";

const periodoColocacionSchema = Yup.object().shape({
  fechaInicial: Yup.string().required("La fecha inicial es requerida"),
  fechaFinal: Yup.string()
    .required("La fecha final es requerida")
    .test(
      "fechaFinalAfterFechaInicial",
      "La fecha final no puede ser menor que la fecha inicial",
      function (value) {
        const { fechaInicial } = this.parent as PeriodoColocacionFormValues;
        if (!fechaInicial || !value) {
          return true;
        }

        return value >= fechaInicial;
      },
    ),
  generalesSeguimiento: Yup.string().max(2000, "Máximo 2000 caracteres"),
  activo: Yup.boolean().required(),
});

interface PeriodosColocacionFormModalProps {
  open: boolean;
  periodoColocacion?: PeriodoColocacion | null;
  onClose: () => void;
  onSaved: (values: PeriodoColocacionFormValues) => Promise<void> | void;
}

export function PeriodosColocacionFormModal({
  open,
  periodoColocacion,
  onClose,
  onSaved,
}: PeriodosColocacionFormModalProps) {
  const isEditMode = Boolean(periodoColocacion);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PeriodoColocacionFormValues>({
    resolver: typedYupResolver(periodoColocacionSchema),
    defaultValues: {
      fechaInicial: "",
      fechaFinal: "",
      generalesSeguimiento: "",
      activo: true,
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      fechaInicial: periodoColocacion?.fechaInicial ?? "",
      fechaFinal: periodoColocacion?.fechaFinal ?? "",
      generalesSeguimiento: periodoColocacion?.generalesSeguimiento ?? "",
      activo: periodoColocacion?.activo ?? true,
    });
  }, [open, periodoColocacion, reset]);

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
                  {isEditMode ? "Editar periodo" : "Nuevo periodo"}
                </Dialog.Title>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                  Define el rango de fechas del periodo de colocación.
                </p>

                <form className="mt-5 space-y-4" onSubmit={submit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Input
                        type="date"
                        label="Fecha inicial"
                        {...register("fechaInicial")}
                        error={errors.fechaInicial?.message}
                      />
                    </div>

                    <div>
                      <Input
                        type="date"
                        label="Fecha final"
                        {...register("fechaFinal")}
                        error={errors.fechaFinal?.message}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Textarea
                        label="Generales de seguimiento"
                        rows={4}
                        placeholder="Notas o comentarios para seguimiento"
                        {...register("generalesSeguimiento")}
                        error={errors.generalesSeguimiento?.message}
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
                          : "Crear periodo"}
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
