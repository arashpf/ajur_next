import React from 'react';
import { FilterProvider } from '../contexts/FilterContext';

function AppWrapper({ children }) {
  return (
    <FilterProvider>
      {children}
    </FilterProvider>
  );
}

export default AppWrapper;
