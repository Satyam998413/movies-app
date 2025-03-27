import React from 'react';
import { Alert as FlowbiteAlert } from 'flowbite-react';
import { HiInformationCircle, HiExclamationCircle, HiCheckCircle, HiXCircle } from 'react-icons/hi';

const Alert = ({ type, message, onDismiss }) => {
  const alertTypes = {
    error: {
      color: 'failure',
      icon: HiXCircle,
    },
    success: {
      color: 'success',
      icon: HiCheckCircle,
    },
    info: {
      color: 'info',
      icon: HiInformationCircle,
    },
    warning: {
      color: 'warning',
      icon: HiExclamationCircle,
    },
  };

  const { color, icon: Icon } = alertTypes[type] || alertTypes.info;

  return (
    <FlowbiteAlert
      color={color}
      icon={Icon}
      onDismiss={onDismiss}
      className="mb-4"
    >
      <span className="font-medium">{message}</span>
    </FlowbiteAlert>
  );
};

export default Alert; 