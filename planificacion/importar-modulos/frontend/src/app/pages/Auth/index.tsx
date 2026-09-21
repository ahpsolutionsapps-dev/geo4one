// Import Dependencies
import { useState } from "react";
import { Link } from "react-router";
import {
  EnvelopeIcon,
  LockClosedIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

// Local Imports
import loginLogo from "@/assets/branding/nuevo-logo.png";
import { Button, Card, Checkbox, Input, InputErrorMsg } from "@/components/ui";
import { useAuthContext } from "@/app/contexts/auth/context";
import { AuthFormValues, schema } from "./schema";
import { Page } from "@/components/shared/Page";
import { QrLoginPanel } from "./QrLoginPanel";

// ----------------------------------------------------------------------

type AuthMode = "credentials" | "qr";

export default function SignIn() {
  const { login, errorMessage } = useAuthContext();
  const [mode, setMode] = useState<AuthMode>("credentials");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: AuthFormValues) => {
    login({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    });
  };

  if (mode === "qr") {
    return (
      <Page title="Inicio de sesión QR">
        <main className="auth-page grid w-full grow grid-cols-1 place-items-center bg-[#F0F2F5] dark:bg-dark-900">
          <div className="w-full max-w-[52rem] p-4 sm:px-5">
            <Card className="rounded-2xl p-5 sm:p-8 lg:p-10">
              <button
                type="button"
                onClick={() => setMode("credentials")}
                className="mb-4 inline-flex size-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-dark-300 dark:hover:bg-dark-700 dark:hover:text-dark-100"
                aria-label="Volver"
              >
                ←
              </button>
              <div className="mb-5 flex items-center gap-3">
                <img
                  src={loginLogo}
                  alt="Gestionar mi negocio"
                  className="h-10 w-auto max-w-[9rem] shrink-0 object-contain"
                />
                <h2 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-dark-50">
                  Inicia sesión
                </h2>
              </div>
              <QrLoginPanel onBack={() => setMode("credentials")} />
            </Card>
          </div>
        </main>
      </Page>
    );
  }

  return (
    <Page title="Iniciar sesión">
      <main className="auth-page grid w-full grow grid-cols-1 place-items-center">
        <div className="w-full max-w-[26rem] p-4 sm:px-5">
          <div className="text-center">
            <img
              src={loginLogo}
              alt="Gestionar mi negocio"
              className="mx-auto w-full max-w-[17rem] object-contain"
            />
            <div className="mt-4">
              <h2 className="text-2xl font-semibold text-gray-600 dark:text-dark-100">
                Bienvenido
              </h2>
              <p className="text-gray-400 dark:text-dark-300">
                Inicia sesión para continuar
              </p>
            </div>
          </div>
          <Card className="mt-5 rounded-lg p-5 lg:p-7">
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
                  label="Contraseña"
                  placeholder="Ingresa tu contraseña"
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
              </div>

              <div className="mt-2">
                <InputErrorMsg
                  when={(errorMessage && errorMessage !== "") as boolean}
                >
                  {errorMessage}
                </InputErrorMsg>
              </div>

              <div className="mt-4 flex items-center justify-between space-x-2">
                <Checkbox label="Recordarme" {...register("rememberMe")} />
                <Link
                  to="/recuperar-contrasena"
                  className="text-xs text-gray-400 transition-colors hover:text-gray-800 focus:text-gray-800 dark:text-dark-300 dark:hover:text-dark-100 dark:focus:text-dark-100"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button type="submit" className="mt-5 w-full" color="primary">
                Iniciar sesión
              </Button>
            </form>
            <div className="mt-4 text-center text-xs-plus">
              <p className="line-clamp-1">
                <span>¿No tienes cuenta?</span>{" "}
                <Link
                  className="text-primary-600 transition-colors hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-600"
                  to="/pages/sign-up-v1"
                >
                  Crear cuenta
                </Link>
              </p>
            </div>
            <div className="my-7 flex items-center space-x-3 text-xs rtl:space-x-reverse">
              <div className="h-px flex-1 bg-gray-200 dark:bg-dark-500"></div>
              <p>O</p>
              <div className="h-px flex-1 bg-gray-200 dark:bg-dark-500"></div>
            </div>
            <div className="flex gap-4">
              <Button className="h-10 flex-1 gap-3" variant="outlined">
                <img
                  className="size-5.5"
                  src="/images/logos/google.svg"
                  alt="logo"
                />
                <span>Google</span>
              </Button>
              <Button
                type="button"
                className="h-10 flex-1 gap-3"
                variant="outlined"
                onClick={() => setMode("qr")}
              >
                <QrCodeIcon className="size-5.5" strokeWidth={1.5} />
                <span>Código QR</span>
              </Button>
            </div>
          </Card>
          <div className="mt-8 flex justify-center text-xs text-gray-400 dark:text-dark-300">
            <a href="##">Aviso de privacidad</a>
            <div className="mx-2.5 my-0.5 w-px bg-gray-200 dark:bg-dark-500"></div>
            <a href="##">Términos de servicio</a>
          </div>
        </div>
      </main>
    </Page>
  );
}
