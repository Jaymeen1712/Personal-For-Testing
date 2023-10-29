import { Button, DatePicker, PageHeader, Tooltip } from 'antd';
import ArrowLeftIcon from '../../../../../images/icons/arrow-left-icon';
import EditIcon from '../../../../../images/icons/edit-icon';
import Calender from '../../../../../images/icons/calender';
import SeparatorIcon from '../../../../../images/icons/separator-icon';
import React from 'react';
import { Header } from 'antd/es/layout/layout';
import useHeaderWidgetRuleController from './header-widget-rule-controller';
import CreateUpdateRule from '../../modal/rule';
import InfoCircleIcon from '../../../../../images/icons/info-circle-icon';
import moment from 'moment';
import { convertUtcToCurrentTimeZone } from '../../../../../utills';

const { RangePicker } = DatePicker;

interface IHeaderWidgetRule {
  //eslint-disable-next-line
  ruleData: any;
  isSuccess: boolean;
  isEditRule: boolean;
  isDateConflict: boolean;
  startDate?: string;
  endDate?: string;
  selectedWidget: { id: string; type?: string | undefined } | undefined;
  //eslint-disable-next-line
  onSetRuleData: (data: any) => void;
  onSetStartDate: (val: string) => void;
  onSetEndDate: (val: string) => void;
  onSetEditRule: (val: boolean) => void;
  onSaveWidgetRulData: () => void;
  onBackToList: () => void;
  onAddEditRuleModalVisible: (val: boolean) => void;
  isAddRuleModalVisible: boolean;
  isMainSaveLoading?: boolean;
}

const HeaderWidgetRule = ({
  ruleData,
  isSuccess,
  isMainSaveLoading,
  isEditRule,
  isDateConflict,
  startDate,
  endDate,
  selectedWidget,
  onSetRuleData,
  onSetEditRule,
  onSetStartDate,
  onSetEndDate,
  onSaveWidgetRulData,
  onBackToList,
  onAddEditRuleModalVisible,
  isAddRuleModalVisible,
}: IHeaderWidgetRule) => {
  const {
    t,
    environment,
    onEditRule,
    onCancel,
    onStartDateEndDateChange,
    onCancelRuleModalVisible,
  } = useHeaderWidgetRuleController({
    ruleData,
    isSuccess,
    startDate,
    endDate,
    selectedWidget,
    onSetRuleData,
    onAddEditRuleModalVisible,
    onSetEditRule,
    onSetStartDate,
    onSetEndDate,
  });

  return (
    <>
      <Header>
        <div className="headerinner ant-row ant-space-align-start ant-row-space-between">
          <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
            <div
              className="cursor-pointer arrowleft-icon m-r-16"
              onClick={onBackToList}>
              <ArrowLeftIcon />
            </div>

            <PageHeader
              className="custom-title"
              title={ruleData?.contentModelData.title}
              subTitle={ruleData?.contentModelData.description}
            />
            <Button
              type="text"
              className="edit-icon"
              icon={<EditIcon />}
              onClick={onEditRule}
            />
          </div>

          <div className="headerright">
            <div className="ant-row ant-row-end ant-space-align-center custom-date-picker large-size">
              <div className="ant-row ant-row-middle">
                <span className="m-r-4 gray-text">
                  {t('common.labels.rule_duration')}
                </span>
                <Tooltip
                  overlayClassName="custom-tooltip custom-medium"
                  className="m-r-8"
                  title={t('common.messages.personalization_duration_tool_tip')}
                  placement="bottom">
                  <span className="icon-16">
                    <InfoCircleIcon />
                  </span>
                </Tooltip>
              </div>

              <div className="m-r-16">
                <RangePicker
                  inputReadOnly={true}
                  size={'middle'}
                  allowClear={false}
                  suffixIcon={<Calender />}
                  separator={<SeparatorIcon />}
                  placement="bottomRight"
                  placeholder={[
                    t('common.labels.start_date'),
                    t('common.labels.end_date'),
                  ]}
                  format="YYYY-MM-DD hh:mm:ss A"
                  showTime={{ use12Hours: true, format: 'HH:mm:ss A' }}
                  value={[
                    moment(convertUtcToCurrentTimeZone(startDate)),
                    moment(convertUtcToCurrentTimeZone(endDate)),
                  ]}
                  onChange={onStartDateEndDateChange}
                />
              </div>
              <Button key="back" onClick={onCancel}>
                {t('common.labels.cancel')}
              </Button>
              <Button
                type="primary"
                loading={isMainSaveLoading}
                disabled={isDateConflict}
                onClick={onSaveWidgetRulData}>
                {t('common.labels.save')}
              </Button>
            </div>
          </div>
        </div>
      </Header>

      <CreateUpdateRule
        isEditRule={isEditRule}
        onSetEditRule={onSetEditRule}
        environment={environment}
        isAddRuleModalVisible={isAddRuleModalVisible}
        onCancelRuleModalVisible={onCancelRuleModalVisible}
      />
    </>
  );
};

export default HeaderWidgetRule;
