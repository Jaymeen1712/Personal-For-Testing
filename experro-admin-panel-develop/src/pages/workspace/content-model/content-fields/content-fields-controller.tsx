import { useLocation, useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Dropdown,
  Menu,
  Table,
  Tooltip,
  TablePaginationConfig,
  Form,
} from 'antd';
import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';

import RightIcon from '../../../../images/icons/right-icon';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import useEnums from '../enums';
import { RowRecord } from '../../../../types';
import {
  useDeleteField,
  useListField,
  useReorderField,
} from '../services/models';
import {
  useDeleteComponentField,
  useListComponentFields,
  useReorderComponentField,
} from '../services/components';
import useError from '../../../../hooks/error';
import queryClient from '../../../../query-client';
import {
  API_QUERY_KEY,
  camelToSnackCase,
  openNotificationWithIcon,
  // sortableHeader,
} from '../../../../utills';
import useQuery from '../../../../hooks/queryParameter';
// import EditIcon from '../../../../images/icons/edit-icon';
// import DeleteIcon from '../../../../images/icons/delete-icon';
import DragIcon from '../../../../images/icons/drag-icon';

import usePermissions from '../permission';
import EllipsisIcon from '../../../../images/icons/ellipsis-icon';
import debounce from 'lodash.debounce';

interface ContentField {
  index: number;
  id: string;
  type: string;
  title: string;
  fieldName: string;
  isRequired: boolean;
  validations: string;
  fields?: ContentField[];
}

const useContentFieldsController = ({
  isCreateFieldFormModalVisible,
  setIsCreateFieldFormModalVisible,
  onEditFieldStatusChange,
  onCreateField,
  addNewType,
  modelInternalName,
  sortable,
  changeTableSortOrderStatus,
}: {
  isCreateFieldFormModalVisible: boolean;
  setIsCreateFieldFormModalVisible: (
    isCreateFieldFormModalVisible: boolean
  ) => void;
  onEditFieldStatusChange: (id: string, status: boolean) => void;
  onCreateField: (id: string) => void;
  addNewType: string;
  modelInternalName: string;
  sortable: boolean;
  changeTableSortOrderStatus: (val: boolean) => void;
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const query = useQuery();
  const enums = useEnums();
  const { workspaceId, contentModelId } = useParams<{
    workspaceId: string;
    contentModelId: string;
  }>();
  const {
    canUpdateContentModelField,
    canDeleteContentModelField,
    canUpdateComponent,
    canDeleteComponent,
  } = usePermissions(modelInternalName);

  const [form] = Form.useForm();

  const queryContentId: string | null = query.get('content');
  const [isDeleteField, setIsDeleteField] = useState(false);
  const [selectedDeleteFieldId, setSelectedDeleteFieldId] = useState('');
  const [filterFlag, setFilterFlag] = useState(false);
  const [dataSource, setDataSource] = useState<ContentField[]>([
    {
      fieldName: '',
      id: '',
      index: 0,
      isRequired: false,
      title: '',
      type: '',
      validations: '',
    },
  ]);
  const [componentDataSource, setComponentDataSource] = useState<
    ContentField[]
  >([
    {
      fieldName: '',
      id: '',
      index: 0,
      isRequired: false,
      title: '',
      type: '',
      validations: '',
    },
  ]);
  const [filter, setFilter] = useState('');
  const [type, setType] = useState('model');
  const [columnSortOrder, setColumnSortOrder] = useState({
    sortBy: '',
    orderBy: '',
  });
  const [envId, setEnvId] = useState(
    localStorage.getItem(`${workspaceId}/environmentId`)
  );

  const contentFields = useListField(
    workspaceId,
    type,
    addNewType,
    columnSortOrder,
    contentModelId,
    filter
  );
  const componentFields = useListComponentFields(
    workspaceId,
    type,
    addNewType,
    columnSortOrder,
    contentModelId,
    filter
  );
  const deleteField = useDeleteField(workspaceId, contentModelId);
  const deleteComponentField = useDeleteComponentField(
    workspaceId,
    contentModelId
  );
  const reorderField = useReorderField(workspaceId, contentModelId);
  const reorderComponentField = useReorderComponentField(
    workspaceId,
    contentModelId
  );

  const onInputChange = debounce((val) => {
    setFilter(val.target.value.trim());
    if (type === 'component') {
      componentFields.remove();
    } else {
      contentFields.remove();
    }
  }, 500);

  useEffect(() => {
    if (filter.length) {
      setFilterFlag(true);
    }
    // eslint-disable-next-line
  }, [filter]);

  useEffect(() => {
    form.resetFields();
    setFilterFlag(false);
    setFilter('');
    setColumnSortOrder({
      sortBy: '',
      orderBy: '',
    });
    setDataSource([
      {
        fieldName: '',
        id: '',
        index: 0,
        isRequired: false,
        title: '',
        type: '',
        validations: '',
      },
    ]);
    setComponentDataSource([
      {
        fieldName: '',
        id: '',
        index: 0,
        isRequired: false,
        title: '',
        type: '',
        validations: '',
      },
    ]);
    // if (type === 'component') {
    componentFields.remove();
    // } else {
    contentFields.remove();
    // }
    // eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    setFilter('');
    form.resetFields();
    if (type === 'component') {
      componentFields.remove();
    } else {
      contentFields.remove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreateFieldFormModalVisible]);

  const sortOptions = useMemo(
    () => ({
      canSort: (record: RowRecord) => !record.isComponentField,
    }),
    []
  );

  const SortableItem = SortableElement(
    (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />
  );
  const SortableBody = SortableContainer(
    (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <tbody {...props} />
    )
  );

  const DragHandle = SortableHandle(() => <DragIcon />);

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    if (type === 'component') {
      if (oldIndex !== newIndex) {
        const newData = arrayMoveImmutable(
          componentDataSource.slice(),
          oldIndex,
          newIndex
        ).filter((el: ContentField) => !!el);
        setComponentDataSource(newData);
      }
    } else {
      if (oldIndex !== newIndex) {
        const newData = arrayMoveImmutable(
          dataSource.slice(),
          oldIndex,
          newIndex
        ).filter((el: ContentField) => !!el);
        setDataSource(newData);
      }
    }
  };

  const DraggableContainer = (props: SortableContainerProps) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = ({
    //@ts-ignore
    className,
    //@ts-ignore
    style,
    ...restProps
  }) => {
    if (type === 'component') {
      const index = componentDataSource.findIndex(
        (x) => x.index === restProps['data-row-key']
      );
      return <SortableItem index={index} {...restProps} />;
    } else {
      const index = dataSource.findIndex(
        (x) => x.index === restProps['data-row-key']
      );
      return <SortableItem index={index} {...restProps} />;
    }
  };

  const expandedRowRender = (record: object) =>
    (record as ContentField).fields ? (
      <Table
        showHeader={false}
        className="content-fields-child"
        //@ts-ignore
        columns={columns}
        //@ts-ignore
        dataSource={(record as ContentField).fields}
        pagination={false}
      />
    ) : undefined;

  const nameOptions = useMemo(
    () => ({
      getText: (record: RowRecord): string => record.title,
      getIcon: (record: RowRecord): JSX.Element | undefined =>
        enums.CONTENT_FIELD_TYPES.find((field) => field.key === record.type)
          ?.icon,
      getClassName: () => 'ant-row ant-space-align-center',
    }),
    [enums]
  );

  const requiredOptions = useMemo(
    () => ({
      getIcon: (record: RowRecord): JSX.Element | undefined | string => {
        if (record.isRequired) {
          return record.isRequired ? <RightIcon /> : undefined;
        }
        return '_';
      },
    }),
    []
  );

  const onDeleteRecord = useCallback(
    (record: RowRecord) => {
      setIsDeleteField(true);
      setSelectedDeleteFieldId(record.id);
    },
    [setIsDeleteField, setSelectedDeleteFieldId]
  );

  const onDeleteField = useCallback(() => {
    if (type === 'component') {
      deleteComponentField.mutate(selectedDeleteFieldId);
    } else {
      deleteField.mutate(selectedDeleteFieldId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, selectedDeleteFieldId]);

  const onHideDeleteField = useCallback(() => {
    setIsDeleteField(false);
  }, [setIsDeleteField]);

  const onEditRecord = useCallback((record: RowRecord) => {
    onCreateField(record.type);
    onEditFieldStatusChange(record.id, true);
    setIsCreateFieldFormModalVisible(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actionOptions = useMemo(
    () => ({
      onEdit: onEditRecord,
      onDelete: onDeleteRecord,
      getClassName: (record: RowRecord) => {
        return record.isComponentField ? 'display-none' : '';
      },
      isEditable: (record: RowRecord) => {
        return record.isEditable;
      },
      isRemovable: (record: RowRecord) => {
        return record.isRemovable;
      },
      className: 'onlyIcon',
    }),
    [onEditRecord, onDeleteRecord]
  );

  const columns = useMemo(() => {
    const columns = [
      {
        // title: sortableHeader(
        //   t('common.labels.name'),
        //   'title',
        //   columnSortOrder
        // ),
        title: t('common.labels.name'),
        dataIndex: 'title',
        key: 'title',
        width: '50%',
        // sorter: true,
        render: (text: string, record: RowRecord) => {
          return (
            <div className="ant-row ant-space-align-center">
              <div className="m-r-8 ant-row icon-24">
                {nameOptions.getIcon(record)}
              </div>
              <span className="text-truncate with-pixel-large"> {text}</span>
              {actionOptions.isEditable(record as RowRecord) &&
                actionOptions.isRemovable(record as RowRecord) &&
                !record.contentModelComponentId && (
                  <Dropdown
                    placement="bottomRight"
                    trigger={['click']}
                    overlay={
                      <div className="table-dropdown">
                        <Menu>
                          <Menu.Item>
                            {actionOptions.isEditable(record as RowRecord) && (
                              <Tooltip
                                title={
                                  addNewType === 'component'
                                    ? !canUpdateComponent() &&
                                      t(
                                        'common.messages.error_model_field_update'
                                      )
                                    : !canUpdateContentModelField(
                                        modelInternalName
                                      ) &&
                                      t(
                                        'common.messages.error_model_field_update'
                                      )
                                }>
                                <Button
                                  disabled={
                                    addNewType === 'component'
                                      ? !canUpdateComponent()
                                      : !canUpdateContentModelField(
                                          modelInternalName
                                        )
                                  }
                                  onClick={() =>
                                    actionOptions.onEdit(record as RowRecord)
                                  }>
                                  {' '}
                                  {t('common.labels.edit')}
                                </Button>
                              </Tooltip>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {actionOptions.isRemovable &&
                              actionOptions.isRemovable(
                                record as RowRecord
                              ) && (
                                <Tooltip
                                  title={
                                    addNewType === 'component'
                                      ? !canDeleteComponent() &&
                                        t(
                                          'common.messages.error_model_field_delete'
                                        )
                                      : !canDeleteContentModelField(
                                          modelInternalName
                                        ) &&
                                        t(
                                          'common.messages.error_model_field_delete'
                                        )
                                  }>
                                  <Button
                                    disabled={
                                      addNewType === 'component'
                                        ? !canDeleteComponent()
                                        : !canDeleteContentModelField(
                                            modelInternalName
                                          )
                                    }
                                    danger
                                    onClick={() =>
                                      actionOptions.onDelete(
                                        record as RowRecord
                                      )
                                    }>
                                    {' '}
                                    {t('common.labels.delete')}
                                  </Button>
                                </Tooltip>
                              )}
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
                )}
            </div>
          );
        },
      },
      {
        // title: sortableHeader(
        //   t('common.labels.api_name'),
        //   'fieldName',
        //   columnSortOrder
        // ),
        title: t('common.labels.api_name'),
        dataIndex: 'fieldName',
        key: 'fieldName',
        width: '25%',
        className: 'text-truncate with-pixel',
        // sorter: true,
      },
      {
        title: t('common.labels.type'),
        dataIndex: 'type',
        key: 'type',
        width: '12.5%',
      },
      {
        title: t('common.labels.required'),
        dataIndex: 'isRequired',
        key: 'isRequired',
        width: '8%',
        render: (text: string, record: RowRecord) =>
          record.isRequired ? <RightIcon /> : <p>-</p>,
      },
    ];

    if (sortable)
      return [
        {
          title: '',
          dataIndex: 'sort',
          width: '3%',
          className: 'drag-visible',
          render: () => (
            <span className="dragHandleIcon">
              <DragHandle />
            </span>
          ),
        },
        ...columns,
      ];

    return columns;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    actionOptions,
    nameOptions,
    requiredOptions,
    sortOptions,
    sortable,
    t,
    columnSortOrder,
  ]);

  const onSortingClick = () => {
    if (filter !== '') {
      setFilter('');
      form.resetFields();
      if (type === 'component') {
        componentFields.remove();
      } else {
        contentFields.remove();
      }
    }
    changeTableSortOrderStatus(true);
  };

  const onSortSave = () => {
    const tempArray: {
      id: string;
      position: number;
    }[] = [];

    if (type === 'component') {
      componentDataSource.map((item, index) =>
        tempArray.push({
          id: item.id,
          position: index,
        })
      );

      const result = {
        fields: tempArray,
      };
      reorderComponentField.mutate(result);
    } else {
      dataSource.map((item, index) =>
        tempArray.push({
          id: item.id,
          position: index,
        })
      );

      const result = {
        fields: tempArray,
      };
      reorderField.mutate(result);
    }
  };

  const onChangeTable = (
    pagination: TablePaginationConfig,
    //@ts-ignore
    filters,
    //@ts-ignore
    sorter
  ) => {
    if (!filterFlag) {
      setFilterFlag(true);
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
    if (type === 'component') {
      componentFields.remove();
    } else {
      contentFields.remove();
    }
  };

  useError({
    mutation: deleteField,
    entity: t('common.labels.content_field_deleted_successfully'),
    dependentEntities: t('common.labels.content-modal'),
    cb: onHideDeleteField,
  });

  useError({
    mutation: deleteComponentField,
    entity: t('common.labels.content_field'),
    dependentEntities: t('common.labels.content-modal'),
    cb: onHideDeleteField,
  });

  useEffect(() => {
    if (deleteField.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.content_field_deleted_successfully')
      );
      if (filter !== '') {
        setFilter('');
        form.resetFields();
      }
      queryClient.removeQueries([API_QUERY_KEY.CONTENT_FIELDS, contentModelId]);
      onHideDeleteField();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteField.isSuccess, t]);

  useEffect(() => {
    if (deleteComponentField.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.deleted_successfully')
      );
      if (filter !== '') {
        setFilter('');
        form.resetFields();
      }
      componentFields.remove();
      onHideDeleteField();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteComponentField.isSuccess, t]);

  useEffect(() => {
    if (contentFields.isSuccess) {
      if (contentFields.data) {
        //@ts-ignore
        setDataSource([...contentFields.data]);
      } else {
        setDataSource([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentFields.isSuccess, contentFields.data]);

  useEffect(() => {
    if (contentFields.isError) {
      setDataSource([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentFields.isError]);

  useEffect(() => {
    if (componentFields.isSuccess) {
      if (componentFields.data) {
        //@ts-ignore
        setComponentDataSource([...componentFields.data]);
      } else {
        setComponentDataSource([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentFields.isSuccess, componentFields.data]);

  useEffect(() => {
    if (componentFields.isError) {
      setComponentDataSource([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentFields.isError]);

  useEffect(() => {
    setFilter('');
    form.resetFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryContentId]);

  useEffect(() => {
    if (reorderField.isSuccess) {
      changeTableSortOrderStatus(false);
      openNotificationWithIcon(
        'success',
        t('common.messages.reorder_successfully')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reorderField.isSuccess, t]);

  useEffect(() => {
    if (reorderField.isError) {
      openNotificationWithIcon(
        'error',
        t('common.messages.error_in_reordering')
      );
    }
  }, [reorderField.isError, t]);

  useEffect(() => {
    if (reorderComponentField.isSuccess) {
      changeTableSortOrderStatus(false);
      openNotificationWithIcon(
        'success',
        t('common.messages.reorder_successfully')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reorderComponentField.isSuccess, t]);

  useEffect(() => {
    if (reorderComponentField.isError) {
      openNotificationWithIcon('error', 'Error in reordering');
    }
  }, [reorderComponentField.isError]);

  useEffect(() => {
    const envChange = () => {
      setEnvId(localStorage.getItem(`${workspaceId}/environmentId`));
    };
    document.addEventListener('environmentChange', envChange);

    return () => {
      document.removeEventListener('environmentChange', envChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilter('');
    form.resetFields();
    if (type === 'component') {
      componentFields.remove();
    } else {
      contentFields.remove();
    }
    // eslint-disable-next-line
  }, [envId]);

  useEffect(() => {
    const url = location.pathname.split('/');
    setType(url[4]);
    changeTableSortOrderStatus(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return {
    t,
    columns,
    filter,
    setFilter,
    contentFields,
    sortable,
    onSortingClick,
    isDeleteField,
    onDeleteField,
    onHideDeleteField,
    componentFields,
    filterFlag,
    deleteField,
    deleteComponentField,
    dataSource,
    DraggableContainer,
    DraggableBodyRow,
    onSortSave,
    componentDataSource,
    type,
    canUpdateContentModelField: canUpdateContentModelField(modelInternalName),
    canUpdateComponent: canUpdateComponent(),
    expandedRowRender,
    onChangeTable,
    onInputChange,
    form,
  };
};
export default useContentFieldsController;
