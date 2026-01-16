// Authentication Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  authority: string;
  createdTime: number;
  additionalInfo?: Record<string, unknown>;
}

// Device Types
export interface Device {
  id: string;
  name: string;
  type: string;
  label?: string;
  additionalInfo?: Record<string, unknown>;
  createdTime: number;
}

export interface DeviceCredentials {
  deviceId: string;
  credentialsId: string;
  credentialsType: string;
  credentialsValue: string;
  credentialsExpires: number;
}

// Telemetry Types
export interface TelemetryData {
  [key: string]: Array<[number, string | number | boolean]>;
}

export interface SensorReading {
  deviceId: string;
  deviceName: string;
  key: string;
  value: number | string | boolean;
  timestamp: number;
  unit?: string;
}

export interface PoolInfo {
  id: string;
  name: string;
  type: "pool";
  sensors: SensorReading[];
  pumpStatus: boolean;
  lastUpdate: number;
}

export interface PumpController {
  id: string;
  name: string;
  type: "pump";
  status: "on" | "off" | "error";
  power?: number;
  flowRate?: number;
  operatingHours?: number;
}

export interface EnergyMeter {
  id: string;
  name: string;
  type: "energy_meter";
  totalConsumption: number;
  currentPower: number;
  voltage?: number;
  current?: number;
  frequency?: number;
}

// Historical Data Types
export interface HistoricalDataPoint {
  timestamp: number;
  value: number;
}

export interface HistoricalData {
  deviceId: string;
  deviceName: string;
  key: string;
  dataPoints: HistoricalDataPoint[];
  unit?: string;
}

export interface DateRange {
  startTime: number;
  endTime: number;
}

// Dashboard Types
export interface DashboardState {
  pools: PoolInfo[];
  pumps: PumpController[];
  energyMeters: EnergyMeter[];
  loading: boolean;
  error: string | null;
  lastUpdated: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface PagedResponse<T> {
  data: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}
