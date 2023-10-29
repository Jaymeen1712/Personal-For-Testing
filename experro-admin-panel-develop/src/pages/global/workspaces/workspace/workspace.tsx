import React from 'react';
import {
  Card,
  Avatar,
  Typography,
  Dropdown,
  Menu,
  Button,
  Tooltip,
} from 'antd';

import { IWorkspace, IWorkspaceResponse } from '../../../../types';
import useWorkspace from './workspace-controller';
import CopyIcon from '../../../../images/icons/copy-icon';
import { APIS_ROUTES, avatarColorCode } from '../../../../utills';
import EllipsisIcon from '../../../../images/icons/ellipsis-icon';

const { Paragraph } = Typography;

export interface WorkspaceProps {
  workspace: IWorkspaceResponse;
  onEditWorkspace: (workspace: IWorkspace) => void;
  onDeleteWorkspace: (workspace: IWorkspace) => void;
  canManageGlobalWorkspace: boolean;
  isModalVisible?: boolean;
  isDeleteModalVisible?: boolean;
}

const Workspace: React.FC<WorkspaceProps> = ({
  workspace,
  onEditWorkspace,
  onDeleteWorkspace,
  canManageGlobalWorkspace,
  isModalVisible,
  isDeleteModalVisible,
}) => {
  const { link, copiedText, duration, t, onWorkspaceClick } = useWorkspace({
    workspace,
    onEditWorkspace,
    onDeleteWorkspace,
  });

  return (
    <>
      <Card
        hoverable
        onClick={onWorkspaceClick}
        title={workspace.name}
        extra={
          <div className="ant-row ant-space-align-center workspace-btn-section">
            <Tooltip placement="top" title={'Copy Link'}>
              <Paragraph
                className="m-r-16"
                copyable={{
                  text: `https://${window.location.host}${link}`,
                  icon: <CopyIcon />,
                  tooltips: false,
                  onCopy: copiedText,
                }}
              />
            </Tooltip>
            {canManageGlobalWorkspace && (
              <Dropdown
                placement="bottomRight"
                trigger={['click']}
                overlay={
                  <div
                    className={`table-dropdown ${
                      (isModalVisible || isDeleteModalVisible) &&
                      'ant-dropdown-hidden'
                    }`}>
                    <Menu>
                      <>
                        <Menu.Item
                          onClick={(event) => {
                            event.domEvent.stopPropagation();
                            onEditWorkspace(workspace);
                          }}>
                          {t('common.labels.edit')}
                        </Menu.Item>

                        <Menu.Item
                          onClick={(event) => {
                            event.domEvent.stopPropagation();
                            onDeleteWorkspace(workspace);
                          }}>
                          <p className="text-red m-0">
                            {t('common.labels.delete')}
                          </p>
                        </Menu.Item>
                      </>
                    </Menu>
                  </div>
                }>
                <Button
                  type="text"
                  size="small"
                  onClick={(event) => event.stopPropagation()}
                  className="on-hover"
                  icon={<EllipsisIcon />}
                  style={{ float: 'right' }}
                />
              </Dropdown>
            )}
          </div>
        }>
        <div className="w-100 card-description">
          {workspace.description && (
            <p className="m-0" title={workspace.description}>
              {workspace.description}
            </p>
          )}
        </div>
        <div className="ant-row ant-space-align-end w-100">
          <div className="ant-space-align-end ant-row ant-row-space-between w-100">
            <Avatar.Group
              maxCount={4}
              maxPopoverTrigger="click"
              maxStyle={{
                color: '#6B7280',
                backgroundColor: '#F3F4F6',
                cursor: 'pointer',
              }}>
              {workspace.users?.map((user) =>
                user.isProfileImage ? (
                  <Avatar
                    src={`${process.env.REACT_APP_API_URL}${
                      APIS_ROUTES.PROFILE_IMAGE_THUMBNAIL
                    }/image-thumbnail?width=80&height=80&&content_type=url&random=${new Date().getTime()}&url=${
                      user.imageUrl
                    }`}
                  />
                ) : (
                  <Avatar
                    key={user.firstName}
                    className={`avatar-${avatarColorCode(user.firstName)}`}>
                    {user.firstName?.charAt(0).toUpperCase()}
                    {user.lastName
                      ? user.lastName?.charAt(0).toUpperCase()
                      : user.firstName?.charAt(0).toUpperCase()}
                  </Avatar>
                )
              )}
            </Avatar.Group>
            <p className="m-0 edit-description">
              <small>
                {t('common.labels.duration', {
                  duration: `${duration}`,
                })}
              </small>
            </p>
          </div>
        </div>
      </Card>
    </>
  );
};

export default Workspace;
