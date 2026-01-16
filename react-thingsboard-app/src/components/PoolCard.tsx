import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import type { PoolInfo } from "../types";

interface PoolCardProps {
  pool: PoolInfo;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool }) => {
  const getUnitForKey = (key: string): string => {
    const unitMap: Record<string, string> = {
      temperature: "°C",
      ph: "pH",
      turbidity: "NTU",
    };
    return unitMap[key] || "";
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
          {pool.name}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Chip
            label={pool.pumpStatus ? "Pump: ON" : "Pump: OFF"}
            color={pool.pumpStatus ? "success" : "default"}
            variant="outlined"
            size="small"
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {pool.sensors.length > 0 ? (
            pool.sensors.map((sensor, index) => (
              <Box
                key={index}
                sx={{
                  p: 1.5,
                  bgcolor: "#f5f5f5",
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  {sensor.key.charAt(0).toUpperCase() + sensor.key.slice(1)}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {sensor.value} {getUnitForKey(sensor.key)}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No sensor data available
            </Typography>
          )}
        </Box>

        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ mt: 2, display: "block" }}
        >
          Last updated: {new Date(pool.lastUpdate).toLocaleTimeString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PoolCard;
