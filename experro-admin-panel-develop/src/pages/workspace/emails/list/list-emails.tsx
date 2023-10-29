import React from 'react';
import { Tabs } from 'antd';
import { Route, Switch } from 'react-router-dom';

import Templates from '../templates';
import PhrasesEmails from '../phrases';
import SmtpConfig from '../smtp-config';
import useListEmailsController from './list-emails-controller';
import HeaderListEmails from './header-list-emails';

const ListEmails = () => {
  const { t, defaultActiveKey, onTabChange, permissions, path, emailRef } =
    useListEmailsController();

  return (
    <>
      <Switch>
        <Route path={`${path}/:source`}>
          <HeaderListEmails t={t} emailRef={emailRef} />
          <Tabs
            onChange={onTabChange}
            defaultActiveKey={defaultActiveKey}
            className="email-tabs">
            {permissions.canReadEmailTemplatesTemplate() && (
              <Tabs.TabPane tab={t('common.labels.templates')} key="templates">
                <Templates />
              </Tabs.TabPane>
            )}

            {permissions.canReadEmailTemplatesTemplate() && (
              <Tabs.TabPane tab={t('common.labels.phrases')} key="phrases">
                <PhrasesEmails
                  defaultActiveKey={defaultActiveKey}
                  emailRef={emailRef}
                />
              </Tabs.TabPane>
            )}

            {permissions.canReadEmailTemplatesSmtp() && (
              <Tabs.TabPane
                tab={t('common.labels.smtp_config')}
                key="smtpConfig">
                <SmtpConfig />
              </Tabs.TabPane>
            )}
          </Tabs>
        </Route>
      </Switch>
    </>
  );
};

export default ListEmails;
