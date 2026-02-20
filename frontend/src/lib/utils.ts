import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGradientClass(gradient: string): string {
  const map: Record<string, string> = {
    'gradient-purple': 'bg-primary',
    'gradient-pink': 'bg-destructive',
    'gradient-cyan': 'bg-secondary',
    'gradient-green': 'bg-success',
    purple: 'bg-primary',
    pink: 'bg-destructive',
    cyan: 'bg-secondary',
    green: 'bg-success',
  };
  return map[gradient] || 'bg-primary';
}

export function formatNota(nota: number | null): string {
  if (nota === null) return '-';
  return nota.toFixed(3).replace('.', ',');
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

export function getLetterRank(nota: number): { letter: string; color: string; bgColor: string } {
  if (nota >= 9) return { letter: 'S+', color: 'text-warning', bgColor: 'bg-warning/10 border-warning/30' };
  if (nota >= 8) return { letter: 'A', color: 'text-success', bgColor: 'bg-success/10 border-success/30' };
  if (nota >= 7) return { letter: 'B', color: 'text-secondary', bgColor: 'bg-secondary/10 border-secondary/30' };
  if (nota >= 6) return { letter: 'C', color: 'text-primary', bgColor: 'bg-primary/10 border-primary/30' };
  return { letter: 'D', color: 'text-destructive', bgColor: 'bg-destructive/10 border-destructive/30' };
}

export function getResultEmoji(percentage: number): string {
  if (percentage >= 90) return '\u{1F3C6}';
  if (percentage >= 70) return '\u{1F31F}';
  if (percentage >= 50) return '\u{1F4AA}';
  return '\u{1F4DA}';
}
