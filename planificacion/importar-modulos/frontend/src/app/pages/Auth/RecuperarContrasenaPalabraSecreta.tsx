import { useState } from "react";
import { Link } from "react-router";
import {
  EnvelopeIcon,
  KeyIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { AppBrandLogo } from "@/components/shared/AppBrandLogo";
import { Button, Card, Input, InputErrorMsg } from "@/components/ui";
import { Page } from "@/components/shared/Page";
import axios from "@/utils/axios";
import {
  RecuperarContrasenaFormValues,
  recuperarContrasenaSchema,
} from "./recuperar-contrasena.schema";

export default function RecuperarContrasenaPalabraSecreta() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RecuperarContrasenaFormValues>({
    resolver: yupResolver(recuperarContrasenaSchema),
    defaultValues: {
      email: "",
      palabraSecreta: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RecuperarContrasenaFormValues) => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post<{ message: string }>(
        "/auth/reset-password",
        {
          email: data.email,
          palabraSecreta: data.palabraSecreta,
          password: data.password,
        },
      );
      setSuccessMessage(
        response.data.message || "Contraseña actualizada correctamente",
      );
      reset();
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "No fue posible recuperar la contraseña",
      );
    }
  };

  return (
    <Page title="Recuperar con palabra secreta">
      <main className="auth-page grid w-full grow grid-cols-1 place-items-center">
        <div className="w-full max-w-[26rem] p-4 sm:px-5">
          <div className="text-center">
            <AppBrandLogo className="mx-auto size-16" />
            <div className="mt-4">
              <h2 className="text-2xl font-semibold text-gray-600 dark:text-dark-100">
                Palabra secreta
              </h2>
              <p className="text-gray-400 dark:text-dark-300">
                Usa el correo y la palabra secreta de tu cuenta para crear una
                nueva contraseña
              </p>
            </div>
          </div>

          <Card className="mt-5 rounded-lg p-5 lg:p-7">
            {successMessage ? (
              <div className="text-center">
                <p className="text-sm text-success dark:text-success-lighter">
                  {successMessage}
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
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="space-y-4">
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
                    {...register("email")}
                    error={errors?.email?.message}
                  />
                  <Input
                    label="Palabra secreta"
                    placeholder="Ingresa tu palabra secreta"
                    type="text"
                    prefix={
                      <KeyIcon
                        className="size-5 transition-colors duration-200"
                        strokeWidth="1"
                      />
                    }
                    {...register("palabraSecreta")}
                    error={errors?.palabraSecreta?.message}
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
                    {...register("password")}
                    error={errors?.password?.message}
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
                    {...register("confirmPassword")}
                    error={errors?.confirmPassword?.message}
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Guardando..." : "Restablecer contraseña"}
                </Button>
              </form>
            )}

            {!successMessage && (
              <div className="mt-4 text-center text-xs-plus">
                <Link
                  className="text-primary-600 transition-colors hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-600"
                  to="/recuperar-contrasena"
                >
                  Elegir otro método
                </Link>
              </div>
            )}
          </Card>
        </div>
      </main>
    </Page>
  );
}
