import React, { MouseEventHandler } from 'react';
import { Form, Collapse, Checkbox } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { UseQueryResult } from 'react-query';
import { TFunction } from 'react-i18next';

import {
  checkAllChildModelPermissions,
  contentModelComponentPermission,
  contentModelPermissionMethod,
  contentModelSingleCheckboxSelect,
} from '../utils/utils';
import { IAPIError, IListContentResponse } from '../../../../types';
import useContentModelTabController from './content-model-tab-controller';
import ArrowRightIcon from "../../../../images/icons/arrow-right-icon";

interface SingleTypeProps {
  form: FormInstance;
  t: TFunction<'translation', undefined>;
  stopPropagation: MouseEventHandler<HTMLElement>;
  allContentModels: UseQueryResult<
    IListContentResponse[] | undefined,
    IAPIError
  >;
  // listLanguage: UseQueryResult<ILanguage[], IAPIError>;
}

const ContentModelTab: React.FC<SingleTypeProps> = ({
  form,
  t,
  stopPropagation,
  allContentModels,
  // singleTypeContentModels,
}) => {
  const { indeterminateStates, setIndeterminateStates } =
    useContentModelTabController();

  return (
    <>
      <div className="ant-row ant-space-align-center tab-content-list">
        <div className="tab-content-left lg-width">
          <h4 className="title-sm">{t('common.labels.components')}</h4>
          {t('common.labels.component_description')}
        </div>
        <div className="tab-content-right four-checkbox ant-row">
          <Form.Item
            name={['contentModel', 'components', 'permissions', 'create']}
            valuePropName="checked">
            <Checkbox
              onChange={(e) =>
                contentModelComponentPermission(form, e, 'create')
              }>
              {t('common.labels.create')}
            </Checkbox>
          </Form.Item>
          <Form.Item
            name={['contentModel', 'components', 'permissions', 'read']}
            valuePropName="checked">
            <Checkbox
              onChange={(e) =>
                contentModelComponentPermission(form, e, 'read')
              }>
              {t('common.labels.read')}
            </Checkbox>
          </Form.Item>
          <Form.Item
            name={['contentModel', 'components', 'permissions', 'update']}
            valuePropName="checked">
            <Checkbox
              onChange={(e) =>
                contentModelComponentPermission(form, e, 'update')
              }>
              {t('common.labels.update')}
            </Checkbox>
          </Form.Item>
          <Form.Item
            name={['contentModel', 'components', 'permissions', 'delete']}
            valuePropName="checked">
            <Checkbox
              onChange={(e) =>
                contentModelComponentPermission(form, e, 'delete')
              }>
              {t('common.labels.delete')}
            </Checkbox>
          </Form.Item>
        </div>
      </div>
      {allContentModels.isSuccess && (
        <div className="ant-row ant-space-align-center tab-content-list">
          <div className="tab-content-left lg-width">
            <h4 className="title-sm">{t('common.labels.model')}</h4>
            {t('common.labels.model_description')}
          </div>
          <div className="tab-content-right four-checkbox ant-row">
            <Form.Item
              name={['contentModel', 'model', 'permissions', 'create']}
              valuePropName="checked">
              <Checkbox
                onChange={(e) =>
                  checkAllChildModelPermissions(
                    form,
                    e,
                    'create',
                    indeterminateStates,
                    setIndeterminateStates,
                    allContentModels.data
                  )
                }>
                {t('common.labels.create')}
              </Checkbox>
            </Form.Item>
            <Form.Item
              name={['contentModel', 'model', 'permissions', 'read']}
              valuePropName="checked">
              <Checkbox
                indeterminate={indeterminateStates.read}
                onChange={(e) =>
                  checkAllChildModelPermissions(
                    form,
                    e,
                    'read',
                    indeterminateStates,
                    setIndeterminateStates,
                    allContentModels.data
                  )
                }>
                {t('common.labels.read')}
              </Checkbox>
            </Form.Item>
            <Form.Item
              name={['contentModel', 'model', 'permissions', 'update']}
              valuePropName="checked">
              <Checkbox
                indeterminate={indeterminateStates.update}
                onChange={(e) =>
                  checkAllChildModelPermissions(
                    form,
                    e,
                    'update',
                    indeterminateStates,
                    setIndeterminateStates,
                    allContentModels.data
                  )
                }>
                {t('common.labels.update')}
              </Checkbox>
            </Form.Item>
            <Form.Item
              name={['contentModel', 'model', 'permissions', 'delete']}
              valuePropName="checked">
              <Checkbox
                indeterminate={indeterminateStates.delete}
                onChange={(e) =>
                  checkAllChildModelPermissions(
                    form,
                    e,
                    'delete',
                    indeterminateStates,
                    setIndeterminateStates,
                    allContentModels.data
                  )
                }>
                {t('common.labels.delete')}
              </Checkbox>
            </Form.Item>
          </div>
        </div>
      )}
      {allContentModels.isSuccess &&
        allContentModels.data?.map((ele) => (
          <div key={ele.id}>
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
              }>
              <Collapse.Panel
                forceRender
                key={ele.id}
                header={
                  <>
                    <div className="tab-content-left lg-width ant-row ant-space-align-center">
                      <span>{ele.name}</span>
                    </div>
                    <div
                      className="tab-content-right ant-row"
                      onClick={stopPropagation}>
                      <Form.Item
                        name={[
                          'contentModel',
                          'model',
                          ele.internalName,
                          'permissions',
                          'read',
                        ]}
                        valuePropName="checked">
                        <Checkbox
                          onChange={(e) =>
                            contentModelPermissionMethod(
                              form,
                              e,
                              ele.internalName,
                              'read',
                              indeterminateStates,
                              setIndeterminateStates,
                              allContentModels.data
                            )
                          }>
                          {t('common.labels.read')}
                        </Checkbox>
                      </Form.Item>
                      {/* <Form.Item
                        name={[
                          'contentModel',
                          ele.internalName,
                          'permissions',
                          'create',
                        ]}
                        valuePropName="checked">
                        <Checkbox
                          onChange={(e) =>
                            contentModelPermissionMethod(
                              form,
                              e,
                              ele.internalName,
                              'create'
                            )
                          }>
                          {t('common.labels.create')}
                        </Checkbox>
                      </Form.Item> */}
                      <Form.Item
                        name={[
                          'contentModel',
                          'model',
                          ele.internalName,
                          'permissions',
                          'update',
                        ]}
                        valuePropName="checked">
                        <Checkbox
                          onChange={(e) =>
                            contentModelPermissionMethod(
                              form,
                              e,
                              ele.internalName,
                              'update',
                              indeterminateStates,
                              setIndeterminateStates,
                              allContentModels.data
                            )
                          }>
                          {t('common.labels.update')}
                        </Checkbox>
                      </Form.Item>
                      <Form.Item
                        name={[
                          'contentModel',
                          'model',
                          ele.internalName,
                          'permissions',
                          'delete',
                        ]}
                        valuePropName="checked">
                        <Checkbox
                          onChange={(e) =>
                            contentModelPermissionMethod(
                              form,
                              e,
                              ele.internalName,
                              'delete',
                              indeterminateStates,
                              setIndeterminateStates,
                              allContentModels.data
                            )
                          }>
                          {t('common.labels.delete')}
                        </Checkbox>
                      </Form.Item>
                    </div>
                  </>
                }>
                <div className="ant-row ant-space-align-center tab-content-list tab-content-no-border">
                  <div className="tab-content-left lg-width ant-row ant-space-align-center">
                    <span>{t('common.labels.field-permission')}</span>
                  </div>

                  <div className="tab-content-right ant-row">
                    <Form.Item
                      name={[
                        'contentModel',
                        'model',
                        ele.internalName,
                        'fieldPermissions',
                        'create',
                      ]}
                      valuePropName="checked">
                      <Checkbox
                        onChange={(e) =>
                          contentModelSingleCheckboxSelect(
                            form,
                            e,
                            ele.internalName,
                            'create',
                            indeterminateStates,
                            setIndeterminateStates,
                            allContentModels.data
                          )
                        }>
                        {t('common.labels.create')}
                      </Checkbox>
                    </Form.Item>
                    <Form.Item
                      name={[
                        'contentModel',
                        'model',
                        ele.internalName,
                        'fieldPermissions',
                        'read',
                      ]}
                      valuePropName="checked">
                      <Checkbox
                        onChange={(e) =>
                          contentModelSingleCheckboxSelect(
                            form,
                            e,
                            ele.internalName,
                            'read',
                            indeterminateStates,
                            setIndeterminateStates,
                            allContentModels.data
                          )
                        }>
                        {t('common.labels.read')}
                      </Checkbox>
                    </Form.Item>
                    <Form.Item
                      name={[
                        'contentModel',
                        'model',
                        ele.internalName,
                        'fieldPermissions',
                        'update',
                      ]}
                      valuePropName="checked">
                      <Checkbox
                        onChange={(e) =>
                          contentModelSingleCheckboxSelect(
                            form,
                            e,
                            ele.internalName,
                            'update',
                            indeterminateStates,
                            setIndeterminateStates,
                            allContentModels.data
                          )
                        }>
                        {t('common.labels.update')}
                      </Checkbox>
                    </Form.Item>

                    <Form.Item
                      name={[
                        'contentModel',
                        'model',
                        ele.internalName,
                        'fieldPermissions',
                        'delete',
                      ]}
                      valuePropName="checked">
                      <Checkbox
                        onChange={(e) =>
                          contentModelSingleCheckboxSelect(
                            form,
                            e,
                            ele.internalName,
                            'delete',
                            indeterminateStates,
                            setIndeterminateStates,
                            allContentModels.data
                            // singleTypeContentModels.data
                          )
                        }>
                        {t('common.labels.delete')}
                      </Checkbox>
                    </Form.Item>
                  </div>
                </div>
              </Collapse.Panel>
            </Collapse>
          </div>
        ))}
    </>
  );
};

export default ContentModelTab;
