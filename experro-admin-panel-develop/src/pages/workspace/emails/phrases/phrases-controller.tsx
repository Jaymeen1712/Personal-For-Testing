// @ts-nocheck
import React, {
  ChangeEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, Dropdown, Form, Menu, Typography } from 'antd';
import debounce from 'lodash.debounce';

import { IWorkspaceParams, RowRecord } from '../../../../types';
import {
  NAME_REGEX_PATTERN,
  openNotificationWithIcon,
  PAGE_SIZE,
} from '../../../../utills';
import CopyableIcon from '../../../../images/icons/copyable-icon';
import useError from '../../../../hooks/error';
import usePermissions from '../../../../hooks/permissions';
import EllipsisIcon from '../../../../images/icons/ellipsis-icon';
import {
  useAddPhrasesEmails,
  useDeletePhrasesEmails,
  useListPhrasesEmail,
  useUpdatePhrasesEmails,
} from '../services';

const { Paragraph } = Typography;

interface IUsePhrasesController {
  defaultActiveKey?: string;
  emailRef: MutableRefObject<null>;
}

const usePhrasesController = ({
  defaultActiveKey,
  emailRef,
}: IUsePhrasesController) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const { workspaceId } = useParams<IWorkspaceParams>();
  const [filter, setFilter] = useState('');
  const [disableSave, setIsDisableSave] = useState(true);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [
    isCreateUpdatePhrasesModalVisible,
    setIsCreateUpdatePhrasesModalVisible,
  ] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [editRecordId, setEditRecordId] = useState<string>('');
  const [shortCode, setShortCode] = useState('');
  const [deletePhrasesIds, setDeletePhrasesIds] = useState<
    string[] | React.Key[]
  >([]);
  const [deleteSinglePhrases, setDeleteSinglePhrases] = useState<string>('');

  const permission = usePermissions();
  const getPhraseEmails = useListPhrasesEmail(
    workspaceId,
    filter,
    page,
    pageSize
  );
  const addPhrasesEmail = useAddPhrasesEmails(workspaceId);
  const deletePhrasesEmail = useDeletePhrasesEmails(workspaceId);
  const updatePhrasesEmail = useUpdatePhrasesEmails(workspaceId);

  useError({
    mutation: addPhrasesEmail,
    entity: t('common.labels.name'),
  });

  useError({
    mutation: updatePhrasesEmail,
    entity: t('common.labels.name'),
  });

  useError({
    mutation: deletePhrasesEmail,
    entity: t('common.labels.name'),
  });

  const onEditClick = useCallback((phraseId: string, record?: RowRecord) => {
    if (record) {
      setIsDisableSave(true);
      setShortCode(record.shortCode);
      form.setFieldsValue({
        id: phraseId,
        name: record.name,
        value: record.value,
        shortCode: record.shortCode,
      });
    }

    setEditRecordId(phraseId);
    setIsCreateUpdatePhrasesModalVisible(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDeleteClick = useCallback((phraseId: string) => {
    setDeleteSinglePhrases(phraseId);
    setIsDeleteModalVisible(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const onPhrasesSelectChange = (id: any) => {
    setDeletePhrasesIds(id);
  };

  const onClearAllPhrases = () => {
    setDeletePhrasesIds([]);
  };

  const onSelectAllPhrases = () => {
    if (getPhraseEmails.data?.length > 0) {
      setDeletePhrasesIds(
        getPhraseEmails.data?.items?.map((phrases) => phrases.id)
      );
    }
  };

  const onDeletePhrase = () => {
    if (deleteSinglePhrases) {
      deletePhrasesEmail.mutate({ phrasesIds: [deleteSinglePhrases] });
    } else {
      deletePhrasesEmail.mutate({ phrasesIds: deletePhrasesIds });
    }
  };

  const onHideDeleteModalVisible = () => {
    setIsDeleteModalVisible(false);
    setDeletePhrasesIds([]);
    setDeleteSinglePhrases('');
  };

  const onDeleteMultipleData = () => {
    setIsDeleteModalVisible(true);
  };

  useEffect(() => {
    if (deletePhrasesEmail.isSuccess) {
      getPhraseEmails.refetch();
      setDeletePhrasesIds([]);
      setDeleteSinglePhrases('');
      openNotificationWithIcon(
        'success',
        t('common.messages.deleted_successfully')
      );
      onHideDeleteModalVisible();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletePhrasesEmail.isSuccess, t]);

  const columns = useMemo(
    () => [
      {
        title: t('common.labels.name'),
        dataIndex: 'name',
        key: 'name',
        width: '33%',
        render: (name: string, row: object) => {
          return (
            <div className="ant-row ant-space-align-center ant-row-space-between w-100 table-text-button">
              <div
                className={`text-truncate with-pixel-large ${
                  permission.canReadEmailTemplatesTemplate() &&
                  permission.canUpdateEmailTemplatesTemplate()
                    ? 'cursor-pointer text-blue'
                    : ''
                }`}
                onClick={
                  permission.canReadEmailTemplatesTemplate() &&
                  permission.canUpdateEmailTemplatesTemplate()
                    ? () => onEditClick(row.id, row)
                    : (e) => e.stopPropagation()
                }>
                {row.name ? row.name : '-'}
              </div>

              {permission.canReadEmailTemplatesTemplate() &&
                (permission.canUpdateEmailTemplatesTemplate() ||
                  permission.canDeleteEmailTemplatesTemplate()) &&
                deletePhrasesIds &&
                !deletePhrasesIds.length > 0 && (
                  <Dropdown
                    placement="bottomRight"
                    trigger={['click']}
                    overlay={
                      <div className="table-dropdown">
                        <Menu>
                          {permission.canUpdateEmailTemplatesTemplate() && (
                            <Menu.Item
                              //@ts-ignore
                              onClick={() => onEditClick(row.id, row)}>
                              {t('common.labels.edit')}
                            </Menu.Item>
                          )}

                          {permission.canDeleteEmailTemplatesTemplate() && (
                            <Menu.Item
                              //@ts-ignore
                              onClick={() => onDeleteClick(row.id)}>
                              <p className="text-red m-0">
                                {t('common.labels.delete')}
                              </p>
                            </Menu.Item>
                          )}
                        </Menu>
                      </div>
                    }>
                    <Button
                      type="text"
                      size="small"
                      className="on-hover"
                      icon={<EllipsisIcon />}
                      style={{ float: 'right' }}
                    />
                  </Dropdown>
                )}
            </div>
          );
        },
      },
      {
        title: t('common.labels.value'),
        dataIndex: 'value',
        key: 'value',
        width: '33%',
      },
      {
        title: t('common.labels.shortCode'),
        dataIndex: 'shortCode',
        key: 'shortCode',
        width: '33%',
        render: (shortCode: string, record: object) => (
          <>
            <Paragraph
              className="table-text OnlyIcon table-copyicon"
              copyable={{
                // @ts-ignore
                text: record.shortCode,
                icon: [<CopyableIcon />],
              }}>
              {/*@ts-ignore*/}
              {record.shortCode}
            </Paragraph>
          </>
        ),
      },
    ],
    [t, onEditClick, onDeleteClick, permission, deletePhrasesIds]
  );

  const pagination = useMemo(
    () => ({
      total: getPhraseEmails.data?.totalCount,
      pageSize: pageSize,
      showSizeChanger: true,
      current: page,
      hideOnSinglePage: !!(
        getPhraseEmails.data &&
        getPhraseEmails.data &&
        getPhraseEmails.data.totalCount < PAGE_SIZE
      ),
      pageSizeOptions: [5, 10, 20, 50, 100],
      locale: { items_per_page: ' per page' },
      onChange: (page: number, pageSize: number) => {
        setPageSize(pageSize);
        setPage(page);
        setDeleteSinglePhrases('');
        setDeletePhrasesIds([]);
        getPhraseEmails.remove();
        // @ts-ignore
        emailRef.current.scrollIntoView();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getPhraseEmails.data, page, pageSize]
  );

  const addPhrase = () => {
    setIsCreateUpdatePhrasesModalVisible(true);
  };

  const onHideCreateUpdatePhraseModal = () => {
    form.resetFields();
    setEditRecordId('');
    setShortCode('');
    setIsCreateUpdatePhrasesModalVisible(false);
  };

  const onNameChange = () => {
    const name = form.getFieldValue('name').trim();
    if (name.length > 0) {
      setShortCode(`{{${name}}}`);
    } else {
      setShortCode('');
    }
  };

  const onAddPhrase = async () => {
    const values = await form.validateFields();
    if (values.name.trim().length === 0) {
      form.setFields([
        {
          name: 'name',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (values.name.trim().length > 255) {
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
      !NAME_REGEX_PATTERN.test(values.name)
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
    } else if (values.value.trim().length === 0) {
      form.setFields([
        {
          name: 'value',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (values.value.trim().length > 255) {
      form.setFields([
        {
          name: 'value',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.value'),
            }),
          ],
        },
      ]);
    } else {
      if (editRecordId) {
        values.id = editRecordId;
        values.shortCode = shortCode;
        updatePhrasesEmail.mutate(values);
      } else {
        values.shortCode = shortCode;
        addPhrasesEmail.mutate(values);
      }
    }
  };

  const onFilterChange = debounce((event: ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
    setPage(1);
  }, 1000);

  const handleFieldChange = () => {
    const values = form.getFieldValue();
    if (values.name && values.value) {
      setIsDisableSave(false);
    } else {
      setIsDisableSave(true);
    }
  };

  useEffect(() => {
    if (addPhrasesEmail.isSuccess) {
      form.resetFields();
      setShortCode('');
      onHideCreateUpdatePhraseModal();
      openNotificationWithIcon(
        'success',
        t('common.messages.added_successfully')
      );
      getPhraseEmails.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addPhrasesEmail.isSuccess, t]);

  useEffect(() => {
    if (updatePhrasesEmail.isSuccess) {
      form.resetFields();
      setShortCode('');
      setEditRecordId('');
      onHideCreateUpdatePhraseModal();
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
      getPhraseEmails.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatePhrasesEmail.isSuccess, t]);

  useEffect(() => {
    setDeletePhrasesIds([]);
  }, [filter]);

  useEffect(() => {
    if (defaultActiveKey !== 'phrases') {
      setFilter('');
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultActiveKey]);

  const onShortCodeCopy = () => {
    openNotificationWithIcon(
      'success',
      t('common.messages.copied_successfully')
    );
  };

  return {
    getPhraseEmails,
    columns,
    pagination,
    t,
    addPhrase,
    isCreateUpdatePhrasesModalVisible,
    onHideCreateUpdatePhraseModal,
    form,
    onNameChange,
    onAddPhrase,
    isDeleteModalVisible,
    onHideDeleteModalVisible,
    onDeletePhrase,
    editRecordId,
    shortCode,
    canCreateEmailTemplate: permission.canCreateEmailTemplatesTemplate(),
    canDeleteEmailTemplate: permission.canDeleteEmailTemplatesTemplate(),
    filter,
    onFilterChange,
    onPhrasesSelectChange,
    isAllPhrasesSelected:
      deletePhrasesIds.length === getPhraseEmails.data?.items.length,
    onClearAllPhrases,
    onSelectAllPhrases,
    deletePhrasesIds,
    onDeleteMultipleData,
    handleFieldChange,
    disableSave,
    onShortCodeCopy,
    deleteSinglePhrases,
  };
};

export default usePhrasesController;
