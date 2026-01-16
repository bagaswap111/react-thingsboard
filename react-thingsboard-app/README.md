# ThingsBoard IoT Dashboard

A modern React TypeScript application that connects to ThingsBoard CE (Community Edition) for comprehensive IoT device monitoring and control.

## Features

- **Authentication System**

  - User login and signup functionality
  - Secure token-based authentication
  - Session persistence

- **Dashboard Monitoring**

  - Real-time pool sensor data display (temperature, pH, turbidity)
  - Pump controller with on/off capabilities
  - Energy meter consumption tracking
  - Live status indicators

- **Pump Control**

  - Remote on/off control for pumps
  - Real-time power and flow rate monitoring
  - Error status indication

- **Energy Monitoring**

  - Current power consumption tracking
  - Total energy consumption history
  - Voltage and current measurements

- **Historical Data Visualization**
  - Time-series charts for sensor data
  - Customizable date range selection
  - Multiple metric support
  - Area chart visualization

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **UI Components**: Material-UI (MUI)
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Routing**: React Router
- **MQTT**: JavaScript MQTT client (for real-time updates)

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Layout.tsx      # Main app layout with navigation
│   ├── PoolCard.tsx    # Pool sensor display card
│   ├── PumpController.tsx # Pump control interface
│   ├── EnergyMeterCard.tsx # Energy meter display
│   └── ProtectedRoute.tsx # Route protection wrapper
├── pages/              # Page components
│   ├── LoginPage.tsx   # User login form
│   ├── SignupPage.tsx  # User registration form
│   ├── DashboardPage.tsx # Main dashboard with device overview
│   └── HistoricalDataPage.tsx # Historical data visualization
├── services/           # API and external services
│   └── thingsboardService.ts # ThingsBoard API integration
├── store/              # Zustand state management
│   └── index.ts        # Auth, Device, and Dashboard stores
├── types/              # TypeScript interfaces
│   └── index.ts        # All type definitions
├── utils/              # Utility functions
├── App.tsx             # Main app component with routing
└── main.tsx            # React entry point
```

## Setup Instructions

### Prerequisites

- Node.js 18.14.0 or higher (Recommended: 20.19.0+)
- npm or yarn
- ThingsBoard CE instance running locally or remotely

### Installation

1. **Clone and navigate to the project**

```bash
cd react-thingsboard-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure ThingsBoard Connection**

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` with your ThingsBoard instance details:

```
VITE_THINGSBOARD_URL=http://your-thingsboard-host:8080/api
VITE_MQTT_URL=mqtt://your-mqtt-host:1883
```

For local ThingsBoard CE installation:

```
VITE_THINGSBOARD_URL=http://localhost:8080/api
VITE_MQTT_URL=mqtt://localhost:1883
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

### Building for Production

```bash
npm run build
```

The build artifacts will be in the `dist/` directory.

### Running Production Build Locally

```bash
npm run preview
```

## ThingsBoard Setup

### Required Device Types

Create the following device types in ThingsBoard:

1. **Pool Devices** (type: "pool")

   - Telemetry keys: `temperature`, `ph`, `turbidity`

2. **Pump Devices** (type: "pump")

   - Telemetry keys: `status`, `power`, `flowRate`
   - RPC Methods: `setPumpStatus(status)`

3. **Energy Meter Devices** (type: "energy_meter")
   - Telemetry keys: `totalEnergy`, `power`, `voltage`, `current`

### ThingsBoard API Endpoints Used

- `POST /auth/login` - User authentication
- `POST /auth/signup` - User registration
- `GET /auth/refresh` - Token refresh
- `GET /user/profile` - Get current user
- `GET /tenant/devices` - List devices
- `GET /device/{deviceId}` - Get device details
- `GET /plugins/telemetry/DEVICE/{deviceId}/values/timeseries` - Get telemetry data
- `POST /plugins/rpc/oneway/DEVICE/{deviceId}` - Send one-way RPC command
- `POST /plugins/rpc/twoway/DEVICE/{deviceId}` - Send two-way RPC command

## Usage

### Login

1. Navigate to the login page
2. Enter your ThingsBoard credentials
3. Click "Login"

### Dashboard

- View all connected devices organized by type
- Monitor real-time sensor readings for pools
- Control pumps with on/off buttons
- View energy consumption metrics

### Historical Data

1. Select a device from the dropdown
2. Choose the metric to visualize
3. Select date range
4. Click "Fetch Data" to see the trend

## API Integration Details

The `thingsboardService.ts` provides:

- **Authentication Management**

  - Login/Signup with token storage
  - Automatic token refresh
  - Session persistence

- **Device Operations**

  - Fetch devices by type
  - Get device details
  - Device filtering

- **Telemetry Operations**

  - Get latest sensor values
  - Fetch historical data with date range
  - Support for multiple metrics

- **Device Control**
  - Send RPC commands
  - Control pump status
  - Error handling and retries

## Error Handling

The application includes comprehensive error handling:

- HTTP error responses are caught and displayed
- Authentication errors trigger logout
- Failed API calls show user-friendly messages
- Loading states prevent duplicate submissions

## State Management with Zustand

Three main stores:

1. **useAuthStore** - User authentication and session
2. **useDeviceStore** - Device list and filtering
3. **useDashboardStore** - Real-time dashboard data

All stores include error management and loading states.

## Security Features

- Token-based authentication with refresh mechanism
- Secure token storage in localStorage
- Protected routes that require authentication
- Automatic logout on 401 responses
- CSRF protection (handled by ThingsBoard)

## Troubleshooting

### Cannot connect to ThingsBoard

- Verify VITE_THINGSBOARD_URL in `.env`
- Check if ThingsBoard is running
- Ensure CORS is enabled on ThingsBoard
- Check browser console for detailed errors

### Login fails

- Verify credentials are correct
- Check ThingsBoard user exists
- Check Network tab for API response

### No devices showing

- Create devices in ThingsBoard admin panel
- Ensure devices have correct type names (pool, pump, energy_meter)
- Check device has telemetry data
- Verify user has access to devices

### Historical data not loading

- Ensure device has historical data for the date range
- Check date format is correct
- Verify telemetry key name matches

## Performance Optimization

- Lazy loading of routes
- Memoization of components
- Efficient store updates with Zustand
- Chart virtualization for large datasets
- Auto-refresh every 30 seconds (configurable)

## Future Enhancements

- [ ] Real-time MQTT updates instead of polling
- [ ] Custom dashboard builder
- [ ] Alerts and notifications
- [ ] Data export to CSV/Excel
- [ ] Mobile responsive improvements
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Advanced filtering and search
- [ ] User profile management
- [ ] Device configuration UI

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please create an issue in the repository or contact the development team.

## Additional Resources

- [ThingsBoard Documentation](https://thingsboard.io/docs/)
- [ThingsBoard CE GitHub](https://github.com/thingsboard/thingsboard)
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
  tseslint.configs.stylisticTypeChecked,

        // Other configs...
      ],
      languageOptions: {
        parserOptions: {
          project: ['./tsconfig.node.json', './tsconfig.app.json'],
          tsconfigRootDir: import.meta.dirname,
        },
        // other options...
      },

  },
  ])

````

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
````
