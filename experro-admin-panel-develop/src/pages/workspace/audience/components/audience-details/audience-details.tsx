import React from 'react';
import { TFunction } from 'react-i18next';
import { Avatar } from 'antd';

import {
  avatarColorCode,
  convertAndFormatDate,
  convertDateTimeToUserTimezone,
  countryListWithCountryCode,
} from '../../../../../utills';
import { UserContextProps } from '../../../../../context/user';
import CurrencyFormat from './currenct-formater';

interface IAudienceDetails {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsAudience: any;
  t: TFunction<'translation', undefined>;
  user: UserContextProps | undefined;
}

const AudienceDetails = ({ detailsAudience, t, user }: IAudienceDetails) => {
  return (
    <div className="audienceDetail">
      {detailsAudience.name && (
        <div className="customerName">
          <Avatar
            className={`avatar-${avatarColorCode(detailsAudience.name)}`}
            size="large">
            {detailsAudience.name
              .match(/(\b\S)?/g)
              .join('')
              .match(/(^\S|\S$)?/g)
              .join('')
              .toUpperCase()}
          </Avatar>
          <h2>{detailsAudience.name}</h2>
        </div>
      )}

      <div className="ant-vertical-table-wrapper">
        <div className="ant-vertical-table">
          <div className="formitem-withtitle">
            <h5>{t('common.labels.about')}</h5>
          </div>

          <div className="ant-vertical-table-row">
            <span className="table-label">
              {t('common.labels.customer_id')}
            </span>
            <span className="table-value">
              {detailsAudience.id ? detailsAudience.id : '-'}
            </span>
          </div>

          <div className="ant-vertical-table-row">
            <span className="table-label">{t('common.labels.email')}</span>
            <span className="table-value">
              {detailsAudience.email ? detailsAudience.email : '-'}
            </span>
          </div>

          <div className="ant-vertical-table-row">
            <span className="table-label">{t('common.labels.contact')}</span>
            <span className="table-value">
              {detailsAudience.phone ? detailsAudience.phone : '-'}
            </span>
          </div>

          <div className="ant-vertical-table-row">
            <span className="table-label">{t('common.labels.city')}</span>
            <span className="table-value">
              {detailsAudience.city ? detailsAudience.city : '-'}
            </span>
          </div>

          <div className="ant-vertical-table-row">
            <span className="table-label">{t('common.labels.state')}</span>
            <span className="table-value">
              {detailsAudience.region ? detailsAudience.region : '-'}
            </span>
          </div>

          <div className="ant-vertical-table-row">
            <span className="table-label">{t('common.labels.country')}</span>
            <span className="table-value">
              {detailsAudience.country
                ? // @ts-ignore
                  countryListWithCountryCode[detailsAudience.country]
                : '-'}
            </span>
          </div>

          <div className="ant-vertical-table-row">
            <span className="table-label">{t('common.labels.gender')}</span>
            <span className="table-value">
              {detailsAudience.gender ? detailsAudience.gender : '-'}
            </span>
          </div>

          <div className="ant-vertical-table-row">
            <span className="table-label">{t('common.labels.language')}</span>
            <span className="table-value">
              {detailsAudience.locale ? detailsAudience.locale : '-'}
            </span>
          </div>
        </div>
      </div>

      <div className="ant-vertical-table-wrapper">
        <div className="ant-vertical-table">
          <div className="formitem-withtitle">
            <h5>{t('common.labels.summary')}</h5>
          </div>

          <div className="ant-vertical-table-row">
            <span className="table-label">{t('common.labels.first_seen')}</span>
            <span className="table-value">
              {detailsAudience.first_session_start
                ? convertDateTimeToUserTimezone(
                    detailsAudience.first_session_start,
                    user?.user?.timezone
                  )
                : '-'}
            </span>
          </div>

          <div className="ant-vertical-table-row">
            <span className="table-label">{t('common.labels.last_seen')}</span>
            <span className="table-value">
              {detailsAudience.last_seen_at
                ? convertDateTimeToUserTimezone(
                    detailsAudience.last_seen_at,
                    user?.user?.timezone
                  )
                : '-'}
            </span>
          </div>

          <div className="ant-vertical-table-row">
            <span className="table-label">
              {t('common.labels.device_and_os')}
            </span>
            <span className="table-value">{`${detailsAudience.os_name} (${detailsAudience.os_version})`}</span>
          </div>

          <div className="ant-vertical-table-row">
            <span className="table-label">{t('common.labels.screen')}</span>
            <span className="table-value">
              {detailsAudience.device_resolution
                ? detailsAudience.device_resolution
                : '-'}
            </span>
          </div>

          <div className="ant-vertical-table-row">
            <span className="table-label">
              {t('common.labels.total_sessions')}
            </span>
            <span className="table-value">
              {detailsAudience.total_session_count
                ? detailsAudience.total_session_count
                : 0}
            </span>
          </div>

          <div className="ant-vertical-table-row">
            <span className="table-label">
              {t('common.labels.total_time_spent')}
            </span>
            <span className="table-value">
              {detailsAudience.total_duration
                ? new Date(detailsAudience.total_duration * 1000)
                    .toISOString()
                    .slice(11, 19)
                : '-'}
            </span>
          </div>

          <div className="ant-vertical-table-row">
            <span className="table-label">
              {t('common.labels.last_purchase_amount')}
            </span>
            <span className="table-value">
              <CurrencyFormat
                value={detailsAudience?.last_purchase_amount}
                thousandSeparator={','}
                decimalSeparator={'.'}
                prefixSymbol={'$'}
              />
              {/*{detailsAudience.last_purchase_amount*/}
              {/*  ? detailsAudience.last_purchase_amount*/}
              {/*  : '-'}*/}
            </span>
          </div>

          <div className="ant-vertical-table-row">
            <span className="table-label">
              {t('common.labels.last_purchase_time')}
            </span>
            <span className="table-value">
              {detailsAudience.last_purchase_date &&
              new Date(detailsAudience.last_purchase_date)
                .getFullYear()
                .toString().length > 3
                ? convertAndFormatDate(
                    detailsAudience.last_purchase_date,
                    user?.user?.timezone
                  )
                : '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceDetails;
