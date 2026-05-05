import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRef(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `RF-2024-00${num}`;
}
