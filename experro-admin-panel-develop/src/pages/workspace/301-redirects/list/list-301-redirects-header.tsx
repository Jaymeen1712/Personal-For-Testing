import React, { MutableRefObject } from 'react';
import { TFunction } from 'react-i18next';
import { UseQueryResult } from 'react-query';
import { Button, Dropdown, Menu } from 'antd';

import HamburgerIcon from '../../../../images/icons/hamburger-icon';
import EllipsisIcon from '../../../../images/icons/ellipsis-icon';
import PlusIcon from '../../../../images/icons/plus-icon';
import { I301Redirect } from '../../../../types';
import { onSidebarToggle } from '../../../../utills';

interface IList301RedirectsHeader {
  t: TFunction<'translation', undefined>;
  list301Redirects: UseQueryResult<
    { items: I301Redirect[]; totalCount: number },
    unknown
  >;
  deleteRedirectIds: string[] | React.Key[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setIsImportModalVisible: (isImportModalVisible: boolean) => void;
  exportRedirects: () => void;
  onAddRedirect: () => void;
  canCreate301Redirect: () => boolean;
  canRead301Redirect: () => boolean;
  scrollTopRef: MutableRefObject<null>;
}

const List301RedirectsHeader: React.FC<IList301RedirectsHeader> = ({
  t,
  list301Redirects,
  deleteRedirectIds,
  setIsImportModalVisible,
  exportRedirects,
  onAddRedirect,
  canCreate301Redirect,
  canRead301Redirect,
  scrollTopRef,
}) => {
  return (
    <div
      ref={scrollTopRef}
      className="headerinner ant-row ant-space-align-start ant-row-space-between ">
      <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
        <div className="hamburgericon" onClick={onSidebarToggle}>
          <HamburgerIcon />
        </div>
        <div className="w-100 ant-row ant-space-vertical">
          <span className="ant-page-header-heading-title">
            {t('common.labels.301_redirects_title')}
          </span>
          <span className="ant-page-header-heading-sub-title m-t-4">
            {t('common.labels.301_redirects_subtitle')}
          </span>
        </div>
      </div>
      <div className="headerright">
        <div className="ant-row ant-row-end">
          {list301Redirects.isSuccess &&
            list301Redirects.data.items.length > 0 && (
              <>
                <Dropdown
                  disabled={deleteRedirectIds.length > 0}
                  placement="bottomRight"
                  trigger={['click']}
                  overlay={
                    <div className="table-dropdown file-action-dropdown">
                      {!deleteRedirectIds.length && (
                        <Menu>
                          {canCreate301Redirect() && (
                            <Menu.Item key="import">
                              <Button
                                type="text"
                                key="import-file"
                                onClick={() => setIsImportModalVisible(true)}>
                                {t('common.labels.import_file')}
                              </Button>
                            </Menu.Item>
                          )}
                          {canRead301Redirect() && (
                            <Menu.Item key="export">
                              <Button
                                type="text"
                                key="export-file"
                                onClick={exportRedirects}>
                                {t('common.labels.export_file')}
                              </Button>
                            </Menu.Item>
                          )}
                        </Menu>
                      )}
                    </div>
                  }>
                  <Button
                    type="default"
                    size="middle"
                    className="btn-hover-gray"
                    icon={<EllipsisIcon />}
                  />
                </Dropdown>
                {canCreate301Redirect() && (
                  <Button
                    type="primary"
                    icon={
                      <span className="anticon">
                        <PlusIcon />
                      </span>
                    }
                    onClick={onAddRedirect}
                    disabled={deleteRedirectIds.length ? true : false}>
                    {t('common.labels.add_redirect')}
                  </Button>
                )}
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default List301RedirectsHeader;
