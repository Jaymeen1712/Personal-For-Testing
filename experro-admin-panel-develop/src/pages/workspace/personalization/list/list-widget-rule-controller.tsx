import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { Button, Dropdown, Form, Menu, Tag } from 'antd';
import EllipsisIcon from '../../../../images/icons/ellipsis-icon';
import {
  IListWidgetRules,
  IWidgetRuleList,
  IWidgetRuleRowRecord,
  IWorkspaceParams,
  listWidgetRuleArray,
  RowRecord,
} from '../../../../types';
import moment from 'moment';
import {
  API_QUERY_KEY,
  convertUtcToCurrentTimeZone,
  openNotificationWithIcon,
} from '../../../../utills';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import useUser from '../../../../hooks/user';
import debounce from 'lodash.debounce';
import queryClient from '../../../../query-client';
import {
  useGetUserPreference,
  useUpdateUserPreference,
} from '../services/preferences';
import {
  useDeleteWidget,
  useDeleteWidgetRule,
  useListWidgetRule,
  useWidgetRuleDetails,
  useWidgetStatusPatchRule,
} from '../services';

const useListWidgetRuleControllerNew = (
  selectedWidget: { id: string; type?: string | undefined } | undefined,
  selectedId: string,
  environment: string | null,
  // eslint-disable-next-line
  widgetData: any,
  // eslint-disable-next-line
  customWidgetData: any,
  onDeleteModalVisible: (val: boolean) => void,
  onAddEditRuleModalVisible: (val: boolean) => void
) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [form] = Form.useForm();
  const history = useHistory();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const userDetails = useUser();

  const [sortBy, setSortBy] = useState('created_at');
  const [orderBy, setOrderBy] = useState('desc');
  const [applicable, setApplicable] = useState('');
  const [searchData, setSearchData] = useState('');
  const [status, setStatus] = useState('');
  const [selectedSortValue, setSelectedSortValue] =
    useState('recently_created');

  const [contentModalDataId, setContentModalDataId] = useState<
    string | undefined
  >('');
  const [contentModalId, setContentModalId] = useState('');
  const [versionId, setVersionId] = useState('');
  const [isStatusChange, setIsStatusChange] = useState(false);
  // eslint-disable-next-line
  const [columns, setColumns] = useState<any>([]);
  // eslint-disable-next-line
  const [columnData, setColumnData] = useState<any>([
    {
      rule_name: '',
      duration: '',
      applicable: '',
      status: '',
      created_at: '',
      created_bt: '',
      modified_at: '',
      modified_by: '',
    },
  ]);

  const [userPreference, setUserPreference] = useState<string[]>([]);
  const [userPreferenceId, setUserPreferenceId] = useState<string>('');
  const [selectedFields, setSelectedFields] = useState<CheckboxValueType[]>([]);

  const getUserPreference = useGetUserPreference(
    workspaceId,
    'personalization',
    userDetails?.user?.id
  );

  const updateUserPreference = useUpdateUserPreference(workspaceId);

  const listWidgetRule = useListWidgetRule(
    selectedWidget?.id,
    workspaceId,
    environment,
    '',
    sortBy,
    orderBy,
    applicable,
    status,
    searchData
  );

  const widgetRulesDetails = useWidgetRuleDetails(
    workspaceId,
    contentModalId,
    contentModalDataId,
    versionId,
    environment
  );

  const [ruleData, setRuleData] = useState<IWidgetRuleList | undefined>(
    undefined
  );

  const updateStatus = useWidgetStatusPatchRule(
    workspaceId,
    contentModalId,
    contentModalDataId
  );
  const deleteWidget = useDeleteWidget(workspaceId);
  const deleteRule = useDeleteWidgetRule(workspaceId, environment);

  const sortingOptions = useMemo(
    () => [
      { value: 'recently_created', label: t('common.labels.recently_update') },
      { value: 'oldest_created', label: t('common.labels.oldest_update') },
      { value: 'a_to_z', label: t('common.labels.a_to_z') },
      { value: 'z_to_a', label: t('common.labels.z_to_a') },
    ],
    [t]
  );

  const applicableOption = useMemo(
    () => [
      { value: '', label: t('common.labels.all') },
      { value: 'global', label: t('common.labels.global') },
      { value: 'page', label: t('common.labels.page_specific') },
      { value: 'keyword', label: t('common.labels.keyword_specific') },
    ],
    [t]
  );

  const onInputChange = debounce((searchValue) => {
    setSearchData(searchValue);
    queryClient.removeQueries([API_QUERY_KEY.WIDGET_RULE_LIST]);
  }, 1000);

  const onAddWidgetRule = () => {
    onAddEditRuleModalVisible(true);
  };

  const onCancelRuleModalVisible = () => {
    onAddEditRuleModalVisible(false);
  };

  // eslint-disable-next-line
  const onClickEditRule = (item: any) => {
    history.push(
      `create-edit/${item?.currentVersionId}/${item?.contentModelId}/${item?.contentModelDataId}/${item?.environmentId}`
    );
  };

  const onClickDeleteRule = (item: IListWidgetRules) => {
    onDeleteModalVisible(true);
    setContentModalDataId(item.contentModelDataId);
  };

  const onDeleteWidget = () => {
    if (selectedId) {
      deleteWidget.mutate(selectedId);
    }
  };

  const onDeleteRule = useCallback(() => {
    if (contentModalDataId) {
      deleteRule.mutate([contentModalDataId]);
    }
    // eslint-disable-next-line
  }, [contentModalDataId]);

  const onCancelModal = () => {
    onDeleteModalVisible(false);
    setContentModalDataId('');
  };

  const onActiveInactive = (rule: IWidgetRuleRowRecord) => {
    setContentModalId(rule.contentModelId);
    setContentModalDataId(rule.contentModelDataId);
    setVersionId(rule.currentVersionId);
    setIsStatusChange(true);
  };

  const onSortByWidgetRule = (sortValue: string) => {
    setSelectedSortValue(sortValue);
    if (sortValue === 'recently_created') {
      setSortBy('created_at');
      setOrderBy('desc');
    } else if (sortValue === 'oldest_created') {
      setSortBy('created_at');
      setOrderBy('asc');
    } else if (sortValue === 'a_to_z') {
      setSortBy('title');
      setOrderBy('asc');
    } else if (sortValue === 'z_to_a') {
      setSortBy('title');
      setOrderBy('desc');
    }
  };

  const columnValue = (selectedCheckboxOfFields: CheckboxValueType[]) => {
    const arr = [];

    if (selectedCheckboxOfFields.includes('created_at')) {
      arr.push({
        title: t('common.labels.created_at'),
        dataIndex: 'created_at',
        key: 'created_at',
        width: 'auto',
      });
    }

    if (selectedCheckboxOfFields.includes('created_by')) {
      arr.push({
        title: t('common.labels.created_by'),
        dataIndex: 'created_by',
        key: 'created_by',
        width: 'auto',
      });
    }

    if (selectedCheckboxOfFields.includes('modified_at')) {
      arr.push({
        title: t('common.labels.modified_at'),
        dataIndex: 'modified_at',
        key: 'modified_at',
        width: 'auto',
      });
    }

    if (selectedCheckboxOfFields.includes('modified_by')) {
      arr.push({
        title: t('common.labels.modified_by'),
        dataIndex: 'modified_by',
        key: 'modified_by',
        width: 'auto',
      });
    }

    setColumns([
      {
        title: t('common.labels.rule_name'),
        dataIndex: 'rule_name',
        key: 'rule_name',
        width: '15%',
        // eslint-disable-next-line
        render: (item: any) => (
          <>
            <div
              className={`ant-row ant-row-middle ant-row-no-wrap ant-row-space-between table-text-button`}>
              <div className="table-text">
                <div
                  className="text-blue cursor-pointer text-truncate with-pixel-xs"
                  onClick={() => {
                    history.push(
                      `create-edit/${item?.currentVersionId}/${item?.contentModelId}/${item?.contentModelDataId}/${item?.environmentId}`
                    );
                  }}>
                  {item.title}
                </div>
                <span className="gray-text text-truncate with-pixel-xs display-block">
                  {item.description}
                </span>
              </div>

              <Dropdown
                placement="bottomRight"
                trigger={['click']}
                overlay={
                  <div className="table-dropdown">
                    <Menu>
                      <Menu.Item onClick={() => onClickEditRule(item)}>
                        {t('common.labels.edit')}
                      </Menu.Item>

                      <Menu.Item onClick={() => onActiveInactive(item)}>
                        {item.statusEsi === 'active'
                          ? t('common.labels.inactive')
                          : t('common.labels.active')}
                      </Menu.Item>

                      <Menu.Item onClick={() => onClickDeleteRule(item)}>
                        <span className="text-red">
                          {t('common.labels.delete')}
                        </span>
                      </Menu.Item>
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
            </div>
          </>
        ),
      },
      {
        title: t('common.labels.rule_duration'),
        dataIndex: 'duration',
        key: 'duration',
        width: 'auto',
        render: (record: IListWidgetRules) => (
          <>
            {/*@ts-ignore*/}

            {record.startDateEdti ? (
              // @ts-ignore
              moment(convertUtcToCurrentTimeZone(record.endDateEdti)).isBefore(
                Date.now()
              ) ? (
                'Expired'
              ) : (
                <>
                  {moment(
                    // @ts-ignore
                    convertUtcToCurrentTimeZone(record.startDateEdti)
                  ).format('DD MMM')}{' '}
                  -
                  {moment(
                    // @ts-ignore
                    convertUtcToCurrentTimeZone(record.endDateEdti)
                  ).format('DD MMM YYYY')}
                </>
              )
            ) : (
              '-'
            )}
          </>
        ),
      },
      {
        title: t('common.labels.applicable_on'),
        dataIndex: 'applicable',
        key: 'applicable',
        width: 'auto',
        render: (record: RowRecord) => {
          if (record.widgetRuleApplicableOnEsi === 'global') {
            return (
              <div className="text-blue cursor-pointer text-truncate with-pixel-xs">
                {t('common.labels.global')}
              </div>
            );
          } else if (record.widgetRuleApplicableOnEsi === 'page') {
            return (
              <div className="text-blue cursor-pointer text-truncate with-pixel-xs">
                {t('common.labels.page_specific')}
              </div>
            );
          } else {
            return (
              <div className="text-blue cursor-pointer text-truncate with-pixel-xs">
                {record?.keywordEsai?.length} {t('common.labels.keyword')}
              </div>
            );
          }
        },
      },
      {
        title: t('common.labels.status'),
        dataIndex: 'status',
        key: 'status',
        width: 'auto',
        render: (status: string) => {
          if (status === 'active') {
            return <Tag color="success">active</Tag>;
          } else {
            return <Tag color="error">Inactive</Tag>;
          }
        },
      },
      ...arr,
    ]);
  };

  const onPreferenceChange = (newValue: CheckboxValueType[]) => {
    const value: {
      preferenceName: string;
      preferenceValue: CheckboxValueType[];
      preferenceId?: string;
    } = {
      preferenceName: 'personalization',
      preferenceValue: newValue,
    };

    if (userPreferenceId) {
      value['preferenceId'] = userPreferenceId;
    }
    updateUserPreference.mutate(value);
    setSelectedFields(newValue);
  };

  useEffect(() => {
    if (widgetRulesDetails.isSuccess) {
      setRuleData(widgetRulesDetails.data);
    }
  }, [widgetRulesDetails.data, widgetRulesDetails.isSuccess]);

  useEffect(() => {
    if (getUserPreference.isSuccess) {
      if (getUserPreference.data.length > 0) {
        if (getUserPreference.data[0].preferenceValue.length > 1) {
          setUserPreference(getUserPreference.data[0].preferenceValue);
          setSelectedFields(getUserPreference.data[0].preferenceValue);
          setUserPreferenceId(getUserPreference.data[0].id);
          columnValue(getUserPreference.data[0].preferenceValue);
        } else {
          setUserPreferenceId(getUserPreference.data[0].id);
          setSelectedFields(['duration', 'applicable', 'status']);
          setUserPreference(['duration', 'applicable', 'status']);
          columnValue(['duration', 'applicable', 'status']);
        }
      } else {
        setSelectedFields(['duration', 'applicable', 'status']);
        setUserPreference(['duration', 'applicable', 'status']);
        columnValue(['duration', 'applicable', 'status']);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserPreference.isSuccess]);

  useEffect(() => {
    if (updateUserPreference.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.preference_update')
      );
      columnValue(selectedFields);
    }
    // eslint-disable-next-line
  }, [updateUserPreference.isSuccess]);

  useEffect(() => {
    const array: listWidgetRuleArray[] = [];
    if (listWidgetRule.isSuccess) {
      listWidgetRule?.data?.items?.map((item) => {
        return array.push({
          rule_name: item,
          duration: item,
          applicable: item,
          created_at: item.createdAt
            ? moment(item.createdAt).format('DD MMM, YYYY HH:mm A')
            : '-',
          created_by: `${userDetails?.listAllUser?.[item.createdBy]}`,
          modified_at: item.modifiedAt
            ? moment(item.modifiedAt).format('DD MMM, YYYY HH:mm A')
            : '-',
          modified_by: `${userDetails?.listAllUser?.[item.modifiedBy]}`,
          status: item.statusEsi,
        });
      });
      setColumnData([...array]);
    }
    // eslint-disable-next-line
  }, [listWidgetRule.isSuccess, listWidgetRule.data, ruleData]);

  useEffect(() => {
    if (isStatusChange && widgetRulesDetails.data) {
      const ruleList = widgetRulesDetails.data;
      // eslint-disable-next-line
      const updatedPatchData: any = {
        version_id: versionId,
        language: ruleList?.contentModelFieldData.language,
        dynamic_fields_data: {
          environmentId: ruleList?.contentModelFieldData.environmentId,
          status_esi:
            ruleList?.contentModelFieldData.statusEsi === 'active'
              ? 'inactive'
              : 'active',
        },
      };
      updateStatus.mutate(updatedPatchData);
    }
    // eslint-disable-next-line
  }, [isStatusChange, widgetRulesDetails.data]);

  useEffect(() => {
    if (deleteRule.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.deleted_successfully')
      );
      queryClient.refetchQueries([API_QUERY_KEY.WIDGET_RULE_LIST]);
      onCancelModal();
    }
    // eslint-disable-next-line
  }, [deleteRule.isSuccess]);

  useEffect(() => {
    if (deleteWidget.isSuccess && customWidgetData) {
      openNotificationWithIcon(
        'success',
        t('common.messages.deleted_successfully')
      );
      queryClient.refetchQueries([API_QUERY_KEY.WIDGET_LIST]);
      onCancelModal();
      history.push(
        `/workspaces/${workspaceId}/personalization/custom-widget/${customWidgetData[0].id}/list-records`
      );
    }
    // eslint-disable-next-line
  }, [deleteWidget.isSuccess]);

  useEffect(() => {
    if (updateStatus.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.WIDGET_RULE_LIST]);
      queryClient.refetchQueries([API_QUERY_KEY.WIDGET_RULE_DETAILS]);
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
      setIsStatusChange(false);
    }
    // eslint-disable-next-line
  }, [updateStatus.isSuccess]);

  return {
    t,
    form,
    location,
    columns,
    searchData,
    status,
    selectedSortValue,
    applicableOption,
    userPreference,
    sortingOptions,
    applicable,
    columnData,
    onInputChange,
    setStatus,
    setApplicable,
    onSortByWidgetRule,
    onPreferenceChange,
    onAddWidgetRule,
    // onClickEditWidget,
    // onClickDeleteWidget,
    onDeleteWidget,
    onDeleteRule,
    onCancelRuleModalVisible,
    contentModalDataId,
    onCancelModal,
    isLoading: listWidgetRule.isLoading,
    isDeleteLoading: deleteWidget.isLoading || deleteRule.isLoading,
    isFetching: listWidgetRule.isFetching,
    isSuccess: listWidgetRule.isSuccess,
    listWidgetRuleDataLength: listWidgetRule?.data?.totalCount,
  };
};

export default useListWidgetRuleControllerNew;
