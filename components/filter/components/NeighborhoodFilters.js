// components/filter/components/NeighborhoodFilters.js
import React from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material';

const NeighborhoodFilters = ({ neighborhoods, selectedNeighborhoods, onNeighborhoodToggle }) => {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        انتخاب محلات
      </Typography>
      <FormGroup>
        {neighborhoods.map((neighborhood) => {
          const isSelected = selectedNeighborhoods.some(n => n.id === neighborhood.id);
          return (
            <FormControlLabel
              key={neighborhood.id}
              control={
                <Checkbox
                  checked={isSelected}
                  onChange={() => onNeighborhoodToggle(neighborhood)}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography>{neighborhood.name}</Typography>
                </Box>
              }
              sx={{
                mb: 1,
                p: 1.5,
                borderRadius: 1,
                border: '1px solid',
                borderColor: isSelected ? '#b92a31' : '#e0e0e0',
                bgcolor: isSelected ? 'rgba(185, 42, 49, 0.1)' : 'white',
                '&:hover': {
                  bgcolor: isSelected ? 'rgba(185, 42, 49, 0.15)' : '#f5f5f5',
                },
                '& .MuiFormControlLabel-label': {
                  flex: 1,
                }
              }}
            />
          );
        })}
      </FormGroup>
    </Box>
  );
};

export default NeighborhoodFilters;