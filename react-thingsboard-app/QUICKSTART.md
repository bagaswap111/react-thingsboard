# Quick Start Guide

## ThingsBoard IoT Dashboard Setup

This is a fully functional React + TypeScript application for monitoring IoT devices through ThingsBoard CE.

## What's Included

✅ **Complete React TypeScript Setup**

- Modern Vite build tool
- TypeScript with strict type checking
- All dependencies installed

✅ **Features Implemented**

- User Authentication (Login/Signup)
- Dashboard with real-time device monitoring
- Pool sensor displays (temperature, pH, turbidity)
- Pump control interface (on/off commands)
- Energy meter monitoring
- Historical data visualization with interactive charts
- Protected routes

✅ **Technology Stack**

- React 18
- TypeScript
- Material-UI for components
- Zustand for state management
- Recharts for data visualization
- Axios for HTTP requests
- React Router for navigation

## Quick Start

### 1. Verify Environment

```bash
node --version  # Should be 18.14.0+
npm --version
```

### 2. Install & Run

```bash
# Dependencies are already installed, but if needed:
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

### 3. Configure ThingsBoard

Update `.env` file with your ThingsBoard instance:

```
VITE_THINGSBOARD_URL=http://localhost:8080/api
VITE_MQTT_URL=mqtt://localhost:1883
```

### 4. Create Test Devices (Optional)

For testing, create devices in ThingsBoard with these types:

- **Pool** devices with keys: `temperature`, `ph`, `turbidity`
- **Pump** devices with keys: `status`, `power`, `flowRate`
- **Energy Meter** devices with keys: `totalEnergy`, `power`, `voltage`, `current`

### 5. Login

- Use your ThingsBoard credentials
- First time? Create an account on the signup page

## File Organization

```
src/
├── App.tsx                 # Main app with routing
├── components/
│   ├── Layout.tsx         # App layout with nav
│   ├── PoolCard.tsx       # Pool display component
│   ├── PumpController.tsx # Pump control component
│   ├── EnergyMeterCard.tsx # Energy display component
│   ├── ProtectedRoute.tsx # Auth guard
│   └── Layout.tsx         # Main layout
├── pages/
│   ├── LoginPage.tsx      # Login form
│   ├── SignupPage.tsx     # Signup form
│   ├── DashboardPage.tsx  # Main dashboard
│   └── HistoricalDataPage.tsx # Data charts
├── services/
│   └── thingsboardService.ts # API integration
├── store/
│   └── index.ts           # Zustand stores
├── types/
│   └── index.ts           # TypeScript definitions
└── main.tsx               # Entry point
```

## Key Functionality

### Authentication

- Login with ThingsBoard credentials
- Automatic token refresh
- Session persistence
- Logout on 401 errors

### Dashboard

- Auto-refreshes every 30 seconds
- Shows all connected devices
- Displays real-time sensor values
- Pump control with visual feedback

### Historical Data

- Select any device and metric
- Choose date range
- View trend visualization
- Download data points

## API Endpoints Used

The application connects to ThingsBoard using these endpoints:

- `/auth/login` - User authentication
- `/user/profile` - Get current user
- `/tenant/devices` - List devices
- `/plugins/telemetry/DEVICE/{id}/values/timeseries` - Get sensor data
- `/plugins/rpc/oneway/DEVICE/{id}` - Send device commands

## Environment Variables

Available in `.env`:

```
VITE_THINGSBOARD_URL=http://localhost:8080/api
VITE_MQTT_URL=mqtt://localhost:1883
```

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run TypeScript type check
npm run type-check  # if available
```

## Troubleshooting

### "Cannot connect to ThingsBoard"

1. Verify ThingsBoard is running
2. Check VITE_THINGSBOARD_URL is correct
3. Try http://localhost:8080 in browser first

### "Login fails"

1. Check user exists in ThingsBoard
2. Verify username/password
3. Check browser DevTools Network tab

### "No devices showing"

1. Create devices in ThingsBoard admin panel
2. Use exact type names: pool, pump, energy_meter
3. Send test telemetry data to devices

### CORS Errors

ThingsBoard may need CORS configuration. Update in thingsboard.yml:

```yaml
server:
  netty:
    additionalHttpHeadersFromConfig:
      Access-Control-Allow-Origin: "*"
```

## Next Steps

1. **Test the Dashboard**

   - Create test devices in ThingsBoard
   - Send sensor data via MQTT
   - View real-time updates

2. **Customize Components**

   - Modify colors in Theme (App.tsx)
   - Add new sensors in PoolCard
   - Extend device types

3. **Deploy**
   - Run `npm run build`
   - Deploy `dist/` folder to web server
   - Update production .env variables

## Support & Documentation

- **ThingsBoard Docs**: https://thingsboard.io/docs/
- **React Docs**: https://react.dev/
- **Material-UI**: https://mui.com/
- **Zustand**: https://github.com/pmndrs/zustand

## Technical Notes

- Uses TypeScript in strict mode
- All requests include authentication token
- Automatic token refresh on 401 response
- Error boundaries and error states for all async operations
- Responsive Material-UI components for all screen sizes
- State management with Zustand for simplicity
- Vite for fast development and optimized builds

Enjoy building with ThingsBoard and React! 🚀
