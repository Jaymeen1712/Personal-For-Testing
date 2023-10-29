import { Card, Input, Select, Spin, Tag, Button, Form, Row, Col } from 'antd';
import React from 'react';

import SearchIcon from '../../../../../images/icons/search-icon';
import useAppListController from './app-list-controller';
import FilterDropDownIcon from '../../../../../images/icons/filterdropdown-icon';
import JotfromIcon from '../../../../../images/icons/jotfrom-icon';
// import GoogleAnalyticsIcon from '../../../../../images/icons/google-analytics-icon';
import UserWayIcon from '../../../../../images/icons/user-way-icon';
import AcquireIcon from '../../../../../images/icons/acquire-icon';
import SalesmateIcon from '../../../../../images/icons/salesmate-icon';
import ContentstackIcon from '../../../../../images/icons/contentstack-icon';
import ContentfulIcon from '../../../../../images/icons/contentful-icon';
import AlgoliaIcon from '../../../../../images/icons/algolia-icon';
import AffirmIcon from '../../../../../images/icons/affirm-icon';
import IntegrationsHeader from '../../header/integration-header';
import { LoadingOutlined } from '@ant-design/icons';
import YotpoIcon from '../../../../../images/icons/yotpo-icon';
import KlaviyoIcon from '../../../../../images/icons/klaviyo-icon';
import StampedeIcon from '../../../../../images/icons/stamped-icon';
import NoAppFoundIcon from '../../../../../images/icons/no-apps-found-icon';
import MailchimpIcon from '../../../../../images/icons/mailchimp-icon';

const AppList = () => {
  const {
    t,
    filterList,
    appItemClick,
    appList,
    categories,
    onCategoryChange,
    onFilterChange,
    onSearchValueChange,
    onEmptySearchField,
    form,
  } = useAppListController();
  const { Option } = Select;

  return (
    <>
      <IntegrationsHeader isListHeader={true} type="apps" />
      <div className="search-section environment-search app-search ant-row ant-row-space-between">
        <Form form={form}>
          <Form.Item name={'search'} className="m-0">
            <Input
              type="text"
              size="middle"
              placeholder={t('common.labels.search')}
              prefix={<SearchIcon />}
              onChange={(e) => {
                onSearchValueChange(e.target.value);
              }}
            />
          </Form.Item>
        </Form>
        <div className="filters ant-space ant-space-horizontal ant-space-align-center">
          <div className="ant-space-item-main">
            <span>{t('common.labels.category')}</span>
            <Select
            className="m-0 ant-space-align-center borderless-select"
            popupClassName="dropdown-size-medium"
              key="recordTableStatusSelect"
              placeholder={t('common.labels.all')}
              onChange={onCategoryChange}
              suffixIcon={<FilterDropDownIcon />}
              placement="bottomRight">
              {categories &&
                categories.map((item) => (
                  <Option value={item.id}>{item.categoryName}</Option>
                ))}
            </Select>
          </div>
          <div className="ant-space-item-main">
            <span>{t('common.labels.filter')}</span>
            <Select
            className="m-0 ant-space-align-center borderless-select"
            popupClassName="dropdown-size-medium"
              key="recordTableStatusSelect"
              placeholder={t('common.labels.all')}
              onChange={onFilterChange}
              suffixIcon={<FilterDropDownIcon />}
              placement="bottomRight">
              {filterList.map((item) => (
                <Option value={item.key}>{item.label}</Option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      <Row gutter={32} className="apps-row">
        {appList ? (
          appList.length > 0 ? (
            appList.map(
              (item) =>
                item.integrationName !== 'Bunny Cache' &&
                item.integrationName !== 'Jotform' && (
                  <Col lg={12} xl={8} className='m-b-32'>
                    <Card
                      hoverable
                      onClick={() =>
                        appItemClick(
                          item.id,
                          item.integrationInternalName,
                          item.categoryId,
                          item?.active
                        )
                      }>
                      <div className="m-b-24 ant-row ant-space-align-center ant-row-space-between">
                        {item.integrationName === 'Contentful' ? (
                          <ContentfulIcon />
                        ) : item.integrationName === 'Algolia' ? (
                          <AlgoliaIcon />
                        ) : item.integrationName === 'Affirm Marketing' ? (
                          <AffirmIcon />
                        ) : item.integrationName === 'Salesmate CRM' ? (
                          <SalesmateIcon />
                        ) : item.integrationName === 'Acquire' ? (
                          <AcquireIcon />
                        ) : item.integrationName ===
                          'Accessibility by UserWay' ? (
                          <UserWayIcon />
                        ) : item.integrationName === 'Google Analytics 4' ? (
                          <div className="ant-row google-analytics-icon" />
                        ) : item.integrationName === 'Contentstack' ? (
                          <ContentstackIcon />
                        ) : item.integrationName === 'Jotform' ? (
                          <JotfromIcon />
                        ) : item.integrationName === 'Yotpo' ? (
                          <YotpoIcon />
                        ) : item.integrationName === 'Klaviyo' ? (
                          <KlaviyoIcon />
                        ) : item.integrationName === 'Stamped.io' ? (
                          <StampedeIcon />
                        ) : item.integrationName === 'Mailchimp' ? (
                          <MailchimpIcon />
                        ) : item.integrationName === 'Power Reviews' ? (
                          <div className="ant-row power-reviews-icon" />
                        ) : item.integrationName === 'Bazzar Voice' ? (
                          <div className="ant-row bazzar-voice-icon" />
                        ) : item.integrationName ===
                          'B2B Ninja Quote Request & Management' ? (
                          <div className="ant-row b2bninja-icon" />
                        ) : (
                          ''
                        )}

                        <div>
                          {item?.active && (
                            <Tag color="success">
                              {t('common.labels.installed')}
                            </Tag>
                          )}
                        </div>
                      </div>
                      <p className="m-0 font-semibold">{item.integrationName}
                      </p>
                      <p className="text-blue m-0 small-text">
                        <small>{item.categoryName}</small>
                      </p>
                      <p className="light-gray m-0 m-t-16 small-text description-truncate">
                        <small>{item.description}</small>
                      </p>
                    </Card>
                  </Col>
                )
            )
          ) : (
            <div className="w-100 text-center">
              <NoAppFoundIcon />
              <p className="m-0 m-b-8 title-default font-medium">
                {t('common.labels.no_app_founded')}
              </p>
              <p className='gray-text m-0 m-b-24'>
                <small>{t('common.labels.cant_find_app')}</small>
              </p>
              <Button type="primary" onClick={onEmptySearchField}>
                {t('common.labels.explore_apps')}
              </Button>
            </div>
          )
        ) : (
          <Spin
            className="HV-center table-center"
            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            size="large"
          />
        )}
             
      </Row>
        
     
    </>
  );
};

export default AppList;
