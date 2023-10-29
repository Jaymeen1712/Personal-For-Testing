import React, { ReactNode } from 'react';

interface NoDataFoundProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
}

const NoDataFound: React.FC<NoDataFoundProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="no-data">
      <>{icon}</>
      <h5>{title}</h5>
      <span>{description}</span>
    </div>
  );
};

export default NoDataFound;
