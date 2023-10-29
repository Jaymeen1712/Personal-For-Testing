import React from 'react';
import { TFunction } from 'react-i18next';
import { DatePicker } from 'antd';
import moment from 'moment';

import {
  convertUtcToCurrentTimeZone,
  onSidebarToggle,
} from '../../../../utills';
import HamburgerIcon from '../../../../images/icons/hamburger-icon';
import SeparatorIcon from '../../../../images/icons/separator-icon';
import Calender from '../../../../images/icons/calender';

const { RangePicker } = DatePicker;

interface IHeaderAnalyticsDashboard {
  t: TFunction<'translation', undefined>;
  startDate?: string;
  endDate?: string;
  onStartDateEndDateChange?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dates: any,
    dateStrings: [string, string]
  ) => void;
}

const HeaderAnalyticsDashboard: React.FC<IHeaderAnalyticsDashboard> = ({
  t,
  startDate,
  endDate,
  onStartDateEndDateChange,
}) => {
  return (
    <div className="headerinner ant-row ant-space-align-start ant-row-space-between">
      <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
        <div className="hamburgericon" onClick={onSidebarToggle}>
          <HamburgerIcon />
        </div>
        <div className="w-100 ant-row ant-space-vertical">
          <span className="ant-page-header-heading-title">
            {t('common.labels.dashboard')}
          </span>
          <span className="ant-page-header-heading-sub-title m-t-4">
            {t('common.labels.show_analytics_selected_index')}
          </span>
        </div>
      </div>
      <div className="headerright">
        <div className="ant-row ant-row-end ant-space-align-center custom-date-picker">
          <span className="m-r-16">{t('common.labels.rule_duration')}</span>

          <RangePicker
            inputReadOnly={true}
            size={'middle'}
            allowClear={false}
            format="DD MMM YYYY"
            suffixIcon={<Calender />}
            separator={<SeparatorIcon />}
            popupClassName="custom-date-picker-dropdown"
            placeholder={[
              t('common.labels.start_date'),
              t('common.labels.end_date'),
            ]}
            value={[
              moment(convertUtcToCurrentTimeZone(startDate)),
              moment(convertUtcToCurrentTimeZone(endDate)),
            ]}
            ranges={{
              Today: [
                moment(new Date(Date.now())),
                moment(new Date(Date.now())),
              ],
              Yesterday: [
                moment(
                  new Date(new Date(Date.now()).getTime() - 24 * 60 * 60 * 1000)
                ),
                moment(
                  new Date(new Date(Date.now()).getTime() - 24 * 60 * 60 * 1000)
                ),
              ],
              'Last 7 Days': [
                moment(
                  new Date(
                    new Date(Date.now()).getTime() - 7 * 24 * 60 * 60 * 1000
                  )
                ),
                moment(new Date(new Date(Date.now()).getTime())),
              ],
              'Last 14 Days': [
                moment(
                  new Date(
                    new Date(Date.now()).getTime() - 14 * 24 * 60 * 60 * 1000
                  )
                ),
                moment(new Date(new Date(Date.now()).getTime())),
              ],
              'Last Month': [
                moment(
                  new Date(
                    new Date(Date.now()).setMonth(
                      new Date(Date.now()).getMonth() - 1
                    )
                  )
                ),
                moment(new Date(new Date(Date.now()).getTime())),
              ],
              'Last 3 Months': [
                moment(
                  new Date(
                    new Date(Date.now()).setMonth(
                      new Date(Date.now()).getMonth() - 3
                    )
                  )
                ),
                moment(new Date(new Date(Date.now()).getTime())),
              ],
              'Last 6 Months': [
                moment(
                  new Date(
                    new Date(Date.now()).setMonth(
                      new Date(Date.now()).getMonth() - 6
                    )
                  )
                ),
                moment(new Date(new Date(Date.now()).getTime())),
              ],
              'Last 12 Month': [
                moment(
                  new Date(
                    new Date(Date.now()).setMonth(
                      new Date(Date.now()).getMonth() - 12
                    )
                  )
                ),
                moment(new Date(new Date(Date.now()).getTime())),
              ],
            }}
            onChange={onStartDateEndDateChange}
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderAnalyticsDashboard;
