import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Button, Form, Input, Modal } from 'antd';

import useAudienceController from './audience-controller';
import { onSidebarToggle, SIDEBAR_KEYS } from '../../../utills';
import SubSideBar from '../../../components/sub-sidebar';
import DetailsAudience from './details';
import QueryBuilder from './query-builder';
import HamburgerIcon from '../../../images/icons/hamburger-icon';
import DetailsList from './list';

const Audience: React.FC<{
  onMainSidebarActiveItem?: (val: string) => void;
}> = ({ onMainSidebarActiveItem }) => {
  const {
    menuItems,
    onEnvironmentChange,
    path,
    environmentId,
    onSubSidebarMenuItemClick,
    sidebarActiveItem,
    segmentDetail,
    isCreateSegmentModalVisible,
    onCreteSegmentModalVisibleChange,
    t,
    form,
    onValueChange,
    isCreateSegmentButtonDisabled,
    onSaveSegmentButtonClick,
    isSaveButtonLoading,
    skipLimit,
    totalRecordCount,
    currentPageNumber,
    columns,
    onPageChange,
    segmentDetailsByQuery,
    isLoading,
    onSearchDataChange,
    segmentEditStatus,
  } = useAudienceController(onMainSidebarActiveItem);
  return (
    <SubSideBar
      sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.AUDIENCE}
      subSidebarActiveItemKey={sidebarActiveItem}
      isGlobalPage={false}
      subSidebarMenuItems={menuItems}
      isEnvironmentSelectorVisible={true}
      onEnvironmentSelectValueChange={onEnvironmentChange}
      onSubSidebarMenuItemClick={onSubSidebarMenuItemClick}>
      <Switch>
        <Route exact path={`${path}/:segmentId/query-builder`}>
          <QueryBuilder
            segmentDetail={segmentDetail}
            onCreteSegmentModalVisibleChange={onCreteSegmentModalVisibleChange}
          />
        </Route>
        <Route exact path={`${path}/all-details`}>
          <div className="headerinner ant-row ant-space-align-center ant-row-space-between">
            <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
              <div className="hamburgericon" onClick={onSidebarToggle}>
                <HamburgerIcon />
              </div>
              <div className="w-100 ant-row ant-space-vertical">
                <span className="ant-page-header-heading-title">
                  {sidebarActiveItem === 'allVisitor'
                    ? t('common.labels.all_visitors')
                    : sidebarActiveItem === 'knownVisitor'
                    ? t('common.labels.known_visitor')
                    : sidebarActiveItem === 'anonymousVisitor'
                    ? t('common.labels.anonymous_visitor')
                    : t('common.labels.all_customers')}
                </span>
              </div>
            </div>
          </div>
          <DetailsList
            skipLimit={skipLimit}
            columns={columns}
            currentPageNumber={currentPageNumber}
            totalRecordCount={totalRecordCount}
            onSearchDataChange={onSearchDataChange}
            t={t}
            isLoading={isLoading}
            segmentDetailsByQuery={segmentDetailsByQuery}
            onPageChange={onPageChange}
          />
        </Route>
        <Route exact path={`${path}/:segmentType/:audienceId/details`}>
          <DetailsAudience environmentId={environmentId} />
        </Route>
      </Switch>
      <Modal
        onCancel={() => onCreteSegmentModalVisibleChange(false)}
        className="CustomModal CustomModal-small"
        centered
        open={isCreateSegmentModalVisible}
        title={ segmentEditStatus ? t('common.labels.rename_segment') : t('common.labels.add_segment')}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              onCreteSegmentModalVisibleChange(false);
            }}>
            {t('common.labels.cancel')}
          </Button>,
          <Button
            onClick={onSaveSegmentButtonClick}
            key="save"
            type="primary"
            loading={isSaveButtonLoading}
            disabled={isCreateSegmentButtonDisabled}>
            {t('common.labels.save')}
          </Button>,
        ]}>
        <Form
          layout="vertical"
          form={form}
          onValuesChange={onValueChange}
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}>
          <Form.Item
            key="segmentName"
            label={t('common.labels.sagment_name')}
            name="name"
            rules={[
              {
                required: true,
                message: t('common.messages.segment_name_required'),
              },
            ]}
            normalize={(value) => value.trimStart()}>
            <Input
              maxLength={255}
              placeholder={t('common.labels.enter_segment_name')}
            />
          </Form.Item>
          <Form.Item
            key="description"
            label={t('common.labels.description')}
            name="description"
            normalize={(value) => value.trimStart()}>
            <Input.TextArea
              maxLength={255}
              placeholder={t('common.labels.description_input_placeholder')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </SubSideBar>
  );
};
export default Audience;
