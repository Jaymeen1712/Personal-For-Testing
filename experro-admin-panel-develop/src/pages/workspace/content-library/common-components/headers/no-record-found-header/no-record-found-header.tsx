import React from 'react';

import HamburgerIcon from '../../../../../../images/icons/hamburger-icon';

const NoRecordFoundHeader = () => {
  return (
    <div className="headerinner ant-row ant-space-align-start ant-row-space-between ">
      <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
        <div className="hamburgericon">
          <HamburgerIcon />
        </div>
        <div className="w-100 ant-row ant-space-vertical">
          <span className="ant-page-header-heading-title"></span>
          <span className="ant-page-header-heading-sub-title m-t-4"></span>
        </div>
      </div>
      <div className="headerright">right header- button</div>
    </div>
  );
};

export default NoRecordFoundHeader;
