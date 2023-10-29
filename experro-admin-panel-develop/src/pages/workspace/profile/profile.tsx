import React from 'react';
import {
  Button,
  Form,
  Avatar,
  Upload,
  Spin,
  Space,
  Typography,
  Input,
  Select,
} from 'antd';
import get from 'lodash.get';
import { LoadingOutlined } from '@ant-design/icons';

import useProfileController from './profile-controller';
import EditIcon from '../../../images/icons/edit-icon';
import {
  APIS_ROUTES,
  avatarColorCode,
  onSidebarToggle,
  SIDEBAR_KEYS,
  SUB_SIDEBAR_KEYS,
} from '../../../utills';
import DownArrowIcon from '../../../images/icons/downarrow-icon';
import SubSideBar from '../../../components/sub-sidebar';
import HamburgerIcon from '../../../images/icons/hamburger-icon';

interface IProfile {
  onMainSidebarActiveItem?: (val: string) => void;
}

const Profile: React.FC = ({ onMainSidebarActiveItem }: IProfile) => {
  const {
    t,
    userProfile,
    onFinish,
    updateProfile,
    form,
    uploadProps,
    browserTZ,
    onRemoveProfileImage,
    loading,
    onValueChange,
    isSaveButtonDisable,
    onCancel,
    isCancelButtonDisable,
    listTimeZones,
    listLanguages,
  } = useProfileController({ onMainSidebarActiveItem });

  const { Text } = Typography;

  return (
    <div className="page-content page-wrapper">
      <SubSideBar
        sidebarActiveItemKey={SIDEBAR_KEYS.USER.ACCOUNT}
        subSidebarActiveItemKey={SUB_SIDEBAR_KEYS.USER.ACCOUNT.PROFILE}>
        <Form
          autoComplete="off"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          initialValues={
            userProfile.data?.timezone
              ? { ...userProfile.data, timezone: userProfile.data?.timezone }
              : { ...userProfile.data, timezone: browserTZ }
          }
          layout="vertical"
          onFinish={onFinish}
          key={get(userProfile.data, 'firstName', '')}
          form={form}
          name="profile-form"
          onValuesChange={onValueChange}>
          <div className="headerinner ant-row ant-space-align-start ant-row-space-between">
            <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
              <div className="hamburgericon" onClick={onSidebarToggle}>
                <HamburgerIcon />
              </div>
              <div className="w-100 ant-row ant-space-vertical">
                <span className="ant-page-header-heading-title">
                  {t('common.labels.profile')}
                </span>
                <span className="ant-page-header-heading-sub-title m-t-4">
                  {t('common.labels.edit_profile_settings')}
                </span>
              </div>
            </div>
          </div>
          <div className="page-content-top">
            <div className="w-480">
              <div className="profile-image-section ant-row ant-space-align-center m-b-32 p-b-16">
                <div className="user-profile-image m-r-24">
                  <Avatar
                    size={80}
                    className={
                      !userProfile.isFetching &&
                      !userProfile.data?.isProfileImage &&
                      !loading
                        ? `avatar-${avatarColorCode(
                            userProfile.data && userProfile.data.firstName
                          )}`
                        : ''
                    }
                    src={
                      userProfile.data?.isProfileImage &&
                      `${process.env.REACT_APP_API_URL}${
                        APIS_ROUTES.PROFILE_IMAGE_THUMBNAIL
                      }/image-thumbnail?width=80&height=80&&content_type=url&random=${new Date().getTime()}&url=${
                        userProfile.data?.profileUrl
                      }`
                    }
                    icon={
                      loading && (
                        <Spin
                          className="HV-center table-center"
                          indicator={
                            <LoadingOutlined style={{ fontSize: 30 }} spin />
                          }
                          size="large"
                        />
                      )
                    }>
                    {!userProfile.isFetching &&
                      !userProfile.data?.isProfileImage &&
                      userProfile.data?.firstName
                        .charAt(0)
                        .toUpperCase()
                        .concat(
                          userProfile.data?.lastName
                            ? userProfile.data?.lastName.charAt(0).toUpperCase()
                            : userProfile.data?.firstName
                                .charAt(1)
                                .toUpperCase()
                        )}
                  </Avatar>
                  <>
                    <Upload {...uploadProps}>
                      <Button type="primary" icon={<EditIcon />} size="small" />
                    </Upload>
                  </>
                </div>
                <div className="profile-content">
                  <h3 className="m-b-4">
                    {`${userProfile.data?.firstName} ${
                      userProfile.data?.lastName && userProfile.data?.lastName
                    }`}
                  </h3>
                  <p>{userProfile.data?.email}</p>
                  {userProfile.data?.isProfileImage && (
                    <>
                      {/* <Button type="link" danger onClick={onRemoveProfileImage}>
                      {t('common.labels.remove_profile_image')}
                    </Button> */}
                      <Space className="m-t-12">
                        <Text type="danger" onClick={onRemoveProfileImage}>
                          {t('common.labels.remove_profile_image')}
                        </Text>
                      </Space>
                    </>
                  )}
                </div>
              </div>

              <Form.Item
                className="w-480"
                label={t('common.labels.email')}
                name="email"
                rules={[
                  {
                    required: true,
                    message: t('common.messages.required', {
                      entity: t('common.labels.email'),
                    }),
                  },
                ]}>
                <Input disabled={true} placeholder={t('common.labels.email')} />
              </Form.Item>

              <Form.Item
                className="w-480"
                label={t('common.labels.firstName')}
                name="firstName"
                rules={[
                  {
                    required: true,
                    message: t('common.messages.required', {
                      entity: t('common.labels.firstName'),
                    }),
                  },
                ]}>
                <Input placeholder={t('common.labels.firstName')} />
              </Form.Item>

              <Form.Item
                className="w-480"
                label={t('common.labels.lastName')}
                name="lastName"
                rules={[
                  {
                    required: true,
                    message: t('common.messages.required', {
                      entity: t('common.labels.lastName'),
                    }),
                  },
                ]}>
                <Input placeholder={t('common.labels.lastName')} />
              </Form.Item>

              <Form.Item
                name="timezone"
                label={t('common.labels.profile_timezone')}
                rules={[
                  {
                    required: true,
                    message: t('common.messages.at_least_required', {
                      entity: t('common.labels.timezone'),
                    }),
                  },
                ]}>
                <Select
                  placeholder={t('common.labels.timezone')}
                  showSearch={true}
                  optionFilterProp="children"
                  suffixIcon={<DownArrowIcon />}>
                  {listTimeZones?.data?.map((timezone) => (
                    <Select.Option value={timezone.value}>
                      {timezone.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="languageId"
                label={t('common.labels.interface_languages')}
                rules={[
                  {
                    required: true,
                    message: t('common.messages.at_least_required', {
                      entity: t('common.labels.interface_languages'),
                    }),
                  },
                ]}>
                <Select
                  placeholder={t('common.labels.interface_languages')}
                  showSearch={true}
                  optionFilterProp="children"
                  suffixIcon={<DownArrowIcon />}>
                  {listLanguages?.data?.map((languages) => (
                    <Select.Option value={languages.id}>
                      {languages.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <div className="profile-action p-t-16">
                <Button
                  id={t('common.labels.save')}
                  type="primary"
                  htmlType="submit"
                  loading={updateProfile.isLoading ? true : false}
                  onClick={() => onFinish}
                  disabled={isSaveButtonDisable}>
                  {t('common.labels.save')}
                </Button>

                <Button
                  id={t('common.labels.cancel')}
                  type="default"
                  onClick={onCancel}
                  disabled={isCancelButtonDisable}>
                  {t('common.labels.cancel')}
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </SubSideBar>
    </div>
  );
};

export default Profile;
