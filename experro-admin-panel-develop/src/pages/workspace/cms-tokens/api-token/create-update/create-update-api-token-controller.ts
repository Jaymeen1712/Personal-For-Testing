import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import moment, { Moment } from 'moment';

import { ICmsToken } from '../../../../../types';
import {
  API_QUERY_KEY,
  APIS_ROUTES,
  DESCRIPTION_REGEX_PATTERN,
  openNotificationWithIcon,
  TEXT_REGEX_PATTERN,
} from '../../../../../utills';
import queryClient from '../../../../../query-client';
import useError from '../../../../../hooks/error';
import useCreateCmsToken from '../../services/create';
import useUpdateCmsToken from '../../services/update';
import useDetailsCmsToken from '../../services/details';

interface IParams {
  tokenId: string;
  workspaceId: string;
}

const useAPITokenController = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();
  const { workspaceId } = useParams<IParams>();
  const createAPIToken = useCreateCmsToken(workspaceId);
  const { tokenId } = useParams<{
    tokenId: string;
  }>();
  const updateAPIToken = useUpdateCmsToken(tokenId, workspaceId);
  const getAPIToken = useDetailsCmsToken(tokenId, workspaceId);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [disableSave, setIsDisableSave] = useState(true);
  const [selectedValue, setSelectedValue] = useState('READ_ONLY');

  useError({
    mutation: createAPIToken,
    entity: t('common.labels.api_token'),
  });
  useError({
    mutation: updateAPIToken,
    entity: t('common.labels.api_token'),
  });

  const onCancel = () => history.push(`/workspaces/${workspaceId}/cms-tokens`);

  const handleOnSelectChange = (value: string) => {
    setSelectedValue(value);
  };

  const onFinish = async () => {
    const values: ICmsToken = await form.validateFields();
    if (values.name.trim().length === 0) {
      form.setFields([
        {
          name: 'name',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (values.name.trim().length < 5) {
      form.setFields([
        {
          name: 'name',
          errors: [
            t('common.messages.min_token_length', {
              entity: t('common.labels.name'),
            }),
          ],
        },
      ]);
    } else if (values.name.trim().length > 30) {
      form.setFields([
        {
          name: 'name',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.name'),
            }),
          ],
        },
      ]);
    } else if (
      values.name.trim().length > 0 &&
      !TEXT_REGEX_PATTERN.test(values.name)
    ) {
      form.setFields([
        {
          name: 'name',
          errors: [
            t('common.messages.format', {
              entity: t('common.labels.name'),
            }),
          ],
        },
      ]);
    } else if (
      values.description !== undefined &&
      values.description !== null &&
      values.description.length > 0 &&
      values.description.trim().length === 0
    ) {
      form.setFields([
        {
          name: 'description',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (
      values.description !== undefined &&
      values.description !== null &&
      values.description.length > 2000
    ) {
      form.setFields([
        {
          name: 'description',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.description'),
            }),
          ],
        },
      ]);
    } else if (
      values.description !== undefined &&
      values.description !== null &&
      values.description.trim().length > 0 &&
      !DESCRIPTION_REGEX_PATTERN.test(values.description)
    ) {
      form.setFields([
        {
          name: 'description',
          errors: [
            t('common.messages.format', {
              entity: t('common.labels.description'),
            }),
          ],
        },
      ]);
    } else {
      values.name = values.name.trim();
      values.description = values.description?.trim();
      values.tokenType = 'API';
      values.type = selectedValue;
      if (
        values.validTill !== undefined &&
        values.validTill !== null &&
        values.validTill !== ''
      ) {
        values.validTill = moment(values.validTill).format('YYYY-MM-DD');
      }

      if (tokenId || createAPIToken.isSuccess) {
        updateAPIToken.mutate(values);
      } else {
        createAPIToken.mutate(values);
      }
    }
  };

  const disabledDate = (current: Moment) => {
    return current && current <= moment().endOf('day');
  };

  const onCopyToken = () => {
    openNotificationWithIcon(
      'success',
      t('common.messages.copied_successfully')
    );
  };

  const onGenerateToken = () => {
    setIsModalVisible(false);
    history.push(`/workspaces/${workspaceId}/cms-tokens`);
  };

  const onClickBackButton = () => {
    history.push(`/workspaces/${workspaceId}/cms-tokens`);
  };

  const fileDownloadLink = useMemo(
    () =>
      `${process.env.REACT_APP_API_URL}${APIS_ROUTES.WORKSPACES}/${workspaceId}/cms-tokens/${createAPIToken?.data?.id}/download`,

    // eslint-disable-next-line
    [workspaceId, createAPIToken.isSuccess]
  );

  const onTokenCopy = () => {
    openNotificationWithIcon(
      'success',
      t('common.messages.copied_successfully')
    );
  };

  const onHideModal = () => {
    setIsModalVisible(false);
    history.push(`/workspaces/${workspaceId}/cms-tokens`);
  };

  const handleFieldChange = () => {
    const values = form.getFieldsValue();
    if (values.name) {
      setIsDisableSave(false);
    } else {
      setIsDisableSave(true);
    }
  };

  const onResetDate = () => {
    form.setFieldsValue({
      validTill: '',
    });
  };

  useEffect(() => {
    if (createAPIToken.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.TOKEN_LIST]);
      queryClient.removeQueries([API_QUERY_KEY.TOKEN_DETAIL]);
      form.resetFields();
      setIsModalVisible(true);
      openNotificationWithIcon(
        'success',
        t('common.messages.api_token_generated_success')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createAPIToken.data, createAPIToken.isSuccess, form, t, workspaceId]);

  useEffect(() => {
    if (updateAPIToken.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.TOKEN_LIST]);
      queryClient.removeQueries([API_QUERY_KEY.TOKEN_DETAIL]);
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
      history.push(`/workspaces/${workspaceId}/cms-tokens`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateAPIToken.isSuccess, tokenId, createAPIToken.isSuccess, t]);

  useEffect(() => {
    if (getAPIToken.isSuccess && getAPIToken.data && tokenId) {
      if (getAPIToken?.data?.type) {
        setSelectedValue(getAPIToken?.data?.type);
      }
    }
  }, [getAPIToken?.data, getAPIToken.isSuccess, tokenId]);

  return {
    tokenId,
    t,
    form,
    onCancel,
    onFinish,
    disabledDate,
    onTokenCopy,
    handleFieldChange,
    selectedValue,
    isModalVisible,
    onGenerateToken,
    handleOnSelectChange,
    disableSave,
    fileDownloadLink,
    onHideModal,
    onCopyToken,
    onClickBackButton,
    getAPIToken,
    onResetDate,
    generateToken: createAPIToken.data?.token,
    isLoading: createAPIToken.isLoading || updateAPIToken.isLoading,
  };
};

export default useAPITokenController;
