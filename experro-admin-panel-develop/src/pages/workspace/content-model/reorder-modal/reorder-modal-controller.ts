import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Item } from 'react-nestable';
import { useParams } from 'react-router-dom';

import { ContentModelList, IWorkspaceParams } from '../../../../types';
import { useReorderModel } from '../services/models';
import { useReorderComponents } from '../services/components';
import queryClient from '../../../../query-client';
import { API_QUERY_KEY, openNotificationWithIcon } from '../../../../utills';

const useReorderModalController = (
  data: {
    id: string;
    label: string;
    position: number;
    children: ContentModelList[];
  }[],
  reorderType: string,
  onReorderModalCancelClick: () => void
) => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const [reorderArrayData, setReorderArrayData] = useState<
    {
      id: string;
      label: string;
      position: number;
      children: ContentModelList[];
    }[]
  >(data);

  const [collapseActiveKey, setCollapseActiveKey] = useState<string[] | string>(
    []
  );

  const reorderModel = useReorderModel(workspaceId);

  const reorderComponents = useReorderComponents(workspaceId);

  const reorderChildren = (items: Item[], index: number) => {
    const tempArray = [...reorderArrayData];
    // @ts-ignore
    tempArray[index].children = [...items];

    setReorderArrayData([...tempArray]);
  };

  const folderReorder = (val: Item[]) => {
    // @ts-ignore
    setReorderArrayData(val);
  };

  const onCollapseActiveKeyChange = (key: string[] | string) => {
    setCollapseActiveKey(key);
  };

  const onSaveClick = () => {
    const folderArray: {
      id: string;
      name: string;
      position: number;
    }[] = [];

    const modelArray: {
      id: string;
      name: string;
      position: number;
    }[] = [];

    reorderArrayData.map((folderData, folderIndex) => {
      folderArray.push({
        id: folderData.id,
        position: folderIndex,
        name: folderData.label,
      });
      if (folderData.children) {
        folderData.children.map((modelData, modelIndex) => {
          modelArray.push({
            id: modelData.id,
            position: modelIndex,
            name: modelData.name,
          });
          return true;
        });
      }
      return true;
    });
    if (reorderType === 'model') {
      reorderModel.mutate({
        contentModels: modelArray,
        groups: folderArray,
      });
    } else {
      reorderComponents.mutate({
        components: modelArray,
        groups: folderArray,
      });
    }
  };

  useEffect(() => {
    if (reorderModel.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.CONTENT_MODEL_GROUP_LIST]);
      queryClient.removeQueries([API_QUERY_KEY.CONTENT_MODEL_LIST]);
      openNotificationWithIcon(
        'success',
        t('common.messages.reorder_successfully')
      );
      onReorderModalCancelClick();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reorderModel.isSuccess]);

  useEffect(() => {
    if (reorderModel.isError) {
      openNotificationWithIcon('error', t('common.messages.error_in_reorder'));
    }
  }, [t, reorderModel.isError]);

  useEffect(() => {
    if (reorderComponents.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.COMPONENT_MODEL_GROUP_LIST]);
      queryClient.removeQueries([API_QUERY_KEY.COMPONENT_MODEL_LIST]);
      openNotificationWithIcon(
        'success',
        t('common.messages.reorder_successfully')
      );
      onReorderModalCancelClick();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reorderComponents.isSuccess]);

  useEffect(() => {
    if (reorderComponents.isError) {
      openNotificationWithIcon('error', t('common.messages.error_in_reorder'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reorderComponents.isError]);

  return {
    t,
    reorderArrayData,
    reorderChildren,
    folderReorder,
    onSaveClick,
    collapseActiveKey,
    onCollapseActiveKeyChange,
  };
};
export default useReorderModalController;
