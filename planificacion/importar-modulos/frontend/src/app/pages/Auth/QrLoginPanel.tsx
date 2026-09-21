import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import axios from "@/utils/axios";
import { ApiUser } from "@/@types/user";
import { Button } from "@/components/ui";
import { useAuthContext } from "@/app/contexts/auth/context";

interface QrSessionResponse {
  code: string;
  payload: string;
  expiresAt: string;
  expiresInSeconds: number;
}

interface QrStatusResponse {
  status: "pending" | "approved" | "expired" | "consumed";
  expiresAt: string;
  user?: ApiUser;
  token?: string;
}

type PanelState = "loading" | "ready" | "expired" | "error";

export function QrLoginPanel({ onBack }: { onBack: () => void }) {
  const { loginWithToken } = useAuthContext();
  const loginWithTokenRef = useRef(loginWithToken);
  const [state, setState] = useState<PanelState>("loading");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const codeRef = useRef<string | null>(null);
  const pollRef = useRef<number | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    loginWithTokenRef.current = loginWithToken;
  }, [loginWithToken]);

  const clearPoll = useCallback(() => {
    if (pollRef.current != null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startSession = useCallback(async () => {
    clearPoll();
    cancelledRef.current = false;
    setState("loading");
    setErrorMessage(null);
    setQrDataUrl(null);

    try {
      const response = await axios.post<QrSessionResponse>("/auth/qr/session", {
        deviceName: "Escritorio",
      });
      const { code, payload } = response.data;
      if (cancelledRef.current) {
        return;
      }

      codeRef.current = code;
      const dataUrl = await QRCode.toDataURL(payload, {
        errorCorrectionLevel: "M",
        margin: 1,
        width: 240,
        color: {
          dark: "#121826",
          light: "#FFFFFF",
        },
      });

      if (cancelledRef.current) {
        return;
      }

      setQrDataUrl(dataUrl);
      setState("ready");

      pollRef.current = window.setInterval(async () => {
        const currentCode = codeRef.current;
        if (!currentCode) {
          return;
        }

        try {
          const statusResponse = await axios.get<QrStatusResponse>(
            `/auth/qr/session/${encodeURIComponent(currentCode)}`,
          );
          const { status, token, user } = statusResponse.data;

          if (status === "approved" && typeof token === "string" && user) {
            clearPoll();
            await loginWithTokenRef.current({ token, user });
            return;
          }

          if (status === "expired" || status === "consumed") {
            clearPoll();
            setState("expired");
          }
        } catch {
          // keep polling while the session may still be valid
        }
      }, 2000);
    } catch (err) {
      if (cancelledRef.current) {
        return;
      }
      setState("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "No fue posible generar el código QR",
      );
    }
  }, [clearPoll]);

  useEffect(() => {
    void startSession();
    return () => {
      cancelledRef.current = true;
      clearPoll();
    };
  }, [clearPoll, startSession]);

  return (
    <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-10">
      <div className="flex min-w-0 flex-1 flex-col">
        <ol className="space-y-0">
          <Step
            number={1}
            text="Abre la app en el teléfono e inicia sesión con tu cuenta."
            showLine
          />
          <Step
            number={2}
            text="Ve a Configuración y toca Vincular dispositivo."
            showLine
          />
          <Step
            number={3}
            text="Escanea este código QR para autorizar el acceso."
            showLine={false}
          />
        </ol>
      </div>

      <div className="flex shrink-0 flex-col items-center lg:items-end">
        <div className="flex size-[240px] items-center justify-center rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-200 dark:bg-dark-800 dark:ring-dark-500">
          {state === "loading" && (
            <div className="size-10 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
          )}
          {state === "ready" && qrDataUrl && (
            <img
              src={qrDataUrl}
              alt="Código QR para iniciar sesión"
              className="size-full object-contain"
            />
          )}
          {(state === "expired" || state === "error") && (
            <div className="flex flex-col items-center gap-3 px-4 text-center">
              <p className="text-sm text-gray-600 dark:text-dark-200">
                {state === "expired"
                  ? "El código QR expiró."
                  : (errorMessage ?? "No se pudo cargar el código QR.")}
              </p>
              <Button color="primary" onClick={() => void startSession()}>
                Generar nuevo
              </Button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onBack}
          className="mt-4 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400"
        >
          Iniciar sesión con correo y contraseña →
        </button>
      </div>
    </div>
  );
}

function Step({
  number,
  text,
  showLine,
}: {
  number: number;
  text: string;
  showLine: boolean;
}) {
  return (
    <div className="flex gap-3.5">
      <div className="flex w-7 flex-col items-center">
        <div className="flex size-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
          {number}
        </div>
        {showLine ? (
          <div className="my-1 min-h-6 w-0.5 flex-1 bg-gray-200 dark:bg-dark-500" />
        ) : null}
      </div>
      <p className="pb-5 pt-1 text-[15px] leading-snug text-gray-700 dark:text-dark-100">
        {text}
      </p>
    </div>
  );
}
