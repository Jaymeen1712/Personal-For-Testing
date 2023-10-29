import React from 'react';
import { Select } from 'antd';
import { Route, Switch } from 'react-router-dom';

import useTemplatesController from './templates-controller';
import DownArrowIcon from '../../../../images/icons/downarrow-icon';
import ListTemplates from './list';

const Templates = () => {
  const {
    t,
    onListMasterTemplateChange,
    listMasterTemplateEmails,
    selectedMasterTemplateId,
    path,
  } = useTemplatesController();

  return (
    <>
      <>
        {listMasterTemplateEmails.isSuccess &&
          listMasterTemplateEmails.data &&
          listMasterTemplateEmails.data?.length > 0 && (
            <>
              <div className="m-b-8 gray-text">
                <span>{t('common.labels.template')}</span>
              </div>
              <Select
                className="m-b-40"
                style={{ width: 400 }}
                suffixIcon={<DownArrowIcon />}
                value={selectedMasterTemplateId}
                onChange={onListMasterTemplateChange}>
                {listMasterTemplateEmails &&
                  listMasterTemplateEmails.data &&
                  listMasterTemplateEmails.data.map((masterTemplate) => (
                    <Select.Option
                      key={masterTemplate.id}
                      value={masterTemplate.id}>
                      {masterTemplate.name}
                    </Select.Option>
                  ))}
              </Select>
            </>
          )}
      </>

      <Switch>
        <Route exact path={`${path}/:masterTemplateId`}>
          <ListTemplates />
        </Route>
      </Switch>
    </>
  );
};

export default Templates;
