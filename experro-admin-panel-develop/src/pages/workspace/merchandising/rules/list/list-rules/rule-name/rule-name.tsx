import React from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { Button, Dropdown, Menu } from 'antd';
import { useTranslation } from 'react-i18next';

import EllipsisIcon from '../../../../../../../images/icons/ellipsis-icon';
import { IRuleRowRecord } from '../../../../../../../types';
import { convertUtcToCurrentTimeZone } from '../../../../../../../utills';

interface IRuleNameCellRenderer {
  rule: IRuleRowRecord;
  onEditRule: (contentModalDataId: string, rule: IRuleRowRecord) => void;
  onInActiveRule: (contentModalDataId: string, rule: IRuleRowRecord) => void;
  onDeleteClick: (contentModalDataId: string) => void;
  onDuplicateRule: (rule: IRuleRowRecord) => void;
}

const RuleName: React.FC<IRuleNameCellRenderer> = ({
  rule,
  onEditRule,
  onInActiveRule,
  onDeleteClick,
  onDuplicateRule,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const ruleClick = () => {
    history.push(
      `create-edit/${rule?.currentVersionId}/${rule?.contentModelId}/${rule.id}/${rule.environmentId[0]}`
    );
  };

  return (
    <>
      <div className="ant-row ant-space-align-center ant-row-space-between w-100 table-text-button">
        <div className="table-text">
          <div
            className="text-blue cursor-pointer text-truncate with-pixel-xs"
            onClick={ruleClick}>
            {rule.title}
          </div>
          <span className="gray-text text-truncate with-pixel-xs display-block">
            {rule.description}
          </span>
        </div>

        <Dropdown
          placement="bottomRight"
          trigger={['click']}
          overlay={
            <div className="table-dropdown">
              <Menu>
                <Menu.Item onClick={() => onEditRule(rule.id, rule)}>
                  {t('common.labels.edit')}
                </Menu.Item>
                {
                  // @ts-ignore
                  (rule.statusEsi === 'active'
                    ? // @ts-ignore
                      rule.startDateEdti &&
                      // @ts-ignore
                      rule.endDateEdti
                      ? !moment(
                          // @ts-ignore
                          convertUtcToCurrentTimeZone(rule.endDateEdti)
                        ).isBefore(Date.now())
                      : true
                    : rule.statusEsi === 'inactive' && // @ts-ignore
                      rule.startDateEdti &&
                      // @ts-ignore
                      rule.endDateEdti
                    ? !moment(
                        // @ts-ignore
                        convertUtcToCurrentTimeZone(rule.endDateEdti)
                      ).isBefore(Date.now())
                    : true) && (
                    <Menu.Item onClick={() => onInActiveRule(rule.id, rule)}>
                      {/*@ts-ignore*/}
                      {rule.statusEsi === 'inactive'
                        ? t('common.labels.active')
                        : t('common.labels.inactive')}
                    </Menu.Item>
                  )
                }

                <Menu.Item onClick={() => onDuplicateRule(rule)}>
                  {t('common.labels.duplicate')}
                </Menu.Item>
                <Menu.Item onClick={() => onDeleteClick(rule.id)}>
                  <p className="text-red m-0">{t('common.labels.delete')}</p>
                </Menu.Item>
              </Menu>
            </div>
          }>
          <Button
            type="text"
            size="small"
            className="on-hover"
            icon={<EllipsisIcon />}
            style={{ float: 'right' }}
          />
        </Dropdown>
      </div>
    </>
  );
};

export default RuleName;
