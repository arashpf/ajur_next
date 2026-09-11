import { Box, Paper, Typography } from "@mui/material";

export default function SpecialDetails({ data }) {
    return (
      <Paper sx={{ p: 3 }}>
        <p variant="h6" gutterBottom> پلن ویژه</p>
  
        <p>شروع در تاریخ: {data.start_date}</p>
        <p>پایان در تاریخ: {data.end_date}</p>
        <p>    روزهای باقی مانده : {data.remaining_days}</p>
      </Paper>
    );
  }
  