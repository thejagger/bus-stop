import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isAppleDevice() {
  if (
      typeof navigator === undefined ||
      typeof navigator.userAgent === undefined
  ) {
    return;
  }
  return /(iPod|iPad|iPhone|Mac)/i.test(navigator.userAgent);
}

// export function format