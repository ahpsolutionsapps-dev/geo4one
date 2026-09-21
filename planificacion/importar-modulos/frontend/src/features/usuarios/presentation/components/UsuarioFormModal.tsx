import { typedYupResolver } from "@/utils/typedYupResolver";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { useHotkeys } from "react-hotkeys-hook";
import * as Yup from "yup";

import {
  Button,
  Input,
  InputErrorMsg,
  Select,
  Switch,
  Textarea,
} from "@/components/ui";
import { EntityImagenField } from "@/shared/presentation/components/EntityImagenField";

import { usuariosModule } from "../../di/usuarios.module";
import { Rol } from "../../domain/entities/rol.entity";
import {
  ESTATUS_USUARIO_OPTIONS,
  Usuario,
} from "../../domain/entities/usuario.entity";
import {
  UsuarioFormValues,
  useUsuarioForm,
} from "../hooks/use-usuario-form";

const createSchema = Yup.object().shape({
  username: Yup.string()
    .trim()
    .min(3, "Debe tener al menos 3 caracteres")
    .max(80, "Maximo 80 caracteres")
    .required("El nombre de usuario es requerido"),
  email: Yup.string()
    .trim()
    .email("Correo electronico invalido")
    .max(160, "Maximo 160 caracteres")
    .required("El correo es requerido"),
  userpassword: Yup.string()
    .trim()
    .min(6, "La contrasena debe tener al menos 6 caracteres")
    .max(120, "Maximo 120 caracteres")
    .required("La contrasena es requerida"),
  idRol: Yup.string(),
  palabraSecreta: Yup.string().trim().max(255, "Maximo 255 caracteres"),
  habilitado: Yup.boolean().required(),
  verificado: Yup.boolean().required(),
  estatus: Yup.number()
    .typeError("Selecciona un estatus")
    .oneOf([0, 1])
    .required("Selecciona un estatus"),
  comentario: Yup.string().trim().max(500, "Maximo 500 caracteres"),
});

const editSchema = createSchema.shape({
  userpassword: Yup.string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .min(6, "La contrasena debe tener al menos 6 caracteres")
    .max(120, "Maximo 120 caracteres")
    .optional(),
});

interface UsuarioFormModalProps {
  open: boolean;
  usuario?: Usuario | null;
  roles: Rol[];
  elevated?: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
  onOpenShortcuts?: () => void;
}

export function UsuarioFormModal({
  open,
  usuario,
  roles,
  elevated = false,
  onClose,
  onSaved,
  onOpenShortcuts,
}: UsuarioFormModalProps) {
  const { isSaving, errorMessage, save, isEditMode } = useUsuarioForm({
    usuario,
    onSuccess: onSaved,
  });

  const [pendingImagen, setPendingImagen] = useState<File | null>(null);
  const [imagenUrl, setImagenUrl] = useState<string | null>(
    usuario?.imagen ?? null,
  );

  const firstFieldRef = useRef<HTMLInputElement>(null);
  const imagenButtonRef = useRef<HTMLButtonElement>(null);

  const roleOptions = useMemo(
    () => [
      { value: "", label: "Sin rol" },
      ...roles.map((rol) => ({
        value: rol.id,
        label: rol.rol,
      })),
    ],
    [roles],
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UsuarioFormValues>({
    resolver: typedYupResolver<UsuarioFormValues>(
      isEditMode ? editSchema : createSchema,
    ),
    defaultValues: {
      username: "",
      email: "",
      userpassword: "",
      idRol: "",
      palabraSecreta: "",
      habilitado: true,
      verificado: false,
      estatus: 1,
      comentario: "",
    },
  });

  const usernameField = register("username");

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      username: usuario?.username ?? "",
      email: usuario?.email ?? "",
      userpassword: "",
      idRol: usuario?.idRol ?? "",
      palabraSecreta: usuario?.palabraSecreta ?? "",
      habilitado: usuario?.habilitado ?? true,
      verificado: usuario?.verificado ?? false,
      estatus: usuario?.estatus ?? 1,
      comentario: usuario?.comentario ?? "",
    });
    setImagenUrl(usuario?.imagen ?? null);
    setPendingImagen(null);
  }, [usuario, open, reset]);

  const handleClose = () => {
    if (isSaving) {
      return;
    }

    reset({
      username: "",
      email: "",
      userpassword: "",
      idRol: "",
      palabraSecreta: "",
      habilitado: true,
      verificado: false,
      estatus: 1,
      comentario: "",
    });
    setImagenUrl(null);
    setPendingImagen(null);
    onClose();
  };

  const onSubmit = async (values: UsuarioFormValues) => {
    const saved = await save(values, pendingImagen);
    if (saved) {
      handleClose();
    }
  };

  const submitForm = handleSubmit(onSubmit);

  const handleFormEnterKeyDown = useCallback(
    (event: KeyboardEvent<HTMLFormElement>) => {
      if (event.key !== "Enter") {
        return;
      }

      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }

      if (
        target.disabled ||
        target.readOnly ||
        target.type === "checkbox" ||
        target.type === "radio" ||
        target.type === "button" ||
        target.type === "submit" ||
        target.type === "hidden" ||
        target.type === "password"
      ) {
        return;
      }

      if (target.getAttribute("aria-expanded") === "true") {
        return;
      }

      event.preventDefault();

      const candidates = Array.from(
        event.currentTarget.querySelectorAll<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >(
          'input:not([disabled]):not([readonly]):not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]):not([type="password"]), select:not([disabled]), textarea:not([disabled])',
        ),
      ).filter((element) => {
        if (element.closest('[aria-hidden="true"]')) {
          return false;
        }

        if (element.closest(".hidden")) {
          return false;
        }

        return true;
      });

      const currentIndex = candidates.indexOf(target);
      if (currentIndex < 0) {
        return;
      }

      for (let index = currentIndex + 1; index < candidates.length; index += 1) {
        const next = candidates[index];
        if (!next || next.disabled) {
          continue;
        }
        next.focus();
        if (next instanceof HTMLInputElement || next instanceof HTMLTextAreaElement) {
          next.select();
        }
        return;
      }
    },
    [],
  );

  useHotkeys(
    "mod+g",
    (event) => {
      if (!open || isSaving) {
        return;
      }
      event.preventDefault();
      void submitForm();
    },
    { enableOnFormTags: true, preventDefault: true },
    [open, isSaving, submitForm],
  );

  useHotkeys(
    "mod+p",
    (event) => {
      if (!open || isSaving) {
        return;
      }
      event.preventDefault();
      imagenButtonRef.current?.click();
    },
    { enableOnFormTags: true, preventDefault: true },
    [open, isSaving],
  );

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className={elevated ? "relative z-110" : "relative z-100"}
        initialFocus={firstFieldRef}
        onClose={() => undefined}
      >
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
              <DialogPanel className="w-full max-w-4xl rounded-xl bg-white p-6 shadow-xl dark:bg-dark-700">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-50">
                    {isEditMode ? "Editar usuario" : "Nuevo usuario"}
                  </h3>
                  {onOpenShortcuts ? (
                    <Button
                      type="button"
                      variant="flat"
                      isIcon
                      className="size-9 shrink-0"
                      title="Atajos disponibles (?)"
                      aria-label="Atajos disponibles"
                      disabled={isSaving}
                      onClick={onOpenShortcuts}
                    >
                      <QuestionMarkCircleIcon className="size-5" />
                    </Button>
                  ) : null}
                </div>

                <form
                  className="mt-5"
                  onSubmit={submitForm}
                  onKeyDown={handleFormEnterKeyDown}
                >
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)]">
                    <div className="min-w-0 space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                          label="Nombre de usuario"
                          placeholder="Ej. jperez"
                          {...usernameField}
                          ref={(element) => {
                            usernameField.ref(element);
                            firstFieldRef.current = element;
                          }}
                          error={errors.username?.message}
                          disabled={isSaving}
                        />

                        <Input
                          label="Correo electronico"
                          type="email"
                          placeholder="usuario@empresa.com"
                          {...register("email")}
                          error={errors.email?.message}
                          disabled={isSaving}
                        />

                        <div className="sm:col-span-2">
                          <Input
                            label={
                              isEditMode
                                ? "Nueva contrasena (opcional)"
                                : "Contrasena"
                            }
                            type="password"
                            placeholder={
                              isEditMode
                                ? "Dejar vacio para mantener la actual"
                                : "Minimo 6 caracteres"
                            }
                            {...register("userpassword")}
                            error={errors.userpassword?.message}
                            disabled={isSaving}
                          />
                        </div>

                        <Controller
                          control={control}
                          name="idRol"
                          render={({ field }) => (
                            <Select
                              label="Rol"
                              data={roleOptions}
                              value={field.value}
                              onChange={(event) =>
                                field.onChange(event.target.value)
                              }
                              onBlur={field.onBlur}
                              error={errors.idRol?.message}
                              disabled={isSaving}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name="estatus"
                          render={({ field }) => (
                            <Select
                              label="Estatus"
                              data={ESTATUS_USUARIO_OPTIONS.map((option) => ({
                                value: String(option.value),
                                label: option.label,
                              }))}
                              value={String(field.value)}
                              onChange={(event) =>
                                field.onChange(Number(event.target.value))
                              }
                              onBlur={field.onBlur}
                              error={errors.estatus?.message}
                              disabled={isSaving}
                            />
                          )}
                        />

                        <div className="sm:col-span-2">
                          <Input
                            label="Palabra secreta (opcional)"
                            placeholder="Para recuperacion de cuenta"
                            {...register("palabraSecreta")}
                            error={errors.palabraSecreta?.message}
                            disabled={isSaving}
                          />
                        </div>

                        <Controller
                          control={control}
                          name="habilitado"
                          render={({ field }) => (
                            <Switch
                              label="Usuario habilitado"
                              checked={field.value}
                              onChange={(event) =>
                                field.onChange(event.target.checked)
                              }
                              role="switch"
                              disabled={isSaving}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name="verificado"
                          render={({ field }) => (
                            <Switch
                              label="Correo verificado"
                              checked={field.value}
                              onChange={(event) =>
                                field.onChange(event.target.checked)
                              }
                              role="switch"
                              disabled={isSaving}
                            />
                          )}
                        />

                        <div className="sm:col-span-2">
                          <Textarea
                            label="Comentario (opcional)"
                            rows={3}
                            placeholder="Notas internas sobre el usuario"
                            {...register("comentario")}
                            error={errors.comentario?.message}
                            disabled={isSaving}
                          />
                        </div>
                      </div>
                    </div>

                    <aside className="min-w-0 lg:sticky lg:top-0 lg:self-start">
                      <EntityImagenField
                        title="Imagen del usuario"
                        entityId={usuario?.id}
                        imagenUrl={imagenUrl}
                        disabled={isSaving}
                        pendingFile={pendingImagen}
                        onPendingFileChange={setPendingImagen}
                        enableCrop
                        cropAspectRatio={1}
                        cropTitle="Recortar imagen del usuario"
                        addButtonRef={imagenButtonRef}
                        addButtonTitle="Agregar o cambiar imagen (Ctrl+P)"
                        onUpload={async (file) => {
                          if (!usuario?.id) {
                            return null;
                          }

                          const updated =
                            await usuariosModule.uploadUsuarioImagen.execute({
                              id: usuario.id,
                              file,
                            });
                          setImagenUrl(updated.imagen);
                          return updated.imagen;
                        }}
                        onRemove={async () => {
                          if (!usuario?.id) {
                            return null;
                          }

                          const updated =
                            await usuariosModule.deleteUsuarioImagen.execute(
                              usuario.id,
                            );
                          setImagenUrl(updated.imagen);
                          return updated.imagen;
                        }}
                      />
                    </aside>
                  </div>

                  <InputErrorMsg when={Boolean(errorMessage)} className="mt-4">
                    {errorMessage}
                  </InputErrorMsg>

                  <div className="mt-4 flex justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      color="neutral"
                      onClick={handleClose}
                      disabled={isSaving}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      color="primary"
                      disabled={isSaving}
                      title="Guardar (Ctrl+G)"
                    >
                      {isSaving ? "Guardando..." : "Guardar"}
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
