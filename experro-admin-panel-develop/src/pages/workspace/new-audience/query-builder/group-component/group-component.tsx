//@ts-nocheck
import React from 'react';
import { Button } from 'antd';

import useGroupComponentController from './group-component-controller';
import ConditionComponent from '../condition-component';
import PlusCircleIcon from '../../../../../images/icons/pluscircle-icon';
import Copythreelayer from '../../../../../images/icons/copythreelayer';
// import DeleteIcon from '../../../../../images/icons/delete-icon';

const GroupComponent: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any;
  changeQuery: () => void;
  showRemoveButton: boolean;
  deleteConditionShow?: () => void;
  isGroupIsEvent: boolean;
  reFetchSegmentDetailsBYQuery: () => void;
}> = ({
  query,
  changeQuery,
  showRemoveButton,
  deleteConditionShow,
  isGroupIsEvent,
  reFetchSegmentDetailsBYQuery,
}) => {
  const {
    deleteCondition,
    addGroup,
    addCondition,
    changeFieldValue,
    changeConditionValue,
    changeDataValue,
    changeOperator,
    t,
    onBlur,
  } = useGroupComponentController(
    query,
    changeQuery,
    reFetchSegmentDetailsBYQuery
  );
  return (
    <>
      <div
        className={`queryBuilder ${
          showRemoveButton
            ? isGroupIsEvent
              ? 'light-blue-bg-color'
              : 'white-bg-color'
            : ''
        }`}>
        <div className="queryBuilder-wrapper">
          <div className="ant-row ant-row-middle form-inline queryBuilder-head">
            <div className="combine-buttons-action">
              <Button
                className={`${query.operator === 'AND' && 'active'} and-btn`}
                // type="primary"
                size="small"
                htmlType="submit"
                onClick={() => {
                  changeOperator('AND');
                }}>
                {t('common.labels.and')}
              </Button>
              <Button
                className={`${query.operator === 'OR' && 'active'}`}
                type="default"
                size="small"
                htmlType="submit"
                onClick={() => {
                  changeOperator('OR');
                }}>
                {t('common.labels.or')}
              </Button>
            </div>

            <div className="ant-row">
              <Button
                type="default"
                size="small"
                htmlType="submit"
                onClick={() => {
                  addCondition();
                }}
                icon={
                  <span className="anticon">
                    <PlusCircleIcon />
                  </span>
                }>
                {t('common.labels.add_condition')}
              </Button>
              <Button
                type="default"
                size="small"
                htmlType="submit"
                onClick={addGroup}
                icon={
                  <span className="anticon">
                    <Copythreelayer />
                  </span>
                }>
                {t('common.labels.add_group')}
              </Button>
              {showRemoveButton && (
                <Button
                  danger
                  type="link"
                  size="small"
                  htmlType="submit"
                  onClick={deleteConditionShow}>
                  {t('common.labels.remove_group')}
                </Button>
              )}
            </div>
          </div>

          <div
            className={`group-conditions ${
              query.operator === 'OR' && 'active-border'
            }`}>
            {query?.rules?.map((rule, index) => {
              if (rule.group) {
                return (
                  <GroupComponent
                    query={rule.group}
                    changeQuery={changeQuery}
                    deleteConditionShow={() => deleteCondition(index)}
                    showRemoveButton={true}
                    isGroupIsEvent={!isGroupIsEvent}
                    reFetchSegmentDetailsBYQuery={reFetchSegmentDetailsBYQuery}
                  />
                );
              } else {
                return (
                  <ConditionComponent
                    rule={rule}
                    index={index}
                    changeFieldValue={changeFieldValue}
                    changeConditionValue={changeConditionValue}
                    changeDataValue={changeDataValue}
                    deleteCondition={() => deleteCondition(index)}
                    t={t}
                    onBlur={onBlur}
                  />
                );
              }
            })}
          </div>
        </div>
      </div>
    </>
  );
};
export default GroupComponent;
