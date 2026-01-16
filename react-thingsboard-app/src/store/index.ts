import { create } from "zustand";
import type {
  User,
  Device,
  PoolInfo,
  PumpController,
  EnergyMeter,
  SensorReading,
} from "../types";
import { thingsboardService } from "../services/thingsboardService";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  login: (username: string, password: string) => Promise<void>;
  signup: (
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  fetchCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const response = await thingsboardService.login({ username, password });
      set({
        token: response.token,
        isAuthenticated: true,
        loading: false,
      });

      // Fetch user profile after login
      const user = await thingsboardService.getCurrentUser();
      set({ user });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      set({
        error: message,
        loading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  signup: async (
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ) => {
    set({ loading: true, error: null });
    try {
      await thingsboardService.signup({
        email,
        firstName,
        lastName,
        password,
      });
      set({ loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed";
      set({
        error: message,
        loading: false,
      });
      throw error;
    }
  },

  logout: () => {
    thingsboardService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),

  fetchCurrentUser: async () => {
    try {
      const user = await thingsboardService.getCurrentUser();
      set({ user });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch user";
      set({ error: message });
    }
  },
}));

interface DeviceStore {
  devices: Device[];
  poolDevices: Device[];
  pumpDevices: Device[];
  energyMeterDevices: Device[];
  loading: boolean;
  error: string | null;

  fetchDevices: () => Promise<void>;
  fetchDevicesByType: (type: string) => Promise<Device[]>;
  clearError: () => void;
}

export const useDeviceStore = create<DeviceStore>((set) => ({
  devices: [],
  poolDevices: [],
  pumpDevices: [],
  energyMeterDevices: [],
  loading: false,
  error: null,

  fetchDevices: async () => {
    set({ loading: true, error: null });
    try {
      const devices = await thingsboardService.getDevices();
      set({
        devices,
        loading: false,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch devices";
      set({
        error: message,
        loading: false,
      });
    }
  },

  fetchDevicesByType: async (type: string) => {
    try {
      return await thingsboardService.getDevicesByType(type);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch devices";
      set({ error: message });
      return [];
    }
  },

  clearError: () => set({ error: null }),
}));

interface DashboardStore {
  pools: PoolInfo[];
  pumps: PumpController[];
  energyMeters: EnergyMeter[];
  sensorReadings: SensorReading[];
  loading: boolean;
  error: string | null;
  lastUpdated: number;

  fetchDashboardData: () => Promise<void>;
  updatePoolData: (poolId: string, data: Partial<PoolInfo>) => void;
  updatePumpStatus: (pumpId: string, status: "on" | "off" | "error") => void;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  pools: [],
  pumps: [],
  energyMeters: [],
  sensorReadings: [],
  loading: false,
  error: null,
  lastUpdated: 0,

  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      // Fetch devices by type
      const [poolDevices, pumpDevices, energyDevices] = await Promise.all([
        thingsboardService.getDevicesByType("pool"),
        thingsboardService.getDevicesByType("pump"),
        thingsboardService.getDevicesByType("energy_meter"),
      ]);

      // Fetch telemetry for each device type
      const pools: PoolInfo[] = await Promise.all(
        poolDevices.map(async (device) => {
          try {
            const telemetry = await thingsboardService.getLatestTelemetry(
              device.id,
              ["temperature", "ph", "turbidity"]
            );

            const sensors: SensorReading[] = Object.entries(telemetry).flatMap(
              ([key, values]) =>
                values.map(([timestamp, value]) => ({
                  deviceId: device.id,
                  deviceName: device.name,
                  key,
                  value,
                  timestamp,
                }))
            );

            return {
              id: device.id,
              name: device.name,
              type: "pool" as const,
              sensors,
              pumpStatus: false,
              lastUpdate: Date.now(),
            };
          } catch {
            return {
              id: device.id,
              name: device.name,
              type: "pool" as const,
              sensors: [],
              pumpStatus: false,
              lastUpdate: Date.now(),
            };
          }
        })
      );

      const pumps: PumpController[] = await Promise.all(
        pumpDevices.map(async (device) => {
          try {
            const telemetry = await thingsboardService.getLatestTelemetry(
              device.id,
              ["status", "power", "flowRate"]
            );

            const status = (telemetry.status?.[0]?.[1] as string) || "off";

            return {
              id: device.id,
              name: device.name,
              type: "pump" as const,
              status: (status.toLowerCase() as "on" | "off" | "error") || "off",
              power: telemetry.power?.[0]?.[1] as number | undefined,
              flowRate: telemetry.flowRate?.[0]?.[1] as number | undefined,
            };
          } catch {
            return {
              id: device.id,
              name: device.name,
              type: "pump" as const,
              status: "error" as const,
            };
          }
        })
      );

      const energyMeters: EnergyMeter[] = await Promise.all(
        energyDevices.map(async (device) => {
          try {
            const telemetry = await thingsboardService.getLatestTelemetry(
              device.id,
              ["totalEnergy", "power", "voltage", "current"]
            );

            return {
              id: device.id,
              name: device.name,
              type: "energy_meter" as const,
              totalConsumption:
                (telemetry.totalEnergy?.[0]?.[1] as number) || 0,
              currentPower: (telemetry.power?.[0]?.[1] as number) || 0,
              voltage: telemetry.voltage?.[0]?.[1] as number | undefined,
              current: telemetry.current?.[0]?.[1] as number | undefined,
            };
          } catch {
            return {
              id: device.id,
              name: device.name,
              type: "energy_meter" as const,
              totalConsumption: 0,
              currentPower: 0,
            };
          }
        })
      );

      set({
        pools,
        pumps,
        energyMeters,
        loading: false,
        lastUpdated: Date.now(),
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch dashboard data";
      set({
        error: message,
        loading: false,
      });
    }
  },

  updatePoolData: (poolId: string, data: Partial<PoolInfo>) => {
    const { pools } = get();
    const updatedPools = pools.map((pool) =>
      pool.id === poolId ? { ...pool, ...data } : pool
    );
    set({ pools: updatedPools });
  },

  updatePumpStatus: (pumpId: string, status: "on" | "off" | "error") => {
    const { pumps } = get();
    const updatedPumps = pumps.map((pump) =>
      pump.id === pumpId ? { ...pump, status } : pump
    );
    set({ pumps: updatedPumps });
  },

  clearError: () => set({ error: null }),
}));
