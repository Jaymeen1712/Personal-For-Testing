import { Button, Collapse, Modal, Select } from 'antd';
import React from 'react';
import useSecondaryAlgorithmController from './secondary-algorithm-controller';
import Tabs from '../../../../../../components/tabs/tabs';
import ArrowRightIcon from "../../../../../../images/icons/arrow-right-icon";

interface ISecondaryAlgorithm {
  // eslint-disable-next-line
  ruleData: any;
  primaryId: string;
  secondaryId: string;
  environmentId: string;
  // eslint-disable-next-line
  algorithmList: any;
  isSuccess: boolean;
  // eslint-disable-next-line
  onSetRuleData: (data: any) => void;
  onChangeSecondaryId: (id: string) => void;
}

const { Panel } = Collapse;

const SecondaryAlgorithm: React.FC<ISecondaryAlgorithm> = ({
  ruleData,
  primaryId,
  secondaryId,
  environmentId,
  algorithmList,
  isSuccess,
  onSetRuleData,
  onChangeSecondaryId,
}) => {
  const {
    t,
    isVisibleDirtyCheck,
    onCancel,
    onDirtyCheckSave,
    isCustomRule,
    // secondaryId,
    secondaryData,
    secondaryItems,
    onSecondaryAlgorithmChange,
  } = useSecondaryAlgorithmController(
    isSuccess,
    ruleData,
    primaryId,
    secondaryId,
    environmentId,
    algorithmList,
    onSetRuleData,
    onChangeSecondaryId
  );

  return (
    <>
      <>
        <Collapse
          collapsible="header"
          expandIcon={({ isActive }) =>
            isActive ? (
              <span className="anticon">
                <ArrowRightIcon />
              </span>
            ) : (
              <span className="anticon">
                <ArrowRightIcon />
              </span>
            )
          }
          className="personalization-main-collapse"
          defaultActiveKey={['2']}>
          <Panel header="Fallback Rule" key="2">
            <div className="w-100">
              <span className="custom-input-label">Secondary Algorithm</span>
              <Select
                className="w-100"
                placeholder="Select Algorithm"
                value={secondaryId ? secondaryId : undefined}
                onChange={onSecondaryAlgorithmChange}>
                {secondaryData?.map(
                  (
                    // eslint-disable-next-line
                    item: any
                  ) => (
                    <Select.Option value={item.id} key={item.id}>
                      {item.name}
                    </Select.Option>
                  )
                )}
              </Select>
            </div>
          </Panel>
        </Collapse>
      </>

      {(isCustomRule ||
        secondaryId === 'custom' ||
        ruleData?.contentModelFieldData?.secondaryAlgorithmEj
          ?.isCustomRuleEbi) && (
        <Tabs
          items={secondaryItems}
          className="personalization-tabs-section with-no-bg"
          id="2"
        />
      )}

      <Modal
        className="confirm-modal"
        title={t('common.labels.change_algorithm')}
        open={isVisibleDirtyCheck}
        onCancel={onCancel}
        centered
        footer={[
          <Button key="cancel" onClick={onCancel}>
            {t('common.labels.cancel')}
          </Button>,
          <Button key="change" type="primary" onClick={onDirtyCheckSave}>
            {t('common.labels.change')}
          </Button>,
        ]}>
        <p>{t('common.labels.change_algorithm_description')}</p>
      </Modal>
    </>
  );
};

export default SecondaryAlgorithm;
