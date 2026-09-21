import { ShieldExclamationIcon } from "@heroicons/react/24/outline";

import { AppBrandLogo } from "@/components/shared/AppBrandLogo";
import { useAuthContext } from "@/app/contexts/auth/context";
import { getAccountAccessBlockReason } from "@/@types/user";
import { Button, Card } from "@/components/ui";
import { Page } from "@/components/shared/Page";

function resolveCopy(reason: ReturnType<typeof getAccountAccessBlockReason>, email?: string) {
  const accountLabel = email ? `La cuenta ${email}` : "Tu cuenta";

  switch (reason) {
    case "annulled":
      return {
        title: "Cuenta anulada",
        subtitle: "No puedes acceder a los módulos de la aplicación.",
        detail: `${accountLabel} ha sido anulada.`,
        help: "Contacta a un administrador si crees que se trata de un error.",
      };
    case "disabled":
      return {
        title: "Cuenta deshabilitada",
        subtitle: "No puedes acceder a los módulos de la aplicación.",
        detail: `${accountLabel} está deshabilitada.`,
        help: "Contacta a un administrador para que la vuelva a habilitar.",
      };
    case "not_verified":
    default:
      return {
        title: "Cuenta sin verificar",
        subtitle: "Tu usuario aún no tiene acceso a los módulos de la aplicación.",
        detail: `${accountLabel} está pendiente de verificación.`,
        help: "Contacta a un administrador para que marque tu correo como verificado.",
      };
  }
}

export default function CuentaSinVerificar() {
  const { user, logout } = useAuthContext();
  const copy = resolveCopy(getAccountAccessBlockReason(user), user?.email);

  return (
    <Page title={copy.title}>
      <main className="auth-page grid w-full grow grid-cols-1 place-items-center">
        <div className="w-full max-w-[26rem] p-4 sm:px-5">
          <div className="text-center">
            <AppBrandLogo className="mx-auto size-16" />
            <div className="mt-4">
              <h2 className="text-2xl font-semibold text-gray-600 dark:text-dark-100">
                {copy.title}
              </h2>
              <p className="mt-2 text-gray-400 dark:text-dark-300">
                {copy.subtitle}
              </p>
            </div>
          </div>

          <Card className="mt-5 rounded-lg p-5 lg:p-7">
            <div className="flex flex-col items-center text-center">
              <div className="bg-warning/10 text-warning flex size-14 items-center justify-center rounded-full">
                <ShieldExclamationIcon className="size-7" strokeWidth={1.5} />
              </div>
              <p className="mt-4 text-sm text-gray-600 dark:text-dark-200">
                {copy.detail}
              </p>
              <p className="mt-2 text-sm text-gray-400 dark:text-dark-300">
                {copy.help}
              </p>
              <Button
                color="primary"
                className="mt-6 w-full"
                onClick={() => void logout()}
              >
                Cerrar sesión
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </Page>
  );
}
