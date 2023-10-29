import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import moment, { Moment } from 'moment';
import {
  API_QUERY_KEY,
  APIS_ROUTES,
  openNotificationWithIcon,
  TEXT_REGEX_PATTERN,
} from '../../../../../utills';
import queryClient from '../../../../../query-client';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import useError from '../../../../../hooks/error';
import {
  useCreateCmsToken,
  useDetailsCmsToken,
  useUpdateCmsToken,
} from '../../services';
import { Form } from 'antd';

const useCLITokenController = (
  tokenId: string | undefined,
  setCLITokenId: (tokenId: string) => void,
  setIsCreateModalVisible: (isCreateModalVisible: boolean) => void,
  setIsModalVisible: (isModalVisible: boolean) => void,
  isModalVisible: boolean
) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();
  const createCLIToken = useCreateCmsToken(workspaceId);
  const getCLITokenDetails = useDetailsCmsToken(tokenId, workspaceId);

  const updateCLIToken = useUpdateCmsToken(tokenId, workspaceId);
  const [radioValue, setRadioValue] = useState(
    getCLITokenDetails?.data
      ? getCLITokenDetails?.data?.type
      : 'LOCAL_DEVELOPMENT_ONLY'
  );
  const [disableReadOnly, setDisableReadOnly] = useState(false);
  const [disableBuild, setDisableBuild] = useState(false);
  const [disableFullAccess, setDisableFullAccess] = useState(false);
  const [disableSave, setIsDisableSave] = useState(true);
  useError({
    mutation: createCLIToken,
    entity: t('common.labels.cli_token'),
  });
  useError({
    mutation: updateCLIToken,
    entity: t('common.labels.cli_token'),
  });

  const onChangeRadioValue = (event: RadioChangeEvent) => {
    if (event?.target?.value) {
      const type = event.target.value;
      setRadioValue(type);
    }
  };

  const onSave = async () => {
    const values = await form.validateFields();
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
    } else {
      values.name = values.name.trim();
      values.tokenType = 'CLI';
      values.type = radioValue;
      if (
        values.validTill !== undefined &&
        values.validTill !== null &&
        values.validTill !== ''
      ) {
        values.validTill = moment(values.validTill).format('YYYY-MM-DD');
      }
      if (tokenId || createCLIToken.isSuccess) {
        updateCLIToken.mutate(values);
      } else {
        createCLIToken.mutate(values);
      }
    }
  };

  const disabledDate = (current: Moment) => {
    return current && current <= moment().endOf('day');
  };

  const onHideModal = () => {
    setIsModalVisible(false);
  };

  const fileDownloadLink = useMemo(
    () =>
      `${process.env.REACT_APP_API_URL}${APIS_ROUTES.WORKSPACES}/${workspaceId}/cms-tokens/${createCLIToken?.data?.id}/download`,
    // eslint-disable-next-line
    [workspaceId, createCLIToken.isSuccess]
  );

  const onGenerateToken = () => {
    setIsModalVisible(false);
  };

  const onCopyToken = () => {
    openNotificationWithIcon(
      'success',
      t('common.messages.copied_successfully')
    );
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
    if (createCLIToken.isSuccess) {
      setIsCreateModalVisible(false);
      setIsModalVisible(true);
      queryClient.removeQueries([API_QUERY_KEY.TOKEN_LIST]);
      queryClient.removeQueries([API_QUERY_KEY.TOKEN_DETAIL]);
      form.resetFields();
      openNotificationWithIcon(
        'success',
        t('common.messages.cli_token_generated_success')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    createCLIToken.data,
    createCLIToken.isSuccess,
    tokenId,
    form,
    t,
    workspaceId,
  ]);

  useEffect(() => {
    if (getCLITokenDetails?.isSuccess && getCLITokenDetails?.data && tokenId) {
      setRadioValue(getCLITokenDetails?.data?.type);
      form.setFieldsValue({
        name: getCLITokenDetails?.data?.name,
        validTill: getCLITokenDetails?.data?.validTill
          ? moment(getCLITokenDetails?.data?.validTill)
          : undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCLITokenDetails?.data, getCLITokenDetails?.isSuccess, tokenId]);

  useEffect(() => {
    if (updateCLIToken.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.TOKEN_LIST]);
      queryClient.removeQueries([API_QUERY_KEY.TOKEN_DETAIL]);
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
      setIsCreateModalVisible(false);
    }
    // eslint-disable-next-line
  }, [updateCLIToken.data, tokenId, updateCLIToken.isSuccess, t]);

  useEffect(() => {
    if (tokenId) {
      if (radioValue === 'LOCAL_DEVELOPMENT_ONLY') {
        setDisableBuild(true);
        setDisableFullAccess(true);
        setDisableReadOnly(false);
      } else if (radioValue === 'FULL_ACCESS') {
        setDisableBuild(true);
        setDisableReadOnly(true);
        setDisableFullAccess(false);
      } else {
        setDisableFullAccess(true);
        setDisableReadOnly(true);
        setDisableBuild(false);
      }
    }
  }, [radioValue, tokenId]);

  return {
    t,
    form,
    getCLITokenDetails,
    radioValue,
    disabledDate,
    onChangeRadioValue,
    onSave,
    onHideModal,
    isModalVisible,
    fileDownloadLink,
    onGenerateToken,
    onCopyToken,
    disableReadOnly,
    disableSave,
    disableFullAccess,
    handleFieldChange,
    onResetDate,
    disableBuild,
    generateToken: createCLIToken.data?.token,
  };
};

export default useCLITokenController;
