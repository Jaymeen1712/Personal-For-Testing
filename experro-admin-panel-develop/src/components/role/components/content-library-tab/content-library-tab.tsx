import React, { MouseEventHandler } from 'react';
import { Form, Collapse, Checkbox } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { UseQueryResult } from 'react-query';
import { TFunction } from 'react-i18next';

import {
  singleCheckboxSelect,
  singleEnvironmentCheckboxSelect,
  // singleLanguageCheckboxSelect,
} from '../utils/utils';
import {
  IAPIError,
  // ILanguage,
  IListContentResponse,
  IListEnvironments,
} from '../../../../types';
import useContentLibraryTabController from './content-library-tab-controller';
import ArrowRightIcon from '../../../../images/icons/arrow-right-icon';

interface ContentLibraryProps {
  form: FormInstance;
  t: TFunction<'translation', undefined>;
  stopPropagation: MouseEventHandler<HTMLElement>;
  workspaceId: string;
  selectedWorkspaceId: string;
  editWorkspaceId: string | null;
  allContentModels: UseQueryResult<
    IListContentResponse[] | undefined,
    IAPIError
  >;
  // listLanguage: UseQueryResult<ILanguage[], IAPIError>;
  listEnvironment: UseQueryResult<IListEnvironments[], IAPIError>;
}

const ContentLibraryTab: React.FC<ContentLibraryProps> = ({
  form,
  t,
  // listLanguage,
  stopPropagation,
  workspaceId,
  selectedWorkspaceId,
  editWorkspaceId,
  allContentModels,
  // singleTypeContentModels,
  listEnvironment,
  // indeterminateStates,
  // setIndeterminateStates
}) => {
  const {
    collapseChange,
    contentModelFields,
    contentModelFieldsFlag,
    checkAllChildPermissions,
    indeterminateStates,
    setIndeterminateStates,
  } = useContentLibraryTabController(
    selectedWorkspaceId,
    editWorkspaceId,
    workspaceId,
    allContentModels
  );

  return (
    <>
      {allContentModels.isSuccess &&
        // listLanguage.isSuccess &&
        listEnvironment.isSuccess &&
        allContentModels.data?.map((contentModel) => (
          <div key={contentModel.id}>
            <Collapse
              expandIconPosition="right"
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
              onChange={collapseChange}>
              <Collapse.Panel
                forceRender
                key={contentModel.id}
                header={
                  <>
                    <div className="tab-content-left lg-width ant-row ant-space-align-center">
                      <span>{contentModel.name}</span>
                    </div>
                    <div
                      className="tab-content-right ant-row"
                      onClick={stopPropagation}>
                      <Form.Item
                        name={[
                          'contentLibrary',
                          contentModel.internalName,
                          'permissions',
                          'read',
                        ]}
                        valuePropName="checked">
                        <Checkbox
                          indeterminate={
                            indeterminateStates[contentModel.id] &&
                            indeterminateStates[contentModel.id]['read']
                          }
                          onChange={(e) =>
                            checkAllChildPermissions(
                              form,
                              e,
                              contentModel.id,
                              contentModel.internalName,
                              contentModelFields,
                              // listLanguage.data,
                              listEnvironment.data,
                              'read'
                            )
                          }>
                          {t('common.labels.read')}
                        </Checkbox>
                      </Form.Item>

                      <Form.Item
                        name={[
                          'contentLibrary',
                          contentModel.internalName,
                          'permissions',
                          'update',
                        ]}
                        valuePropName="checked">
                        <Checkbox
                          indeterminate={
                            indeterminateStates[contentModel.id] &&
                            indeterminateStates[contentModel.id]['update']
                          }
                          onChange={(e) =>
                            checkAllChildPermissions(
                              form,
                              e,
                              contentModel.id,
                              contentModel.internalName,
                              contentModelFields,
                              // listLanguage.data,
                              listEnvironment.data,
                              'update'
                            )
                          }>
                          {t('common.labels.update')}
                        </Checkbox>
                      </Form.Item>

                      <Form.Item
                        name={[
                          'contentLibrary',
                          contentModel.internalName,
                          'permissions',
                          'create',
                        ]}
                        valuePropName="checked">
                        <Checkbox
                          indeterminate={
                            indeterminateStates[contentModel.id] &&
                            indeterminateStates[contentModel.id]['create']
                          }
                          onChange={(e) =>
                            checkAllChildPermissions(
                              form,
                              e,
                              contentModel.id,
                              contentModel.internalName,
                              contentModelFields,
                              // listLanguage.data,
                              listEnvironment.data,
                              'create'
                            )
                          }>
                          {t('common.labels.create')}
                        </Checkbox>
                      </Form.Item>

                      <Form.Item
                        name={[
                          'contentLibrary',
                          contentModel.internalName,
                          'permissions',
                          'delete',
                        ]}
                        valuePropName="checked">
                        <Checkbox
                          indeterminate={
                            indeterminateStates[contentModel.id] &&
                            indeterminateStates[contentModel.id]['delete']
                          }
                          onChange={(e) =>
                            checkAllChildPermissions(
                              form,
                              e,
                              contentModel.id,
                              contentModel.internalName,
                              contentModelFields,
                              // listLanguage.data,
                              listEnvironment.data,
                              'delete'
                            )
                          }>
                          {t('common.labels.delete')}
                        </Checkbox>
                      </Form.Item>

                      <Form.Item
                        name={[
                          'contentLibrary',
                          contentModel.internalName,
                          'permissions',
                          'publish',
                        ]}
                        valuePropName="checked">
                        <Checkbox
                          indeterminate={
                            indeterminateStates[contentModel.id] &&
                            indeterminateStates[contentModel.id]['publish']
                          }
                          onChange={(e) =>
                            checkAllChildPermissions(
                              form,
                              e,
                              contentModel.id,
                              contentModel.internalName,
                              contentModelFields,
                              // listLanguage.data,
                              listEnvironment.data,
                              'publish'
                            )
                          }>
                          {t('common.labels.publish')}
                        </Checkbox>
                      </Form.Item>
                    </div>
                  </>
                }>
                <div className="ant-row ant-space-align-center tab-content-list tab-content-no-border">
                  <div className="tab-content-left lg-width ant-row ant-space-align-center">
                    <span>{t('common.labels.environments')}</span>
                  </div>
                </div>
                {listEnvironment.data.map((env) => (
                  <div
                    className="ant-row ant-space-align-center tab-content-list"
                    key={env.id}>
                    <div className="tab-content-left lg-width ant-row ant-space-align-center gray-text">
                      {env.title}
                    </div>
                    <div className="tab-content-right ant-row ant-row-end">
                      <Form.Item
                        name={[
                          'contentLibrary',
                          contentModel.internalName,
                          'publish',
                          env.id,
                        ]}
                        valuePropName="checked">
                        <Checkbox
                          onChange={(e) =>
                            singleEnvironmentCheckboxSelect(
                              form,
                              e,
                              contentModel.id,
                              contentModel.internalName,
                              listEnvironment.data,
                              contentModelFields,
                              // listLanguage.data,
                              indeterminateStates,
                              setIndeterminateStates
                            )
                          }>
                          {t('common.labels.publish')}
                        </Checkbox>
                      </Form.Item>
                    </div>
                  </div>
                ))}
                {/* <div className="ant-row ant-space-align-center tab-content-list tab-content-no-border">
                  <div className="tab-content-left lg-width ant-row ant-space-align-center">
                    <span className="FW-600">
                      {t('common.labels.local-permissions')}
                    </span>
                  </div>
                </div> */}
                {/* {listLanguage.data.map((langEle) => (
                  <div
                    className="ant-row ant-space-align-center tab-content-list"
                    key={langEle.id}>
                    <div className="tab-content-left lg-width ant-row ant-space-align-center">
                      {langEle.name}
                    </div>
                    <div className="tab-content-right ant-row ant-row-start">
                      <Form.Item
                        name={[
                          'contentLibrary',
                          contentModel.internalName,
                          'localePermissions',
                          langEle.locale,
                          'read',
                        ]}
                        valuePropName="checked">
                        <Checkbox
                          onChange={(e) =>
                            singleLanguageCheckboxSelect(
                              form,
                              e,
                              contentModel.id,
                              contentModel.internalName,
                              'read',
                              contentModelFields,
                              listLanguage.data,
                              langEle.locale
                            )
                          }>
                          {t('common.labels.read')}
                        </Checkbox>
                      </Form.Item>
                      <Form.Item
                        name={[
                          'contentLibrary',
                          contentModel.internalName,
                          'localePermissions',
                          langEle.locale,
                          'update',
                        ]}
                        valuePropName="checked">
                        <Checkbox
                          onChange={(e) =>
                            singleLanguageCheckboxSelect(
                              form,
                              e,
                              contentModel.id,
                              contentModel.internalName,
                              'update',
                              contentModelFields,
                              listLanguage.data,
                              langEle.locale
                            )
                          }>
                          {t('common.labels.update')}
                        </Checkbox>
                      </Form.Item>
                    </div>
                  </div>
                ))} */}
                {contentModelFieldsFlag[contentModel.id] &&
                  // @ts-ignore
                  contentModelFields[
                    contentModelFields.findIndex(
                      (findContent) =>
                        findContent.contentModelId === contentModel.id
                    )
                  ].fields?.length > 0 && (
                    <div className="ant-row ant-space-align-center tab-content-list tab-content-no-border">
                      <div className="tab-content-left lg-width ant-row ant-space-align-center">
                        <span>{t('common.labels.field-permission')}</span>
                      </div>
                    </div>
                  )}
                {contentModelFieldsFlag[contentModel.id] &&
                  contentModelFields[
                    contentModelFields.findIndex(
                      (findContent) =>
                        findContent.contentModelId === contentModel.id
                    )
                  ].fields?.map((field) => (
                    <div key={field.id}>
                      <div className="ant-row ant-space-align-center tab-content-list test-content">
                        <div className="tab-content-left lg-width ant-row ant-space-align-center gray-text">
                          {field.title}
                        </div>
                        <div className="tab-content-right ant-row ant-row-start">
                          <Form.Item
                            name={[
                              'contentLibrary',
                              contentModel.internalName,
                              'fieldPermissions',
                              field.fieldName,
                              'read',
                            ]}
                            valuePropName="checked">
                            <Checkbox
                              onChange={(e) =>
                                singleCheckboxSelect(
                                  form,
                                  e,
                                  contentModel.id,
                                  contentModel.internalName,
                                  'read',
                                  contentModelFields,
                                  // listLanguage.data,
                                  listEnvironment.data,
                                  field.fieldName,
                                  indeterminateStates,
                                  setIndeterminateStates
                                )
                              }>
                              {t('common.labels.read')}
                            </Checkbox>
                          </Form.Item>
                          <Form.Item
                            name={[
                              'contentLibrary',
                              contentModel.internalName,
                              'fieldPermissions',
                              field.fieldName,
                              'update',
                            ]}
                            valuePropName="checked">
                            <Checkbox
                              onChange={(e) =>
                                singleCheckboxSelect(
                                  form,
                                  e,
                                  contentModel.id,
                                  contentModel.internalName,
                                  'update',
                                  contentModelFields,
                                  // listLanguage.data,
                                  listEnvironment.data,
                                  field.fieldName,
                                  indeterminateStates,
                                  setIndeterminateStates
                                )
                              }>
                              {t('common.labels.update')}
                            </Checkbox>
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  ))}
              </Collapse.Panel>
            </Collapse>
          </div>
        ))}
    </>
  );
};

export default ContentLibraryTab;
