import {Check, Component, SquareFunction, X} from "lucide-react";
import * as React from "react";

export interface TypeOption {
  label: string
  value: any
  icon?: React.ComponentType<{ className?: string }>
}

export const status: TypeOption[] = [
  {
    label: 'Aktiv',
    value: true,
    icon: Check
  },
  {
    label: 'Inaktiv',
    value: false,
    icon: X
  },
]

export const permissionTypes: TypeOption[] = [
  {
    label: 'Module',
    value: 'module',
    icon: Component
  },
  {
    label: 'Funktion',
    value: 'function',
    icon: SquareFunction
  }
]

export const moduleAccessLevelTypes: TypeOption[] = [
  {
    label: 'None',
    value: 'none'
  },
  {
    label: 'Read',
    value: 'read'
  },
  {
    label: 'Write',
    value: 'write'
  },
  {
    label: 'Delete',
    value: 'delete'
  },
];

export const frameworks: TypeOption[] = [
  {value: 'react', label: 'React'},
  {value: 'nextjs', label: 'Nextjs'},
  {value: 'angular', label: 'Angular'},
  {value: 'vue', label: 'VueJS'},
  {value: 'django', label: 'Django'},
  {value: 'astro', label: 'Astro'},
  {value: 'remix', label: 'Remix'},
  {value: 'svelte', label: 'Svelte'},
  {value: 'solidjs', label: 'SolidJS'},
  {value: 'qwik', label: 'Qwik'}
]