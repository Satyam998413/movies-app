import React from 'react';
import { Card as FlowbiteCard } from 'flowbite-react';

const Card = ({ title, children, image, actions }) => {
  return (
    <FlowbiteCard
      className="max-w-sm"
      imgSrc={image}
      imgAlt={title}
      horizontal={false}
    >
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h5>
      <div className="font-normal text-gray-700 dark:text-gray-400">
        {children}
      </div>
      {actions && (
        <div className="flex justify-between">
          {actions}
        </div>
      )}
    </FlowbiteCard>
  );
};

export default Card; 