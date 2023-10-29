import React, { ReactNode } from 'react';
import { Button, Row, Col } from 'antd';
import NoStoreAdded from '../../images/icons/no-store-added';

interface OnBoardBannerProps {
  header: string;
  description: string | ReactNode;
  buttonName?: string;
  onClickAction?: () => void;
  image?: string;
  children?: ReactNode;
  className?: string;
  addButtonPermission?: boolean;
}

const OnBoardBanner: React.FC<OnBoardBannerProps> = ({
  header,
  description,
  buttonName,
  onClickAction,
  image,
  children,
  className,
  addButtonPermission,
}) => {
  return (
    // <div className={`generate-box ant-row ant-space-align-center p-32 ${className}`}>
    //   <div className="generate-box-content">
    //     <h1 className='h4'>{header}</h1>
    //     <p className="m-b-32">{description}</p>
    //     {children}
    //     {addButtonPermission && (
    //       <Button type="primary" onClick={onClickAction}>
    //         {buttonName}
    //       </Button>
    //     )}
    //   </div>
    //   <div className="generate-box-img">
    //     <img src={image} alt="internationalize" />
    //   </div>
    // </div>
    <Row
      className={`generate-box ant-row ant-space-align-center p-32 ${className}`}>
      <Col span={12}>
        <div className="generate-box-content p-l-32">
          <h1 className="h4 m-b-16 secondary-black">{header}</h1>
          <p className="m-b-32 gray-text">{description}</p>
          {children}
          {addButtonPermission && (
            <Button type="primary" onClick={onClickAction}>
              {buttonName}
            </Button>
          )}
        </div>
      </Col>
      <Col span={12}>
        <div className="generate-box-img ant-row ant-row-end">
          <NoStoreAdded />
        </div>
      </Col>
    </Row>
  );
};

export default OnBoardBanner;
