import React from 'react';
import { Collapse, Switch } from 'antd';
import { TFunction } from 'react-i18next';

import { IListProductItems } from '../../../../../../../types';
import ArrowRightIcon from "../../../../../../../images/icons/arrow-right-icon";

interface IRules {
  description: string[];
  keywords?: string[];
  pin: number;
  ruleTypeEsi: string;
  ruleTitleEti: string;
  enabled: boolean;
  rules: number;
  slot: number;
  sort: number;
  id: string;
  default?: boolean;
}

interface IListPreviewProductResponse {
  totalCount: string;
  categoryRule: IRules[];
  searchRule: IRules[];
  sitesRule: IRules[];
  query: string;
  items: IListProductItems[];
}

interface ISiteTab {
  listPreviewProduct?: IListPreviewProductResponse;
  t: TFunction<'translation', undefined>;
  onEnableDisableSiteRule: (
    rule: IRules,
    checked: boolean,
    type: string
  ) => void;
  listPreviewProductIsSuccess: boolean;
  listPreviewProductIsLoading: boolean;
}

const SiteTab: React.FC<ISiteTab> = ({
  listPreviewProduct,
  t,
  onEnableDisableSiteRule,
  listPreviewProductIsSuccess,
  listPreviewProductIsLoading,
}) => {
  return (
    <>
      {listPreviewProductIsSuccess && !listPreviewProductIsLoading && (
        <>
          {listPreviewProduct &&
          listPreviewProduct.sitesRule &&
          listPreviewProduct.sitesRule.length > 0 ? (
            <div className="sidebar-top-section collapse-sidebar-section">
              <Collapse
                collapsible="header"
                expandIcon={({ isActive }) =>
                  isActive ? (
                    <span className="anticon">
                      <ArrowRightIcon />
                    </span>
                  ) : (
                    <span className="anticon">
                      <ArrowRightIcon />
                    </span>
                  )
                }>
                {listPreviewProduct.sitesRule.map((rule, index) => {
                  return (
                    <Collapse.Panel
                      key={index}
                      header={rule.ruleTitleEti}
                      extra={
                        <Switch
                          disabled={rule.default ? true : false}
                          checked={rule.enabled}
                          onChange={(checked) =>
                            onEnableDisableSiteRule(rule, checked, 'site-rule')
                          }
                        />
                      }>
                      <div className="product-condition-labels">
                        <h5>{t('common.labels.description')}</h5>
                        <div className="ant-row media-content-details operation-text preview-description-truncate">
                          <b>
                            {rule.description &&
                            typeof rule.description === 'string'
                              ? rule.description
                              : '-'}
                          </b>
                        </div>
                      </div>

                      <div className="product-condition-labels">
                        <h5>{t('common.labels.keywords')}</h5>
                        <div className="ant-row media-content-details operation-text preview-description-truncate">
                          <b>
                            {rule.keywords && rule.keywords.length > 0
                              ? rule.keywords?.join(',')
                              : '-'}
                          </b>
                        </div>
                      </div>

                      <div className="product-condition-labels">
                        <h5>{t('common.labels.total_sub_rules')}</h5>
                        <div className="media-content-details product-condition-labels">
                          <>
                            <div className="ant-row ant-row-space-between">
                              <span>{t('common.labels.rules')} :</span>
                              <p>{rule.rules ? rule.rules : 0}</p>
                            </div>
                            <div className="ant-row ant-row-space-between">
                              <span>{t('common.labels.sort')} :</span>
                              <p>{rule.sort ? rule.sort : 0}</p>
                            </div>
                            <div className="ant-row ant-row-space-between">
                              <span>{t('common.labels.pin')} :</span>
                              <p>{rule.pin ? rule.pin : 0}</p>
                            </div>
                            <div className="ant-row ant-row-space-between">
                              <span>{t('common.labels.slot')} :</span>
                              <p>{rule.slot ? rule.slot : 0}</p>
                            </div>
                          </>
                        </div>
                      </div>
                    </Collapse.Panel>
                  );
                })}
              </Collapse>
            </div>
          ) : (
            <div className="text-dark-gray">
              {t(
                'common.messages.no_rules_are_affecting_results_from_site_rules'
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default SiteTab;
