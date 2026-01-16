import { useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Container,
} from "@mui/material";
import { useDashboardStore } from "../store";
import PoolCard from "../components/PoolCard";
import PumpController from "../components/PumpController";
import EnergyMeterCard from "../components/EnergyMeterCard";

export const Dashboard = () => {
  const {
    pools,
    pumps,
    energyMeters,
    loading,
    error,
    fetchDashboardData,
    clearError,
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  if (error) {
    return (
      <Container>
        <Alert severity="error" onClose={clearError} sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ mb: 4, fontWeight: "bold" }}
        >
          IoT Monitoring Dashboard
        </Typography>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Pools Section */}
        {pools.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ mb: 2, fontWeight: "600" }}
            >
              Pools Monitoring
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 3,
              }}
            >
              {pools.map((pool) => (
                <PoolCard key={pool.id} pool={pool} />
              ))}
            </Box>
          </Box>
        )}

        {/* Pumps Section */}
        {pumps.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ mb: 2, fontWeight: "600" }}
            >
              Pump Control
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 3,
              }}
            >
              {pumps.map((pump) => (
                <PumpController key={pump.id} pump={pump} />
              ))}
            </Box>
          </Box>
        )}

        {/* Energy Meters Section */}
        {energyMeters.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ mb: 2, fontWeight: "600" }}
            >
              Energy Consumption
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 3,
              }}
            >
              {energyMeters.map((meter) => (
                <EnergyMeterCard key={meter.id} meter={meter} />
              ))}
            </Box>
          </Box>
        )}

        {!loading &&
          pools.length === 0 &&
          pumps.length === 0 &&
          energyMeters.length === 0 && (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="textSecondary">
                No devices found. Please configure your devices in ThingsBoard.
              </Typography>
            </Paper>
          )}
      </Container>
    </Box>
  );
};
