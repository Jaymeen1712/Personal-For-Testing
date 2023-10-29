import { Button, Collapse, Form, Modal, Select, Switch } from 'antd';
import React from 'react';
import Tabs from '../../../../../../components/tabs/tabs';
import usePrimaryAlgorithmController from './primary-algorithm-controller';
import CustomAlgorithm from '../custom-algorithm';
import ArrowRightIcon from "../../../../../../images/icons/arrow-right-icon";

interface IPrimaryAlgorithm {
  // eslint-disable-next-line
  ruleData: any;
  primaryId: string;
  secondaryId: string;
  onChangePrimaryId: (id: string) => void;
  environmentId: string;
  // eslint-disable-next-line
  algorithmList: any;
  onChangeFallBack: (val: boolean) => void;
  // eslint-disable-next-line
  onSetRuleData: (data: any) => void;
  onSetCustomMerchandising: (val: boolean) => void;
  isSuccess: boolean;
  onCustomAlgorithmChange: (data: string, index: number) => void;
  // eslint-disable-next-line
  onChangeStartSlot: (index: number, startSlot: any) => void;
  // eslint-disable-next-line
  onChangeEndSlot: (index: number, startSlot: any) => void;
}

const { Panel } = Collapse;

const PrimaryAlgorithm: React.FC<IPrimaryAlgorithm> = ({
  ruleData,
  primaryId,
  secondaryId,
  onChangePrimaryId,
  environmentId,
  algorithmList,
  onChangeFallBack,
  onSetCustomMerchandising,
  onSetRuleData,
  isSuccess,
  onCustomAlgorithmChange,
  onChangeEndSlot,
  onChangeStartSlot,
}) => {
  const {
    t,
    isMerchandising,
    isCustomAlgorithm,
    primaryData,
    primaryItems,
    onChangePrimary,
    onEnableMerchandising,
    isVisibleDirtyCheck,
    onCancel,
    onDirtyCheckSave,
  } = usePrimaryAlgorithmController(
    ruleData,
    primaryId,
    secondaryId,
    environmentId,
    algorithmList,
    onSetRuleData,
    isSuccess,
    onChangeFallBack,
    onChangePrimaryId
  );

  return (
    <>
      <Collapse
        collapsible="header"
        defaultActiveKey={['primary-key']}
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
        className="personalization-main-collapse">
        <Panel
          key={
            ruleData?.contentModelFieldData?.primaryAlgorithmEj ||
            ruleData?.contentModelFieldData?.customPrimaryAlgorithmEj ||
            isCustomAlgorithm
              ? 'primary-key'
              : ''
          }
          header={t('common.labels.primary_rule')}
          extra={
            <>
              <Form.Item className="m-0" label="Fallback">
                <Switch
                  checked={ruleData?.contentModelFieldData?.isFallbackEbi}
                  onChange={onChangeFallBack}
                />
              </Form.Item>
            </>
          }>
          <div className="w-100">
            <span className="custom-input-label">Primary Algorithm</span>
            <Select
              className="w-100"
              disabled={ruleData?.contentModelFieldData.isSystemGeneratedEbi}
              value={
                ruleData?.contentModelFieldData.isSystemGeneratedEbi
                  ? ruleData?.contentModelFieldData.name.toString()
                  : primaryId
              }
              onChange={onChangePrimary}>
              {primaryData?.map(
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

          {!isCustomAlgorithm &&
            !ruleData?.contentModelFieldData?.isSystemGeneratedEbi && (
              <div className="single-input">
                <Form.Item className="m-0" label="Merchandising">
                  <Switch
                    checked={
                      ruleData?.contentModelFieldData?.primaryAlgorithmEj
                        ?.isMerchandisingEbi
                    }
                    onChange={onEnableMerchandising}
                  />
                </Form.Item>
              </div>
            )}
          {isMerchandising && !isCustomAlgorithm && (
            <Collapse
              className='merchandising-rules-collapse'
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
              defaultActiveKey={['primary-merchandising']}>
              <Panel
                key={
                  ruleData?.contentModelFieldData?.primaryAlgorithmEj
                    ?.isMerchandisingEbi
                    ? 'primary-merchandising'
                    : ''
                }
                header={t('common.labels.merchandising')}>
                <Tabs
                  items={primaryItems}
                  className="personalization-tabs-section"
                  id="1"
                />
              </Panel>
            </Collapse>
          )}

          {(isCustomAlgorithm || primaryId === 'custom') &&
            !ruleData?.contentModelFieldData?.isSystemGeneratedEbi && (
              <CustomAlgorithm
                algorithmList={algorithmList}
                ruleData={ruleData}
                onSetRuleData={onSetRuleData}
                isCustomAlgorithm={isCustomAlgorithm}
                environmentId={environmentId}
                onSetCustomMerchandising={onSetCustomMerchandising}
                onCustomAlgorithmChange={onCustomAlgorithmChange}
                onChangeEndSlot={onChangeEndSlot}
                onChangeStartSlot={onChangeStartSlot}
              />
            )}
        </Panel>
      </Collapse>

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

export default PrimaryAlgorithm;
