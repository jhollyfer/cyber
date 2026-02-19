import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGradientClass(gradient: string): string {
  const map: Record<string, string> = {
    'gradient-purple': 'bg-gradient-purple',
    'gradient-pink': 'bg-gradient-pink',
    'gradient-cyan': 'bg-gradient-cyan',
    'gradient-green': 'bg-gradient-green',
    purple: 'bg-gradient-purple',
    pink: 'bg-gradient-pink',
    cyan: 'bg-gradient-cyan',
    green: 'bg-gradient-green',
  };
  return map[gradient] || 'bg-gradient-purple';
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
  if (nota >= 9) return { letter: 'S+', color: 'text-cyber-yellow', bgColor: 'bg-cyber-yellow/10 border-cyber-yellow/30' };
  if (nota >= 8) return { letter: 'A', color: 'text-cyber-green', bgColor: 'bg-cyber-green/10 border-cyber-green/30' };
  if (nota >= 7) return { letter: 'B', color: 'text-cyber-cyan', bgColor: 'bg-cyber-cyan/10 border-cyber-cyan/30' };
  if (nota >= 6) return { letter: 'C', color: 'text-cyber-purple', bgColor: 'bg-cyber-purple/10 border-cyber-purple/30' };
  return { letter: 'D', color: 'text-cyber-red', bgColor: 'bg-cyber-red/10 border-cyber-red/30' };
}

export function getResultEmoji(percentage: number): string {
  if (percentage >= 90) return '\u{1F3C6}';
  if (percentage >= 70) return '\u{1F31F}';
  if (percentage >= 50) return '\u{1F4AA}';
  return '\u{1F4DA}';
}
