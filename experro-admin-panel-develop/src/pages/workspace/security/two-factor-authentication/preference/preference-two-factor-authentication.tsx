import React from 'react';
import { TFunction } from 'react-i18next';
import { Select } from 'antd';

import { PREFERENCES } from '../../../../../utills';
import FilterDropDownIcon from '../../../../../images/icons/filterdropdown-icon';

interface IPreference {
  t: TFunction<'translation', undefined>;
  selectedFirstPreference: string;
  onPreferenceChange: (preference: string) => void;
}

const PreferenceTwoFactorAuthentication: React.FC<IPreference> = ({
  t,
  selectedFirstPreference,
  onPreferenceChange,
}) => {
  return (
    <div className="filters ant-space ant-space-horizontal ant-space-align-center">
      <div className="ant-space-item-main m-0">
        <span>{t('common.labels.first_preference')}</span>
        <Select
          className="m-0 ant-space-align-center borderless-select"
          popupClassName="dropdown-size-medium"
          placement={'bottomRight'}
          onChange={onPreferenceChange}
          size="middle"
          suffixIcon={<FilterDropDownIcon />}
          showArrow={true}
          showSearch={false}
          value={selectedFirstPreference}>
          {PREFERENCES &&
            PREFERENCES.map((preference) => (
              <Select.Option value={preference.key}>
                {preference.label}
              </Select.Option>
            ))}
        </Select>
      </div>
    </div>
  );
};

export default PreferenceTwoFactorAuthentication;
