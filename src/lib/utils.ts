import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function kgToLbs(kg: number): number {
  return kg * 2.20462;
}

export function lbsToKg(lbs: number): number {
  return lbs / 2.20462;
}

export function cmToInches(cm: number): number {
  return cm / 2.54;
}

export function inchesToCm(inches: number): number {
  return inches * 2.54;
}

export function kgToStoneLbs(kg: number): { st: number; lbs: number } {
  const totalLbs = kg * 2.20462;
  const st = Math.floor(totalLbs / 14);
  const lbs = totalLbs % 14;
  return { st, lbs };
}

export function stoneLbsToKg(st: number, lbs: number): number {
  const totalLbs = (st * 14) + lbs;
  return totalLbs / 2.20462;
}

export function formatWeight(weightInKg: number, unit: 'kg' | 'lbs' | 'st', decimals: number = 1): string {
  if (unit === 'kg') {
    return `${weightInKg.toFixed(decimals)} kg`;
  } else if (unit === 'lbs') {
    return `${kgToLbs(weightInKg).toFixed(decimals)} lbs`;
  } else {
    const { st, lbs } = kgToStoneLbs(weightInKg);
    return `${st}st ${Math.round(lbs)}lb`;
  }
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}
