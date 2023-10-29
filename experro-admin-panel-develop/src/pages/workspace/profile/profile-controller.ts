import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, UploadProps } from 'antd';
import Cookies from 'js-cookie';
import moment from 'moment-timezone';

import { IUpdateProfileRequest } from '../../../types';
import useError from '../../../hooks/error';
import {
  APIS_ROUTES,
  EMAIL_REGEX_PATTERN,
  NAME_REGEX_PATTERN,
  openNotificationWithIcon,
  SIDEBAR_KEYS,
  USER_ACCESS_KEY,
} from '../../../utills';
import {
  useDeleteProfileImage,
  useListLanguages,
  useListTimeZones,
  useProfile,
  useUpdateProfile,
} from './services';

interface IUseProfileController {
  onMainSidebarActiveItem?: (val: string) => void;
}

interface IAllValues {
  email: string;
  firstName: string;
  lastName: string;
  timezone: string;
  languageId?: string;
}

const useProfileController = ({
  onMainSidebarActiveItem,
}: IUseProfileController) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const browserTZ = moment.tz.guess();

  const listLanguages = useListLanguages();
  const listTimeZones = useListTimeZones();
  const userProfile = useProfile();
  const updateProfile = useUpdateProfile();
  const deleteProfileImage = useDeleteProfileImage();

  const [loading, setLoading] = useState<boolean>(false);
  const [isSaveButtonDisable, setIsSaveButtonDisable] = useState<boolean>(true);
  const [isCancelButtonDisable, setIsCancelButtonDisable] =
    useState<boolean>(true);

  useError({
    mutation: updateProfile,
    entity: t('common.labels.profile'),
  });

  useError({
    mutation: deleteProfileImage,
    entity: t('common.labels.profile'),
  });

  const onFinish = (values: IUpdateProfileRequest) => {
    if (values.firstName.trim().length === 0) {
      form.setFields([
        {
          name: 'firstName',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (values.firstName.trim().length < 1) {
      form.setFields([
        {
          name: 'firstName',
          errors: [
            t('common.messages.min_length', {
              entity: t('common.labels.firstName'),
            }),
          ],
        },
      ]);
    } else if (values.firstName.trim().length > 20) {
      form.setFields([
        {
          name: 'firstName',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.firstName'),
            }),
          ],
        },
      ]);
    } else if (
      values.firstName.trim().length > 0 &&
      !NAME_REGEX_PATTERN.test(values.firstName)
    ) {
      form.setFields([
        {
          name: 'firstName',
          errors: [
            t('common.messages.format', {
              entity: t('common.labels.firstName'),
            }),
          ],
        },
      ]);
    } else if (values.lastName.trim().length === 0) {
      form.setFields([
        {
          name: 'lastName',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (values.lastName.trim().length < 1) {
      form.setFields([
        {
          name: 'lastName',
          errors: [
            t('common.messages.min_length', {
              entity: t('common.labels.lastName'),
            }),
          ],
        },
      ]);
    } else if (values.lastName.trim().length > 20) {
      form.setFields([
        {
          name: 'lastName',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.lastName'),
            }),
          ],
        },
      ]);
    } else if (
      values.lastName.trim().length > 0 &&
      !NAME_REGEX_PATTERN.test(values.lastName)
    ) {
      form.setFields([
        {
          name: 'lastName',
          errors: [
            t('common.messages.format', {
              entity: t('common.labels.lastName'),
            }),
          ],
        },
      ]);
    } else if (
      values.email.trim().length > 0 &&
      !EMAIL_REGEX_PATTERN.test(values.email)
    ) {
      form.setFields([
        {
          name: 'email',
          errors: [t('common.messages.email_invalid')],
        },
      ]);
    } else if (values.email.trim().length === 0) {
      form.setFields([
        {
          name: 'email',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else {
      values.firstName = values.firstName.trim();
      values.lastName = values.lastName.trim();
      updateProfile.mutate(values);
    }
  };

  useEffect(() => {
    if (updateProfile.isSuccess) {
      userProfile.refetch();
      setIsSaveButtonDisable(true);
      openNotificationWithIcon(
        'success',
        t('common.messages.profile_updated_successfully')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateProfile.isSuccess, form, t]);

  const uploadProps: UploadProps = {
    name: 'files',
    accept: '.JPG,.JPEG,.GIF,.TIFF,.PSD,.PNG,.SVG,.AI,.BMP,.WEBP,.RAW',
    showUploadList: false,
    action: `${process.env.REACT_APP_API_URL}${APIS_ROUTES.PROFILE_IMAGE}`,
    headers: {
      accessToken: `Bearer ${Cookies.get(USER_ACCESS_KEY.TOKEN)}`,
    },

    onChange(info) {
      const { status } = info.file;

      if (status === 'uploading') {
        setLoading(true);
      } else if (status === 'done') {
        setLoading(false);
        userProfile.refetch();
        openNotificationWithIcon(
          'success',
          t('common.messages.profile_picture_added')
        );
      } else if (status === 'error') {
        if (info.file.response.Error.code === 'EX-00146') {
          openNotificationWithIcon(
            'error',
            t('common.messages.file_size_not_more_than_five_mb')
          );
          setLoading(false);
        } else if (info.file.response.Error.code === 'EX-00145') {
          openNotificationWithIcon(
            'error',
            t('common.messages.un_supported_file_type_only_image')
          );
          setLoading(false);
        } else if (info.file.response.Error.code === 'EX-00079') {
          openNotificationWithIcon(
            'error',
            t('common.messages.user_not_exist')
          );
          setLoading(false);
        } else if (info.file.response.Error.code === 'EX-00002') {
          openNotificationWithIcon(
            'error',
            t('common.messages.validation_failed')
          );
          setLoading(false);
        }
      }
    },
  };

  const onRemoveProfileImage = () => {
    deleteProfileImage.mutate();
  };

  const onValueChange = (values: IAllValues, allValues: IAllValues) => {
    if (
      userProfile.data &&
      userProfile.data.firstName === allValues.firstName &&
      userProfile.data.lastName === allValues.lastName &&
      userProfile.data.email === allValues.email &&
      userProfile.data.timezone === allValues.timezone &&
      userProfile.data.languageId === allValues.languageId
    ) {
      setIsSaveButtonDisable(true);
      setIsCancelButtonDisable(true);
    } else {
      if (
        !allValues.firstName ||
        !allValues.lastName ||
        !allValues.email ||
        !allValues.timezone ||
        !allValues.languageId
      ) {
        setIsCancelButtonDisable(true);
        setIsSaveButtonDisable(true);
      } else {
        setIsCancelButtonDisable(false);
        setIsSaveButtonDisable(false);
      }
    }
  };

  const onCancel = () => {
    form.resetFields();
    userProfile.refetch();
  };

  useEffect(() => {
    if (deleteProfileImage.isSuccess) {
      userProfile.refetch();
      openNotificationWithIcon(
        'success',
        t('common.messages.profile_picture_removed')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteProfileImage.isSuccess]);

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.USER.ACCOUNT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsSaveButtonDisable(true);
  }, [userProfile.isSuccess]);

  return {
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
    listLanguages,
    listTimeZones,
  };
};

export default useProfileController;
