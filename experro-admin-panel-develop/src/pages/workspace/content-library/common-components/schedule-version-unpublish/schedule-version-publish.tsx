import React from 'react';
// import moment from 'moment';
import {
  Button,
  // DatePicker,
  Form,
  Modal,
  // Checkbox,
  // Radio,
  // Tooltip,
} from 'antd';
// import { InfoCircleOutlined } from '@ant-design/icons';

import useScheduleVersionPublishUnPublishController from './schedule-version-publish-unpublish-controller';

const ScheduleVersionUnPublish = () => {
  const {
    onSave,
    onCancel,
    form,
    t,
    // environmentList,
    // publishButtonState,
    onChange,
    isUnPublishLoading,
    // timeZone,
    // isEnvironmentSelected,
  } = useScheduleVersionPublishUnPublishController();
  return (
    <>
      <Modal
        title={t('common.labels.unpublish_record')}
        className="CustomModal"
        visible
        footer={[
          <Button key="cancel" onClick={onCancel}>
            {t('common.labels.cancel')}
          </Button>,
          <>
            <Button
              key="save"
              type="primary"
              onClick={onSave}
              danger
              // disabled={!isEnvironmentSelected}
              loading={isUnPublishLoading}>
              {t('common.labels.un_publish')}
            </Button>
          </>,
        ]}
        onCancel={onCancel}
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
          {/*<Form.Item*/}
          {/*  name="environment"*/}
          {/*  className="schedule-row"*/}
          {/*  label={t('common.labels.publish_environment')}>*/}
          {/*  <Checkbox.Group>*/}
          {/*    {environmentList?.map((item) => (*/}
          {/*      <Tooltip*/}
          {/*        placement="bottom"*/}
          {/*        title={*/}
          {/*          item.isDisable &&*/}
          {/*          t('common.messages.error_permission_unpublish')*/}
          {/*        }>*/}
          {/*        <Checkbox value={item.id} disabled={item.isDisable}>*/}
          {/*          {item.title}*/}
          {/*        </Checkbox>*/}
          {/*      </Tooltip>*/}
          {/*    ))}*/}
          {/*  </Checkbox.Group>*/}
          {/*</Form.Item>*/}

          {/*<Form.Item*/}
          {/*  label={t('common.labels.un_publish')}*/}
          {/*  className="schedule-row m-0"*/}
          {/*  name="publish"*/}
          {/*  initialValue="now">*/}
          {/*  <Radio.Group defaultValue="now">*/}
          {/*    <Radio value="now"> {t('common.labels.now')} </Radio>*/}
          {/*    <Radio value="schedule"> {t('common.labels.schedule')} </Radio>*/}
          {/*  </Radio.Group>*/}
          {/*</Form.Item>*/}
          {/*{publishButtonState !== 'now' && (*/}
          {/*  <Form.Item*/}
          {/*    rules={[*/}
          {/*      {*/}
          {/*        required: true,*/}
          {/*        message: 'Schedule unpublish date is required.',*/}
          {/*      },*/}
          {/*    ]}*/}
          {/*    name="endDate"*/}
          {/*    className="m-0 m-t-32 m-b-16"*/}
          {/*    label={t('common.labels.un_publish')}*/}
          {/*    tooltip={{*/}
          {/*      title: t('common.labels.un_schedule_tooltip'),*/}
          {/*      icon: <InfoCircleOutlined />,*/}
          {/*    }}>*/}
          {/*    <DatePicker*/}
          {/*      showTime*/}
          {/*      format="YYYY-MM-DD HH:mm:ss"*/}
          {/*      allowClear*/}
          {/*      disabledDate={(current) => {*/}
          {/*        const customDate = moment().format('YYYY-MM-DD HH:mm:ss');*/}
          {/*        return (*/}
          {/*          current &&*/}
          {/*          current < moment(customDate, 'YYYY-MM-DD HH:mm:ss')*/}
          {/*        );*/}
          {/*      }}*/}
          {/*    />*/}
          {/*  </Form.Item>*/}
          {/*)}*/}
          {/*{publishButtonState !== 'now' && (*/}
          {/*  <p className="m-0 gray-text">*/}
          {/*    <small>*/}
          {/*      {t('common.labels.workspace_timezone')} {timeZone}*/}
          {/*    </small>*/}
          {/*  </p>*/}
          {/*)}*/}
        </Form>
      </Modal>
    </>
  );
};

export default ScheduleVersionUnPublish;
