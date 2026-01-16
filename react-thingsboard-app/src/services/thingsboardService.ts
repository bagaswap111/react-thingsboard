import axios from "axios";
import type { AxiosInstance } from "axios";
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  User,
  Device,
  TelemetryData,
  HistoricalData,
  HistoricalDataPoint,
  DateRange,
} from "../types";

// Configuration - Update these with your ThingsBoard CE instance
const API_BASE_URL =
  import.meta.env.VITE_THINGSBOARD_URL || "http://localhost:8080/api";
const MQTT_URL = import.meta.env.VITE_MQTT_URL || "mqtt://localhost:1883";

class ThingsboardService {
  private api: AxiosInstance;
  private token: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          if (this.refreshToken) {
            try {
              const response = await this.refreshAuthToken();
              this.token = response.token;
              this.refreshToken = response.refreshToken;
              originalRequest.headers.Authorization = `Bearer ${this.token}`;
              return this.api(originalRequest);
            } catch (refreshError) {
              this.logout();
              return Promise.reject(refreshError);
            }
          }
        }
        return Promise.reject(error);
      }
    );

    this.loadTokenFromStorage();
  }

  // Load token from localStorage on initialization
  private loadTokenFromStorage() {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    if (token && refreshToken) {
      this.token = token;
      this.refreshToken = refreshToken;
    }
  }

  // Authentication Methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>(
        "/auth/login",
        credentials
      );
      this.token = response.data.token;
      this.refreshToken = response.data.refreshToken;

      // Save to localStorage
      localStorage.setItem("token", this.token);
      localStorage.setItem("refreshToken", this.refreshToken);

      return response.data;
    } catch (error) {
      throw this.handleError(error, "Login failed");
    }
  }

  async signup(data: SignupRequest): Promise<User> {
    try {
      // ThingsBoard CE uses different endpoint for user registration
      const response = await this.api.post<User>("/auth/signup", {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        authority: "CUSTOMER_USER",
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Signup failed");
    }
  }

  async refreshAuthToken(): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>("/auth/refresh", {
        refreshToken: this.refreshToken,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Token refresh failed");
    }
  }

  logout() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  }

  // User Methods
  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.api.get<User>("/user/profile");
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch user profile");
    }
  }

  // Device Methods
  async getDevices(
    pageSize: number = 100,
    page: number = 0
  ): Promise<Device[]> {
    try {
      const response = await this.api.get<{ data: Device[] }>(
        "/tenant/devices",
        {
          params: {
            pageSize,
            page,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch devices");
    }
  }

  async getDeviceById(deviceId: string): Promise<Device> {
    try {
      const response = await this.api.get<Device>(`/device/${deviceId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch device");
    }
  }

  async getDevicesByType(
    type: string,
    pageSize: number = 100
  ): Promise<Device[]> {
    try {
      const allDevices = await this.getDevices(pageSize);
      return allDevices.filter((device) => device.type === type);
    } catch (error) {
      throw this.handleError(error, "Failed to fetch devices by type");
    }
  }

  // Telemetry Methods
  async getLatestTelemetry(
    deviceId: string,
    keys: string[]
  ): Promise<TelemetryData> {
    try {
      const response = await this.api.get<TelemetryData>(
        `/plugins/telemetry/DEVICE/${deviceId}/values/timeseries`,
        {
          params: {
            keys: keys.join(","),
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch telemetry");
    }
  }

  async getHistoricalTelemetry(
    deviceId: string,
    key: string,
    dateRange: DateRange,
    limit: number = 1000
  ): Promise<HistoricalDataPoint[]> {
    try {
      const response = await this.api.get<TelemetryData>(
        `/plugins/telemetry/DEVICE/${deviceId}/values/timeseries`,
        {
          params: {
            keys: key,
            startTs: dateRange.startTime,
            endTs: dateRange.endTime,
            limit,
            agg: "NONE",
          },
        }
      );

      const dataPoints = response.data[key] || [];
      return dataPoints.map(([timestamp, value]) => ({
        timestamp,
        value:
          typeof value === "string" ? parseFloat(value) : (value as number),
      }));
    } catch (error) {
      throw this.handleError(error, "Failed to fetch historical telemetry");
    }
  }

  async getHistoricalData(
    deviceId: string,
    key: string,
    dateRange: DateRange,
    device?: Device
  ): Promise<HistoricalData> {
    try {
      const dataPoints = await this.getHistoricalTelemetry(
        deviceId,
        key,
        dateRange
      );
      return {
        deviceId,
        deviceName: device?.name || "Unknown Device",
        key,
        dataPoints,
        unit: this.getUnitForKey(key),
      };
    } catch (error) {
      throw this.handleError(error, "Failed to fetch historical data");
    }
  }

  // Device Control Methods
  async sendCommand(
    deviceId: string,
    method: string,
    params: unknown
  ): Promise<void> {
    try {
      await this.api.post(`/plugins/rpc/oneway/DEVICE/${deviceId}`, {
        method,
        params,
      });
    } catch (error) {
      throw this.handleError(error, "Failed to send command");
    }
  }

  async sendRpcCommand(
    deviceId: string,
    method: string,
    params: unknown
  ): Promise<unknown> {
    try {
      const response = await this.api.post(
        `/plugins/rpc/twoway/DEVICE/${deviceId}`,
        {
          method,
          params,
        },
        {
          timeout: 30000,
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to send RPC command");
    }
  }

  async setPumpStatus(deviceId: string, status: "on" | "off"): Promise<void> {
    try {
      await this.sendCommand(deviceId, "setPumpStatus", { status });
    } catch (error) {
      throw this.handleError(error, "Failed to set pump status");
    }
  }

  // Utility Methods
  private getUnitForKey(key: string): string {
    const keyLower = key.toLowerCase();
    const unitMap: Record<string, string> = {
      temperature: "°C",
      humidity: "%",
      pressure: "hPa",
      power: "W",
      energy: "kWh",
      voltage: "V",
      current: "A",
      frequency: "Hz",
      flowrate: "L/min",
      ph: "pH",
      turbidity: "NTU",
    };

    for (const [unit, symbol] of Object.entries(unitMap)) {
      if (keyLower.includes(unit)) {
        return symbol;
      }
    }
    return "";
  }

  private handleError(error: unknown, message: string): Error {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data as { message?: string };
      const errorMessage = responseData?.message || error.message;

      if (status === 401) {
        this.logout();
        return new Error("Authentication failed. Please login again.");
      }

      return new Error(`${message}: ${errorMessage}`);
    }

    if (error instanceof Error) {
      return error;
    }

    return new Error(message);
  }

  // Helper method to check if authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  getMqttUrl(): string {
    return MQTT_URL;
  }
}

export const thingsboardService = new ThingsboardService();
export default ThingsboardService;
