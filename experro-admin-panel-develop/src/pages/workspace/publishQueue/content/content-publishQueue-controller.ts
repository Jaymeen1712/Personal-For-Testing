import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd';
import debounce from 'lodash.debounce';

import { ContentModelList, IWorkspaceParams } from '../../../../types';
import { useListContentModelPublishQueue } from '../services';
import { useParams } from 'react-router-dom';
import { useListAllUser } from '../../../../apis/user';

interface IUseContentPublishQueueController {
  setSearchData: (searchData: string) => void;
  setCurrentPageNumber: (currentPageNumber: number) => void;
  setSkip: (skip: number) => void;
  setSkipLimit: (skipLimit: number) => void;
  currentPageNumber: number;
  selectedUserIds: string[];
  setSelectedUserIds: (selectedUserIds: string[]) => void;
  selectedModelIds: string[];
  setSelectedModelIds: (selectedModelIds: string[]) => void;
  selectedStatus: string[];
  setSelectedStatus: (selectedStatus: string[]) => void;
}

interface IUser {
  id: string;
  firstName: string;
  lastName: string;
}

const useContentPublishQueueController = ({
  setSearchData,
  setCurrentPageNumber,
  setSkip,
  setSkipLimit,
  currentPageNumber,
  selectedUserIds,
  setSelectedUserIds,
  selectedModelIds,
  setSelectedModelIds,
  selectedStatus,
  setSelectedStatus,
}: IUseContentPublishQueueController) => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<IWorkspaceParams>();

  const [form] = Form.useForm();
  const contentModalFilterInputRef = useRef();
  const userFilterInputRef = useRef();
  const [contentModalFilterValue, setContentModalFilterValue] = useState('');
  const [contentModalList, setContentModalList] = useState<ContentModelList[]>(
    []
  );
  const [userFilterValue, setUserFilterValue] = useState<string>('');
  const [userList, SetUserList] = useState<IUser[]>([]);
  const getModelList = useListContentModelPublishQueue(
    workspaceId,
    localStorage.getItem(`${workspaceId}/environmentId`)
  );
  const listAllUser = useListAllUser();

  const onInputChange = debounce((searchValue) => {
    setSearchData(searchValue);
    setCurrentPageNumber(1);
    setSkip(1);
  }, 1000);

  const onPageChange = (page: number, pageSize: number) => {
    setCurrentPageNumber(page);
    setSkip(page);
    setSkipLimit(pageSize);
  };

  const onStatus = useCallback(
    (status: string[]) => {
      if (status.length > 1 && status.indexOf('All') !== -1) {
        status.splice(status.indexOf('All'), 1);
      }

      if (currentPageNumber > 1) {
        setCurrentPageNumber(1);
        setSkip(1);
      }
      setSelectedStatus(status);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedStatus]
  );

  const onContentModalChange = useCallback(
    (modelId: string[]) => {
      if (modelId.length > 1 && modelId.indexOf('All') !== -1) {
        modelId.splice(modelId.indexOf('All'), 1);
      }

      if (currentPageNumber > 1) {
        setCurrentPageNumber(1);
        setSkip(1);
      }

      setSelectedModelIds(modelId);
      if (getModelList.data) {
        setContentModalList(getModelList?.data);
      }

      setContentModalFilterValue('');
      //@ts-ignore
      contentModalFilterInputRef?.current?.blur();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedModelIds, getModelList.data, currentPageNumber]
  );

  const onContentModalFilterInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (getModelList.data) {
      if (e.target.value.length > 0) {
        setContentModalList(
          getModelList.data.filter((item) =>
            item.name.toLowerCase().includes(e.target.value.toLowerCase())
          )
        );
      } else {
        setContentModalList(getModelList.data);
      }
      setContentModalFilterValue(e.target.value);
    }
  };

  const onWorkspaceUser = useCallback(
    (userId: string[]) => {
      if (userId.length > 1 && userId.indexOf('All') !== -1) {
        userId.splice(userId.indexOf('All'), 1);
      }

      if (currentPageNumber > 1) {
        setCurrentPageNumber(1);
        setSkip(1);
      }

      if (listAllUser.data) {
        SetUserList(listAllUser.data);
      }

      setUserFilterValue('');

      setSelectedUserIds(userId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedUserIds, listAllUser.data, currentPageNumber]
  );

  const onUserFilterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (listAllUser.data) {
      if (e.target.value.length > 0) {
        SetUserList(
          listAllUser.data.filter(
            (item) =>
              item.firstName
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
              item.lastName.toLowerCase().includes(e.target.value.toLowerCase())
          )
        );
      } else {
        SetUserList(listAllUser.data);
      }
      setUserFilterValue(e.target.value);
    }
  };

  useEffect(() => {
    if (
      getModelList.isSuccess &&
      getModelList.data &&
      getModelList.data.length > 0
    ) {
      setContentModalList([...getModelList.data]);
    }
  }, [getModelList.isSuccess, getModelList.data]);

  useEffect(() => {
    if (
      listAllUser.isSuccess &&
      listAllUser.data &&
      listAllUser.data.length > 0
    ) {
      SetUserList([...listAllUser.data]);
    }
  }, [listAllUser.data, listAllUser.isSuccess]);

  return {
    t,
    form,
    onInputChange,
    onPageChange,
    onWorkspaceUser,
    onContentModalChange,
    onStatus,
    contentModalFilterInputRef,
    onContentModalFilterInputChange,
    contentModalFilterValue,
    contentModalList,
    userFilterInputRef,
    userList,
    userFilterValue,
    onUserFilterInputChange,
    getModelList,
  };
};

export default useContentPublishQueueController;
