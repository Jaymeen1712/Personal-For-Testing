import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';

import useSingleTypeLoaderComponentController from './single-type-loader-component-controller';
import { ContentModelList } from '../../../../../types';

const SingleTypeLoaderComponent: React.FC<{
  selectedContentModalDetails: ContentModelList;
}> = ({selectedContentModalDetails}) => {
  useSingleTypeLoaderComponentController(selectedContentModalDetails);
  return (
    <Spin
      className="HV-center table-center"
      indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
      size="large"
    />
  );
};

export default SingleTypeLoaderComponent;
