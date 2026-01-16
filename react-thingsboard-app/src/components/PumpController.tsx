import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import type { PumpController as PumpControllerType } from "../types";
import { thingsboardService } from "../services/thingsboardService";
import { useDashboardStore } from "../store";

interface PumpControllerProps {
  pump: PumpControllerType;
}

const PumpController: React.FC<PumpControllerProps> = ({ pump }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updatePumpStatus } = useDashboardStore();

  const handleTogglePump = async (action: "on" | "off") => {
    setLoading(true);
    setError(null);

    try {
      await thingsboardService.setPumpStatus(pump.id, action);
      updatePumpStatus(pump.id, action);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update pump status";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on":
        return "success";
      case "off":
        return "default";
      case "error":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          {pump.name}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Chip
            label={`Status: ${pump.status.toUpperCase()}`}
            color={getStatusColor(pump.status)}
            variant="outlined"
            size="small"
          />
        </Box>

        {pump.power && (
          <Box sx={{ mb: 2, p: 1.5, bgcolor: "#f5f5f5", borderRadius: 1 }}>
            <Typography variant="body2" color="textSecondary">
              Power
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {pump.power} W
            </Typography>
          </Box>
        )}

        {pump.flowRate && (
          <Box sx={{ mb: 2, p: 1.5, bgcolor: "#f5f5f5", borderRadius: 1 }}>
            <Typography variant="body2" color="textSecondary">
              Flow Rate
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {pump.flowRate} L/min
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
          <Button
            fullWidth
            variant={pump.status === "on" ? "contained" : "outlined"}
            color="success"
            size="small"
            onClick={() => handleTogglePump("on")}
            disabled={loading || pump.status === "on"}
          >
            {loading ? <CircularProgress size={20} /> : "Turn On"}
          </Button>
          <Button
            fullWidth
            variant={pump.status === "off" ? "contained" : "outlined"}
            color="error"
            size="small"
            onClick={() => handleTogglePump("off")}
            disabled={loading || pump.status === "off"}
          >
            {loading ? <CircularProgress size={20} /> : "Turn Off"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PumpController;
