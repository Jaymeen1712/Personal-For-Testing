import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  useGetSegmentDetailsByQuery,
  useDeleteSegment,
  useUpdateSegment,
  useCreateSegment,
} from '../services';
import { ISegmentList } from '../../../../types';
import {
  API_QUERY_KEY,
  camelToSnackCase,
  convertDateTimeToUserTimezone,
  countryListWithCountryCode,
  openNotificationWithIcon,
} from '../../../../utills';
import queryClient from '../../../../query-client';
import shapeCollection from '../../../../utills/convert-request-response';
import usePermissions from '../../../../hooks/permissions/permissions';
import useUser from '../../../../hooks/user';
import debounce from 'lodash.debounce';

const useQueryBuilderController = (segmentDetail: ISegmentList) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const user = useUser();
  const inputRef = useRef(null);
  const { canDeleteAudience, canUpdateAudience } = usePermissions();
  const { workspaceId, segmentId } = useParams<{
    workspaceId: string;
    segmentId: string;
  }>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [query, setQuery] = useState<any>(
    segmentDetail.queryJson
      ? segmentDetail.queryJson
      : {
          group: {
            operator: 'AND',
            rules: [],
          },
        }
  );
  const [segmentDetailsByQuery, setSegmentDetailsByQuery] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useState<any>([]);
  const [editSegment, setEditSegment] = useState(segmentId !== 'new');

  const [isDeleteSegmentIsVisible, setIsDeleteSegmentIsVisible] =
    useState(false);

  const [skip, setSkip] = useState(1);
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [skipLimit, setSkipLimit] = useState(20);
  const [searchData, setSearchData] = useState('');

  const [columnSortOrder, setColumnSortOrder] = useState({
    sortBy: '',
    orderBy: '',
  });
  const [isSortByClick, setIsSortByClick] = useState(false);

  const [isQuerySectionVisible, setIsQuerySectionVisible] = useState(false);

  const getSegmentDetailsByQuery = useGetSegmentDetailsByQuery(workspaceId);

  const deleteSegment = useDeleteSegment(workspaceId);

  const updateSegment = useUpdateSegment(workspaceId);

  const createSegment = useCreateSegment(workspaceId);
  const changeQuery = () => {
    setQuery({ ...query });
  };

  const onDeleteSegmentButtonClick = () => {
    setIsDeleteSegmentIsVisible(true);
  };

  const onCancelDeleteSegmentButtonClick = () => {
    setIsDeleteSegmentIsVisible(false);
  };

  const onConfirmDeleteButtonClick = () => {
    deleteSegment.mutate(segmentId);
  };

  const onUpdateSegmentButtonClick = () => {
    updateSegment.mutate({
      name: segmentDetail.name,
      description: segmentDetail.description,
      queryJson: query,
      id: segmentId,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queryValidationCheck = (query: any) => {
    let queryString = '';
    for (let i = 0; i < query.rules.length; i++) {
      if (query.rules[i].group) {
        const result = queryValidationCheck(query.rules[i].group);
        if (result) {
          queryString = queryString.concat(
            '',
            ` ${i !== 0 ? query.operator : ''} ${result}`
          );
        } else {
          queryString = '';
        }
      } else {
        if (
          !query.rules[i].field.displayName ||
          query.rules[i].field === 'hasError'
        ) {
          query.rules[i].field = 'hasError';
          queryString = '';
          changeQuery();
          return false;
        } else if (
          !query.rules[i].condition ||
          query.rules[i].condition === 'hasError'
        ) {
          query.rules[i].condition = 'hasError';
          queryString = '';
          changeQuery();
          return false;
        } else if (!query.rules[i].data || query.rules[i].data === 'hasError') {
          query.rules[i].data = 'hasError';
          queryString = '';
          changeQuery();
          return false;
        }
        queryString = queryString.concat(
          '',
          ` ${i !== 0 ? query.operator : ''} ${
            query.rules[i].field.displayName
          } ${query.rules[i].condition} ${query.rules[i].data}`
        );
      }
    }
    changeQuery();
    if (queryString) {
      return `(${queryString} )`;
    } else {
      return '';
    }
  };

  const reFetchSegmentDetailsBYQuery = () => {
    const result = queryValidationCheck(query.group);
    if (result) {
      getSegmentDetailsByQuery.mutate({
        //@ts-ignore
        environmentId: localStorage.getItem(`${workspaceId}/environmentId`),
        query: query,
        skip: 1,
        skipLimit: 20,
        columnSortOrder,
        searchData,
      });
    }
  };

  const onPageChange = (page: number, pageSize: number) => {
    setSegmentDetailsByQuery([]);
    setCurrentPageNumber(page);
    setSkip(page);
    setSkipLimit(pageSize);
    getSegmentDetailsByQuery.mutate({
      //@ts-ignore
      environmentId: localStorage.getItem(`${workspaceId}/environmentId`),
      query: query,
      skip: page,
      skipLimit: pageSize,
      columnSortOrder,
      searchData,
    });
  };

  //@ts-ignore
  const onChangeTable = (pagination, filter, sorter) => {
    if (!isSortByClick) {
      setIsSortByClick(true);
    }
    if (sorter.order === 'ascend') {
      setColumnSortOrder({
        sortBy: camelToSnackCase(sorter.field),
        orderBy: 'asc',
      });
    } else if (sorter.order === 'descend') {
      setColumnSortOrder({
        sortBy: camelToSnackCase(sorter.field),
        orderBy: 'desc',
      });
    } else {
      setColumnSortOrder({
        sortBy: '',
        orderBy: '',
      });
    }
  };

  const onAudienceClick = (recordId: string) => {
    history.push(
      `/workspaces/${workspaceId}/audience/${
        segmentId
          ? segmentId === 'new'
            ? 'all-audiance'
            : segmentId
          : location.pathname.split('/').pop()
      }/${recordId}/details`
    );
  };

  const onSearchDataChange = debounce((val) => {
    setSearchData(val.target.value.trim());
    getSegmentDetailsByQuery.mutate({
      //@ts-ignore
      environmentId: localStorage.getItem(`${workspaceId}/environmentId`),
      query: query,
      skip: skip,
      skipLimit: skipLimit,
      searchData: val.target.value.trim(),
    });
  }, 500);

  const onQuerySectionVisibleChange = (val: boolean) => {
    setIsQuerySectionVisible(val);
  };

  const onCloneButtonClick = () => {
    createSegment.mutate({
      name: `${segmentDetail.name} Copy`,
      description: segmentDetail.description ? segmentDetail.description : '',
      queryJson: segmentDetail.queryJson,
      environmentId: localStorage.getItem(`${workspaceId}/environmentId`),
    });
  };

  const columns = [
    {
      title: t('common.labels.name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string, row: { id: string }) => {
        return (
          <>
            <div className="ant-row ant-space-align-center ant-row-space-between w-100 table-text-button">
              <div className="table-text">
                <div
                  className="text-truncate with-pixel text-blue cursor-pointer"
                  onClick={() => onAudienceClick(row.id)}>
                  {/* @ts-ignore */}
                  {row.name ? row.name : row.device_id ? row.device_id : '-'}
                </div>
              </div>
            </div>
          </>
        );
      },
    },
    {
      title: t('common.labels.country'),
      dataIndex: 'country',
      key: 'country',
      render: (country: string, row: object) => {
        return (
          <>
            <div className="text-truncate with-pixel">
              {/*@ts-ignore*/}
              {row.country ? countryListWithCountryCode[row.country] : '-'}
            </div>
          </>
        );
      },
    },
    {
      title: t('common.labels.device'),
      dataIndex: 'device_vendor',
      key: 'device_vendor',
      render: (device_vendor: string, row: object) => {
        return (
          <>
            <div className="text-truncate with-pixel">
              {/*@ts-ignore*/}
              {row.device_category
                ? //@ts-ignore
                  row.device_category === 'pc'
                  ? 'Desktop'
                  : 'Smartphone'
                : '-'}
            </div>
          </>
        );
      },
    },
    {
      title: t('common.labels.browser'),
      dataIndex: 'device_name',
      key: 'device_name',
      render: (device_name: string, row: object) => {
        return (
          <>
            <div className="text-truncate with-pixel">
              {/*@ts-ignore*/}
              {row.device_name ? row.device_name : '-'}
            </div>
          </>
        );
      },
    },
    {
      title: t('common.labels.sessions'),
      dataIndex: 'total_session_count',
      key: 'total_session_count',
      render: (total_session_count: number, row: object) => {
        return (
          <>
            <div className="text-truncate with-pixel">
              {/*@ts-ignore*/}
              {row.total_session_count ? row.total_session_count : '-'}
            </div>
          </>
        );
      },
    },
    {
      title: t('common.labels.last_seen'),
      dataIndex: 'last_seen_at',
      key: 'last_seen_at',
      render: (last_seen_at: string, row: object) => {
        return (
          <>
            <div className="text-truncate with-pixel">
              {/*@ts-ignore*/}
              {row.last_seen_at
                ? convertDateTimeToUserTimezone(
                    last_seen_at,
                    user?.user?.timezone
                  )
                : '-'}
            </div>
          </>
        );
      },
    },
    {
      title: t('common.labels.time_spent'),
      dataIndex: 'total_duration',
      key: 'total_duration',
      render: (total_duration: string, row: object) => {
        return (
          <>
            <div className="text-truncate with-pixel">
              {/*@ts-ignore*/}
              {row.total_duration
                ? //@ts-ignore
                  new Date(row.total_duration * 1000)
                    .toISOString()
                    .slice(11, 19)
                : '-'}
            </div>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    setSkipLimit(20);
    setCurrentPageNumber(1);
    setSegmentDetailsByQuery([]);
    if (segmentId === 'new') {
      setQuery({
        group: {
          operator: 'AND',
          rules: [],
        },
      });
      setEditSegment(false);
    } else {
      if (segmentDetail?.name) {
        setQuery(segmentDetail.queryJson);
        getSegmentDetailsByQuery.mutate({
          //@ts-ignore
          environmentId: localStorage.getItem(`${workspaceId}/environmentId`),
          query: segmentDetail.queryJson,
          skip: 1,
          skipLimit: 20,
          columnSortOrder,
          searchData,
        });
      }
      setEditSegment(true);
      setIsQuerySectionVisible(false);
    }

    if (inputRef.current) {
      //@ts-ignore
      inputRef.current.input.value = '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segmentDetail?.name]);

  useEffect(() => {
    if (getSegmentDetailsByQuery.isSuccess) {
      setTotalRecordCount(getSegmentDetailsByQuery.data.totalCount);
      setSegmentDetailsByQuery(
        shapeCollection(
          getSegmentDetailsByQuery.data.items,
          false,
          'camelToSnackCase'
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSegmentDetailsByQuery.isSuccess, getSegmentDetailsByQuery.data]);
  useEffect(() => {
    if (getSegmentDetailsByQuery.error) {
      setTotalRecordCount(0);
      setSegmentDetailsByQuery([]);
      console.log('test', getSegmentDetailsByQuery.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSegmentDetailsByQuery.error]);

  useEffect(() => {
    if (deleteSegment.isSuccess) {
      onCancelDeleteSegmentButtonClick();
      openNotificationWithIcon(
        'success',
        t('common.messages.segment_deleted_successfully')
      );
      queryClient.removeQueries([API_QUERY_KEY.GET_SEGMENTS_LIST]);
      getSegmentDetailsByQuery.mutate({
        //@ts-ignore
        environmentId: localStorage.getItem(`${workspaceId}/environmentId`),
        query: {
          group: {
            operator: 'AND',
            rules: [],
          },
        },
        skip: 1,
        skipLimit: 20,
        columnSortOrder: {
          sortBy: '',
          orderBy: '',
        },
        searchData: '',
      });
      history.push(
        `/workspaces/${workspaceId}/audience/all-details?queryType=allVisitor`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteSegment.isSuccess]);

  useEffect(() => {
    if (deleteSegment.error) {
      //@ts-ignore
      openNotificationWithIcon('error', deleteSegment.error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteSegment.error]);

  useEffect(() => {
    if (updateSegment.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.segment_updated_successfully')
      );
      setIsQuerySectionVisible(false);
      queryClient.removeQueries([API_QUERY_KEY.GET_SEGMENTS_LIST]);
      history.push(
        `/workspaces/${workspaceId}/audience/${segmentId}/query-builder`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateSegment.isSuccess]);

  useEffect(() => {
    if (updateSegment.error) {
      //@ts-ignore
      openNotificationWithIcon('error', updateSegment.error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateSegment.error]);

  useEffect(() => {
    if (createSegment.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.segment_clone_successfully')
      );
      queryClient.removeQueries([API_QUERY_KEY.GET_SEGMENTS_LIST]);
      history.push(
        `/workspaces/${workspaceId}/audience/${createSegment.data.id}/query-builder`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createSegment.isSuccess]);

  useEffect(() => {
    if (createSegment.error) {
      //@ts-ignore
      openNotificationWithIcon('error', createSegment.error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createSegment.error]);

  return {
    query,
    changeQuery,
    t,
    segmentDetailsByQuery,
    editSegment,
    onDeleteSegmentButtonClick,
    isDeleteSegmentIsLoading: deleteSegment.isLoading,
    onUpdateSegmentButtonClick,
    isUpdateSegmentIsLoading: updateSegment.isLoading,
    isLoading: getSegmentDetailsByQuery.isLoading || !segmentDetail.name,
    reFetchSegmentDetailsBYQuery,
    isDeleteSegmentIsVisible,
    onConfirmDeleteButtonClick,
    onCancelDeleteSegmentButtonClick,
    newSegment: location.pathname.split('/').includes('new'),
    canDeleteAudience,
    canUpdateAudience,
    columns,
    skip,
    skipLimit,
    totalRecordCount,
    currentPageNumber,
    onPageChange,
    onChangeTable,
    isQuerySectionVisible,
    onSearchDataChange,
    onQuerySectionVisibleChange,
    isCloneLoading: createSegment.isLoading,
    onCloneButtonClick,
    inputRef,
  };
};
export default useQueryBuilderController;
