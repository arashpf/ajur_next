// components/filter/components/CategoryFilters.js
import React from 'react';
import {
  Box,
  Typography,
  Radio,
  FormControlLabel,
  RadioGroup,
} from '@mui/material';

const CategoryFilters = ({ categories, selectedCategory, onCategorySelect }) => {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        انتخاب دسته‌بندی
      </Typography>
      <RadioGroup
        value={selectedCategory?.id || ''}
        onChange={(e) => {
          const category = categories.find(c => c.id === parseInt(e.target.value));
          if (category) onCategorySelect(category);
        }}
      >
        {categories.map((category) => (
          <FormControlLabel
            key={category.id}
            value={category.id}
            control={<Radio color="primary" />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>{category.name}</Typography>
              </Box>
            }
            sx={{
              mb: 1,
              p: 1.5,
              borderRadius: 1,
              border: '1px solid',
              borderColor: selectedCategory?.id === category.id ? '#b92a31' : '#e0e0e0',
              bgcolor: selectedCategory?.id === category.id ? 'rgba(185, 42, 49, 0.1)' : 'white',
              '&:hover': {
                bgcolor: selectedCategory?.id === category.id ? 'rgba(185, 42, 49, 0.15)' : '#f5f5f5',
              },
              '& .MuiFormControlLabel-label': {
                flex: 1,
              }
            }}
          />
        ))}
      </RadioGroup>
    </Box>
  );
};

export default CategoryFilters;