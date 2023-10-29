import { Button, Select, Tooltip } from 'antd';
import React from 'react';

import FilterDropDownIcon from '../../images/icons/filterdropdown-icon';
import useEnvironmentSelectorController from './environment-selector-controller';
import ExternalIcon from '../../images/icons/external-link-icon';

const EnvironmentSelector: React.FC<{
  isEnvironmentSelectorVisible?: boolean;
  environmentSelectDefaultValue?: string | null;
  onEnvironmentSelectValueChange?: (val: string) => void;
  isEnvironmentSelectorDisable?: boolean;
  disableEnvironmentToolTipMessage?: string;
}> = ({
  isEnvironmentSelectorVisible,
  environmentSelectDefaultValue,
  onEnvironmentSelectValueChange,
  isEnvironmentSelectorDisable,
  disableEnvironmentToolTipMessage,
}) => {
  const { environmentList, defaultSelect, onChange, onRedirect, t } =
    useEnvironmentSelectorController(isEnvironmentSelectorDisable);

  return (
    <>
      {isEnvironmentSelectorVisible && (
        <>
          <div className="ant-row sidebar-top-select-with-icon">
            <Tooltip
              placement="bottom"
              title={
                isEnvironmentSelectorDisable && disableEnvironmentToolTipMessage
              }>
              <Select
                className="sidebar-top-select"
                size="large"
                suffixIcon={<FilterDropDownIcon />}
                disabled={
                  isEnvironmentSelectorDisable && isEnvironmentSelectorDisable
                }
                onChange={(val) => {
                  if (onEnvironmentSelectValueChange) {
                    onEnvironmentSelectValueChange(val);
                  }
                  onChange(val);
                }}
                defaultValue={
                  environmentSelectDefaultValue
                    ? environmentSelectDefaultValue
                    : defaultSelect
                }
                value={
                  environmentSelectDefaultValue
                    ? environmentSelectDefaultValue
                    : defaultSelect
                }>
                {environmentList.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.title}
                  </Select.Option>
                ))}
              </Select>
            </Tooltip>
            <Tooltip placement="bottom" title={t('common.messages.view_site')}>
              <Button
                // disabled={isEnvironmentSelectorDisable}
                icon={<ExternalIcon />}
                size="large"
                className="onlyIcon"
                onClick={onRedirect}></Button>
            </Tooltip>
          </div>
        </>
      )}
    </>
  );
};

export default EnvironmentSelector;
