
export interface Field {
  id: string;
  name: string;
  acres: number;
  cropType?: string;
}

export interface Machine {
  id: string;
  name: string; // Computed as Manufacturer + Model
  manufacturer: string;
  model: string;
  type: string;
  horsepower?: number;
  licensePlate?: string;
  year?: number;
  usage?: string; // Hours or Kilometers
  fuelType?: string;
}

export const COMMON_MACHINE_TYPES = [
  'Tractor',
  'Combine',
  'Planter',
  'Sprayer',
  'Truck',
  'ATV',
  'Loader',
  'Other'
];

export interface FieldWork {
  id: string;
  fieldId: string;
  date: string;
  task: string;
  notes?: string;
}

export interface MachineRepair {
  id: string;
  machineId: string;
  date: string;
  description: string;
  cost?: number;
  nextDueDate?: string;
}

export interface AnalysisResult {
  efficiencyScore: number;
  summary: string;
  recommendations: string[];
}