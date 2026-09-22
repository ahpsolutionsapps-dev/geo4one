import { TbPalette } from "react-icons/tb";
import {
  HomeIcon,
  UserIcon as HiUserIcon,
  BuildingStorefrontIcon,
  MapIcon,
  UsersIcon,
  MegaphoneIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  ChartBarIcon,
  FolderIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { ElementType } from "react";

import DashboardsIcon from "@/assets/dualicons/dashboards.svg?react";
import SettingIcon from "@/assets/dualicons/setting.svg?react";

export const navigationIcons: Record<string, ElementType> = {
  dashboards: DashboardsIcon,
  settings: SettingIcon,
  dashboard: DashboardsIcon,
  map: MapIcon,
  elementos: BuildingStorefrontIcon,
  proveedores: UsersIcon,
  anunciantes: MegaphoneIcon,
  campañas: CalendarDaysIcon,
  periodos: DocumentTextIcon,
  reportes: ChartBarIcon,
  catalogos: FolderIcon,
  orientaciones: Squares2X2Icon,
  tipos: BuildingStorefrontIcon,
  formatos: DocumentTextIcon,
  tamaños: WrenchScrewdriverIcon,
  ubicaciones: MapIcon,
  usuarios: UsersIcon,
  configuracion: Cog6ToothIcon,
  auditoria: ShieldCheckIcon,
  "dashboards.home": HomeIcon,
  "dashboards.elementos": BuildingStorefrontIcon,
  "settings.general": HiUserIcon,
  "settings.appearance": TbPalette,
};
