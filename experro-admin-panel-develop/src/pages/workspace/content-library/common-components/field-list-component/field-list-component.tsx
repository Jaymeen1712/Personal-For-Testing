import { Button, Collapse, Tabs } from 'antd';
import Nestable from 'react-nestable';
import React from 'react';

import FormField from './form-components';
import DeleteIcon from '../../../../../images/icons/delete';
import PlusCircleIcon from '../../../../../images/icons/pluscircle-icon';
import { IContentLibraryFieldPops } from '../../../../../types';
import useFieldListComponentController from './field-list-component-controller';
import useFieldPermissionCheck from '../../utils/field-permission-check';
import DragIconsmall from '../../../../../images/icons/drag-icon-small';
import ArrowRightIcon from '../../../../../images/icons/arrow-right-icon';

const FieldListComponent: React.FC<{
  mappingObject: IContentLibraryFieldPops[];
  collapseActiveKey: string[];
  onCollapseActiveKeyChange: (val: string[] | string) => void;
  addNewComponent: (
    index: number,
    mappingObject: IContentLibraryFieldPops[],
    isItemDrag: boolean,
    dragItems?: []
  ) => void;
  deleteNewComponent: (
    mainIndex: number,
    id: string,
    mappingObject: IContentLibraryFieldPops[]
  ) => void;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  form: any;
  contentModalInternalName: string;
  isViewContentInPopupOpen?: boolean;
  isEcommerceModal?: boolean;
  providerEsi?: string;
}> = ({
  mappingObject,
  collapseActiveKey,
  onCollapseActiveKeyChange,
  addNewComponent,
  deleteNewComponent,
  contentModalInternalName,
  isViewContentInPopupOpen,
  isEcommerceModal,
  providerEsi,
}) => {
  const { t, canUpdateRecord } = useFieldListComponentController(
    contentModalInternalName
  );
  const { Panel } = Collapse;
  const { fieldPermissionCheck } = useFieldPermissionCheck(
    contentModalInternalName
  );
  const contentTabCheck = mappingObject.find((item) => item.name);
  return (
    <>
      {mappingObject.length > 0 ? (
        <Tabs
          defaultActiveKey="0"
          className="content-library-left"
          moreIcon={'More'}>
          {mappingObject.length > 0 && contentTabCheck && (
            <Tabs.TabPane tab={t('common.labels.content')} key="0" forceRender>
              <div>
                {mappingObject.map(
                  (item, index) =>
                    item.type !== 'relation' &&
                    !(
                      isEcommerceModal &&
                      item.isSystemField &&
                      !item.name?.includes('page_title_esi') &&
                      !item.name?.includes('content_epe') &&
                      !item.name?.includes('menu_title_es')
                    ) && (
                      <FormField
                        contentModalInternalName={contentModalInternalName}
                        type={item.type}
                        props={item}
                        key={item.name}
                        isViewContentInPopupOpen={isViewContentInPopupOpen}
                      />
                    )
                )}
              </div>
            </Tabs.TabPane>
          )}
          {isEcommerceModal && (
            <Tabs.TabPane
              tab={
                providerEsi && providerEsi === 'BIGCOMMERCE'
                  ? t('common.labels.bigcommerce')
                  : t('common.labels.shopify')
              }
              key="bigcommerce"
              forceRender>
              <div>
                {mappingObject.map(
                  (item, index) =>
                    item.type !== 'relation' &&
                    isEcommerceModal &&
                    item.isSystemField &&
                    !item.name?.includes('page_title_esi') &&
                    !item.name?.includes('content_epe') && (
                      <FormField
                        contentModalInternalName={contentModalInternalName}
                        type={item.type}
                        props={item}
                        key={item.name}
                        isViewContentInPopupOpen={isViewContentInPopupOpen}
                      />
                    )
                )}
              </div>
            </Tabs.TabPane>
          )}
          {mappingObject.map(
            (item, index) =>
              !item.name &&
              !item.RepeatableComponent &&
              // @ts-ignore
              item?.values.length > 0 &&
              //@ts-ignore
              fieldPermissionCheck('read', item?.fieldName) && (
                <Tabs.TabPane
                  tab={item.componentName}
                  key={index + 100}
                  forceRender>
                  <div>
                    {item?.values?.map((data, index) => (
                      <FormField
                        contentModalInternalName={contentModalInternalName}
                        type={data.type}
                        props={data}
                        key={data.name}
                        // @ts-ignore
                        componentName={item.fieldName}
                        isViewContentInPopupOpen={isViewContentInPopupOpen}
                      />
                    ))}
                  </div>
                </Tabs.TabPane>
              )
          )}

          {mappingObject.map(
            (item, maniIndex) =>
              !item.name &&
              item.RepeatableComponent &&
              // @ts-ignore
              item?.values[0].rComponent.length > 0 &&
              //@ts-ignore
              fieldPermissionCheck('read', item?.fieldName) && (
                <Tabs.TabPane
                  tab={item.componentName}
                  key={maniIndex + 11}
                  forceRender>
                  <div className="content-library-collapse">
                    {item?.values && (
                      <Nestable
                        maxDepth={0}
                        onChange={(dragItem) => {
                          addNewComponent(
                            maniIndex,
                            mappingObject,
                            true,
                            //@ts-ignore
                            dragItem.items
                          );
                        }}
                        items={item?.values}
                        renderItem={(renderData) => (
                          <Collapse
                            onChange={(key) => {
                              onCollapseActiveKeyChange(key);
                            }}
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
                            defaultActiveKey={renderData.item.id}
                            activeKey={collapseActiveKey}>
                            <Panel
                              forceRender
                              header={`${t('common.labels.item')} ${
                                renderData.index + 1 ? renderData.index + 1 : ''
                              }`}
                              key={renderData.item.id}
                              extra={
                                item.values &&
                                item.values?.length > 1 && (
                                  <div className="delete-drag-icon">
                                    <div
                                      className={`${
                                        canUpdateRecord
                                          ? 'm-r-16'
                                          : 'table-section table-disable'
                                      }`}>
                                      <div
                                        className={`ant-row`}
                                        onClick={() => {
                                          deleteNewComponent(
                                            maniIndex,
                                            renderData.item.id,
                                            mappingObject
                                          );
                                        }}>
                                        <DeleteIcon />
                                      </div>
                                    </div>
                                    <DragIconsmall />
                                  </div>
                                )
                              }>
                              {renderData.item.rComponent &&
                                renderData.item.rComponent.map(
                                  // @ts-ignore
                                  (componentsData) => (
                                    <FormField
                                      contentModalInternalName={
                                        contentModalInternalName
                                      }
                                      type={componentsData.type}
                                      props={componentsData}
                                      key={componentsData.name}
                                      // @ts-ignore
                                      componentName={item.fieldName}
                                      isViewContentInPopupOpen={
                                        isViewContentInPopupOpen
                                      }
                                    />
                                  )
                                )}
                            </Panel>
                          </Collapse>
                        )}
                      />
                    )}
                  </div>
                  <div className="text-center">
                    <Button
                      disabled={!canUpdateRecord}
                      className="primary-color"
                      type="link"
                      icon={
                        <span className="anticon">
                          <PlusCircleIcon />
                        </span>
                      }
                      onClick={() => {
                        addNewComponent(maniIndex, mappingObject, false);
                      }}>
                      {t('common.labels.add_item')}
                    </Button>
                  </div>
                </Tabs.TabPane>
              )
          )}
        </Tabs>
      ) : (
        <div className="content-library-left"></div>
      )}
    </>
  );
};
export default FieldListComponent;
