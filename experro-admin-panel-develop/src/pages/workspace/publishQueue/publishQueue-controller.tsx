import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Tag } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import moment from 'moment/moment';

import { GridColumnType, IWorkspaceParams } from '../../../types';
import useUser from '../../../hooks/user';
import { PAGE_SIZE, SIDEBAR_KEYS } from '../../../utills';
import {
  useGetUserPreferencePublishQueue,
  useListPublishQueue,
  useUpdateUserPreferencePublishQueue,
} from './services';

interface IUsePublishQueueController {
  onMainSidebarActiveItem?: (val: string) => void;
}

const usePublishQueueController = ({
  onMainSidebarActiveItem,
}: IUsePublishQueueController) => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<IWorkspaceParams>();

  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedEnvironments, setSelectedEnvironments] = useState<
    string | null
  >(localStorage.getItem(`${workspaceId}/environmentId`));
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([]);
  const [searchData, setSearchData] = useState('');
  const [userPreference, setUserPreference] = useState<string[]>([]);
  const [userPreferenceId, setUserPreferenceId] = useState('');
  const [selectedColumns, setSelectedColumn] = useState<GridColumnType[]>([]);
  const [skip, setSkip] = useState(1);

  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [skipLimit, setSkipLimit] = useState(PAGE_SIZE);
  const [selectedFields, setSelectedFields] = useState<CheckboxValueType[]>([
    '',
  ]);
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const userDetails = useUser();

  const getUserPreference = useGetUserPreferencePublishQueue(
    workspaceId,
    'publish-queue',
    userDetails?.user?.id
  );

  const updateUserPreference = useUpdateUserPreferencePublishQueue(workspaceId);

  const listPublishQueue = useListPublishQueue(
    workspaceId,
    skip,
    skipLimit,
    searchData,
    selectedFields,
    selectedUserIds,
    selectedModelIds,
    selectedEnvironments,
    selectedStatus,
    startDate,
    endDate,
    localStorage.getItem(`${workspaceId}/environmentId`)
  );

  const columns = useMemo(
    () => [
      {
        title: t('common.labels.title'),
        dataIndex: 'title',
        key: 'title',
        width: '15%',
        render: (text: string) => (
          <>
            <div
              className={`ant-row ant-row-middle ant-row-no-wrap ant-row-space-between table-text-button`}>
              <div className="table-text text-truncate with-pixel-small">
                {text ? text : '-'}
              </div>
            </div>
          </>
        ),
      },
      {
        title: t('common.labels.model'),
        dataIndex: 'contentModelName',
        key: 'contentModelName',
        width: '15%',
        render: (modalName: string) => (
          <>
            <div
              className={`ant-row ant-row-middle ant-row-no-wrap ant-row-space-between table-text-button`}>
              <div className="text-truncate with-pixel-small">{modalName}</div>
            </div>
          </>
        ),
      },
      ...selectedColumns,
    ],
    [t, selectedColumns]
  );

  const columnValue = useCallback(
    (selectedCheckboxOfFields: CheckboxValueType[]) => {
      setSelectedColumn([]);

      const tempSelectedColumns = [...selectedColumns];

      if (selectedCheckboxOfFields.includes('created_at')) {
        tempSelectedColumns.push({
          title: t('common.labels.date_and_time'),
          dataIndex: 'createdAt',
          key: 'createdAt',
          width: '14%',
          render: (createdAt: string) => (
            <div className={`ant-row ant-row-middle`}>
              <div className="table-text">{createdAt}</div>
            </div>
          ),
        });
      }

      if (selectedCheckboxOfFields.includes('content_model_version_name')) {
        tempSelectedColumns.push({
          title: t('common.labels.version'),
          dataIndex: 'contentModelVersionName',
          key: 'contentModelVersionName',
          width: '10%',
          render: (contentModelVersionName: string) => (
            <div className={`ant-row ant-row-middle `}>
              <div className="text-truncate with-pixel-small">
                {contentModelVersionName ? contentModelVersionName : '-'}
              </div>
            </div>
          ),
        });
      }

      if (selectedCheckboxOfFields.includes('environment')) {
        tempSelectedColumns.push({
          title: t('common.labels.environment'),
          dataIndex: 'environments',
          key: 'environments',
          width: '12%',
          render: (environments: { [k: string]: string }) =>
            environments && JSON.stringify(environments) !== '{}' ? (
              <>{Object.keys(environments)}</>
            ) : (
              '-'
            ),
        });
      }

      if (selectedCheckboxOfFields.includes('created_by')) {
        tempSelectedColumns.push({
          title: t('common.labels.user'),
          dataIndex: 'createdBy',
          key: 'createdBy',
          width: '12%',
          render: (createdBy: string) => (
            <div className={`ant-row ant-row-middle `}>
              <div className="table-text">{createdBy}</div>
            </div>
          ),
        });
      }

      if (selectedCheckboxOfFields.includes('action')) {
        tempSelectedColumns.push({
          title: t('common.labels.status'),
          dataIndex: 'action',
          key: 'action',
          width: '10%',
          render: (action: string) => (
            <div className={`ant-row ant-row-middle`}>
              {action === 'PUBLISHED' ? (
                <Tag color="success" key="recordSuccess">
                  {t('common.labels.Published')}
                </Tag>
              ) : action === 'UNPUBLISHED' || action === 'DRAFT' ? (
                <Tag color="warning" key="recordWarning">
                  {t('common.labels.draft')}
                </Tag>
              ) : action === 'SCHEDULED_TO_PUBLISH' ? (
                <Tag color="warning" key="recordWarning">
                  {t('common.labels.scheduled_to_publish')}
                </Tag>
              ) : (
                <Tag color="blue" key="recordBlue">
                  {t('common.labels.scheduled_to_un_publish')}
                </Tag>
              )}
            </div>
          ),
        });
      }

      if (selectedCheckboxOfFields.includes('id')) {
        tempSelectedColumns.push({
          title: t('common.labels.id'),
          dataIndex: 'id',
          key: 'id',
          width: '14%',
          render: (id: string) => (
            <div className={`ant-row ant-row-middle `}>
              <div className="table-text">{id ? id : '-'}</div>
            </div>
          ),
        });
      }

      setSelectedColumn(tempSelectedColumns);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t]
  );

  useEffect(() => {
    if (getUserPreference.isSuccess) {
      if (getUserPreference.data.length > 0) {
        if (getUserPreference.data[0].preferenceValue.length > 0) {
          setUserPreference(getUserPreference.data[0].preferenceValue);
          setSelectedFields(getUserPreference.data[0].preferenceValue);
        }
        setUserPreferenceId(getUserPreference.data[0].id);
        columnValue(getUserPreference.data[0].preferenceValue);
      } else {
        setSelectedFields([
          'action',
          'environment',
          'created_by',
          'created_at',
          'content_model_version_name',
        ]);
        setUserPreference([
          'action',
          'environment',
          'created_by',
          'created_at',
          'content_model_version_name',
        ]);
        columnValue([
          'action',
          'environment',
          'created_by',
          'created_at',
          'content_model_version_name',
        ]);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserPreference.isSuccess]);

  const onPreferenceChange = (
    checkedPublishQueueFields: CheckboxValueType[]
  ) => {
    const value: {
      preferenceName: string;
      preferenceValue: CheckboxValueType[];
      preferenceId?: string;
    } = {
      preferenceName: 'publish-queue',
      preferenceValue: checkedPublishQueueFields,
    };

    if (userPreferenceId) {
      value['preferenceId'] = userPreferenceId;
    }
    updateUserPreference.mutate(value);
    setSelectedFields(checkedPublishQueueFields);
  };

  useEffect(() => {
    if (updateUserPreference.isSuccess) {
      columnValue(selectedFields);
      getUserPreference.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateUserPreference.isSuccess]);

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.SETTINGS);
    }

    setStartDate(
      moment(
        new Date(new Date(Date.now()).getTime() - 30 * 24 * 60 * 60 * 1000)
      )
        .utc()
        .format('YYYY-MM-DD')
    );
    setEndDate(
      moment(new Date(new Date(Date.now()).getTime()))
        .utc()
        .format('YYYY-MM-DD')
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onEnvironmentChange = (environment: string) => {
    setSelectedEnvironments(environment);
    setSelectedModelIds([]);
    setSelectedUserIds([]);
    setSelectedStatus([]);
  };

  return {
    listPublishQueue,
    columns,
    isSuccess: listPublishQueue.isSuccess,
    currentPageNumber,
    skipLimit,
    userPreference,
    onPreferenceChange,
    selectedUserIds,
    selectedModelIds,
    selectedStatus,
    setCurrentPageNumber,
    setSkip,
    setSearchData,
    setSkipLimit,
    setSelectedUserIds,
    setSelectedModelIds,
    setSelectedStatus,
    onEnvironmentChange,
    setStartDate,
    setEndDate,
    startDate,
    endDate,
  };
};

export default usePublishQueueController;
