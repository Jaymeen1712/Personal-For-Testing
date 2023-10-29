import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  Checkbox,
  Radio,
  Table,
  Spin,
  Row,
  Col,
} from 'antd';
import React from 'react';

import useConfigModalController from './config-modal-controller';
import NoDataFound from '../../../../../components/no-data-found';
import NoRecordIcon from '../../../../../images/icons/no-records-icon';
import { LoadingOutlined } from '@ant-design/icons';

const ConfigModal: React.FC<{
  isVisible: boolean;
  onCancelClick: () => void;
  selectedFacetName: string;

  updateFacetDetail: {
    [k: string]: {
      type: string;
      displayName: string;
      facetType: string;
      fieldName: string;
      isEnabled?: boolean;
      sortOrder?: number;
    };
  };

  onFacetApply: (val: {
    [k: string]: {
      type: string;
      displayName: string;
      facetType: string;
      fieldName: string;
      isEnabled?: boolean;
      sortOrder?: number;
    };
  }) => void;
  ChangeFacetValue: boolean;
}> = ({
  isVisible,
  onCancelClick,
  selectedFacetName,
  updateFacetDetail,
  onFacetApply,
  ChangeFacetValue,
}) => {
  const {
    t,
    onSave,
    form,
    onValueChange,
    displayAsValue,
    selectedRange,
    roundOfCheck,
    dataSource,
    columns,
    DraggableContainer,
    DraggableBodyRow,
    isFieldOrderingEnable,
    loading,
    isSaveButtonEnabled,
  } = useConfigModalController(
    selectedFacetName,
    onFacetApply,
    updateFacetDetail,
    ChangeFacetValue,
    onCancelClick
  );
  const selectOptionArray = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const { Option } = Select;
  return (
    <>
      <Modal
        open={isVisible}
        onCancel={onCancelClick}
        centered
        className={`CustomModal ${
          isFieldOrderingEnable ? `CustomModal-xlarge` : 'CustomModal-small'
        }`}
        title={`${t('common.labels.config_modal_title')} - ${
          updateFacetDetail[selectedFacetName]?.displayName
        }`}
        footer={[
          <Button key="cancel" onClick={onCancelClick}>
            {t('common.labels.cancel')}
          </Button>,
          <>
            <Button
              disabled={!isSaveButtonEnabled}
              key="save"
              type="primary"
              onClick={onSave}>
              {t('common.labels.save')}
            </Button>
          </>,
        ]}>
        <div>
          <Form
            layout="vertical"
            onValuesChange={onValueChange}
            form={form}
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}>
            <Row gutter={48}>
              <Col span={`${isFieldOrderingEnable ? 12 : 24}`}>
                <Form.Item
                  label={t('common.labels.display_name')}
                  name="facetName"
                  rules={[
                    {
                      required: true,
                      message: 'Display name is required',
                    },
                  ]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  label={t('common.labels.show')}
                  name="isShowFacet"
                  initialValue={1}>
                  <Select placeholder="Please select" placement="bottomRight">
                    {selectOptionArray.map((item) => (
                      <Option value={item}>{`${item} ${t(
                        'common.labels.items'
                      )}`}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label={t('common.labels.display_as')}
                  name="displayAs"
                  initialValue="list">
                  <Select placeholder="Please select" placement="bottomRight">
                    <Option value="list">{t('common.labels.list')}</Option>
                    <Option value="block">{t('common.labels.block')}</Option>
                    {updateFacetDetail[selectedFacetName]?.type !== 'text' && (
                      <Option value="range">{t('common.labels.range')}</Option>
                    )}
                    {updateFacetDetail[selectedFacetName]?.type !== 'text' && (
                      <Option value="slider">
                        {t('common.labels.detail_range_slider')}
                      </Option>
                    )}
                  </Select>
                </Form.Item>
                {/*{displayAsValue === 'range' && (*/}
                {/*  <>*/}
                {/*    <div className="ant-row ant-row-space-between">*/}
                {/*      <Form.Item*/}
                {/*        className="w-50"*/}
                {/*        label={t('common.labels.min_value')}*/}
                {/*        name="minValue"*/}
                {/*        rules={[*/}
                {/*          ({ getFieldValue }) => ({*/}
                {/*            validator(_, value) {*/}
                {/*              if (*/}
                {/*                getFieldValue('maxValue') > value ||*/}
                {/*                !getFieldValue('maxValue') ||*/}
                {/*                !value*/}
                {/*              ) {*/}
                {/*                return Promise.resolve(true);*/}
                {/*              }*/}
                {/*              return Promise.reject(*/}
                {/*                new Error(*/}
                {/*                  t(*/}
                {/*                    'common.labels.content_modal_minimum_value_validation'*/}
                {/*                  )*/}
                {/*                )*/}
                {/*              );*/}
                {/*            },*/}
                {/*          }),*/}
                {/*        ]}>*/}
                {/*        <InputNumber min={0} />*/}
                {/*      </Form.Item>*/}
                {/*      <Form.Item*/}
                {/*        className="w-50"*/}
                {/*        label={t('common.labels.max_value')}*/}
                {/*        name="maxValue"*/}
                {/*        rules={[*/}
                {/*          ({ getFieldValue }) => ({*/}
                {/*            validator(_, value) {*/}
                {/*              if (*/}
                {/*                getFieldValue('minValue') < value ||*/}
                {/*                !getFieldValue('minValue')*/}
                {/*              ) {*/}
                {/*                return Promise.resolve(true);*/}
                {/*              }*/}
                {/*              return Promise.reject(*/}
                {/*                new Error(*/}
                {/*                  t(*/}
                {/*                    'common.labels.content_modal_maximum_value_validation'*/}
                {/*                  )*/}
                {/*                )*/}
                {/*              );*/}
                {/*            },*/}
                {/*          }),*/}
                {/*        ]}>*/}
                {/*        <InputNumber min={0} />*/}
                {/*      </Form.Item>*/}
                {/*    </div>*/}
                {/*  </>*/}
                {/*)}*/}
                {displayAsValue === 'slider' && (
                  <div className="modal-slider-section m-b-24">
                    <Form.Item name="rangeSelect" className="m-0">
                      <Radio.Group
                        defaultValue="calculateByRange"
                        className="w-100">
                        <Radio value="calculateByRange" className="m-b-16">
                          {t('common.labels.Calculate_slider_range')}
                        </Radio>
                        <div className="modal-slider-section-inner">
                          {selectedRange === 'calculateByRange' && (
                            <>
                              <Form.Item
                                className="m-0 m-b-16"
                                name="roundOffValue"
                                valuePropName="checked">
                                <Checkbox>
                                  {t('common.labels.round_of_value')}
                                </Checkbox>
                              </Form.Item>
                              {roundOfCheck && (
                                <div className="modal-slider-2-step">
                                  <Row
                                    gutter={16}
                                    className="ant-row ant-row-space-between ant-from-item-m-0 m-t-16 m-b-32">
                                    <Col span={12}>
                                      <Form.Item
                                        className="display-block"
                                        label={t('common.labels.round_down')}
                                        name="roundDown"
                                        // rules={[
                                        //   ({ getFieldValue }) => ({
                                        //     validator(_, value) {
                                        //       if (
                                        //         getFieldValue('roundUp') > value ||
                                        //         !getFieldValue('roundUp') ||
                                        //         !value
                                        //       ) {
                                        //         return Promise.resolve(true);
                                        //       }
                                        //       return Promise.reject(
                                        //         new Error(
                                        //           t(
                                        //             'common.messages.facet_round_up_value_validation'
                                        //           )
                                        //         )
                                        //       );
                                        //     },
                                        //   }),
                                        // ]}
                                      >
                                        <InputNumber
                                          style={{ width: '100%' }}
                                          placeholder="Enter value"
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                      <Form.Item
                                        className="display-block"
                                        label={t('common.labels.round_up')}
                                        name="roundUp"
                                        // rules={[
                                        //   ({ getFieldValue }) => ({
                                        //     validator(_, value) {
                                        //       if (
                                        //         getFieldValue('roundDown') < value ||
                                        //         !getFieldValue('roundDown')
                                        //       ) {
                                        //         return Promise.resolve(true);
                                        //       }
                                        //       return Promise.reject(
                                        //         new Error(
                                        //           t(
                                        //             'common.messages.facet_round_down_value_validation'
                                        //           )
                                        //         )
                                        //       );
                                        //     },
                                        //   }),
                                        // ]}
                                      >
                                        <InputNumber
                                          style={{ width: '100%' }}
                                          placeholder="Enter value"
                                        />
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        <Radio value="manuallyDefine" className="m-0">
                          {t('common.labels.manually_define')}
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                    {selectedRange === 'manuallyDefine' && (
                      <div className="modal-slider-section-inner">
                        <Row
                          gutter={16}
                          className="ant-row three-col-input ant-row-space-between ant-from-item-m-0 ant-from-item-m-t-0 m-t-16">
                          <Col span={8}>
                            <Form.Item
                              label={t('common.labels.min_value')}
                              name="sliderMinValue"
                              className="m-0"
                              rules={[
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    if (
                                      getFieldValue('sliderMaxValue') > value ||
                                      !getFieldValue('sliderMaxValue') ||
                                      !value
                                    ) {
                                      return Promise.resolve(true);
                                    }
                                    return Promise.reject(
                                      new Error(
                                        t(
                                          'common.labels.content_modal_minimum_value_validation'
                                        )
                                      )
                                    );
                                  },
                                }),
                              ]}>
                              <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                placeholder="Enter value"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              label={t('common.labels.max_value')}
                              name="sliderMaxValue"
                              className="m-0"
                              rules={[
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    if (
                                      getFieldValue('sliderMinValue') < value ||
                                      !getFieldValue('sliderMinValue') ||
                                      !value
                                    ) {
                                      return Promise.resolve(true);
                                    }
                                    return Promise.reject(
                                      new Error(
                                        t(
                                          'common.labels.content_modal_maximum_value_validation'
                                        )
                                      )
                                    );
                                  },
                                }),
                              ]}>
                              <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                placeholder="Enter value"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              className="m-0"
                              label={t('common.labels.step_size')}
                              name="sliderStepSize">
                              <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                placeholder="Enter value"
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    )}
                  </div>
                )}

                <Form.Item
                  className="label-switch-inline faceted-switch faceted-switch-top"
                  label={t('common.labels.collapse_by_default')}
                  name="defaultCollapse"
                  valuePropName="checked">
                  <Switch />
                </Form.Item>

                {displayAsValue === 'list' && (
                  <Form.Item
                    className="label-switch-inline faceted-switch"
                    label={t('common.labels.show_count')}
                    name="showCount"
                    valuePropName="checked">
                    <Switch />
                  </Form.Item>
                )}
                {updateFacetDetail[selectedFacetName]?.type !== 'number' && (
                  <Form.Item
                    className="label-switch-inline faceted-switch"
                    label={t('common.labels.sort_order')}
                    name="isFieldOrderingEnable"
                    valuePropName="checked">
                    <Switch />
                  </Form.Item>
                )}
              </Col>
              <Col
                span={12}
                className={`${isFieldOrderingEnable && 'sort-by-facts'}`}>
                {isFieldOrderingEnable && (
                  <>
                    {loading ? (
                      <Spin
                        className="HV-center"
                        indicator={
                          <LoadingOutlined style={{ fontSize: 40 }} spin />
                        }
                        size="large"
                      />
                    ) : (
                      <div>
                        <Form.Item
                          label={t('common.labels.sort_order')}
                          name="order">
                          <Select
                            placeholder="Please select"
                            placement="bottomRight">
                            <Option value="asc">
                              {t('common.labels.sort_by_ascending')}
                            </Option>
                            <Option value="desc">
                              {t('common.labels.sort_by_descending')}
                            </Option>
                            <Option value="highestCount">
                              {t('common.labels.highest_count')}
                            </Option>
                            <Option value="custom">
                              {t('common.labels.custom')}
                            </Option>
                          </Select>
                        </Form.Item>
                        <div className="table-section">
                          <Table
                            pagination={false}
                            dataSource={dataSource}
                            columns={columns}
                            rowKey="index"
                            components={{
                              body: {
                                wrapper: DraggableContainer,
                                row: DraggableBodyRow,
                              },
                            }}
                            locale={{
                              emptyText: (
                                <NoDataFound
                                  icon={<NoRecordIcon />}
                                  title={t(
                                    'common.messages.facet_value_not_found'
                                  )}
                                />
                              ),
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ConfigModal;
