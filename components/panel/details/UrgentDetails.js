import { Box, Paper, Typography } from "@mui/material";

export default function UrgentDetails({ data }) {
    return (
      <Paper sx={{ p: 3 }}>
        <p variant="h6" gutterBottom>پلن فوری</p>
  
        <p>شروع : {data.start_date}</p>
        <p>پایان : {data.end_date}</p>
        <p> روزهای باقی مانده : {data.remaining_days}</p>
      </Paper>
    );
  }
  