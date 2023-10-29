import React from 'react';
import moment from 'moment';
import { TFunction } from 'react-i18next';
import { Button, DatePicker, PageHeader, Layout, Form } from 'antd';
// import { InfoCircleOutlined } from '@ant-design/icons';

import ArrowLeftIcon from '../../../../../../images/icons/arrow-left-icon';
import EditIcon from '../../../../../../images/icons/edit-icon';
import { convertUtcToCurrentTimeZone } from '../../../../../../utills';
import { IRuleList } from '../../../../../../types';
import Calender from '../../../../../../images/icons/calender';

const { Header } = Layout;

interface IHeaderCreateUp {
  backToListPage: () => void;
  rulesList?: IRuleList;
  onEditRuleData: () => void;
  t: TFunction<'translation', undefined>;
  startDate?: string;
  endDate?: string;
  isNotRedirectPage: boolean;
  buttonLoading: boolean;
  saveRule: () => void;
  onPreviewClick: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  disabledStartDate: (startValue: any) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onStartChange: (date: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  disabledEndDate: (endDateValue: any) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEndChange: (date: any) => void;
  isSaveButtonDisable: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
}

const HeaderCreateUpdate: React.FC<IHeaderCreateUp> = ({
  backToListPage,
  rulesList,
  onEditRuleData,
  t,
  startDate,
  endDate,
  isNotRedirectPage,
  buttonLoading,
  saveRule,
  onPreviewClick,
  disabledStartDate,
  onStartChange,
  disabledEndDate,
  onEndChange,
  isSaveButtonDisable,
  form,
}) => {
  return (
    <Header>
      <div className="headerinner ant-row ant-space-align-start ant-row-space-between merchandising-detail-header">
        <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
          <div className="hamburgericon" onClick={backToListPage}>
            <ArrowLeftIcon />
          </div>
          <PageHeader
            className="custom-title"
            title={rulesList?.contentModelData.title}
            subTitle={rulesList?.contentModelData.description}
          />
          <Button
            type="text"
            className="edit-icon"
            icon={<EditIcon />}
            onClick={onEditRuleData}
          />
        </div>
        <div className="headerright">
          <div className="ant-row ant-row-end ant-space-align-center custom-date-picker large-size ant-row-no-wrap">
            <div className="two-date-picker ant-row ant-row-no-wrap">
              <Form layout="inline" form={form} name="date-picker-form">
                <Form.Item
                  className="star-icon"
                  name="startDate"
                  label={t('common.labels.start')}>
                  <div>
                    <DatePicker
                      inputReadOnly={true}
                      size={'middle'}
                      suffixIcon={<Calender />}
                      placement="bottomRight"
                      placeholder={t('common.labels.start_date')}
                      format="YYYY-MM-DD hh:mm:ss A"
                      showTime={{ use12Hours: true, format: 'HH:mm:ss A' }}
                      value={
                        startDate
                          ? moment(convertUtcToCurrentTimeZone(startDate))
                          : undefined
                      }
                      onChange={onStartChange}
                      disabledDate={endDate ? disabledStartDate : undefined}
                    />
                  </div>
                </Form.Item>
                <Form.Item name="endDate" label={t('common.labels.end')}>
                  <div>
                    <DatePicker
                      inputReadOnly={true}
                      size={'middle'}
                      suffixIcon={<Calender />}
                      placement="bottomRight"
                      placeholder={t('common.labels.end_date')}
                      format="YYYY-MM-DD hh:mm:ss A"
                      showTime={{ use12Hours: true, format: 'HH:mm:ss A' }}
                      value={
                        endDate
                          ? moment(convertUtcToCurrentTimeZone(endDate))
                          : undefined
                      }
                      onChange={onEndChange}
                      disabledDate={startDate ? disabledEndDate : undefined}
                    />
                  </div>
                </Form.Item>
              </Form>

              <Button type="default" onClick={onPreviewClick}>
                {t('common.labels.preview')}
              </Button>

              <Button
                disabled={isSaveButtonDisable}
                type="primary"
                loading={!isNotRedirectPage && buttonLoading ? true : false}
                onClick={saveRule}>
                {t('common.labels.save')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default HeaderCreateUpdate;
