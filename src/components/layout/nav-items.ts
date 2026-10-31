import type { ComponentType } from "react";

export interface NavSubItem {
  href: string;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

export type NavItem =
  | {
      type: "link";
      href: string;
      label: string;
    }
  | {
      type: "dropdown";
      id: string;
      label: string;
      items: NavSubItem[];
    };

