import { Form, Collapse, Input, Radio, Button, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import debounce from 'lodash.debounce';

import {
  useDetailsNavigation,
  useGetContentModelId,
  useListNavigationContent,
  useListNavigationCustomLinks,
  useListNavigationRecord,
  useUpdateNavigationItem,
} from '../services';
import EditIcon from '../../../../images/icons/edit-icon';
import {
  IContentFilterParams,
  IContentModelRecords,
  IContentRecordParams,
  IMenuFormItems,
  INavigationContentModelAndRecordList,
  INavigationItemsNestable,
  INavigationParams,
  INavigationTree,
  INavigationTreeItem,
  INestedMenuFormItems,
  IWorkspaceParams,
} from '../../../../types';
import useWorkspaceRoute from '../../../../hooks/workspace-route';
import useError from '../../../../hooks/error';
import DragIcon from '../../../../images/icons/drag-icon';
import { openNotificationWithIcon, SIDEBAR_KEYS } from '../../../../utills';
import useDeleteAllCache from '../services/delete-all-cache/delete-all-cache';
import usePermissions from '../../../../hooks/permissions/permissions';
import CrosscloseIcon from '../../../../images/icons/crossicon';

interface IUseUpdateNavigationController {
  onMainSidebarActiveItem?: (val: string) => void;
}

interface RecordsCount {
  [key: string]: number;
}

interface IChangedFields {
  name: string[];
  value: boolean;
}

const useUpdateNavigationController = ({
  onMainSidebarActiveItem,
}: IUseUpdateNavigationController) => {
  const { t } = useTranslation();

  const [sidebarMenuForm] = Form.useForm();

  const [nestedMenuForm] = Form.useForm();

  const { push } = useWorkspaceRoute();

  const { workspaceId } = useParams<IWorkspaceParams>();

  const { menuId } = useParams<INavigationParams>();

  const { canDeleteCache } = usePermissions();

  const [addedContentRecords, setAddedContentRecords] = useState<
    IContentModelRecords[]
  >([]);

  const [navigationName, setNavigationName] = useState<string>();

  const [allContentRecords, setAllContentRecords] = useState<
    IContentModelRecords[]
  >([]);

  const [allContentModelAndRecords, setAllContentModelAndRecords] = useState<
    INavigationContentModelAndRecordList[]
  >([]);

  const [
    allContentModelAndFilteredRecords,
    setAllContentModelAndFilteredRecords,
  ] = useState<INavigationContentModelAndRecordList[]>([]);

  const [contentRecordParams, setContentRecordParams] = useState<
    IContentFilterParams[]
  >([]);

  const [contentModelId, setContentModelId] = useState<string>();

  const [workspaceContentModelId, setWorkspaceContentModelId] =
    useState<string>();

  const [versionId, setVerisonId] = useState<string>();

  const [pushedMenuItems, setPushedMenuItems] = useState<INavigationTreeItem[]>(
    []
  );

  const [changedFields, setChangedFields] = useState<string[]>([]);

  const [activePanelKey, setActivePanelKey] = useState<string | string[]>();

  const [recordId, setRecordId] = useState<string>('');

  const [contentId, setContentId] = useState<string>('');

  const [unsavedMenuFlag, setUnsavedMenuFlag] = useState<boolean>(false);

  const [saveModalVisible, setSaveModalVisible] = useState<boolean>(false);

  const [activePanelKeyLength, setActivePanelKeyLength] = useState<number>(0);

  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState<boolean>(true);

  const [isSaveButtonDisable, setIsSaveButtonDisable] = useState<boolean>(true);

  const [isPushedMenuStateSet, setIsPushedMenuStateSet] =
    useState<boolean>(false);

  const [purgeCacheModalVisible, setPurgeCacheModalVisible] =
    useState<boolean>(false);

  const contentModel = useGetContentModelId(workspaceId);

  const collectionTypes = useListNavigationContent(
    'collection',
    workspaceId,
    true
  );

  const customLink = useListNavigationCustomLinks(workspaceId);

  const contentFields = useListNavigationRecord(
    workspaceId,
    contentModelId,
    contentRecordParams
  );

  const getMenuDetails = useDetailsNavigation(
    workspaceId,
    menuId,
    workspaceContentModelId
  );

  const updateNavigationItem = useUpdateNavigationItem(
    workspaceId,
    menuId,
    versionId,
    workspaceContentModelId
  );

  const deleteAllCache = useDeleteAllCache(workspaceId);

  let deletedChilds: string[] = [];

  let addedRecordsOnEditNavigation: IContentModelRecords[] = [];

  const changeTree = (e: INavigationTree) => {
    setUnsavedMenuFlag(true);
    setPushedMenuItems(e.items);
    setIsSaveButtonDisable(false);
  };

  const expandPanel = (key: string | string[]) => {
    setActivePanelKey(key);
  };

  useError({
    mutation: updateNavigationItem,
    entity: t('common.labels.navigation'),
  });

  const clearCache = () => {
    deleteAllCache.mutate();
    setPurgeCacheModalVisible(false);
  };

  const onClosePurgeModal = () => {
    setPurgeCacheModalVisible(false);
  };

  const onFormFieldChange = (changedValues: IChangedFields[]) => {

    if (!changedValues[0].name.some((field) => field === 'searchText')) {
      if (changedValues[0].value) {
        if (
          !changedFields?.some((field) => field === changedValues[0].name[0])
        ) {
          setChangedFields((previous) => [
            ...previous,
            changedValues[0].name[0],
          ]);
        }
      }
    }

    setIsAddButtonDisabled(false);
  };

  // To set contend model id to get record of thet content model
  const collapseChange = async (data: string | string[]) => {
    if (activePanelKeyLength < data.length) {
      setContentModelId(data[data.length - 1]);
    }
    setActivePanelKeyLength(data.length);
  };

  // To set content model record search text
  const onFilterTextChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>, id?: string) => {
      setContentModelId(id);

      if (
        contentRecordParams.some(
          (ele) => ele.contentModelId === id?.split('/')[0]
        )
      ) {
        const filters = [...contentRecordParams];
        filters.forEach((ele) => {
          if (ele.contentModelId === id?.split('/')[0]) {
            const params = {} as IContentRecordParams;
            if (event?.target.value.trim()) {
              params.search = event.target.value.trim();
            }

            if (params.limit) {
              // @ts-ignore
              params.skip = ele.params.limit;
            } else {
              params.skip = ele.params.skip;
            }

            ele.params = params;
            delete ele.params.limit;
          }
        });
        setContentRecordParams(filters);
      }
    },
    500
  );

  const addRecordCount = (contentModelId: string) => {
    const allRecords = [...contentRecordParams];

    allRecords.forEach((records) => {
      if (records.contentModelId === contentModelId) {
        if (records.params.limit) {
          records.params.skip = records.params.limit;
        } else {
          records.params.skip = records.params.skip + 5;
        }
        delete records.params.limit;
      }
    });

    setContentRecordParams(allRecords);
  };

  // To add menu item from sidebar to nested menu
  const onAddMenuItems = (values: IMenuFormItems) => {
    setUnsavedMenuFlag(true);

    const addedRecords = [...addedContentRecords];

    let menuItemsCount = 0;

    allContentRecords.forEach((record) => {
      if (values[record.id]) {
        menuItemsCount = menuItemsCount + 1;
        sidebarMenuForm.setFieldsValue({
          [record.id]: false,
        });
        if (!addedContentRecords.some((model) => model.id === record.id)) {
          addedRecords.push(record);
        }
        setPushedMenuItems((previous) => [...previous, record]);
        setIsSaveButtonDisable(false);
      }

      if (changedFields.some((fieldId) => fieldId === record.id)) {
        sidebarMenuForm.setFieldsValue({
          [record.id]: false,
        });
      }
    });

    setChangedFields([]);

    if (menuItemsCount === 1) {
      openNotificationWithIcon(
        'success',
        t('common.messages.menu_item_added_successfully')
      );
    }
    if (menuItemsCount > 1) {
      openNotificationWithIcon(
        'success',
        t('common.messages.menu_items_added_successfully')
      );
    }

    setAddedContentRecords(addedRecords);
  };

  const updateMenu = () => {
    // removeDisplayExtended();
    updateNavigationItem.mutate(pushedMenuItems);
  };

  const onSaveNavigation = () => {
    updateMenu();
    openNotificationWithIcon(
      'success',
      t('common.messages.navigation_updated_successfully')
    );
    push('/navigation');
  };

  const onCloseModal = () => {
    setSaveModalVisible(false);
    // push('/navigation')
  };

  const discardChanges = () => {
    push('/navigation');
  };

  const cancelUpdate = () => {
    if (unsavedMenuFlag) {
      setSaveModalVisible(true);
    } else {
      push('/navigation');
    }
  };

  // To update menu items
  const updateMenuItems = (values: INestedMenuFormItems) => {
    const menuItems = [...pushedMenuItems];
    menuItems.forEach(function iter(menu) {
      if (contentId && recordId) {
        if (contentId === menu.contentModelId && recordId === menu.id) {
          if (menu.type && menu.type === 'link') {
            menu.name = values[contentId][recordId].name;
            menu.link = values[contentId][recordId].link;
            menu.linkTarget = values[contentId][recordId].linkTarget;
            menu.className = values[contentId][recordId].className;
            // delete menu.navigationTitle;
            // menu.displayExtended = values[contentId][recordId].displayExtended;
          } else {
            menu.className = values[contentId][recordId].className;
            // menu.displayExtended = values[contentId][recordId].displayExtended;
            menu.linkTarget = values[contentId][recordId].linkTarget;
            menu.pageSlug = values[contentId][recordId].pageSlug;
            menu.title = values[contentId][recordId].title;
            menu.navigationLabel = values[contentId][recordId].navigationLabel;
          }
        }
      }
      Array.isArray(menu.children) &&
        menu.children.length > 0 &&
        menu.children.forEach(iter);
    });
    setPushedMenuItems(menuItems);
    openNotificationWithIcon(
      'success',
      t('common.messages.item_updated_successfully')
    );
  };

  // To remove menu item recursively
  const recursiveRemove = (list?: INavigationTreeItem[], id?: string) => {
    return list
      ?.map((item) => {
        return { ...item };
      })
      .filter((item) => {
        if ('children' in item) {
          item.children = recursiveRemove(item.children, id);
        }
        return item.id !== id;
      });
  };

  const getNestedAddedRecords = (records: INavigationTreeItem[]) => {
    records.forEach((record) => {
      // @ts-ignore
      addedRecordsOnEditNavigation.push(record);

      if (record.children && record.children.length > 0) {
        getNestedAddedRecords(record.children);
      }
    });

    return addedRecordsOnEditNavigation;
  };

  const getNestedDeletedChildren = (records: INavigationTreeItem[]) => {
    records.forEach((record) => {
      // @ts-ignore
      deletedChilds.push(record.id);

      if (record.children && record.children.length > 0) {
        getNestedDeletedChildren(record.children);
      }
    });

    return deletedChilds;
  };

  // To deleted record from nested menu
  const deleteRecord = (recordId: string, contentModelId: string) => {
    const records = [...pushedMenuItems];

    const addedRecords = [...addedContentRecords];

    const newRecords = recursiveRemove(
      records,
      recordId
    ) as INavigationTreeItem[];

    records.forEach((ele) => {
      if (ele.id === recordId) {
        // @ts-ignore
        deletedChilds.push(ele.id);

        if (ele.children && ele.children.length > 0) {
          getNestedDeletedChildren(ele.children);
        }
      }
    });

    deletedChilds.forEach((record) => {
      addedRecords.splice(
        addedRecords.findIndex((ele) => ele.id === record),
        1
      );
    });

    setAddedContentRecords(addedRecords);
    setPushedMenuItems(newRecords);
    setActivePanelKey([]);
    deletedChilds = [];
  };

  const noRecordsFoundChecker = (
    arr: IContentModelRecords[],
    target: IContentModelRecords[]
  ) =>
    arr?.length > 0 &&
    target?.length > 0 &&
    arr.every((v) => target.some((ele) => ele.id === v.id));

  // To render nested menu
  const renderItem = (items: INavigationItemsNestable) => {
    const { item } = items;

    if (item.type && item.type === 'link') {
      return (
        <div>
          <Collapse accordion onChange={expandPanel} activeKey={activePanelKey}>
            <Collapse.Panel
              showArrow={false}
              key={item.id}
              header={
                <>
                  <div className="ant-row ant-space-align-center nav-text">
                    <div className="m-r-16 ant-row">
                      <DragIcon />
                    </div>
                    <div className="text-truncate">
                      {item.recordTitle || item.navigationTitle}
                    </div>
                  </div>
                  <div className="nav-button-right-section">
                    <Tag className="text-truncate">
                      {item.contentModelName ||
                        (allContentModelAndRecords.filter(
                          (model) => model.id === item.contentModelId
                        ).length > 0 &&
                          allContentModelAndRecords.filter(
                            (model) => model.id === item.contentModelId
                          )[0].name)}
                    </Tag>
                    <Button className="OnlyIcon ant-btn-icon-only" type="link">
                      <span>
                        <EditIcon />
                      </span>
                      <CrosscloseIcon />
                    </Button>
                  </div>
                </>
              }>
              <Form.Item
                label={t('common.labels.name')}
                name={[item.contentModelId, item.id, 'name']}
                initialValue={item.nameEsi}>
                <Input disabled />
              </Form.Item>
              <Form.Item
                label={t('common.labels.url')}
                name={[item.contentModelId, item.id, 'link']}
                initialValue={item.linkEs}>
                <Input disabled />
              </Form.Item>
              <Form.Item
                label={t('common.labels.class_name')}
                name={[item.contentModelId, item.id, 'className']}
                initialValue={item.className}>
                <Input
                  placeholder={t('common.labels.placeholder_enter_class_name')}
                />
              </Form.Item>
              <Form.Item
                className="m-0"
                label={t('common.labels.link_target')}
                name={[item.contentModelId, item.id, 'linkTarget']}
                initialValue={item.linkTarget || 'Current Tab'}>
                <Radio.Group>
                  <Radio value="Current Tab">
                    {t('common.labels.current_tab')}
                  </Radio>
                  <Radio value="New Tab">{t('common.labels.new_tab')}</Radio>
                </Radio.Group>
              </Form.Item>
              <div className="ant-row ant-row-space-between nav-footer">
                <div className="custom-delete-button">
                  <Button
                    className="text-red"
                    type="link"
                    danger
                    onClick={() => {
                      deleteRecord(item.id, item.contentModelId);
                      setUnsavedMenuFlag(true);
                      setIsSaveButtonDisable(false);
                    }}>
                    {t('common.labels.delete')}
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      setActivePanelKey([]);
                      nestedMenuForm.resetFields();
                    }}>
                    {t('common.labels.cancel')}
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => {
                      setActivePanelKey([]);
                      setContentId(item.contentModelId);
                      setRecordId(item.id);
                      setUnsavedMenuFlag(true);
                      setIsSaveButtonDisable(false);
                    }}>
                    {t('common.labels.update')}
                  </Button>
                </div>
              </div>
            </Collapse.Panel>
          </Collapse>
        </div>
      );
    } else {
      return (
        <div>
          <Collapse accordion onChange={expandPanel} activeKey={activePanelKey}>
            <Collapse.Panel
              showArrow={false}
              key={item.id}
              header={
                <>
                  <div className="ant-row ant-space-align-center nav-text">
                    <div className="m-r-16 ant-row">
                      <DragIcon />
                    </div>
                    <div className="text-truncate">
                      {item.recordTitle || item.navigationTitle}
                    </div>
                  </div>
                  <div className="nav-button-right-section">
                    <Tag className="text-truncate">
                      {item.contentModelName ||
                        (allContentModelAndRecords.filter(
                          (model) => model.id === item.contentModelId
                        ).length > 0 &&
                          allContentModelAndRecords.filter(
                            (model) => model.id === item.contentModelId
                          )[0].name)}
                    </Tag>
                    <Button className="OnlyIcon ant-btn-icon-only" type="link">
                      <span>
                        <EditIcon />
                      </span>
                      <CrosscloseIcon />
                    </Button>
                  </div>
                </>
              }>
              {/* <Form.Item
                label={t('common.labels.name')}
                name={[item.contentModelId, item.id, 'name']}
                initialValue={item.nameEsi}>
                <Input disabled />
              </Form.Item> */}
              <Form.Item
                label={t('common.labels.url')}
                name={[item.contentModelId, item.id, 'pageSlug']}
                initialValue={item.pageSlug}>
                <Input disabled />
              </Form.Item>
              <Form.Item
                label={t('common.labels.display_label')}
                name={[item.contentModelId, item.id, 'navigationLabel']}
                initialValue={item.navigationLabel}>
                <Input
                  placeholder={t('common.labels.placeholder_enter_text')}
                />
              </Form.Item>
              <Form.Item
                label={t('common.labels.title_attribute')}
                name={[item.contentModelId, item.id, 'title']}
                initialValue={item.title}>
                <Input
                  placeholder={t('common.labels.placeholder_enter_attribute')}
                />
              </Form.Item>
              <Form.Item
                label={t('common.labels.class_name')}
                name={[item.contentModelId, item.id, 'className']}
                initialValue={item.className}>
                <Input
                  placeholder={t('common.labels.placeholder_enter_class_name')}
                />
              </Form.Item>
              <Form.Item
                className="m-0"
                label={t('common.labels.link_target')}
                name={[item.contentModelId, item.id, 'linkTarget']}
                initialValue={item.linkTarget || 'Current Tab'}>
                <Radio.Group>
                  <Radio value="Current Tab">
                    {t('common.labels.current_tab')}
                  </Radio>
                  <Radio value="New Tab">{t('common.labels.new_tab')}</Radio>
                </Radio.Group>
              </Form.Item>
              <div className="ant-row ant-row-space-between nav-footer">
                <div className="custom-delete-button">
                  <Button
                    className="text-red"
                    type="link"
                    danger
                    onClick={() => {
                      deleteRecord(item.id, item.contentModelId);
                      setUnsavedMenuFlag(true);
                      setIsSaveButtonDisable(false);
                    }}>
                    {t('common.labels.delete')}
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      setActivePanelKey([]);
                      nestedMenuForm.resetFields();
                    }}>
                    {t('common.labels.cancel')}
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => {
                      setActivePanelKey([]);
                      setContentId(item.contentModelId);
                      setRecordId(item.id);
                      setUnsavedMenuFlag(true);
                      setIsSaveButtonDisable(false);
                    }}>
                    {t('common.labels.update')}
                  </Button>
                </div>
              </div>
            </Collapse.Panel>
          </Collapse>
        </div>
      );
    }
  };

  useEffect(() => {
    if (contentFields.isSuccess) {
      let allModelAndRecords;
      if (
        sidebarMenuForm
          // @ts-ignore
          .getFieldValue(contentModelId?.split('/')[0])
          ?.searchText?.trim()
      ) {
        allModelAndRecords = [...allContentModelAndFilteredRecords];

        allModelAndRecords.forEach((model) => {
          if (contentModelId?.split('/')[0] === model.id) {
            model.records = [];

            contentFields.data?.items.forEach((record) => {
              model.records.push(record);
            });
          }
        });
        setAllContentModelAndFilteredRecords(allModelAndRecords);
      } else {
        allModelAndRecords = [...allContentModelAndRecords];

        allModelAndRecords.forEach((model) => {
          if (contentModelId?.split('/')[0] === model.id) {
            if (!model.records) {
              // @ts-ignore
              model.records = [];
              contentFields.data?.items.forEach((record) => {
                model.records.push({
                  ...record,
                  navigationTitle: record.title,
                  linkTarget: 'Current Tab',
                });
              });
              model.totalRecord = contentFields.data?.totalRecord;
            } else {
              contentFields.data?.items.forEach((record) => {
                if (!model.records.some((ele) => ele.id === record.id)) {
                  model.records.push({
                    ...record,
                    navigationTitle: record.title,
                    linkTarget: 'Current Tab',
                  });
                }
              });
            }
          }
        });
        setAllContentModelAndRecords(allModelAndRecords);
      }

      const allRecords = [...allContentRecords];

      contentFields.data?.items.forEach((record) => {
        if (!allContentRecords.some((content) => content.id === record.id)) {
          allRecords.push({
            ...record,
            navigationTitle: record.title,
            linkTarget: 'Current Tab',
          });
        }
      });

      setAllContentRecords(allRecords);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentFields.isSuccess]);

  useEffect(() => {
    if (contentModel.isSuccess) {
      setWorkspaceContentModelId(contentModel.data?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentModel.isSuccess]);

  useEffect(() => {
    if (updateNavigationItem.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.navigation_updated_successfully')
      );
      setUnsavedMenuFlag(false);
    }
  }, [updateNavigationItem.isSuccess, t]);

  useEffect(() => {
    if (deleteAllCache.isSuccess) {
      setPurgeCacheModalVisible(false);
      openNotificationWithIcon(
        'success',
        t('common.messages.all_cache_remove_successfully')
      );
    }
  }, [deleteAllCache.isSuccess, t]);

  useEffect(() => {
    if (getMenuDetails.isSuccess) {
      setVerisonId(getMenuDetails.data?.id);
      setNavigationName(getMenuDetails.data?.contentModelTitle);
      // @ts-ignore
      if (getMenuDetails.data?.contentEj?.length > 0) {
        // @ts-ignore
        setPushedMenuItems(getMenuDetails.data?.contentEj);

        const addedRecords = getNestedAddedRecords(
          // @ts-ignore
          getMenuDetails.data?.contentEj
        );

        setAddedContentRecords(addedRecords);

        // eslint-disable-next-line react-hooks/exhaustive-deps
        addedRecordsOnEditNavigation = [];
      }

      if (collectionTypes.isSuccess && customLink.isSuccess) {
        const recordsCount: RecordsCount = {};

        // @ts-ignore
        if (getMenuDetails.data?.contentEj?.length > 0) {
          collectionTypes.data?.forEach((contentModel) => {
            recordsCount[contentModel.id] = 0;
          });

          recordsCount[customLink.data.id] = 0;

          const addedRecords = getNestedAddedRecords(
            // @ts-ignore
            getMenuDetails.data?.contentEj
          );

          collectionTypes.data?.forEach((contentModel) => {
            addedRecords.forEach((record) => {
              if (contentModel.id === record.contentModelId) {
                recordsCount[contentModel.id] += 1;
              }
            });
          });
          addedRecords.forEach((record) => {
            if (record.contentModelId === customLink.data.id) {
              recordsCount[customLink.data.id] += 1;
            }
          });
        }

        collectionTypes.data?.forEach((model) => {
          if (!allContentModelAndRecords.some((ele) => ele.id === model.id)) {
            // @ts-ignore
            setAllContentModelAndRecords((previous) => [
              ...previous,
              {
                ...model,
              },
            ]);
            setContentRecordParams((previous) => [
              ...previous,
              {
                contentModelId: model.id,
                params: {
                  skip: 0,
                  limit: recordsCount[model.id] + 5,
                },
              },
            ]);
          }
        });

        if (
          !allContentModelAndRecords.some(
            (model) => model.id === customLink.data.id
          )
        ) {
          // @ts-ignore
          setAllContentModelAndRecords((previous) => [
            ...previous,
            {
              ...customLink.data,
            },
          ]);
          setContentRecordParams((previous) => [
            ...previous,
            {
              contentModelId: customLink.data.id,
              params: {
                skip: 0,
                limit: recordsCount[customLink.data.id] + 5,
              },
            },
          ]);
        }

        collectionTypes.data?.forEach((model) => {
          if (
            !allContentModelAndFilteredRecords.some(
              (ele) => ele.id === model.id
            )
          ) {
            // @ts-ignore
            setAllContentModelAndFilteredRecords((previous) => [
              ...previous,
              {
                ...model,
              },
            ]);
          }
        });

        if (
          !allContentModelAndFilteredRecords.some(
            (model) => model.id === customLink.data.id
          )
        ) {
          // @ts-ignore
          setAllContentModelAndFilteredRecords((previous) => [
            ...previous,
            {
              ...customLink.data,
            },
          ]);
        }
        setIsPushedMenuStateSet(true);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    collectionTypes.isSuccess,
    customLink.isSuccess,
    getMenuDetails.isSuccess,
  ]);

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.SETTINGS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    t,
    sidebarMenuForm,
    collectionTypes,
    collapseChange,
    pushedMenuItems,
    changeTree,
    nestedMenuForm,
    updateMenu,
    renderItem,
    onAddMenuItems,
    updateMenuItems,
    navigationName,
    onFilterTextChange,
    addRecordCount,
    customLink,
    workspaceId,
    cancelUpdate,
    onSaveNavigation,
    onCloseModal,
    saveModalVisible,
    discardChanges,
    getMenuDetails,
    updateNavigationItem,
    onFormFieldChange,
    isAddButtonDisabled,
    clearCache,
    purgeCacheModalVisible,
    onClosePurgeModal,
    setPurgeCacheModalVisible,
    canDeleteCache,
    allContentModelAndRecords,
    allContentModelAndFilteredRecords,
    addedContentRecords,
    noRecordsFoundChecker,
    isSaveButtonDisable,
    isPushedMenuStateSet,
    contentModel,
  };
};

export default useUpdateNavigationController;
