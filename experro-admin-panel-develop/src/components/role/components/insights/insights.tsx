import React from 'react';
import { Form, Collapse, Checkbox } from 'antd';
import type { FormInstance } from 'antd/es/form';
import useInsights from './insights-controller';
import ArrowRightIcon from '../../../../images/icons/arrow-right-icon';

interface InsightsProps {
  form: FormInstance;
  shouldUpdateComponent: boolean;
  workspaceId: string;
  selectedWorkspaceId: string;
  editWorkspaceId: string | null;
}

const Insights: React.FC<InsightsProps> = ({
  form,
  shouldUpdateComponent,
  selectedWorkspaceId,
  editWorkspaceId,
  workspaceId,
}) => {
  const {
    t,
    listInsights,
    singleCheckBoxSelect,
    checkAllChilds,
    checkAll,
    stopPropagation,
  } = useInsights(
    form,
    shouldUpdateComponent,
    workspaceId,
    selectedWorkspaceId,
    editWorkspaceId
  );

  return (
    <>
      <div className="ant-row ant-space-align-center tab-content-list">
        <div className="tab-content-left lg-width">&nbsp;</div>
        <div className="tab-content-right ant-row">
          <Form.Item name="insights-read" valuePropName="checked">
            <Checkbox onChange={(e) => checkAll(e, 'read')}>
              {t('common.labels.read')}
            </Checkbox>
          </Form.Item>
          <Form.Item name="insights-create" valuePropName="checked">
            <Checkbox onChange={(e) => checkAll(e, 'create')}>
              {t('common.labels.create')}
            </Checkbox>
          </Form.Item>
          <Form.Item name="insights-update" valuePropName="checked">
            <Checkbox onChange={(e) => checkAll(e, 'update')}>
              {t('common.labels.update')}
            </Checkbox>
          </Form.Item>
          <Form.Item name="insights-delete" valuePropName="checked">
            <Checkbox onChange={(e) => checkAll(e, 'delete')}>
              {t('common.labels.delete')}
            </Checkbox>
          </Form.Item>
          <Form.Item name="insights-publish" valuePropName="checked">
            <Checkbox onChange={(e) => checkAll(e, 'publish')}>
              {t('common.labels.publish')}
            </Checkbox>
          </Form.Item>
        </div>
      </div>
      {listInsights.isSuccess &&
        listInsights.data.items.insights.map((ele) => (
          <div key={ele.value}>
            <Collapse
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
              }>
              <Collapse.Panel
                forceRender
                showArrow={false}
                key={1}
                header={
                  <>
                    <div className="tab-content-left lg-width ant-row ant-space-align-center">
                      <Form.Item name={ele.label} valuePropName="checked">
                        <Checkbox
                          onChange={(e) => checkAllChilds(e, ele.value)}
                          onClick={stopPropagation}
                        />
                      </Form.Item>
                      <span className="custom-checkbox-label">{ele.label}</span>
                    </div>
                    <div className="tab-content-right ant-row">
                      <Form.Item
                        name={['insights', ele.value, 'read']}
                        valuePropName="checked">
                        <Checkbox
                          onClick={stopPropagation}
                          onChange={(e) =>
                            singleCheckBoxSelect(
                              e,
                              'read',
                              ele.value,
                              ele.label
                            )
                          }
                        />
                      </Form.Item>
                      <Form.Item
                        name={['insights', ele.value, 'create']}
                        valuePropName="checked">
                        <Checkbox
                          onClick={stopPropagation}
                          onChange={(e) =>
                            singleCheckBoxSelect(
                              e,
                              'create',
                              ele.value,
                              ele.label
                            )
                          }
                        />
                      </Form.Item>
                      <Form.Item
                        name={['insights', ele.value, 'update']}
                        valuePropName="checked">
                        <Checkbox
                          onClick={stopPropagation}
                          onChange={(e) =>
                            singleCheckBoxSelect(
                              e,
                              'update',
                              ele.value,
                              ele.label
                            )
                          }
                        />
                      </Form.Item>
                      <Form.Item
                        name={['insights', ele.value, 'delete']}
                        valuePropName="checked">
                        <Checkbox
                          onClick={stopPropagation}
                          onChange={(e) =>
                            singleCheckBoxSelect(
                              e,
                              'delete',
                              ele.value,
                              ele.label
                            )
                          }
                        />
                      </Form.Item>
                      <Form.Item
                        name={['insights', ele.value, 'publish']}
                        valuePropName="checked">
                        <Checkbox
                          onClick={stopPropagation}
                          onChange={(e) =>
                            singleCheckBoxSelect(
                              e,
                              'publish',
                              ele.value,
                              ele.label
                            )
                          }
                        />
                      </Form.Item>
                    </div>
                  </>
                }
              />
            </Collapse>
          </div>
        ))}
    </>
  );
};

export default Insights;
