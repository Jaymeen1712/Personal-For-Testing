import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import useUser from '../../../../hooks/user/user';
import { IWorkspaceParams } from '../../../../types';
import {
  convertDateTimeToUserTimezone,
  countryListWithCountryCode,
} from '../../../../utills';
import { useListAudience } from '../services';

interface IUseListAudienceController {
  environment: string;
}

const useListAudienceController = ({
  environment,
}: IUseListAudienceController) => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const history = useHistory();

  // const [rows, setRows] = useState(20);
  const [start, setStart] = useState(0);

  const [audienceList, setAudienceList] = useState<Record<string, string>[]>(
    []
  );
  const [isLoadMoreDisabled, setLoadMoreDisabled] = useState(false);
  const [lastEleId, setLastEleId] = useState('');

  const user = useUser();
  const listAudience = useListAudience(workspaceId, environment, start);

  const increaseRowCount = () => {
    setStart((previous) => previous + 20);

    setTimeout(() => {
      if (lastEleId) {
        document
          .querySelector(`[data-row-key='${lastEleId}']`)
          ?.scrollIntoView({
            behavior: 'smooth',
          });
      }
    }, 800);
  };

  const onAudienceClick = useCallback(
    (record: object) => {
      // @ts-ignore
      history.push(`/workspaces/${workspaceId}/audience/${record.id}/details`);
    },
    [history, workspaceId]
  );

  const recordCountry = useCallback((record: object) => {
    // @ts-ignore
    return countryListWithCountryCode[record.country];
  }, []);

  const totalDuration = useCallback((record: object) => {
    // @ts-ignore
    return new Date(record.total_duration * 1000).toISOString().slice(11, 19);
  }, []);

  const columns = useMemo(
    () => [
      {
        title: t('common.labels.name'),
        dataIndex: 'name',
        key: 'name',
        render: (name: string, row: object) => {
          return (
            <>
              <div className="ant-row ant-space-align-center ant-row-space-between w-100 table-text-button">
                <div className="table-text">
                  <div
                    className="text-truncate with-pixel text-blue cursor-pointer"
                    onClick={() => onAudienceClick(row)}>
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
                {row.country ? recordCountry(row) : '-'}
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
                {row.device_vendor ? row.device_vendor : '-'}
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
                {row.total_duration ? totalDuration(row) : '-'}
              </div>
            </>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, onAudienceClick, recordCountry, totalDuration]
  );

  useEffect(() => {
    listAudience.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  useEffect(() => {
    if (
      listAudience.isSuccess &&
      listAudience.data &&
      listAudience.data.length > 0
    ) {
      setAudienceList((previous) => [...previous, ...listAudience.data]);
      setLastEleId(listAudience.data.slice(-1)[0].id);
    }
  }, [listAudience.data, listAudience.isSuccess]);

  useEffect(() => {
    if (
      listAudience.isSuccess &&
      listAudience.data &&
      (!listAudience.data || listAudience.data.length < 20)
    ) {
      setLoadMoreDisabled(true);
    }
    if (listAudience.isSuccess && !listAudience.data) {
      setLoadMoreDisabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listAudience.data]);

  return {
    t,
    columns,
    listAudience,
    increaseRowCount,
    isLoadMoreDisabled,
    audienceList,
  };
};

export default useListAudienceController;
