import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";

function CreateTicket() {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://altius-assignment-backend-s6ct.onrender.com/api/tickets/create-ticket",
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setTimeout(() => {
        navigate("/tickets");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  if (user?.role !== "customer") {
    return (
      <Typography variant="h5" align="center">
        Only customers can create tickets
      </Typography>
    );
  }

  return (
    <Box maxWidth="600px" mx="auto">
      <Typography variant="h4" gutterBottom>
        Create New Ticket
      </Typography>
      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Ticket created successfully! Redirecting...
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Ticket Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={success}
          >
            Create Ticket
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default CreateTicket;
