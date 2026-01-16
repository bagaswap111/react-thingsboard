# Setup Instructions

## ThingsBoard IoT Dashboard - Complete Setup Guide

This guide will help you get the React TypeScript application up and running with ThingsBoard CE.

## Prerequisites

Before you start, ensure you have:

1. **Node.js** (v18.14.0 or higher)

   ```bash
   node --version
   ```

2. **npm** (v9.x or higher)

   ```bash
   npm --version
   ```

3. **ThingsBoard CE** running locally or remotely

   - Default URL: `http://localhost:8080`
   - [Installation Guide](https://thingsboard.io/docs/installation/)

4. **Text Editor/IDE**
   - VS Code (recommended)
   - WebStorm
   - Sublime Text

## Step-by-Step Setup

### Step 1: Project Directory

Navigate to the project folder:

```bash
cd react-thingsboard-app
```

### Step 2: Install Dependencies

Dependencies are already installed, but to verify or reinstall:

```bash
npm install
```

This installs:

- React 18
- TypeScript
- Vite
- Material-UI
- Zustand
- Axios
- React Router
- Recharts
- MQTT

### Step 3: Configure Environment Variables

The `.env` file is already created with default settings.

**For local ThingsBoard** (no changes needed):

```
VITE_THINGSBOARD_URL=http://localhost:8080/api
VITE_MQTT_URL=mqtt://localhost:1883
```

**For remote ThingsBoard**, edit `.env`:

```
VITE_THINGSBOARD_URL=http://your-domain.com:8080/api
VITE_MQTT_URL=mqtt://your-domain.com:1883
```

**For Docker environment**:

```
VITE_THINGSBOARD_URL=http://thingsboard-container:8080/api
VITE_MQTT_URL=mqtt://thingsboard-container:1883
```

### Step 4: Verify ThingsBoard Connection

Test if ThingsBoard is reachable:

```bash
# For local
curl http://localhost:8080/api/user/profile

# For remote
curl http://your-host:8080/api/user/profile
```

You should get a 401 response (expected without auth).

### Step 5: Create Test User (if needed)

1. Open `http://localhost:8080` in browser
2. Go to Admin > Tenants > Create Tenant
3. Create customer user with credentials
4. Remember these for login testing

### Step 6: Start Development Server

```bash
npm run dev
```

Expected output:

```
  VITE v7.3.1  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### Step 7: Access Application

Open in browser:

```
http://localhost:5173
```

You should see:

- Login page with form
- Signup link at bottom
- ThingsBoard IoT Dashboard title

### Step 8: Login

1. Enter your ThingsBoard credentials
2. Click "Login"
3. Should redirect to Dashboard
4. If no devices, will show "No devices found" message

## Setting Up Test Devices

To see the dashboard in action, create test devices in ThingsBoard:

### Method 1: ThingsBoard Admin Panel

1. Login to `http://localhost:8080`
2. Go to **Devices**
3. Click **"+"** to add device

### Create Pool Device

- **Name**: Pool 1
- **Type**: Pool
- **Add telemetry**: Temperature, pH, Turbidity

### Create Pump Device

- **Name**: Main Pump
- **Type**: Pump
- **Add telemetry**: Status, Power, FlowRate

### Create Energy Meter

- **Name**: Power Meter
- **Type**: Energy_Meter
- **Add telemetry**: TotalEnergy, Power, Voltage, Current

### Method 2: MQTT Test Data

Send test data via MQTT:

```bash
# Install mosquitto-clients
brew install mosquitto-clients  # macOS
apt install mosquitto-clients   # Ubuntu

# Subscribe to topic
mosquitto_sub -h localhost -t "v1/devices/me/telemetry"

# Publish test data (in another terminal)
mosquitto_pub -h localhost -t "v1/devices/me/telemetry" -m '{"temperature": 25.5, "ph": 7.2, "turbidity": 0.8}'
```

## Development Workflow

### Hot Module Replacement (HMR)

Changes are automatically reflected:

```bash
npm run dev
```

Just edit files and save - browser refreshes automatically.

### TypeScript Checking

Check for type errors:

```bash
npm run lint  # if available
```

### Building

Create production build:

```bash
npm run build
```

Output goes to `dist/` directory.

### Preview Production Build

Test the production build locally:

```bash
npm run preview
```

Opens at `http://localhost:4173` (by default).

## File Structure Explanation

```
src/
├── App.tsx                 # Main component with routing
├── main.tsx               # React DOM entry point
├── components/
│   ├── Layout.tsx         # App header and navigation
│   ├── PoolCard.tsx       # Pool sensor component
│   ├── PumpController.tsx # Pump control component
│   ├── EnergyMeterCard.tsx # Energy display component
│   └── ProtectedRoute.tsx # Authentication wrapper
├── pages/
│   ├── LoginPage.tsx      # Login form and logic
│   ├── SignupPage.tsx     # Signup form and logic
│   ├── DashboardPage.tsx  # Main monitoring dashboard
│   └── HistoricalDataPage.tsx # Historical data charts
├── services/
│   └── thingsboardService.ts # All API calls
├── store/
│   └── index.ts           # Zustand stores (Auth, Device, Dashboard)
├── types/
│   └── index.ts           # TypeScript interfaces
└── utils/                 # Utility functions (if any)
```

## Common Issues & Solutions

### Issue: "Cannot GET /"

**Solution**: Your dev server isn't running. Run `npm run dev`

### Issue: "Connection refused" on ThingsBoard

**Solution**:

- Check ThingsBoard is running
- Verify URL in `.env`
- Check firewall/network settings
- Try in browser: `http://localhost:8080`

### Issue: "Login fails immediately"

**Solution**:

- Verify user exists in ThingsBoard
- Check credentials are correct
- Try admin login first
- Check browser console for error details

### Issue: "No devices showing"

**Solution**:

- Create devices in ThingsBoard admin panel
- Use correct device types: pool, pump, energy_meter
- Ensure devices have telemetry data
- Refresh browser

### Issue: "Port 5173 already in use"

**Solution**:

```bash
# Kill process using port 5173
lsof -i :5173
kill -9 <PID>

# Or use different port
npm run dev -- --port 3000
```

### Issue: TypeScript errors

**Solution**:

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Check tsconfig.json
npm run type-check  # if available
```

## Browser DevTools

### Debugging React Components

1. Install **React Developer Tools** extension
2. Open DevTools: F12 or Cmd+Option+I
3. Go to **Components** tab
4. Inspect component state

### Debugging Network

1. Open DevTools: F12
2. Go to **Network** tab
3. Login to see API calls
4. Check responses and headers

### Console

Check for JavaScript errors:

```javascript
// In browser console
localStorage.getItem("token"); // Check if logged in
localStorage.removeItem("token"); // Clear session
```

## Deployment

### Build for Production

```bash
npm run build
```

Creates optimized files in `dist/` folder.

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel login
vercel deploy
```

### Deploy to GitHub Pages

```bash
# Set homepage in package.json first
npm run build
# Deploy dist/ contents to gh-pages branch
```

### Deploy to Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

Build and run:

```bash
docker build -t react-thingsboard .
docker run -p 3000:3000 react-thingsboard
```

## Environment Variables Reference

| Variable               | Description              | Example                     |
| ---------------------- | ------------------------ | --------------------------- |
| `VITE_THINGSBOARD_URL` | ThingsBoard API endpoint | `http://localhost:8080/api` |
| `VITE_MQTT_URL`        | MQTT broker URL          | `mqtt://localhost:1883`     |

## Performance Tips

1. **Development**

   - Use React DevTools Profiler
   - Monitor Network tab
   - Check Bundle size: `npm run build -- --analyze`

2. **Production**

   - Enable compression
   - Use CDN for static files
   - Implement caching headers
   - Minimize external requests

3. **Code**
   - Lazy load routes
   - Memoize expensive components
   - Optimize re-renders
   - Use virtualization for long lists

## Security Considerations

1. **Never commit `.env`**

   - Add to `.gitignore` (already done)
   - Use `.env.example` for template

2. **CORS Configuration**

   - ThingsBoard may need CORS enabled
   - Configure in `thingsboard.yml`

3. **HTTPS in Production**

   - Always use HTTPS
   - Get SSL certificate (Let's Encrypt)
   - Update URLs in `.env`

4. **Token Security**
   - Tokens stored in localStorage
   - Auto-refresh before expiry
   - Clear on logout

## Getting Help

1. **Check Documentation**

   - README.md - Full documentation
   - QUICKSTART.md - Quick reference
   - PROJECT_SUMMARY.md - Project overview

2. **Check Logs**

   - Browser Console: F12
   - Network Tab: Check API responses
   - Terminal: Check npm output

3. **External Resources**
   - [ThingsBoard Docs](https://thingsboard.io/docs/)
   - [React Docs](https://react.dev/)
   - [Material-UI Docs](https://mui.com/)

## Next: Running the Application

Once setup is complete:

```bash
npm run dev
```

Then visit `http://localhost:5173` and login!

Happy developing! 🚀
