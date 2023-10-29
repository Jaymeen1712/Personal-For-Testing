import React from 'react';

import ExperroAnimLogo from '../../images/Loading-icon.gif';
import './index.scss';
// import { Spin } from 'antd';
// import { LoadingOutlined } from '@ant-design/icons';

const Spinner: React.FC = () => {
  return (
    // <Spin
    //   className="HV-center"
    //   indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
    //   size="large"
    // />
    <div className="Spinner">
      <div className="ExperooAnimLogo">
        <img src={ExperroAnimLogo} alt="Experro" />
      </div>
    </div>
  );
};
export default Spinner;
