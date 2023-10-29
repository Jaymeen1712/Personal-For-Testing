import React from 'react';
import { Button } from 'antd';

import useNotAccessController from './not-access-controller';

const NotAccess = () => {
  const { t, noDataVisible, workspaces, redirectToLogin } =
    useNotAccessController();

  return (
    <>
      {noDataVisible && !workspaces.isLoading && (
        <div className="HV-center table-center page-not-found1">
          <div className="text-center">
            <h1 className='h4'>{t('common.messages.not_access_page_heading')}</h1>
            <p className="m-b-40 title-default gray-text font-normal">{t('common.messages.not_access_page_sub_heading')}</p>
            <Button className="button" type="primary" onClick={redirectToLogin}>
              {t('common.labels.logout')}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default NotAccess;
