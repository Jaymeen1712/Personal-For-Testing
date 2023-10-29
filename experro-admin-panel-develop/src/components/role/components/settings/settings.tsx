import React from 'react';
import type { FormInstance } from 'antd/es/form';
import { Checkbox, Form } from 'antd';

import {
  emailTemplatesCheckboxSelect,
  mediaLibraryCheckboxSelect,
  nestedCheckboxSelect,
  singleCheckboxSelect,
} from '../utils/settings-utils';
import useSettings from './settings-controller';

interface SettingsProps {
  form: FormInstance;
}

const Settings: React.FC<SettingsProps> = ({ form }) => {
  const { listSettings, t } = useSettings();

  return (
    <>
      <div className="ant-row ant-space-align-center tab-content-list">
        <div className="tab-content-left lg-width">
          <h4 className="title-sm">{t('common.labels.media-library')}</h4>
          {t('common.labels.media-library-description')}
        </div>
        <div className="tab-content-right ant-row ant-row-start four-checkbox">
          <Form.Item
            className="visibility-hidden"
            name={['settings', 'mediaLibrary', 'add']}
            valuePropName="checked">
            <Checkbox
              onChange={(e) => mediaLibraryCheckboxSelect(e, form, 'add')}>
              {t('common.labels.add')}
            </Checkbox>
          </Form.Item>
          <Form.Item
            name={['settings', 'mediaLibrary', 'view']}
            valuePropName="checked">
            <Checkbox
              onChange={(e) => mediaLibraryCheckboxSelect(e, form, 'view')}>
              {t('common.labels.manage_media_library')}
            </Checkbox>
          </Form.Item>
          {/* <Form.Item
            name={['settings', 'mediaLibrary', 'add']}
            valuePropName="checked">
            <Checkbox
              onChange={(e) => mediaLibraryCheckboxSelect(e, form, 'add')}>
              {t('common.labels.add')}
            </Checkbox>
          </Form.Item>
          <Form.Item
            name={['settings', 'mediaLibrary', 'update']}
            valuePropName="checked">
            <Checkbox
              onChange={(e) => mediaLibraryCheckboxSelect(e, form, 'update')}>
              {t('common.labels.update')}
            </Checkbox>
          </Form.Item>
          <Form.Item
            name={['settings', 'mediaLibrary', 'delete']}
            valuePropName="checked">
            <Checkbox
              onChange={(e) => mediaLibraryCheckboxSelect(e, form, 'delete')}>
              {t('common.labels.delete')}
            </Checkbox>
          </Form.Item> */}
        </div>
      </div>
      <div className="ant-row ant-space-align-center tab-content-list">
        <div className="tab-content-left lg-width">
          <h4 className="title-sm">{t('common.labels.themes')}</h4>
          {t('common.labels.theme_description')}
        </div>
        <div className="tab-content-right ant-row ant-row-start four-checkbox">
          <Form.Item
            className="visibility-hidden"
            name={['settings', 'mediaLibrary', 'add']}
            valuePropName="checked">
            <Checkbox
              onChange={(e) => mediaLibraryCheckboxSelect(e, form, 'add')}>
              {t('common.labels.add')}
            </Checkbox>
          </Form.Item>
          <Form.Item
            name={['settings', 'themes', 'publish']}
            valuePropName="checked">
            <Checkbox
              onChange={(e) => mediaLibraryCheckboxSelect(e, form, 'view')}>
              {t('common.labels.publish')}
            </Checkbox>
          </Form.Item>
        </div>
      </div>
      {listSettings.settings.map((ele) => (
        <div key={ele.value}>
          {ele.subrules ? (
            <div className="tab-content-list-with-data">
              <div className="ant-row ant-space-align-center tab-content-list tab-content-no-border">
                <div className="tab-content-left lg-width" key={ele.label}>
                  <h4 className="title-sm">{ele.label}</h4>
                  {ele.description}
                </div>
              </div>
              {ele.subrules.map((ele1) => (
                <div
                  className="ant-row ant-space-align-center tab-content-list tab-content-no-border"
                  key={ele1.value}>
                  <div className="tab-content-left lg-width p-l-32">
                    <h4 className="title-sm">{ele1.label}</h4>
                  </div>
                  <div className="tab-content-right ant-row four-checkbox">
                    <Form.Item
                      name={['settings', ele.value, ele1.value, 'read']}
                      valuePropName="checked">
                      <Checkbox
                        onChange={(e) =>
                          nestedCheckboxSelect(
                            e,
                            'settings',
                            ele.value,
                            ele1.value,
                            'read',
                            form
                          )
                        }>
                        {t('common.labels.read')}
                      </Checkbox>
                    </Form.Item>
                    <Form.Item
                      name={['settings', ele.value, ele1.value, 'create']}
                      valuePropName="checked">
                      <Checkbox
                        onChange={(e) =>
                          nestedCheckboxSelect(
                            e,
                            'settings',
                            ele.value,
                            ele1.value,
                            'create',
                            form
                          )
                        }>
                        {t('common.labels.create')}
                      </Checkbox>
                    </Form.Item>
                    <Form.Item
                      name={['settings', ele.value, ele1.value, 'update']}
                      valuePropName="checked">
                      <Checkbox
                        onChange={(e) =>
                          nestedCheckboxSelect(
                            e,
                            'settings',
                            ele.value,
                            ele1.value,
                            'update',
                            form
                          )
                        }>
                        {t('common.labels.update')}
                      </Checkbox>
                    </Form.Item>
                    <Form.Item
                      name={['settings', ele.value, ele1.value, 'delete']}
                      valuePropName="checked">
                      <Checkbox
                        onChange={(e) =>
                          nestedCheckboxSelect(
                            e,
                            'settings',
                            ele.value,
                            ele1.value,
                            'delete',
                            form
                          )
                        }>
                        {t('common.labels.delete')}
                      </Checkbox>
                    </Form.Item>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="ant-row ant-space-align-center tab-content-list"
              key={ele.description}>
              <div className="tab-content-left lg-width">
                <h4 className="title-sm">{ele.label}</h4>
                {ele.description}
              </div>
              <div className="tab-content-right ant-row four-checkbox">
                <Form.Item
                  name={['settings', ele.value, 'read']}
                  valuePropName="checked">
                  <Checkbox
                    onChange={(e) =>
                      singleCheckboxSelect(
                        e,
                        'settings',
                        ele.value,
                        'read',
                        form
                      )
                    }>
                    {t('common.labels.read')}
                  </Checkbox>
                </Form.Item>
                <Form.Item
                  name={['settings', ele.value, 'create']}
                  valuePropName="checked">
                  <Checkbox
                    onChange={(e) =>
                      singleCheckboxSelect(
                        e,
                        'settings',
                        ele.value,
                        'create',
                        form
                      )
                    }>
                    {t('common.labels.create')}
                  </Checkbox>
                </Form.Item>
                <Form.Item
                  name={['settings', ele.value, 'update']}
                  valuePropName="checked">
                  <Checkbox
                    onChange={(e) =>
                      singleCheckboxSelect(
                        e,
                        'settings',
                        ele.value,
                        'update',
                        form
                      )
                    }>
                    {t('common.labels.update')}
                  </Checkbox>
                </Form.Item>
                <Form.Item
                  name={['settings', ele.value, 'delete']}
                  valuePropName="checked">
                  <Checkbox
                    onChange={(e) =>
                      singleCheckboxSelect(
                        e,
                        'settings',
                        ele.value,
                        'delete',
                        form
                      )
                    }>
                    {t('common.labels.delete')}
                  </Checkbox>
                </Form.Item>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="ant-row ant-space-align-center tab-content-list">
        <div className="tab-content-left lg-width">
          <h4 className="title-sm">{t('common.labels.cms_tokens')}</h4>
          {t('common.labels.cms_tokens_description')}
        </div>
        <div className="tab-content-right ant-row ant-row-start four-checkbox">
          <Form.Item
            className="visibility-hidden"
            name={['settings', 'cmsTokens', 'permissions', 'read']}
            valuePropName="checked">
            <Checkbox>{t('common.labels.add')}</Checkbox>
          </Form.Item>
          <Form.Item
            name={['settings', 'cmsTokens', 'permissions', 'read']}
            valuePropName="checked">
            <Checkbox
              onChange={(e) =>
                emailTemplatesCheckboxSelect(e, form, 'cmsTokens')
              }>
              {t('common.labels.read')}
            </Checkbox>
          </Form.Item>
        </div>
      </div>
      <div className="tab-content-list-with-data">
        <div
          className="ant-row ant-space-align-center tab-content-list tab-content-no-border"
          key="email-templates">
          <div className="tab-content-left lg-width p-l-32">
            <h4 className="title-sm">{t('common.labels.api_tokens')}</h4>
          </div>
          <div className="tab-content-right ant-row four-checkbox">
            <Form.Item
              name={['settings', 'cmsTokens', 'apiTokens', 'read']}
              valuePropName="checked">
              <Checkbox
                onChange={(e) =>
                  nestedCheckboxSelect(
                    e,
                    'settings',
                    'cmsTokens',
                    'apiTokens',
                    'read',
                    form
                  )
                }>
                {t('common.labels.read')}
              </Checkbox>
            </Form.Item>
            <Form.Item
              name={['settings', 'cmsTokens', 'apiTokens', 'create']}
              valuePropName="checked">
              <Checkbox
                onChange={(e) =>
                  nestedCheckboxSelect(
                    e,
                    'settings',
                    'cmsTokens',
                    'apiTokens',
                    'create',
                    form
                  )
                }>
                {t('common.labels.create')}
              </Checkbox>
            </Form.Item>
            <Form.Item
              name={['settings', 'cmsTokens', 'apiTokens', 'update']}
              valuePropName="checked">
              <Checkbox
                onChange={(e) =>
                  nestedCheckboxSelect(
                    e,
                    'settings',
                    'cmsTokens',
                    'apiTokens',
                    'update',
                    form
                  )
                }>
                {t('common.labels.update')}
              </Checkbox>
            </Form.Item>
            <Form.Item
              name={['settings', 'cmsTokens', 'apiTokens', 'delete']}
              valuePropName="checked">
              <Checkbox
                onChange={(e) =>
                  nestedCheckboxSelect(
                    e,
                    'settings',
                    'cmsTokens',
                    'apiTokens',
                    'delete',
                    form
                  )
                }>
                {t('common.labels.delete')}
              </Checkbox>
            </Form.Item>
          </div>
        </div>

        <div
          className="ant-row ant-space-align-center tab-content-list tab-content-no-border"
          key="smtp">
          <div className="tab-content-left lg-width p-l-32">
            <h4 className="title-sm">{t('common.labels.cli_tokens')}</h4>
          </div>
          <div className="tab-content-right ant-row four-checkbox">
            <Form.Item
              name={['settings', 'cmsTokens', 'cliTokens', 'read']}
              valuePropName="checked">
              <Checkbox
                onChange={(e) =>
                  nestedCheckboxSelect(
                    e,
                    'settings',
                    'cmsTokens',
                    'cliTokens',
                    'read',
                    form
                  )
                }>
                {t('common.labels.read')}
              </Checkbox>
            </Form.Item>
            <Form.Item
              name={['settings', 'cmsTokens', 'cliTokens', 'create']}
              valuePropName="checked">
              <Checkbox
                onChange={(e) =>
                  nestedCheckboxSelect(
                    e,
                    'settings',
                    'cmsTokens',
                    'cliTokens',
                    'create',
                    form
                  )
                }>
                {t('common.labels.create')}
              </Checkbox>
            </Form.Item>
            <Form.Item
              name={['settings', 'cmsTokens', 'cliTokens', 'update']}
              valuePropName="checked">
              <Checkbox
                onChange={(e) =>
                  nestedCheckboxSelect(
                    e,
                    'settings',
                    'cmsTokens',
                    'cliTokens',
                    'update',
                    form
                  )
                }>
                {t('common.labels.update')}
              </Checkbox>
            </Form.Item>
            <Form.Item
              name={['settings', 'cmsTokens', 'cliTokens', 'delete']}
              valuePropName="checked">
              <Checkbox
                onChange={(e) =>
                  nestedCheckboxSelect(
                    e,
                    'settings',
                    'cmsTokens',
                    'cliTokens',
                    'delete',
                    form
                  )
                }>
                {t('common.labels.delete')}
              </Checkbox>
            </Form.Item>
          </div>
        </div>
      </div>

      <div className="ant-row ant-space-align-center tab-content-list">
        <div className="tab-content-left lg-width">
          <h4 className="title-sm">{t('common.labels.email_templates')}</h4>
          {t('common.labels.email_templates_description')}
        </div>
        <div className="tab-content-right ant-row ant-row-start four-checkbox">
          <Form.Item
            className="visibility-hidden"
            name={['settings', 'emailTemplates', 'permissions', 'read']}
            valuePropName="checked">
            <Checkbox>{t('common.labels.add')}</Checkbox>
          </Form.Item>
          <Form.Item
            name={['settings', 'emailTemplates', 'permissions', 'read']}
            valuePropName="checked">
            <Checkbox
              onChange={(e) =>
                emailTemplatesCheckboxSelect(e, form, 'emailTemplates')
              }>
              {t('common.labels.read')}
            </Checkbox>
          </Form.Item>
        </div>
      </div>
      <div className="tab-content-list-with-data">
        <div
          className="ant-row ant-space-align-center tab-content-list tab-content-no-border"
          key="email-templates">
          <div className="tab-content-left lg-width p-l-32">
            <h4 className="title-sm">{t('common.labels.email_template')}</h4>
          </div>
          <div className="tab-content-right ant-row four-checkbox">
            <Form.Item
              name={['settings', 'emailTemplates', 'emailTemplate', 'read']}
              valuePropName="checked">
              <Checkbox
                onChange={(e) =>
                  nestedCheckboxSelect(
                    e,
                    'settings',
                    'emailTemplates',
                    'emailTemplate',
                    'read',
                    form
                  )
                }>
                {t('common.labels.read')}
              </Checkbox>
            </Form.Item>
            <Form.Item
              name={['settings', 'emailTemplates', 'emailTemplate', 'create']}
              valuePropName="checked">
              <Checkbox
                onChange={(e) =>
                  nestedCheckboxSelect(
                    e,
                    'settings',
                    'emailTemplates',
                    'emailTemplate',
                    'create',
                    form
                  )
                }>
                {t('common.labels.create')}
              </Checkbox>
            </Form.Item>
            <Form.Item
              name={['settings', 'emailTemplates', 'emailTemplate', 'update']}
              valuePropName="checked">
              <Checkbox
                onChange={(e) =>
                  nestedCheckboxSelect(
                    e,
                    'settings',
                    'emailTemplates',
                    'emailTemplate',
                    'update',
                    form
                  )
                }>
                {t('common.labels.update')}
              </Checkbox>
            </Form.Item>
            <Form.Item
              name={['settings', 'emailTemplates', 'emailTemplate', 'delete']}
              valuePropName="checked">
              <Checkbox
                onChange={(e) =>
                  nestedCheckboxSelect(
                    e,
                    'settings',
                    'emailTemplates',
                    'emailTemplate',
                    'delete',
                    form
                  )
                }>
                {t('common.labels.delete')}
              </Checkbox>
            </Form.Item>
          </div>
        </div>

        <div
          className="ant-row ant-space-align-center tab-content-list tab-content-no-border"
          key="smtp">
          <div className="tab-content-left lg-width p-l-32">
            <h4 className="title-sm">{t('common.labels.smtp')}</h4>
          </div>
          <div className="tab-content-right ant-row four-checkbox">
            <Form.Item
              name={['settings', 'emailTemplates', 'smtp', 'read']}
              valuePropName="checked">
              <Checkbox
                onChange={(e) =>
                  nestedCheckboxSelect(
                    e,
                    'settings',
                    'emailTemplates',
                    'smtp',
                    'read',
                    form
                  )
                }>
                {t('common.labels.read')}
              </Checkbox>
            </Form.Item>
            <Form.Item
              className="visibility-hidden"
              name={['settings', 'emailTemplates', 'permissions', 'read']}
              valuePropName="checked">
              <Checkbox
                onChange={(e) => mediaLibraryCheckboxSelect(e, form, 'read')}>
                {t('common.labels.add')}
              </Checkbox>
            </Form.Item>
            <Form.Item
              name={['settings', 'emailTemplates', 'smtp', 'update']}
              valuePropName="checked">
              <Checkbox
                onChange={(e) =>
                  nestedCheckboxSelect(
                    e,
                    'settings',
                    'emailTemplates',
                    'smtp',
                    'update',
                    form
                  )
                }>
                {t('common.labels.update')}
              </Checkbox>
            </Form.Item>
            <Form.Item
              className="visibility-hidden"
              name={['settings', 'emailTemplates', 'permissions', 'read']}
              valuePropName="checked">
              <Checkbox
                onChange={(e) => mediaLibraryCheckboxSelect(e, form, 'read')}>
                {t('common.labels.add')}
              </Checkbox>
            </Form.Item>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
