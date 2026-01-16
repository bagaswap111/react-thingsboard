import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  MenuItem,
} from "@mui/material";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { thingsboardService } from "../services/thingsboardService";
import { useDeviceStore } from "../store";
import type { HistoricalDataPoint } from "../types";

export const HistoricalDataPage = () => {
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [selectedKey, setSelectedKey] = useState("temperature");
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [data, setData] = useState<HistoricalDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { devices, fetchDevices } = useDeviceStore();

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const handleFetchData = async () => {
    if (!selectedDeviceId) {
      setError("Please select a device");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const startTime = new Date(startDate).getTime();
      const endTime = new Date(endDate).getTime();

      const historicalData = await thingsboardService.getHistoricalTelemetry(
        selectedDeviceId,
        selectedKey,
        { startTime, endTime },
        1000
      );

      setData(historicalData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch historical data";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const chartData = data.map((point) => ({
    time: new Date(point.timestamp).toLocaleDateString(),
    value: point.value,
    timestamp: point.timestamp,
  }));

  const commonKeys = [
    "temperature",
    "humidity",
    "pressure",
    "ph",
    "turbidity",
    "power",
    "energy",
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ mb: 3, fontWeight: "bold" }}
      >
        Historical Data
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            fullWidth
            select
            label="Select Device"
            value={selectedDeviceId}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            size="small"
          >
            {devices.map((device) => (
              <MenuItem key={device.id} value={device.id}>
                {device.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            select
            label="Select Metric"
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
            size="small"
          >
            {commonKeys.map((key) => (
              <MenuItem key={key} value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />

          <TextField
            fullWidth
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleFetchData}
            disabled={loading}
            sx={{ height: "40px" }}
          >
            {loading ? <CircularProgress size={24} /> : "Fetch Data"}
          </Button>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}
      </Paper>

      {data.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {selectedKey.charAt(0).toUpperCase() + selectedKey.slice(1)} Trend
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Data Points: {data.length}
            </Typography>
          </Box>
        </Paper>
      )}

      {!loading && data.length === 0 && !error && (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="textSecondary">
            Select a device and metric, then fetch data to see the historical
            trend
          </Typography>
        </Paper>
      )}
    </Container>
  );
};
