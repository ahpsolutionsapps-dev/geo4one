import { Link } from "react-router";
import {
  ChevronRightIcon,
  DevicePhoneMobileIcon,
  KeyIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

import { AppBrandLogo } from "@/components/shared/AppBrandLogo";
import { Card } from "@/components/ui";
import { Page } from "@/components/shared/Page";

const recoveryMethods = [
  {
    to: "/recuperar-contrasena/enviar-codigo",
    title: "Enviar código al correo",
    description:
      "Recibe un código por correo electrónico y úsalo para crear una nueva contraseña.",
    icon: DevicePhoneMobileIcon,
  },
  {
    to: "/recuperar-contrasena/palabra-secreta",
    title: "Palabra secreta",
    description:
      "Restablece tu contraseña con el correo y la palabra secreta de tu cuenta.",
    icon: KeyIcon,
  },
  {
    to: "/recuperar-contrasena/contacto-admin",
    title: "Contactar administrador",
    description:
      "Si no recuerdas tu palabra secreta, pide ayuda a un administrador.",
    icon: UserGroupIcon,
  },
] as const;

export default function RecuperarContrasena() {
  return (
    <Page title="Recuperar contraseña">
      <main className="auth-page grid w-full grow grid-cols-1 place-items-center">
        <div className="w-full max-w-[26rem] p-4 sm:px-5">
          <div className="text-center">
            <AppBrandLogo className="mx-auto size-16" />
            <div className="mt-4">
              <h2 className="text-2xl font-semibold text-gray-600 dark:text-dark-100">
                Recuperar contraseña
              </h2>
              <p className="text-gray-400 dark:text-dark-300">
                Elige cómo quieres recuperar el acceso a tu cuenta
              </p>
            </div>
          </div>

          <Card className="mt-5 rounded-lg p-5 lg:p-7">
            <div className="space-y-3">
              {recoveryMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <Link
                    key={method.to}
                    to={method.to}
                    className="group flex items-start gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-primary-600 hover:bg-primary-600/[.04] dark:border-dark-500 dark:hover:border-primary-400 dark:hover:bg-primary-400/5"
                  >
                    <div className="bg-primary-600/10 text-primary-600 flex size-10 shrink-0 items-center justify-center rounded-full dark:bg-primary-400/10 dark:text-primary-400">
                      <Icon className="size-5" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-800 dark:text-dark-50">
                        {method.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-400 dark:text-dark-300">
                        {method.description}
                      </p>
                    </div>
                    <ChevronRightIcon className="mt-1 size-5 shrink-0 text-gray-300 transition-colors group-hover:text-primary-600 dark:text-dark-400 dark:group-hover:text-primary-400" />
                  </Link>
                );
              })}
            </div>

            <div className="mt-5 text-center text-xs-plus">
              <Link
                className="text-primary-600 transition-colors hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-600"
                to="/login"
              >
                Volver a iniciar sesión
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </Page>
  );
}
