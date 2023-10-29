import React, { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import { Button } from 'antd';
import { useParams } from 'react-router-dom';

import {
  ILanguage,
  IReorderDatatype,
  IWorkspaceParams,
} from '../../../../types';
import DeleteIcon from '../../../../images/icons/delete-icon';
import queryClient from '../../../../query-client';
import { API_QUERY_KEY, openNotificationWithIcon } from '../../../../utills';
import useError from '../../../../hooks/error';
import usePermissions from '../../../../hooks/permissions';
import DragIcon from '../../../../images/icons/drag-icon';
import {
  useListWorkspaceLanguage,
  useRemoveWorkspaceLanguage,
  useReOrderWorkspaceLanguages,
} from '../services';

interface SortableItemProps {
  children: ReactNode | ReactNode[];
  'data-row-key'?: number;
  onClick?: () => void;
}

interface SortableBodyProps {
  children: (boolean | ReactNode)[];
  className: string;
}

interface DraggableBodyRowProps {
  className: string;
  style: object;
  children: ReactNode;
  'data-row-key'?: number;
}

interface DraggableContainerProps {
  className: string;
  children: (boolean | ReactNode)[];
}

const useAddReOrderInternationalization = () => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const permissions = usePermissions();

  const [selectedLanguages, setSelectedLanguages] = useState<ILanguage[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [languageToDelete, setLanguageToDelete] = useState({
    id: '',
    locale: '',
    name: '',
  });

  const DragHandle = SortableHandle(() => <DragIcon />);
  const SortableItem = SortableElement((props: SortableItemProps) => (
    <tr {...props} />
  ));
  const SortableBody = SortableContainer((props: SortableBodyProps) => (
    <tbody {...props} />
  ));

  const listWorkspaceLanguages = useListWorkspaceLanguage(workspaceId);
  const reOrderWorkspaceLanguages = useReOrderWorkspaceLanguages();
  const removeWorkspaceLanguage = useRemoveWorkspaceLanguage();

  useError({
    mutation: reOrderWorkspaceLanguages,
    entity: t('common.labels.language'),
  });
  useError({
    mutation: removeWorkspaceLanguage,
    entity: t('common.labels.language'),
    cb: () => setIsModalVisible(false),
  });

  useEffect(() => {
    setSelectedLanguages(listWorkspaceLanguages.data || []);
  }, [listWorkspaceLanguages.data]);

  const columns = [
    {
      title: t('common.labels.sort'),
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: t('common.labels.label'),
      dataIndex: ['display_name', 'locale'],
      className: 'drag-visible',
      render: (text: string, record: ILanguage) => (
        <div className="drag-details">
          <span>
            {record.name} ({record.locale})
          </span>

          {record.locale !== 'en-us' ? (
            permissions.canRemoveInternationalizationLanguage() && (
              <Button
                className="onlyIcon"
                type="link"
                onClick={() => {
                  setIsModalVisible(true);
                  setLanguageToDelete(record);
                }}
                icon={<DeleteIcon />}
              />
            )
          ) : (
            <></>
          )}
        </div>
      ),
    },
  ];

  const onSortEnd = async ({ oldIndex, newIndex }: IReorderDatatype) => {
    if (oldIndex !== newIndex) {
      const updatedLanguages = arrayMoveImmutable(
        ([] as ILanguage[]).concat(selectedLanguages),
        oldIndex,
        newIndex
      ).filter((el) => !!el);

      reOrderWorkspaceLanguages.mutate({
        workspaceId,
        languages: updatedLanguages.map((language, index) => ({
          workspaceLanguageId: language.id,
          position: index + 1,
        })),
      });
    }
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const DraggableContainer = (props: DraggableContainerProps) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  // eslint-disable-next-line react/no-unstable-nested-components
  const DraggableBodyRow = ({
    className,
    style,
    ...restProps
  }: DraggableBodyRowProps) => {
    // function findIndex base on grid rowKey props and should always be a right array index
    const index = selectedLanguages.findIndex(
      (x) => x.index === restProps['data-row-key']
    );
    return <SortableItem index={index} {...restProps} />;
  };

  const deleteLanguage = () => {
    const { id } = languageToDelete;

    removeWorkspaceLanguage.mutate({ languageId: id, workspaceId });
  };

  useEffect(() => {
    if (reOrderWorkspaceLanguages.isSuccess) {
      queryClient.refetchQueries([API_QUERY_KEY.WORKSPACE_LANGUAGES]);
    }
  }, [reOrderWorkspaceLanguages.isSuccess]);

  useEffect(() => {
    if (removeWorkspaceLanguage.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.deleted_successfully')
      );
      setIsModalVisible(false);
      listWorkspaceLanguages.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removeWorkspaceLanguage.isSuccess, t]);

  const hideModal = () => {
    setIsModalVisible(false);
    setLanguageToDelete({ id: '', locale: '', name: '' });
  };

  useEffect(() => {
    if (reOrderWorkspaceLanguages.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.reordered_successfully')
      );
    }
  }, [reOrderWorkspaceLanguages.isSuccess, t]);

  return {
    selectedLanguages,
    columns,
    DraggableContainer,
    DraggableBodyRow,
    isModalVisible,
    hideModal,
    deleteLanguage,
    t,
    canAddLanguage: permissions.canAddInternationalizationLanguage(),
    canUpdateLanguage: permissions.canUpdateInternationalizationLanguage(),
    removeWorkspaceLanguage,
    isFetching: listWorkspaceLanguages.isFetching,
    isLoading: listWorkspaceLanguages.isLoading,
    languageDeleteName: languageToDelete.name,
    languageDeleteLocale: languageToDelete.locale,
  };
};

export default useAddReOrderInternationalization;
