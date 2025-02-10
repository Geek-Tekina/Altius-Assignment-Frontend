import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/tickets");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div
      style={{
        height: "100vh", // Full height
        width: "100vh",
        display: "flex",
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        backgroundColor: "grey",
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              width: "100%",
              borderRadius: 3, // More rounded corners
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow
              background: "linear-gradient(to bottom, #ffffff, #f8f9fa)", // Soft gradient
            }}
          >
            <Typography
              component="h1"
              variant="h5"
              align="center"
              fontWeight="bold"
            >
              Login
            </Typography>

            {error && (
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ borderRadius: 1 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ borderRadius: 1 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.2,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  background: "linear-gradient(45deg, #007BFF, #0056b3)", // Nice blue gradient
                  "&:hover": {
                    background: "linear-gradient(45deg, #0056b3, #00408a)",
                    transform: "scale(1.02)",
                    transition: "0.2s ease-in-out",
                  },
                }}
              >
                Sign In
              </Button>

              <Typography align="center" sx={{ mt: 2, fontSize: "0.9rem" }}>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{
                    color: "#007BFF",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Register
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </div>
  );
}

export default Login;
