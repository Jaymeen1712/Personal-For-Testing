import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dropdown, Form, Menu, Tag } from 'antd';
import debounce from 'lodash.debounce';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import moment from 'moment';

import {
  GridColumnType,
  IRuleData,
  IRuleListParams,
  IRuleRowRecord,
} from '../../../../../../types';
import queryClient from '../../../../../../query-client';
import {
  API_QUERY_KEY,
  convertDateTimeToUserTimezone,
  convertUtcToCurrentTimeZone,
  openNotificationWithIcon,
} from '../../../../../../utills';
import RuleName from './rule-name';
import useError from '../../../../../../hooks/error';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

import useUser from '../../../../../../hooks/user';
import usePermissions from '../../../../../../hooks/permissions';
import {
  useDeleteRule,
  useGetMerchandisingUserPreference,
  useGetRuleDetails,
  useListRule,
  useUpdateMerchandisingUserPreference,
  useUpdateRuleDetails,
} from '../../../services';

interface IUseRuleController {
  environment: string | null;
  setIsAddRuleButtonVisible: (isAddRuleButtonVisible: boolean) => void;
  onDuplicateRule: (rule: IRuleRowRecord) => void;
}

const useListRuleController = ({
  environment,
  setIsAddRuleButtonVisible,
  onDuplicateRule,
}: IUseRuleController) => {
  const { t } = useTranslation();
  const { workspaceId, subMenu } = useParams<IRuleListParams>();
  const location = useLocation();
  const history = useHistory();

  const [sortBy, setSortBy] = useState('created_at');
  const [orderBy, setOrderBy] = useState('desc');
  const [selectedSortValue, setSelectedSortValue] =
    useState('recently_created');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [contentModelDataId, setContentModelDataId] = useState<
    string | undefined
  >();
  const [form] = Form.useForm();
  const [filterFlag, setFilterFlag] = useState(false);
  const [searchData, setSearchData] = useState('');
  const [contentModalId, setContentModalId] = useState('');
  const [contentModalDataId, setContentModalDataId] = useState('');
  const [versionId, setVersionId] = useState('');
  const [inUpdateRule, setInUpdateRule] = useState(false);
  const [listRefetch, setListRefetch] = useState(false);
  const [storeIssueFound, setStoreIssueFound] = useState<boolean>(false);

  const [userPreference, setUserPreference] = useState<string[]>([]);
  const [userPreferenceId, setUserPreferenceId] = useState<string>('');
  const [selectedFields, setSelectedFields] = useState<CheckboxValueType[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<GridColumnType[]>([]);

  const userDetails = useUser();
  const permission = usePermissions();

  const deleteRule = useDeleteRule(
    workspaceId,
    contentModelDataId,
    environment
  );

  const list = useListRule(
    subMenu,
    workspaceId,
    searchData,
    environment,
    sortBy,
    orderBy
  );

  const rules = useGetRuleDetails(
    workspaceId,
    contentModalId,
    contentModalDataId,
    versionId,
    environment
  );

  const updateRule = useUpdateRuleDetails(
    workspaceId,
    contentModalId,
    contentModalDataId
  );

  const getUserPreference = useGetMerchandisingUserPreference(
    workspaceId,
    'merchandising',
    userDetails?.user?.id
  );

  const updateUserPreference =
    useUpdateMerchandisingUserPreference(workspaceId);

  useError({
    mutation: updateRule,
    entity: t('common.labels.rule_name'),
  });

  useError({
    mutation: deleteRule,
    entity: t('common.labels.rule_name'),
  });

  useEffect(() => {
    if (
      list.isSuccess &&
      list.data &&
      list.data?.items &&
      list.data?.items.length > 0
    ) {
      setStoreIssueFound(false);
      setIsAddRuleButtonVisible(true);
    } else {
      setIsAddRuleButtonVisible(false);
      setStoreIssueFound(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.isSuccess, list.data]);

  useEffect(() => {
    if (list.isError) {
      // @ts-ignore
      if (list?.error.response.Error.errorCode === 'EX-00047') {
        // @ts-ignore
        openNotificationWithIcon('error', list.error.message);
        setStoreIssueFound(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.isError]);

  const onAddStore = () => {
    history.push(`/workspaces/${workspaceId}/platforms`);
    setStoreIssueFound(false);
  };

  useEffect(() => {
    form.resetFields();
    setSearchData('');
    setSelectedSortValue('recently_created');
    list.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subMenu, environment, location, history]);

  const onSortRuleListData = (sortValue: string) => {
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

  const onInputChange = debounce((searchValue) => {
    setSearchData(searchValue);
    queryClient.removeQueries([API_QUERY_KEY.RULE_LIST]);
  }, 1000);

  useEffect(() => {
    if (searchData.length) {
      setFilterFlag(true);
    } else {
      setFilterFlag(false);
    }
  }, [searchData]);

  const onDeleteClick = (contentModalDataId: string) => {
    setIsModalVisible(true);
    setContentModelDataId(contentModalDataId);
  };

  const onEditRule = useCallback(
    (contentModalDataId: string, rule: IRuleRowRecord) => {
      history.push(
        `create-edit/${rule?.currentVersionId}/${rule?.contentModelId}/${contentModalDataId}/${rule.environmentId[0]}`
      );
    },
    [history]
  );

  const onInActiveRule = (contentModalDataId: string, rule: IRuleRowRecord) => {
    setContentModalId(rule.contentModelId);
    setContentModalDataId(contentModalDataId);
    setVersionId(rule.currentVersionId);

    rules.remove();
    setInUpdateRule(true);
  };

  useEffect(() => {
    if (inUpdateRule && rules.isSuccess) {
      const newRuleList = rules.data;
      const categories: string[] = [];
      const searchValues: string[] = [];

      if (
        newRuleList?.contentModelFieldData !== undefined &&
        newRuleList.contentModelFieldData.statusEsi === 'active'
      ) {
        newRuleList.contentModelFieldData.statusEsi = 'inactive';
      } else {
        if (
          newRuleList?.contentModelFieldData !== undefined &&
          newRuleList.contentModelFieldData.statusEsi === 'inactive'
        ) {
          newRuleList.contentModelFieldData.statusEsi = 'active';
        }
      }

      if (newRuleList?.contentModelFieldData) {
        newRuleList.contentModelFieldData.globalTermsEslai = '';

        if (
          newRuleList.contentModelFieldData.categoriesEslai !== null &&
          newRuleList.contentModelFieldData.categoriesEslai !== undefined &&
          newRuleList.contentModelFieldData.categoriesEslai &&
          newRuleList.contentModelFieldData.categoriesEslai.length > 0
        ) {
          newRuleList.contentModelFieldData.categoriesEslai.forEach(
            // eslint-disable-next-line
            (category: any) => {
              if (typeof category !== 'string') {
                categories.push(category['value']);
              } else {
                categories.push(category);
              }
            }
          );
          newRuleList.contentModelFieldData.categoriesEslai = categories;
        }

        if (
          newRuleList.contentModelFieldData.searchTermsEslai !== null &&
          newRuleList.contentModelFieldData.searchTermsEslai !== undefined &&
          newRuleList.contentModelFieldData.searchTermsEslai &&
          newRuleList.contentModelFieldData.searchTermsEslai.length > 0
        ) {
          newRuleList.contentModelFieldData.searchTermsEslai.forEach(
            // eslint-disable-next-line
            (search: any) => {
              if (typeof search !== 'string') {
                searchValues.push(search['text']);
              } else {
                searchValues.push(search);
              }
            }
          );
          newRuleList.contentModelFieldData.searchTermsEslai = searchValues;
        }
      }

      const dataToPut: IRuleData = {
        versionId: versionId,
        dynamicFieldsData: { ...newRuleList?.contentModelFieldData },
      };

      updateRule.mutate(dataToPut);

      setListRefetch(true);
      setInUpdateRule(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inUpdateRule, rules.isSuccess]);

  useEffect(() => {
    if (listRefetch && updateRule.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.rule_updated_successfully')
      );
      list.remove();
      setListRefetch(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateRule.isSuccess, listRefetch]);

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const onDeleteRule = useCallback(() => {
    if (contentModelDataId) {
      deleteRule.mutate([contentModelDataId]);
    }
  }, [deleteRule, contentModelDataId]);

  useEffect(() => {
    if (deleteRule.isSuccess) {
      hideModal();
      openNotificationWithIcon(
        'success',
        t('common.messages.rule_deleted_successfully')
      );
      list.remove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteRule.isSuccess, t]);

  const columns = useMemo(
    () => [
      {
        title: t('common.labels.rule_name'),
        dataIndex: 'title',
        key: 'title',
        width:
          subMenu !== 'global-rules'
            ? selectedColumns.length > 3
              ? '16%'
              : selectedColumns.length > 2
              ? '25%'
              : selectedColumns.length > 0
              ? '35%'
              : '40%'
            : selectedColumns.length > 3
            ? '20%'
            : selectedColumns.length > 2
            ? '30%'
            : selectedColumns.length > 0
            ? '40%'
            : '50%',
        render: (title: string, row: object) => {
          return (
            <RuleName
              rule={row as IRuleRowRecord}
              onEditRule={onEditRule}
              onInActiveRule={onInActiveRule}
              onDeleteClick={onDeleteClick}
              onDuplicateRule={onDuplicateRule}
            />
          );
        },
      },
      {
        title: t('common.labels.start_date'),
        dataIndex: 'startDateEdti',
        key: 'startDateEdti',
        width: '13%',
        render: (startDateEdti: string, record: object) => (
          <>
            {/*@ts-ignore*/}
            {record.startDateEdti ? (
              <>
                {`${moment(
                  // @ts-ignore
                  convertUtcToCurrentTimeZone(record.startDateEdti)
                ).format('DD MMM YYYY,LT')}`}
              </>
            ) : (
              '-'
            )}
          </>
        ),
      },
      {
        title: t('common.labels.end_date'),
        dataIndex: 'endDateEdti',
        key: 'endDateEdti',
        width: '13%',
        render: (endDateEdti: string, record: object) => (
          <>
            {/*@ts-ignore*/}
            {record.endDateEdti ? (
              // @ts-ignore
              <>
                {`${moment(
                  // @ts-ignore
                  convertUtcToCurrentTimeZone(record.endDateEdti)
                ).format('DD MMM YYYY,LT')}`}
              </>
            ) : (
              '-'
            )}
          </>
        ),
      },
      subMenu !== 'global-rules'
        ? {
            title:
              subMenu === 'category-rules'
                ? t('common.labels.categories')
                : t('common.labels.keywords'),
            dataIndex: 'keywords',
            key: 'keywords',
            width: '10%',
            render: (categoriesEslai: string[], record: object) => (
              <div className="text-blue">
                {subMenu === 'category-rules' ? (
                  <>
                    {/*@ts-ignore*/}
                    {record.categoriesEslai &&
                    //@ts-ignore
                    record.categoriesEslai.length > 0 ? (
                      <>
                        <Dropdown
                          placement="bottomRight"
                          trigger={['hover']}
                          overlay={
                            <div className="table-dropdown">
                              <Menu>
                                {/*@ts-ignore*/}
                                {record.categoriesEslai.map((category) => (
                                  <Menu.Item>{category}</Menu.Item>
                                ))}
                              </Menu>
                            </div>
                          }>
                          <span className="cursor-pointer">
                            {/* @ts-ignore */}
                            {record.categoriesEslai.length === 1
                              ? '1 Category'
                              : // @ts-ignore
                                `${record.categoriesEslai.length} Categories`}
                          </span>
                        </Dropdown>
                      </>
                    ) : (
                      '-'
                    )}
                  </>
                ) : subMenu === 'search-rules' ? (
                  <>
                    {/*@ts-ignore*/}
                    {record.searchTermsEslai &&
                    // @ts-ignore
                    record.searchTermsEslai.length > 0 ? (
                      <>
                        <Dropdown
                          placement="bottomRight"
                          trigger={['hover']}
                          overlay={
                            <div className="table-dropdown">
                              <Menu>
                                {/*@ts-ignore*/}
                                {record.searchTermsEslai.map((searchTerm) => (
                                  <Menu.Item>{searchTerm}</Menu.Item>
                                ))}
                              </Menu>
                            </div>
                          }>
                          <span className="cursor-pointer">
                            {/* @ts-ignore */}
                            {record.searchTermsEslai.length === 1
                              ? '1 Keyword'
                              : // @ts-ignore
                                `${record.searchTermsEslai.length} Keywords`}
                          </span>
                        </Dropdown>
                      </>
                    ) : (
                      '-'
                    )}
                  </>
                ) : (
                  subMenu === 'global-rules' && '-'
                )}
              </div>
            ),
          }
        : {},
      {
        title: t('common.labels.status'),
        dataIndex: 'status',
        key: 'status',
        width: '10%',
        render: (statusEsi: string, record: object) => (
          <Tag
            color={
              // @ts-ignore
              record.statusEsi === 'active' &&
              // @ts-ignore
              (record.startDateEdti &&
              // @ts-ignore
              record.endDateEdti
                ? !moment(
                    // @ts-ignore
                    convertUtcToCurrentTimeZone(record.endDateEdti)
                  ).isBefore(Date.now())
                : true)
                ? 'success'
                : // @ts-ignore
                record.statusEsi === 'inactive' &&
                  // @ts-ignore
                  (record.startDateEdti &&
                  // @ts-ignore
                  record.endDateEdti
                    ? !moment(
                        // @ts-ignore
                        convertUtcToCurrentTimeZone(record.endDateEdti)
                      ).isBefore(Date.now())
                    : true)
                ? 'error'
                : // @ts-ignore
                  record.endDateEdti &&
                  moment(
                    // @ts-ignore
                    convertUtcToCurrentTimeZone(record.endDateEdti)
                  ).isBefore(Date.now()) &&
                  'default'
            }>
            {
              // @ts-ignore
              record.statusEsi === 'active' &&
              // @ts-ignore
              (record.startDateEdti &&
              // @ts-ignore
              record.endDateEdti
                ? !moment(
                    // @ts-ignore
                    convertUtcToCurrentTimeZone(record.endDateEdti)
                  ).isBefore(Date.now())
                : true)
                ? t('common.labels.active')
                : // @ts-ignore
                record.statusEsi === 'inactive' &&
                  // @ts-ignore
                  (record.startDateEdti &&
                  // @ts-ignore
                  record.endDateEdti
                    ? !moment(
                        // @ts-ignore
                        convertUtcToCurrentTimeZone(record.endDateEdti)
                      ).isBefore(Date.now())
                    : true)
                ? t('common.labels.inactive')
                : t('common.labels.expired')
            }
          </Tag>
        ),
      },
      ...selectedColumns,
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, subMenu, selectedColumns]
  );

  const onPreferenceChange = (
    checkedPublishQueueFields: CheckboxValueType[]
  ) => {
    const value: {
      preferenceName: string;
      preferenceValue: CheckboxValueType[];
      preferenceId?: string;
    } = {
      preferenceName: 'merchandising',
      preferenceValue: checkedPublishQueueFields,
    };

    if (userPreferenceId) {
      value['preferenceId'] = userPreferenceId;
    }

    updateUserPreference.mutate(value);
    setSelectedFields(checkedPublishQueueFields);
  };

  const columnValue = useCallback(
    (selectedFieldCheckBoxes: CheckboxValueType[]) => {
      const tempSelectedColumns = [...selectedColumns];

      if (selectedFieldCheckBoxes.includes('created_at')) {
        tempSelectedColumns.push({
          title: t('common.labels.created_at'),
          dataIndex: 'createdAt',
          key: 'createdAt',
          width: '12%',
          render: (createdAt: string) => (
            <>{convertDateTimeToUserTimezone(createdAt)}</>
          ),
        });
      }

      if (selectedFieldCheckBoxes.includes('created_by')) {
        tempSelectedColumns.push({
          title: t('common.labels.created_by'),
          dataIndex: 'createdBy',
          key: 'createdBy',
          width: '12%',
          render: (createdBy: string) => (
            <>{userDetails?.listAllUser?.[createdBy]}</>
          ),
        });
      }

      if (selectedFieldCheckBoxes.includes('modified_by')) {
        tempSelectedColumns.push({
          title: t('common.labels.modified_by'),
          dataIndex: 'modifiedBy',
          key: 'modifiedBy',
          width: '12%',
          render: (modifiedBy: string) => (
            <>{userDetails?.listAllUser?.[modifiedBy]}</>
          ),
        });
      }

      if (selectedFieldCheckBoxes.includes('modified_at')) {
        tempSelectedColumns.push({
          title: t('common.labels.modified_at'),
          dataIndex: 'modifiedAt',
          key: 'modifiedAt',
          width: '15%',
          render: (modifiedAt: string) => (
            <>{convertDateTimeToUserTimezone(modifiedAt)}</>
          ),
        });
      }

      setSelectedColumns(tempSelectedColumns);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t]
  );

  useEffect(() => {
    if (getUserPreference.isSuccess) {
      if (getUserPreference.data.length > 0) {
        if (getUserPreference.data[0].preferenceValue.length > 0) {
          setUserPreference(getUserPreference.data[0].preferenceValue);
        }
        setUserPreferenceId(getUserPreference.data[0].id);
        columnValue(getUserPreference.data[0].preferenceValue);
      } else {
        setUserPreference(['modified_by']);
        columnValue(['modified_by']);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserPreference.isSuccess]);

  useEffect(() => {
    if (updateUserPreference.isSuccess) {
      columnValue(selectedFields);
      getUserPreference.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateUserPreference.isSuccess]);

  return {
    t,
    list,
    workspaceId,
    columns,
    isModalVisible,
    hideModal,
    onDeleteRule,
    onInputChange,
    form,
    filterFlag,
    deleteRule,
    onSortRuleListData,
    userPreference,
    onPreferenceChange,
    selectedSortValue,
    storeIssueFound,
    onAddStore,
    permission,
    subMenu,
    searchData,
  };
};

export default useListRuleController;
