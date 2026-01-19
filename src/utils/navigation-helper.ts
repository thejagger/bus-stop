import type {NavItem} from "@/config/navigation.ts";

/** Returns true if this nav item (or any child) is active */
export function isNavItemActive(item: NavItem, activeNavItems: NavItem[] | undefined): boolean {
  if (activeNavItems === undefined) return false;
  return activeNavItems.indexOf(item) !== -1;
}

export function getNavItemByPath(items: NavItem[], path: string, fullItemPath?: string): NavItem[] | undefined {
  for (const item of items) {
    let currFullItemPath = fullItemPath;
    if (!currFullItemPath) currFullItemPath = '';

    currFullItemPath += `/${item.path}`;

    if (path == currFullItemPath || path.startsWith(currFullItemPath + '/')) {
      let navItems = [item];

      if (item.items) {
        const result = getNavItemByPath(item.items, path, currFullItemPath);
        if (result) {
          navItems = [...navItems, ...result];
        }
      }
      return navItems;
    }
  }
}