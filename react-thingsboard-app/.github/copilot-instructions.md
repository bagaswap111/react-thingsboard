# ThingsBoard IoT Dashboard - Development Guide

This is a React TypeScript application for monitoring and controlling IoT devices connected to ThingsBoard CE.

## Project Setup Checklist

- [x] React + TypeScript project initialized with Vite
- [x] Core dependencies installed (React Router, Zustand, Material-UI, Recharts, Axios, MQTT)
- [x] TypeScript types defined for all entities
- [x] Authentication service with token management
- [x] State management stores for Auth, Devices, and Dashboard
- [x] Login and Signup pages
- [x] Protected routing
- [x] Dashboard with device monitoring
- [x] Pump control interface
- [x] Energy meter display
- [x] Historical data visualization
- [x] All TypeScript errors resolved
- [x] Material-UI components properly configured

## Getting Started

### Prerequisites

- Node.js 18.14.0+ (Recommended: 20.19.0+)
- ThingsBoard CE instance running (locally or remote)
- npm or yarn package manager

### Installation Steps

1. Navigate to project directory:

```bash
cd react-thingsboard-app
```

2. Install dependencies (already done):

```bash
npm install
```

3. Configure ThingsBoard connection:
   Edit `.env` file with your ThingsBoard instance details:

```
VITE_THINGSBOARD_URL=http://your-thingsboard-host:8080/api
VITE_MQTT_URL=mqtt://your-mqtt-host:1883
```

4. Start development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

- `src/components/` - Reusable React components
- `src/pages/` - Page-level components
- `src/services/` - ThingsBoard API service
- `src/store/` - Zustand state management
- `src/types/` - TypeScript interfaces
- `.env` - Environment configuration

## Key Features

1. **Authentication** - Login/Signup with token-based auth
2. **Device Monitoring** - Real-time display of sensors
3. **Device Control** - Remote pump control
4. **Data Visualization** - Historical trends with charts
5. **Responsive UI** - Mobile-friendly Material-UI components

## Debugging

To debug the application:

1. Open VS Code integrated terminal
2. Run: `npm run dev`
3. Open browser at http://localhost:5173
4. Open browser DevTools (F12)
5. Set breakpoints in TypeScript files directly

## Building for Production

```bash
npm run build
npm run preview  # Preview build locally
```

## Troubleshooting

**Cannot connect to ThingsBoard:**

- Check VITE_THINGSBOARD_URL in .env
- Verify ThingsBoard is running
- Check CORS settings on ThingsBoard

**Login fails:**

- Verify user exists in ThingsBoard
- Check credentials are correct
- Check Network tab for API errors

**No devices showing:**

- Create devices in ThingsBoard
- Ensure correct device type names
- Verify device has telemetry data

## Next Steps for Enhancement

- Implement real-time MQTT updates
- Add custom dashboard builder
- Add data export functionality
- Implement alerts and notifications
- Add dark mode support
- Improve mobile responsiveness

## Documentation

- [ThingsBoard CE Documentation](https://thingsboard.io/docs/)
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
