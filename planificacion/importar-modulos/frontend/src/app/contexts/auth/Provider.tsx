// Import Dependencies
import { useCallback, useEffect, useReducer, ReactNode } from "react";

// Local Imports
import axios from "@/utils/axios";
import { ApiUser, mapApiUserToUser } from "@/@types/user";
import { isTauriRuntime } from "@/shared/platform/is-tauri-runtime";
import {
  getStoredAuthToken,
  getStoredAuthUser,
  isSessionRemembered,
  isTokenValid,
  setSession,
} from "@/utils/jwt";
import { AuthProvider as AuthContext, AuthContextType } from "./context";

// ----------------------------------------------------------------------

function resolveErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === "string" && err.trim() !== "") {
    return err;
  }

  if (err instanceof Error && err.message.trim() !== "") {
    return err.message;
  }

  return fallback;
}

interface AuthAction {
  type:
    | "INITIALIZE"
    | "LOGIN_REQUEST"
    | "LOGIN_SUCCESS"
    | "LOGIN_ERROR"
    | "LOGOUT";
  payload?: Partial<AuthContextType>;
}

interface AuthResponse {
  token: string;
  user: ApiUser;
  idSucursal?: number | null;
}

interface MeResponse {
  user: ApiUser;
  idSucursal?: number | null;
}

// Initial state
const initialState: AuthContextType = {
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  errorMessage: null,
  user: null,
  login: async () => {},
  loginWithToken: async () => {},
  logout: async () => {},
};

// Reducer handlers
const reducerHandlers: Record<
  AuthAction["type"],
  (state: AuthContextType, action: AuthAction) => AuthContextType
> = {
  INITIALIZE: (state, action) => ({
    ...state,
    isAuthenticated: action.payload?.isAuthenticated ?? false,
    isInitialized: true,
    user: action.payload?.user ?? null,
  }),

  LOGIN_REQUEST: (state) => ({
    ...state,
    isLoading: true,
    errorMessage: null,
  }),

  LOGIN_SUCCESS: (state, action) => ({
    ...state,
    isAuthenticated: true,
    isLoading: false,
    user: action.payload?.user ?? null,
    errorMessage: null,
  }),

  LOGIN_ERROR: (state, action) => ({
    ...state,
    errorMessage: action.payload?.errorMessage ?? "An error occurred",
    isLoading: false,
  }),

  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
};

// Reducer function
const reducer = (
  state: AuthContextType,
  action: AuthAction,
): AuthContextType => {
  const handler = reducerHandlers[action.type];
  return handler ? handler(state, action) : state;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const init = async () => {
      const authToken = getStoredAuthToken();
      const rememberMe = isSessionRemembered();
      const cachedUser = getStoredAuthUser<ApiUser>();

      if (!authToken || !isTokenValid(authToken)) {
        setSession(null);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
        return;
      }

      setSession(authToken, { rememberMe, user: cachedUser });

      try {
        const response = await axios.get<MeResponse>("/auth/me");
        const apiUser = response.data.user;
        setSession(authToken, { rememberMe, user: apiUser });

        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: true,
            user: mapApiUserToUser(apiUser, response.data.idSucursal),
          },
        });
      } catch (err) {
        console.error(err);
        if (cachedUser) {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              user: mapApiUserToUser(cachedUser),
            },
          });
          return;
        }

        setSession(null);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    init();
  }, []);

  const login = useCallback(
    async (credentials: {
      email: string;
      password: string;
      rememberMe?: boolean;
    }) => {
      dispatch({ type: "LOGIN_REQUEST" });

      try {
        const response = await axios.post<AuthResponse>("/auth/login", {
          email: credentials.email,
          password: credentials.password,
        });
        const { token, user: apiUser, idSucursal } = response.data;

        if (typeof token !== "string" || !apiUser) {
          throw new Error("Respuesta inválida del servidor");
        }

        setSession(token, {
          rememberMe: credentials.rememberMe === true,
          user: apiUser,
        });

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user: mapApiUserToUser(apiUser, idSucursal) },
        });
      } catch (err) {
        setSession(null);
        dispatch({
          type: "LOGIN_ERROR",
          payload: {
            errorMessage: resolveErrorMessage(
              err,
              "No fue posible iniciar sesión",
            ),
          },
        });
      }
    },
    [],
  );

  const loginWithToken = useCallback(
    async (session: {
      token: string;
      user: ApiUser;
      rememberMe?: boolean;
    }) => {
      dispatch({ type: "LOGIN_REQUEST" });

      try {
        if (typeof session.token !== "string" || !session.user) {
          throw new Error("Sesión QR inválida");
        }

        setSession(session.token, {
          rememberMe: session.rememberMe ?? isTauriRuntime(),
          user: session.user,
        });

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user: mapApiUserToUser(session.user) },
        });
      } catch (err) {
        setSession(null);
        dispatch({
          type: "LOGIN_ERROR",
          payload: {
            errorMessage: resolveErrorMessage(
              err,
              "No fue posible iniciar sesión con QR",
            ),
          },
        });
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    setSession(null);
    dispatch({ type: "LOGOUT" });
  }, []);

  if (!children) {
    return null;
  }

  return (
    <AuthContext
      value={{
        ...state,
        login,
        loginWithToken,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
}
