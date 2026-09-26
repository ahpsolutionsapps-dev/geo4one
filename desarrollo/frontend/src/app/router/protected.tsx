import { Navigate, RouteObject } from "react-router";

import AuthGuard from "@/middleware/AuthGuard";
import { DynamicLayout } from "../layouts/DynamicLayout";
import { AppLayout } from "../layouts/AppLayout";

/**
 * Protected routes configuration
 * These routes require authentication to access
 * Uses AuthGuard middleware to verify user authentication
 */
const protectedRoutes: RouteObject = {
  id: "protected",
  Component: AuthGuard,
  children: [
    // The dynamic layout supports both the main layout and the sideblock.
    {
      Component: DynamicLayout,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboards/home" />,
        },
        {
          path: "dashboards",
          children: [
            {
              index: true,
              element: <Navigate to="/dashboards/home" />,
            },
            {
              path: "home",
              lazy: async () => ({
                Component: (await import("@/app/features/dashboards/home")).default,
              }),
            },
            {
              path: "notificaciones",
              lazy: async () => ({
                Component: (await import("@/app/features/dashboards/notificaciones")).default,
              }),
            },
            {
              path: "mapa",
              lazy: async () => ({
                Component: (await import("@/app/features/dashboards/mapa")).default,
              }),
            },
            {
              path: "elementos",
              lazy: async () => ({
                Component: (await import("@/app/features/dashboards/elementos")).default,
              }),
            },
            {
              path: "elementos/listado",
              lazy: async () => ({
                Component: (await import("@/app/features/dashboards/elementos/listado")).default,
              }),
            },
            {
              path: "elementos/nuevo",
              lazy: async () => ({
                Component: (await import("@/app/features/dashboards/elementos/nuevo")).default,
              }),
            },
            {
              path: "proveedores",
              lazy: async () => ({
                Component: (await import("@/app/features/dashboards/proveedores")).default,
              }),
            },
            {
              path: "anunciantes",
              lazy: async () => ({
                Component: (await import("@/app/features/dashboards/anunciantes")).default,
              }),
            },
            {
              path: "campanas",
              lazy: async () => ({
                Component: (await import("@/app/features/dashboards/campanas")).default,
              }),
            },
            {
              path: "periodos",
              lazy: async () => ({
                Component: (await import("@/app/features/dashboards/periodos")).default,
              }),
            },
            {
              path: "reportes",
              lazy: async () => ({
                Component: (await import("@/app/features/dashboards/reportes")).default,
              }),
            },
            {
              path: "colocaciones",
              lazy: async () => ({
                Component: (await import("@/app/features/dashboards/colocaciones")).default,
              }),
            },
            {
              path: "seguimientos",
              lazy: async () => ({
                Component: (await import("@/app/features/dashboards/seguimientos")).default,
              }),
            },
            {
              path: "incidencias",
              lazy: async () => ({
                Component: (await import("@/app/features/dashboards/incidencias")).default,
              }),
            },
            {
              path: "catalogos",
              lazy: async () => ({
                Component: (await import("@/app/features/dashboards/catalogos")).default,
              }),
            },
            {
              path: "catalogos/orientaciones",
              lazy: async () => ({
                Component: (await import("@/app/features/dashboards/catalogos/orientaciones")).default,
              }),
            },
            {
              path: "catalogos/tipos",
              lazy: async () => ({
                Component: (await import("@/app/features/dashboards/catalogos/tipos")).default,
              }),
            },
            {
              path: "catalogos/formatos",
              lazy: async () => ({
                Component: (await import("@/app/features/dashboards/catalogos/formatos")).default,
              }),
            },
            {
              path: "catalogos/tamanos",
              lazy: async () => ({
                Component: (await import("@/app/features/dashboards/catalogos/tamanos")).default,
              }),
            },
            {
              path: "catalogos/ubicaciones",
              lazy: async () => ({
                Component: (
                  await import(
                    "@/app/features/dashboards/catalogos/ubicaciones/Layout"
                  )
                ).default,
              }),
              children: [
                {
                  index: true,
                  lazy: async () => ({
                    Component: (
                      await import(
                        "@/app/features/dashboards/catalogos/ubicaciones"
                      )
                    ).default,
                  }),
                },
                {
                  path: "provincias",
                  lazy: async () => ({
                    Component: (
                      await import(
                        "@/app/features/dashboards/catalogos/ubicaciones/provincias"
                      )
                    ).default,
                  }),
                },
                {
                  path: "municipios",
                  lazy: async () => ({
                    Component: (
                      await import(
                        "@/app/features/dashboards/catalogos/ubicaciones/municipios"
                      )
                    ).default,
                  }),
                },
                {
                  path: "sectores",
                  lazy: async () => ({
                    Component: (
                      await import(
                        "@/app/features/dashboards/catalogos/ubicaciones/sectores"
                      )
                    ).default,
                  }),
                },
              ],
            },
            {
              path: "administracion",
              lazy: async () => ({
                Component: (await import("@/app/features/dashboards/administracion")).default,
              }),
            },
            {
              path: "administracion/usuarios",
              lazy: async () => ({
                Component: (await import("@/app/features/dashboards/administracion/usuarios")).default,
              }),
            },
            {
              path: "administracion/roles",
              lazy: async () => ({
                Component: (await import("@/app/features/dashboards/administracion/roles")).default,
              }),
            },
            {
              path: "administracion/configuracion",
              lazy: async () => ({
                Component: (await import("@/app/features/dashboards/administracion/configuracion")).default,
              }),
            },
            {
              path: "administracion/auditoria",
              lazy: async () => ({
                Component: (await import("@/app/features/dashboards/administracion/auditoria")).default,
              }),
            },
          ],
        },
      ],
    },
    // The app layout supports only the main layout. Avoid using it for other layouts.
    {
      Component: AppLayout,
      children: [
        {
          path: "settings",
          lazy: async () => ({
            Component: (await import("@/app/features/settings/Layout")).default,
          }),
          children: [
            {
              index: true,
              element: <Navigate to="/settings/general" />,
            },
            {
              path: "general",
              lazy: async () => ({
                Component: (
                  await import("@/app/features/settings/sections/General")
                ).default,
              }),
            },
            {
              path: "appearance",
              lazy: async () => ({
                Component: (
                  await import("@/app/features/settings/sections/Appearance")
                ).default,
              }),
            },
          ],
        },
      ],
    },
  ],
};

export { protectedRoutes };
