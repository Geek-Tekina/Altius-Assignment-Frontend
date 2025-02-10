import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Chat as ChatIcon, Edit as EditIcon } from "@mui/icons-material";

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [noteContent, setNoteContent] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchTickets();
  }, [user]);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const endpoint =
        user?.role === "customer"
          ? "https://altius-assignment-backend-s6ct.onrender.com/api/tickets/my-tickets"
          : "https://altius-assignment-backend-s6ct.onrender.com/api/tickets/all-tickets";

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://altius-assignment-backend-s6ct.onrender.com/api/tickets/add/${selectedTicket._id}/notes`,
        { content: noteContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNoteContent("");
      fetchTickets();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `https://altius-assignment-backend-s6ct.onrender.com/api/tickets/update-status/${ticketId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTickets();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "primary";
      case "Pending":
        return "warning";
      case "Closed":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tickets
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticket ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              {user?.role !== "customer" && <TableCell>Customer</TableCell>}
              <TableCell>Last Updated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket._id}>
                <TableCell>{ticket.ticketId}</TableCell>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>
                  {user?.role === "customer" ? (
                    <Chip
                      label={ticket.status}
                      color={getStatusColor(ticket.status)}
                    />
                  ) : (
                    <FormControl size="small">
                      <Select
                        value={ticket.status}
                        onChange={(e) =>
                          handleStatusChange(ticket._id, e.target.value)
                        }
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Closed">Closed</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </TableCell>
                {user?.role !== "customer" && (
                  <TableCell>{ticket.customer?.name}</TableCell>
                )}
                <TableCell>
                  {new Date(ticket.lastUpdated).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setDialogOpen(true);
                    }}
                  >
                    <ChatIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Ticket Details - {selectedTicket?.ticketId}</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            {selectedTicket?.title}
          </Typography>
          <Box mt={2}>
            <Typography variant="subtitle1" gutterBottom>
              Notes:
            </Typography>
            {selectedTicket?.notes.map((note, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  {new Date(note.createdAt).toLocaleString()}
                </Typography>
                <Typography>{note.content}</Typography>
              </Paper>
            ))}
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Add Note"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddNote} variant="contained" color="primary">
            Add Note
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TicketList;
