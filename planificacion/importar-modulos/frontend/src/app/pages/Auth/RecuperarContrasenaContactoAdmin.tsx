import { Link } from "react-router";
import { UserGroupIcon } from "@heroicons/react/24/outline";

import { AppBrandLogo } from "@/components/shared/AppBrandLogo";
import { Button, Card } from "@/components/ui";
import { Page } from "@/components/shared/Page";

export default function RecuperarContrasenaContactoAdmin() {
  return (
    <Page title="Contactar administrador">
      <main className="auth-page grid w-full grow grid-cols-1 place-items-center">
        <div className="w-full max-w-[26rem] p-4 sm:px-5">
          <div className="text-center">
            <AppBrandLogo className="mx-auto size-16" />
            <div className="mt-4">
              <h2 className="text-2xl font-semibold text-gray-600 dark:text-dark-100">
                Contactar administrador
              </h2>
              <p className="text-gray-400 dark:text-dark-300">
                Un administrador puede restablecer el acceso a tu cuenta
              </p>
            </div>
          </div>

          <Card className="mt-5 rounded-lg p-5 lg:p-7">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-600/10 text-primary-600 flex size-14 items-center justify-center rounded-full dark:bg-primary-400/10 dark:text-primary-400">
                <UserGroupIcon className="size-7" strokeWidth={1.5} />
              </div>
              <p className="mt-4 text-sm text-gray-600 dark:text-dark-200">
                Si no recuerdas tu palabra secreta, solicita a un administrador
                que actualice tu contraseña o te ayude a recuperar el acceso.
              </p>
              <p className="mt-2 text-sm text-gray-400 dark:text-dark-300">
                Indica tu correo de cuenta para que puedan localizarte.
              </p>
              <Button
                component={Link}
                to="/recuperar-contrasena"
                variant="outlined"
                className="mt-6 w-full"
              >
                Elegir otro método
              </Button>
              <Link
                className="text-primary-600 mt-4 text-xs-plus transition-colors hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-600"
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
