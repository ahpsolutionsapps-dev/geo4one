import { baseNavigationObj } from "../baseNavigation";
import { NavigationTree } from "@/@types/navigation";

const ROOT_DASHBOARDS = "/dashboards";

const path = (root: string, item: string) => `${root}${item}`;

export const dashboards: NavigationTree = {
  ...baseNavigationObj["dashboards"],
  type: "root",
  childs: [
    {
      id: "dashboards.home",
      path: path(ROOT_DASHBOARDS, "/home"),
      type: "item",
      title: "Home",
      transKey: "nav.dashboards.home",
      icon: "dashboards.home",
    },
    {
      id: "dashboards.elementos",
      path: path(ROOT_DASHBOARDS, "/elementos"),
      type: "item",
      title: "Elementos",
      transKey: "nav.dashboards.elementos",
      icon: "dashboards.elementos",
    },
    {
      id: "dashboards.reportes",
      path: path(ROOT_DASHBOARDS, "/elementos"),
      type: "item",
      title: "Reportes",
      transKey: "nav.dashboards.reportes",
      icon: "reportes",
    },
    {
      id: "dashboards.ubicaciones",
      path: path(ROOT_DASHBOARDS, "/elementos"),
      type: "item",
      title: "Ubicaciones",
      transKey: "nav.dashboards.ubicaciones",
      icon: "ubicaciones",
    },
  ],
};
