import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Atlanta area ZIP codes (30000-31999)
export function isAtlantaAreaZipCode(zipCode: string): boolean {
  const numericZip = parseInt(zipCode)
  return numericZip >= 30000 && numericZip <= 31999
}
