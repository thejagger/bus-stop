import {lazy} from 'react';
import {
  type Icon,
  IconAdjustments,
  IconDashboard,
  type IconProps,
  IconUser
} from "@tabler/icons-react";
import * as React from "react";

import type {FC} from "react";

export interface NavItem {
  /** URL segment, e.g. "users" or ":id" */
  path: string;

  /** Icon for navigation */
  icon?: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;

  /** React component to render for this route */
  component?: FC;

  /** React componentDetail to render for this route */
  componentDetail?: FC;

  /** Hide this item from the sidebar */
  hideInSidebar?: boolean;

  /** Optional nested items for sub-navigation */
  items?: NavItem[];
}

export const navigationConfig: NavItem[] = [
  {
    path: "dashboard",
    component: lazy(() => import("../app/dashboard/page")),
    icon: IconDashboard,
  },
  {
    path: "admin",
    icon: IconAdjustments,
    items: [
      {
        path: "users",
        component: lazy(() => import("../app/users/page")),
        componentDetail: lazy(() => import("../app/users/detail")),
      },
    ]
  },
  {
    path: "profile",
    icon: IconUser,
    component: lazy(() => import("../app/users/profile_detail")),
    hideInSidebar: true,
  }
]