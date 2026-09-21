import { useState } from "react";
import { Link } from "react-router";
import {
  EnvelopeIcon,
  HashtagIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { AppBrandLogo } from "@/components/shared/AppBrandLogo";
import { Button, Card, Input, InputErrorMsg } from "@/components/ui";
import { Page } from "@/components/shared/Page";
import axios from "@/utils/axios";

interface RequestCodeValues {
  email: string;
}

interface ConfirmCodeValues {
  code: string;
  password: string;
  confirmPassword: string;
}

const requestCodeSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Correo inválido")
    .required("El correo es obligatorio"),
});

const confirmCodeSchema = Yup.object({
  code: Yup.string()
    .trim()
    .matches(/^\d{6}$/, "El código debe tener 6 dígitos")
    .required("El código es obligatorio"),
  password: Yup.string()
    .trim()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La nueva contraseña es obligatoria"),
  confirmPassword: Yup.string()
    .trim()
    .required("Confirma tu contraseña")
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden"),
});

export default function RecuperarContrasenaCodigo() {
  const [step, setStep] = useState<"request" | "confirm" | "success">("request");
  const [email, setEmail] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const requestForm = useForm<RequestCodeValues>({
    resolver: yupResolver(requestCodeSchema),
    defaultValues: { email: "" },
  });

  const confirmForm = useForm<ConfirmCodeValues>({
    resolver: yupResolver(confirmCodeSchema),
    defaultValues: { code: "", password: "", confirmPassword: "" },
  });

  const onRequestCode = async (data: RequestCodeValues) => {
    setErrorMessage("");
    setInfoMessage("");
    setPreviewUrl(null);

    try {
      const response = await axios.post<{
        message: string;
        previewUrl?: string;
      }>("/auth/reset-password/request-code", { email: data.email });

      setEmail(data.email.trim());
      setInfoMessage(
        response.data.message ||
          "Revisa tu correo. Te enviamos un código de 6 dígitos.",
      );
      if (response.data.previewUrl) {
        setPreviewUrl(response.data.previewUrl);
      }
      setStep("confirm");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "No fue posible enviar el código",
      );
    }
  };

  const onConfirmCode = async (data: ConfirmCodeValues) => {
    setErrorMessage("");

    try {
      await axios.post("/auth/reset-password/confirm-code", {
        email,
        code: data.code,
        password: data.password,
      });
      setStep("success");
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "No fue posible restablecer la contraseña",
      );
    }
  };

  return (
    <Page title="Recuperar con código">
      <main className="auth-page grid w-full grow grid-cols-1 place-items-center">
        <div className="w-full max-w-[26rem] p-4 sm:px-5">
          <div className="text-center">
            <AppBrandLogo className="mx-auto size-16" />
            <div className="mt-4">
              <h2 className="text-2xl font-semibold text-gray-600 dark:text-dark-100">
                Enviar código
              </h2>
              <p className="text-gray-400 dark:text-dark-300">
                {step === "request"
                  ? "Te enviaremos un código de 6 dígitos a tu correo"
                  : step === "confirm"
                    ? "Ingresa el código que llegó a tu correo y tu nueva contraseña"
                    : "Tu contraseña fue actualizada"}
              </p>
            </div>
          </div>

          <Card className="mt-5 rounded-lg p-5 lg:p-7">
            {step === "success" ? (
              <div className="text-center">
                <p className="text-sm text-success dark:text-success-lighter">
                  Contraseña actualizada correctamente
                </p>
                <p className="mt-2 text-sm text-gray-400 dark:text-dark-300">
                  Ya puedes iniciar sesión con tu nueva contraseña.
                </p>
                <Button
                  component={Link}
                  to="/login"
                  color="primary"
                  className="mt-6 w-full"
                >
                  Ir a iniciar sesión
                </Button>
              </div>
            ) : null}

            {step === "request" ? (
              <form
                onSubmit={requestForm.handleSubmit(onRequestCode)}
                autoComplete="off"
              >
                <Input
                  label="Correo"
                  placeholder="Ingresa tu correo"
                  type="email"
                  prefix={
                    <EnvelopeIcon
                      className="size-5 transition-colors duration-200"
                      strokeWidth="1"
                    />
                  }
                  {...requestForm.register("email")}
                  error={requestForm.formState.errors?.email?.message}
                />

                <div className="mt-2">
                  <InputErrorMsg when={errorMessage !== ""}>
                    {errorMessage}
                  </InputErrorMsg>
                </div>

                <Button
                  type="submit"
                  className="mt-5 w-full"
                  color="primary"
                  disabled={requestForm.formState.isSubmitting}
                >
                  {requestForm.formState.isSubmitting
                    ? "Enviando..."
                    : "Enviar código"}
                </Button>
              </form>
            ) : null}

            {step === "confirm" ? (
              <form
                onSubmit={confirmForm.handleSubmit(onConfirmCode)}
                autoComplete="off"
              >
                {infoMessage ? (
                  <p className="mb-4 text-sm text-gray-500 dark:text-dark-300">
                    {infoMessage}
                  </p>
                ) : null}
                {email ? (
                  <p className="mb-4 text-sm text-gray-600 dark:text-dark-200">
                    Correo: <strong>{email}</strong>
                  </p>
                ) : null}
                {previewUrl ? (
                  <p className="mb-4 rounded-lg bg-warning/10 px-3 py-2 text-sm text-warning-darker dark:text-warning-lighter">
                    Vista previa del correo:{" "}
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold underline"
                    >
                      abrir
                    </a>
                  </p>
                ) : null}

                <div className="space-y-4">
                  <Input
                    label="Código"
                    placeholder="000000"
                    inputMode="numeric"
                    maxLength={6}
                    prefix={
                      <HashtagIcon
                        className="size-5 transition-colors duration-200"
                        strokeWidth="1"
                      />
                    }
                    {...confirmForm.register("code")}
                    error={confirmForm.formState.errors?.code?.message}
                  />
                  <Input
                    label="Nueva contraseña"
                    placeholder="Ingresa tu nueva contraseña"
                    type="password"
                    prefix={
                      <LockClosedIcon
                        className="size-5 transition-colors duration-200"
                        strokeWidth="1"
                      />
                    }
                    {...confirmForm.register("password")}
                    error={confirmForm.formState.errors?.password?.message}
                  />
                  <Input
                    label="Confirmar contraseña"
                    placeholder="Repite tu nueva contraseña"
                    type="password"
                    prefix={
                      <LockClosedIcon
                        className="size-5 transition-colors duration-200"
                        strokeWidth="1"
                      />
                    }
                    {...confirmForm.register("confirmPassword")}
                    error={
                      confirmForm.formState.errors?.confirmPassword?.message
                    }
                  />
                </div>

                <div className="mt-2">
                  <InputErrorMsg when={errorMessage !== ""}>
                    {errorMessage}
                  </InputErrorMsg>
                </div>

                <Button
                  type="submit"
                  className="mt-5 w-full"
                  color="primary"
                  disabled={confirmForm.formState.isSubmitting}
                >
                  {confirmForm.formState.isSubmitting
                    ? "Guardando..."
                    : "Restablecer contraseña"}
                </Button>

                <button
                  type="button"
                  className="text-primary-600 mt-3 w-full text-center text-xs transition-colors hover:text-primary-800 dark:text-primary-400"
                  onClick={() => {
                    setStep("request");
                    setErrorMessage("");
                    setPreviewUrl(null);
                  }}
                >
                  Reenviar código
                </button>
              </form>
            ) : null}

            {step !== "success" ? (
              <div className="mt-4 text-center text-xs-plus">
                <Link
                  className="text-primary-600 transition-colors hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-600"
                  to="/recuperar-contrasena"
                >
                  Elegir otro método
                </Link>
              </div>
            ) : null}
          </Card>
        </div>
      </main>
    </Page>
  );
}
