import { Form, DatePicker, TimePicker } from 'antd';
import React from 'react';
import moment from 'moment';
import { CommonController, useFieldPermission } from './controllers';
import { InfoCircleOutlined } from '@ant-design/icons';

import { IContentLibraryFieldPops } from '../../../../../../../types';
import { convertUtcToCurrentTimeZone } from '../../../../../../../utills';
import Calender from '../../../../../../../images/icons/calender';

interface FieldProps {
  contentModalInternalName: string;
  data: IContentLibraryFieldPops;
  componentName?: string;
}

const DateComponent: React.FC<FieldProps> = ({
  contentModalInternalName,
  data,
  componentName,
}) => {
  const { t, onDateBlurAction } = CommonController();
  const { canEditField } = useFieldPermission(
    contentModalInternalName,
    data,
    componentName
  );
  return (
    <>
      {
        //@ts-ignore
        data.name?.split('/').shift().endsWith('_ets') ||
        //@ts-ignore
        data.name?.split('/').shift().endsWith('_etsi') ? (
          <Form.Item
            // className={!data.isDataEditable ? 'display-none' : ''}
            label={data.title}
            name={data.name}
            tooltip={
              data.fieldProperties.helpText && {
                title: data.fieldProperties.helpText,
                icon: <InfoCircleOutlined />,
              }
            }
            initialValue={
              data.editValue && moment(data.editValue, 'hh:mm:ss a')
            }
            rules={[
              {
                required: data.isRequired,
                message: t('common.messages.required', { entity: data.title }),
                type: 'object' as const,
              },
            ]}>
            <TimePicker
              // className={!data.isDataEditable ? 'display-none' : ''}
              onBlur={(e) => onDateBlurAction(e, data.editValue)}
              disabled={!data.isDataEditable || !canEditField}
              // disabledDate={(current) => {
              //   const customDate = moment().format('HH:mm:ss');
              //   return current && current < moment(customDate, 'HH:mm:ss');
              // }}
              use12Hours={true}
              defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
            />
          </Form.Item>
        ) : //@ts-ignore
        data.name?.split('/').shift().endsWith('_edt') ||
          //@ts-ignore
          data.name?.split('/').shift().endsWith('_edti') ? (
          <Form.Item
            // className={!data.isDataEditable ? 'display-none' : ''}
            label={data.title}
            name={data.name}
            tooltip={
              data.fieldProperties.helpText && {
                title: data.fieldProperties.helpText,
                icon: <InfoCircleOutlined />,
              }
            }
            initialValue={
              data.editValue &&
              //@ts-ignore
              moment(convertUtcToCurrentTimeZone(data.editValue))
            }
            rules={[
              {
                required: data.isRequired,
                message: t('common.messages.required', { entity: data.title }),
                type: 'object' as const,
              },
            ]}>
            <DatePicker
              onBlur={(e) => onDateBlurAction(e, data.editValue)}
              disabled={!data.isDataEditable || !canEditField}
              // disabledDate={(current) => {
              //   const customDate = moment().format('YYYY-MM-DD HH:mm:ss');
              //   return (
              //     current && current < moment(customDate, 'YYYY-MM-DD HH:mm:ss')
              //   );
              // }}
              format="YYYY-MM-DD HH:mm:ss"
              showTime={true}
            />
          </Form.Item>
        ) : (
          <Form.Item
            label={data.title}
            name={data.name}
            tooltip={
              data.fieldProperties.helpText && {
                title: data.fieldProperties.helpText,
                icon: <InfoCircleOutlined />,
              }
            }
            initialValue={data.editValue && moment(data.editValue)}
            rules={[
              {
                required: data.isRequired,
                message: t('common.messages.required', { entity: data.title }),
                type: 'object' as const,
              },
            ]}>
            <DatePicker
              onBlur={(e) => onDateBlurAction(e, data.editValue)}
              disabled={!data.isDataEditable || !canEditField}
              // disabledDate={(current) => {
              //   const customDate = moment().format('YYYY-MM-DD HH:mm:ss');
              //   return (
              //     current && current < moment(customDate, 'YYYY-MM-DD HH:mm:ss')
              //   );
              // }}
              suffixIcon={<Calender />}
            />
          </Form.Item>
        )
      }
    </>
  );
};

export default DateComponent;
