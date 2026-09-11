import { Box, Paper, Typography } from "@mui/material";

export default function CallDetails({ data }) {
  return (
    <Paper sx={{ p: 3 }}>
      <p variant="h6" gutterBottom>پلن تماس</p>

      <p> تماس های خریداری شده  : {data.total}</p>
      <p>مصرف شده: {data.used}</p>
      <p>باقی مانده: {data.total - data.used}</p>
    </Paper>
  );
}
