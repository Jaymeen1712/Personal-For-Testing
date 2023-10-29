import React from 'react';
import { Button } from 'antd';
import useGraphQlEnvironmentsController from './graphQl-environments-controller';
import ArrowLeftIcon from '../../../../images/icons/arrow-left-icon';

export interface IEnvironmentParams {
  environmentId: string;
  workspaceId: string;
}

const GraphQlEnvironments: React.FC = () => {
  const {
    t,
    onCancel,
    onBackButtonClick,
    environment,
    workspaceId,
    environmentId,
  } = useGraphQlEnvironmentsController();

  return (
    <div className="page-content">
      <div className="headerinner ant-row ant-space-align-start ant-row-space-between">
        <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
          <div className="hamburgericon" onClick={onBackButtonClick}>
            <ArrowLeftIcon />
          </div>
          <div className="w-100 ant-row ant-space-vertical">
            <span className="ant-page-header-heading-title">
              {t('common.labels.graph_ql_environment')}
            </span>
            <span className="ant-page-header-heading-sub-title m-t-4">
              {t('common.labels.graph_ql_of_environments', {
                entity:
                  environment === 'DEV'
                    ? 'Development'
                    : environment === 'CUSTOM'
                    ? 'staging'
                    : environment === 'PRODUCTION' && 'Production',
              })}
            </span>
          </div>
        </div>
        <div className="headerright">
          {
            <div className="ant-row ant-row-end">
              <Button id={t('common.labels.cancel')} onClick={onCancel}>
                {t('common.labels.cancel')}
              </Button>
            </div>
          }
        </div>
      </div>
      <div style={{ height: '100%' }}>
        <iframe
          className="graphQl-section"
          title={t('common.labels.graph_ql_environment')}
          height="100%"
          width="100%"
          src={`https://graphql.experro-dev.app/apis/graphql-service/${workspaceId}?accesstoken=${new URLSearchParams(
            window.location.search
          ).get('accessToken')}&environmentId=${environmentId}`}
        />
      </div>
    </div>
  );
};

export default GraphQlEnvironments;
