import { Button, Collapse, Form, InputNumber, Select, Switch } from 'antd';
import RoundCloseIcon from '../../../../../../images/icons/round-close-icon';
import PlusCircleIcon from '../../../../../../images/icons/pluscircle-icon';
import React from 'react';
import useCustomAlgorithmController from './custom-algorithm-controller';
import RuleTab from '../../merchandising/primary/rule-tab';
import ArrowRightIcon from "../../../../../../images/icons/arrow-right-icon";

const { Panel } = Collapse;

interface ICustomAlgorithm {
  isCustomAlgorithm: boolean;
  // eslint-disable-next-line
  algorithmList: any;
  // eslint-disable-next-line
  ruleData: any;
  // eslint-disable-next-line
  onSetRuleData: (ruleData: any) => void;
  onSetCustomMerchandising: (val: boolean) => void;
  environmentId: string | null;
  onCustomAlgorithmChange: (data: string, index: number) => void;
  // eslint-disable-next-line
  onChangeStartSlot: (index: number, startSlot: any) => void;
  // eslint-disable-next-line
  onChangeEndSlot: (index: number, startSlot: any) => void;
}

const CustomAlgorithm: React.FC<ICustomAlgorithm> = ({
  isCustomAlgorithm,
  algorithmList,
  ruleData,
  onSetRuleData,
  onSetCustomMerchandising,
  environmentId,
  onChangeEndSlot,
  onChangeStartSlot,
  onCustomAlgorithmChange,
}) => {
  const {
    t,
    form,
    workspaceId,
    isDeleteSubRule,
    setIsDeleteSubRule,
    addRule,
    editRule,
    deleteRule,
    onHideSubRuleDelete,
    onEnableMerchandising,
    onDeleteCustomAlgorithm,
    customIndexArray,
    onAddClick,
    initialCustomData,
  } = useCustomAlgorithmController(
    isCustomAlgorithm,
    algorithmList,
    ruleData,
    onSetRuleData,
    onSetCustomMerchandising,
    environmentId
  );

  return (
    <>
      <Form
        name="custom_form"
        form={form}
        autoComplete="off"
        className="custom-algorithm"
        layout={'vertical'}>
        <Form.List name="conditions" initialValue={initialCustomData}>
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map((field, index) => (
                  <>
                    <Form.Item
                      key={field.name}
                      name={field.name}
                      className="rule-condition reverce-rule-condition">
                      <Form.Item
                        name={[field.name, 'algorithmInternalNameEsi']}
                        label={t('common.labels.algorithm')}>
                        <Select
                          onChange={(value) =>
                            onCustomAlgorithmChange(value, index)
                          }>
                          {algorithmList?.data?.map(
                            (
                              // eslint-disable-next-line
                              item: any
                            ) => (
                              <Select.Option
                                value={JSON.stringify(item)}
                                key={item.id}>
                                {item.name}
                              </Select.Option>
                            )
                          )}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label={t('common.labels.slot_range')}
                        name={[field.name, 'start']}
                        className="w-50">
                        <InputNumber
                          className="w-100"
                          placeholder={t('common.labels.start')}
                          type="number"
                          min={1}
                          max={50}
                          onChange={(value) => onChangeStartSlot(index, value)}
                        />
                      </Form.Item>
                      <Form.Item name={[field.name, 'end']} className="w-50">
                        <InputNumber
                          className="w-100"
                          placeholder={t('common.labels.end')}
                          type="number"
                          min={1}
                          max={50}
                          onChange={(value) => onChangeEndSlot(index, value)}
                        />
                      </Form.Item>

                      <Form.Item
                        className="m-0 label-switch-inline-second"
                        valuePropName="checked"
                        label={t('common.labels.merchandising')}
                        name={[field.name, 'isMerchandisingEbi']}>
                        <Switch
                          key={field.name}
                          onChange={(event) =>
                            onEnableMerchandising(event, index)
                          }
                        />
                      </Form.Item>
                      {customIndexArray[index] && (
                        <Collapse
                          key={field.key}
                          defaultActiveKey={
                            ruleData?.contentModelFieldData
                              ?.customPrimaryAlgorithmEj[index]?.rulesEj
                              ? field.name
                              : ''
                          }
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
                          className="w-100 merchandising-rules-collapse">
                          <Panel
                            header={t('common.labels.merchandising_rule')}
                            key={field.name}>
                            <div className='personalization-tabs-section'>
                            <RuleTab
                              rulesList={ruleData}
                              addRule={(data, ruleType) =>
                                addRule(data, ruleType, index)
                              }
                              index={index}
                              isCustomAlgorithm={isCustomAlgorithm}
                              customIndexArray={customIndexArray[index]}
                              deleteRule={(ruleType, id) =>
                                deleteRule(ruleType, index, id)
                              }
                              editRule={(data, ruleType) =>
                                editRule(data, ruleType, index)
                              }
                              onHideSubRuleDelete={onHideSubRuleDelete}
                              isDeleteSubRule={isDeleteSubRule}
                              setIsDeleteSubRule={setIsDeleteSubRule}
                              t={t}
                              workspaceId={workspaceId}
                              environmentId={environmentId}
                            />
                            </div>
                          </Panel>
                        </Collapse>
                      )}
                      {fields.length > 1 && (
                        <Button
                          type="link"
                          className="round-close-icon"
                          onClick={() => onDeleteCustomAlgorithm(index)}
                          icon={<RoundCloseIcon />}></Button>
                      )}
                    </Form.Item>
                  </>
                ))}
                <Form.Item className="m-0">
                  <Button
                    type="link"
                    className="gray-text"
                    onClick={onAddClick}
                    icon={<PlusCircleIcon />}>
                    {t('common.labels.add_condition')}
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
      </Form>
    </>
  );
};

export default CustomAlgorithm;
