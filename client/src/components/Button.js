import React from 'react';
import { Button as FlowbiteButton } from 'flowbite-react';

const Button = ({ 
  children, 
  color = 'blue', 
  size = 'md', 
  onClick, 
  disabled = false,
  className = '',
  type = 'button'
}) => {
  return (
    <FlowbiteButton
      color={color}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={className}
      type={type}
    >
      {children}
    </FlowbiteButton>
  );
};

export default Button; 