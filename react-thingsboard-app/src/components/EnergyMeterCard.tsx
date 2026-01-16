import { Card, CardContent, Typography, Box } from "@mui/material";
import type { EnergyMeter } from "../types";

interface EnergyMeterCardProps {
  meter: EnergyMeter;
}

const EnergyMeterCard: React.FC<EnergyMeterCardProps> = ({ meter }) => {
  const formatValue = (value: number | undefined, decimals: number = 2) => {
    if (value === undefined) return "N/A";
    return value.toFixed(decimals);
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
          {meter.name}
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Box sx={{ p: 1.5, bgcolor: "#e3f2fd", borderRadius: 1 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
              Current Power
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {formatValue(meter.currentPower)} W
            </Typography>
          </Box>

          <Box sx={{ p: 1.5, bgcolor: "#f3e5f5", borderRadius: 1 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
              Total Consumption
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {formatValue(meter.totalConsumption)} kWh
            </Typography>
          </Box>

          {meter.voltage && (
            <Box sx={{ p: 1.5, bgcolor: "#e8f5e9", borderRadius: 1 }}>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ mb: 0.5 }}
              >
                Voltage
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {formatValue(meter.voltage)} V
              </Typography>
            </Box>
          )}

          {meter.current && (
            <Box sx={{ p: 1.5, bgcolor: "#fff3e0", borderRadius: 1 }}>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ mb: 0.5 }}
              >
                Current
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {formatValue(meter.current)} A
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default EnergyMeterCard;
