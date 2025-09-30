import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import CallIcon from '@mui/icons-material/Call';

/**
 * Small wrapper for a call action button used across the app.
 * Props:
 * - href: optional tel: link
 * - phone: phone string to display when children not provided
 * - onClick: click handler
 * - children: custom content
 */
const CallButton = ({ href, phone, onClick, children, ...rest }) => {
  const content = children || phone || href || 'تماس';

  return (
    <Button
      {...rest}
      startIcon={<CallIcon />}
      onClick={onClick}
      href={href}
    >
      {content}
    </Button>
  );
};

CallButton.propTypes = {
  href: PropTypes.string,
  phone: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
};

export default CallButton;
