import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import { useAuthStore } from "../store";
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleProfileClose();
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Historical Data", path: "/historical" },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => navigate("/dashboard")}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              ThingsBoard IoT
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                color={
                  location.pathname === item.path ? "secondary" : "inherit"
                }
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            ))}

            {user && (
              <>
                <Button color="inherit" onClick={handleProfileClick}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      mr: 1,
                      bgcolor: "#ff9800",
                    }}
                  >
                    {user.firstName?.charAt(0).toUpperCase()}
                  </Avatar>
                  {user.firstName} {user.lastName}
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileClose}
                >
                  <MenuItem disabled>
                    <Typography variant="body2">{user.email}</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1 }}>{children}</Box>

      <Box component="footer" sx={{ bgcolor: "#f5f5f5", py: 3, mt: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="textSecondary" align="center">
            © 2026 ThingsBoard IoT Dashboard. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};
