import React from 'react';
import moment from 'moment';
import { Button, Col, DatePicker, Form, Modal, Radio, Row } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import useScheduleVersionPublishUnPublishController from './schedule-version-publish-unpublish-controller';

const ScheduleVersionPublish: React.FC<{
  changeScheduleVersionPublishModalVisibility: (val: boolean) => void;
  saveFormData: () => void;
}> = ({ changeScheduleVersionPublishModalVisibility, saveFormData }) => {
  const {
    onSave,
    form,
    t,
    onCancel,
    // environmentList,
    publishButtonState,
    onChange,
    isPublishLoading,
    timeZone,
    isRecordCreatedLoading,
    isSaveButtonDisabled,
  } = useScheduleVersionPublishUnPublishController(
    changeScheduleVersionPublishModalVisibility,
    saveFormData
  );
  return (
    <>
      <Modal
        title={t('common.labels.publish_record')}
        className="CustomModal"
        visible
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              onCancel();
              changeScheduleVersionPublishModalVisibility(false);
            }}>
            {t('common.labels.cancel')}
          </Button>,
          <>
            <Button
              key="save"
              type="primary"
              onClick={onSave}
              disabled={isSaveButtonDisabled && publishButtonState !== 'now'}
              // disabled={!isEnvironmentSelected}
              loading={isPublishLoading || isRecordCreatedLoading}>
              {t('common.labels.publish')}
            </Button>
          </>,
        ]}
        onCancel={() => {
          onCancel();
          changeScheduleVersionPublishModalVisibility(false);
        }}
        centered>
        <Form
          layout="vertical"
          form={form}
          onValuesChange={onChange}
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}>
          <Form.Item
            label={t('common.labels.publish')}
            name="publish"
            className="schedule-row m-0"
            initialValue="now">
            <Radio.Group defaultValue="now">
              <Radio value="now"> {t('common.labels.now')} </Radio>
              <Radio value="schedule"> {t('common.labels.schedule')} </Radio>
            </Radio.Group>
          </Form.Item>
          <Row
            gutter={40}
            className="ant-row ant-row-space-between m-b-16 schedule-field">
            {publishButtonState !== 'now' && (
              <>
                <Col span={12}>
                  <Form.Item
                    className="m-0 m-t-24"
                    name="startDate"
                    rules={[
                      {
                        required: true,
                        message: t('common.messages.start_date_required'),
                      },
                    ]}
                    label={t('common.labels.start_date')}
                    tooltip={{
                      title: t('common.labels.schedule_tooltip'),
                      icon: <InfoCircleOutlined />,
                    }}>
                    <DatePicker
                      placeholder={t('common.labels.start_date')}
                      showTime
                      format="DD MMM YYYY hh:mm A"
                      allowClear={false}
                      disabledDate={(current) => {
                        const customDate = moment().format(
                          'DD MMM YYYY hh:mm A'
                        );
                        return (
                          current &&
                          current < moment(customDate, 'DD MMM YYYY hh:mm A')
                        );
                      }}
                    />
                  </Form.Item>
                </Col>
              </>
            )}
            {publishButtonState !== 'now' && (
              <Col span={12}>
                <Form.Item
                  className="m-0 m-t-24"
                  name="endDate"
                  label={t('common.labels.end_date')}
                  tooltip={{
                    title: t('common.labels.un_schedule_tooltip'),
                    icon: <InfoCircleOutlined />,
                  }}>
                  <DatePicker
                    showTime
                    placeholder={t('common.labels.end_date')}
                    format="DD MMM YYYY hh:mm A"
                    allowClear
                    disabledDate={(current) => {
                      const customDate = moment().format('DD MMM YYYY hh:mm A');
                      return (
                        current &&
                        current < moment(customDate, 'DD MMM YYYY hh:mm A')
                      );
                    }}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>
          {publishButtonState !== 'now' && (
            <p className="m-0 gray-text">
              {t('common.labels.workspace_timezone')} {timeZone} International
              Date Line West
            </p>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default ScheduleVersionPublish;
