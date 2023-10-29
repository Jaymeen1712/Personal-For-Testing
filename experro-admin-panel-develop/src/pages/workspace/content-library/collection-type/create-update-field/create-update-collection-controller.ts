// @ts-nocheck
import { useContext, useEffect, useMemo, useState } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { customAlphabet } from 'nanoid';
import Cookies from 'js-cookie';

import { fieldMappingFunction, RelationFinalObject } from '../../utils';
import { IContentLibraryFieldPops, ILanguage } from '../../../../../types';
import { ContentLibraryContext } from '../../context';
import {
  useDeleteRecord,
  useFieldList,
  useGetRecordListById,
  useGetVersionList,
  useSaveAsNewVersion,
  useGetRelationRecordList,
  useUpdateCurrentVersion,
  useCreatUpdateNewRecord,
  useBigCommerceSync,
  useCreatUpdatePageEditor,
  useSaveAndPublish,
  useUnPublishVersion,
  useListWorkspaceLanguage,
} from '../../services';
import queryClient from '../../../../../query-client';
import {
  API_QUERY_KEY,
  onMainSidebarCollapsed,
  onSubSidebarCollapse,
  openNotificationWithIcon,
  removeCookies,
} from '../../../../../utills';
import useError from '../../../../../hooks/error';
import useQuery from '../../../../../hooks/queryParameter';
import useUser from '../../../../../hooks/user';
import useFinalObject from '../../utils/final-object';
import { useHandleForbiddenError } from '../../utils';

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const nanoid = customAlphabet(alphabet, 12);

const useCreateUpdateCollectionController = (selectedContentModalDetails) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const query = useQuery();

  const contentLibraryContext = useContext(ContentLibraryContext);
  const userDetails = useUser();
  const [form] = Form.useForm();
  const { finalObject } = useFinalObject();
  const {
    workspaceId,
    contentModalId,
    contentModalDataId,
    versionId,
    languageName,
  } = useParams<{
    workspaceId: string;
    contentModalId: string;
    contentModalDataId: string;
    versionId: string;
    languageName: string;
  }>();

  const { handleForbiddenError } = useHandleForbiddenError();

  const [workspaceLanguageList, setWorkspaceLanguageList] =
    useState<ILanguage[]>();
  const [versionList, setVersionList] = useState<
    {
      id: string;
      versionName: string;
      versionNo: number;
    }[]
  >([]);

  const [mappingObject, setMappingObject] = useState<
    IContentLibraryFieldPops[]
  >([]);

  const [isSpinnerActive, setSpinnerActive] = useState(true);

  const [relationFieldListData, setRelationFieldListData] = useState([]);

  const [relationFieldValues, setRelationFieldValues] = useState([]);

  const [warningPopupValues, setWarningPopupValues] = useState({
    version: '',
    language: '',
  });

  const [rightSideMenuClose, setRightSideMenuClose] = useState('');

  const [currentVersionStatus, setCurrentVersionStatus] = useState([]);

  const [collapseActiveKey, setCollapseActiveKey] = useState([]);

  const [environmentId, setEnvironmentId] = useState(
    localStorage.getItem(`${workspaceId}/environmentId`)
  );

  const [lastSyncAt, setLastSyncAt] = useState('');

  const [isEcommerceRedirectionTabVisible, setEcommerceRedirectionTabVisible] =
    useState(false);

  const [editRecordDetailsModalVisible, setEditRecordDetailsModalVisible] =
    useState(false);

  const [deleteRecordModalVisible, setDeleteRecordModalVisible] =
    useState(false);

  const [headerTitleAndSubtitle, setHeaderTitleAndSubtitle] = useState({
    title: '',
    subtitle: '',
  });

  const [isSaveAsNewVersionModalVisible, SetIsSaveAsNewVersionModalVisible] =
    useState(false);

  const [
    isScheduleVersionPublishModalVisible,
    setIsScheduleVersionPublishVisible,
  ] = useState(false);

  const [isContentLibraryPopupOpen, setIsContentLibraryPopupOpen] =
    useState(false);

  const [viewContentInModalData, setViewContentModalInModalData] = useState<{
    contentModalId: string;
    contentModalDataId: string;
    versionId: string;
    contentModalInternalName: string;
  }>({});

  const [isAddNewRecordInPopupOpen, setIsAddNewRecordInPopupOpen] =
    useState(false);

  const [
    contentModalDataForNewRecordPopup,
    setContentModalDataForNewRecordPopup,
  ] = useState<{
    contentModalId: string;
    contentModalInternalName: string;
  }>({});

  const [
    isSaveAsNewDraftVersionConformationModalVisible,
    setIsSaveAsNewDraftVersionConformationModalVisible,
  ] = useState(false);

  const fieldList = useFieldList('collection', workspaceId, contentModalId);

  const relationFieldList = useGetRelationRecordList(
    workspaceId,
    relationFieldListData
  );

  const getRecordBYId = useGetRecordListById(
    workspaceId,
    contentModalId,
    contentModalDataId,
    versionId,
    languageName,
    environmentId
  );

  const getVersionList = useGetVersionList(
    workspaceId,
    contentModalId,
    contentModalDataId,
    versionId
  );

  const updateCurrentVersion = useUpdateCurrentVersion(
    workspaceId,
    contentModalId,
    contentModalDataId
  );

  const getWorkspaceLanguageList = useListWorkspaceLanguage(workspaceId);

  const deleteRecord = useDeleteRecord(workspaceId, contentModalId);

  const saveAsNewVersion = useSaveAsNewVersion(workspaceId);

  const bigCommerceSync = useBigCommerceSync(workspaceId);

  const creatUpdatePageEditor = useCreatUpdatePageEditor(workspaceId);

  const creatUpdateNewRecord = useCreatUpdateNewRecord(workspaceId);

  const saveAndPublish = useSaveAndPublish(workspaceId);

  const unPublishVersion = useUnPublishVersion(workspaceId);

  const saveFormData = async () => {
    try {
      const result = await form.validateFields();
      //@ts-ignore
      const { contentFieldObject } = contentLibraryContext?.responseValueObject;
      const requestObject = {
        node_type: 'parent',
        contentModelDataId: contentModalDataId,
        contentModelFieldDataId: getRecordBYId?.data?.contentModelFieldData.id,
        contentModalId: contentModalId,
        versionId: versionId,
        template: contentLibraryContext?.newRecordFieldDetails?.template,
        language: languageName,
        dynamic_fields_data: finalObject(contentFieldObject, result),
        dynamic_relation_fields: RelationFinalObject(
          contentFieldObject,
          result
        ),
      };
      return requestObject;
    } catch (err) {
      if (
        contentLibraryContext?.warningPopupVisible.sidebar ||
        contentLibraryContext?.warningPopupVisible.goBack ||
        contentLibraryContext?.warningPopupVisible.version ||
        contentLibraryContext?.warningPopupVisible.relation ||
        contentLibraryContext?.warningPopupVisible.refresh
      ) {
        contentLibraryContext?.changeWarningPopupVisible({
          version: false,
          sidebar: false,
          relation: false,
          refresh: false,
          goBack: false,
        });
      }

      if (err instanceof SyntaxError) {
        openNotificationWithIcon(
          'error',
          t('common.messages.error_enter_valid_json')
        );
      } else {
        openNotificationWithIcon(
          'error',
          t('common.messages.provide_all_details')
        );
      }
      return false;
    }
  };

  const onLanguageChange = (value: string) => {
    openNotificationWithIcon(
      'success',
      t('common.messages.language_changed_successfully')
    );
    setWarningPopupValues({ version: '', language: value });
    if (!Object.values(contentLibraryContext?.isFieldDirty).includes(false)) {
      setSpinnerActive(true);
      history.replace({
        pathname: `/workspaces/${workspaceId}/content-library/collection-type/${contentModalId}/field/${contentModalDataId}/version/${versionId}/language/${value}`,
      });

      queryClient.removeQueries([
        API_QUERY_KEY.GET_RECORD_LIST,
        contentModalId,
        contentModalDataId,
        value,
        versionId,
      ]);
    } else {
      contentLibraryContext?.changeWarningPopupVisible({
        version: true,
        sidebar: false,
        relation: false,
        refresh: false,
        goBack: false,
      });
    }
  };

  const onVersionChange = (value: string) => {
    setWarningPopupValues({ version: value, language: '' });
    if (!Object.values(contentLibraryContext?.isFieldDirty).includes(false)) {
      setSpinnerActive(true);
      updateCurrentVersion.mutate(value);
    } else {
      contentLibraryContext?.changeWarningPopupVisible({
        version: true,
        sidebar: false,
        relation: false,
        refresh: false,
        goBack: false,
      });
    }
  };

  const onWorkingPopupDiscard = () => {
    if (contentLibraryContext?.warningPopupVisible?.version) {
      contentLibraryContext.ChangeIsFieldDirty({});
      contentLibraryContext?.changeWarningPopupVisible({
        version: false,
        sidebar: false,
        relation: false,
        refresh: false,
        goBack: false,
      });
      setSpinnerActive(true);
      if (warningPopupValues.version) {
        updateCurrentVersion.mutate(warningPopupValues.version);
      } else {
        history.replace({
          pathname: `/workspaces/${workspaceId}/content-library/collection-type/${contentModalId}/field/${contentModalDataId}/version/${versionId}/language/${warningPopupValues.language}`,
        });

        queryClient.removeQueries([
          API_QUERY_KEY.GET_RECORD_LIST,
          contentModalId,
          contentModalDataId,
          warningPopupValues.language,
          versionId,
        ]);
      }
    } else if (contentLibraryContext?.warningPopupVisible.relation) {
      contentLibraryContext.ChangeIsFieldDirty({});
      history.push(contentLibraryContext.relationUrl);
      contentLibraryContext?.changeWarningPopupVisible({
        version: false,
        sidebar: false,
        relation: false,
        refresh: false,
        goBack: false,
      });
      contentLibraryContext?.changeFieldComponentLoader(true);
    } else if (contentLibraryContext?.warningPopupVisible.goBack) {
      contentLibraryContext.ChangeIsFieldDirty({});
      const url = location.pathname.split('/');
      history.push(
        `/${url[1]}/${url[2]}/${url[3]}/${url[4]}/${url[5]}/list-records`
      );
      contentLibraryContext?.changeWarningPopupVisible({
        version: false,
        sidebar: false,
        relation: false,
        refresh: false,
        goBack: false,
      });
    } else {
      contentLibraryContext?.changeIFrameVisible({
        isVisible: false,
        url: '',
      });

      contentLibraryContext?.changeSubSidebarActiveKey({
        type: contentLibraryContext?.menuItemChange?.menu?.keyPath[0],
        id: contentLibraryContext?.menuItemChange?.menu?.key,
      });

      contentLibraryContext?.changeTitleAndSubtitle('', '');
      contentLibraryContext.ChangeIsFieldDirty({});
      if (contentLibraryContext?.menuItemChange.type === 'collection') {
        contentLibraryContext?.changeRecordFilterData('', '');
        contentLibraryContext?.changeWarningPopupVisible({
          version: false,
          sidebar: false,
          relation: false,
          refresh: false,
          goBack: false,
        });
        contentLibraryContext?.changeTitleAndSubtitle(
          contentLibraryContext?.menuItemChange.contentResult.name,
          contentLibraryContext?.menuItemChange.contentResult.description
        );
        history.push(
          `/workspaces/${workspaceId}/content-library/collection-type/${contentLibraryContext?.menuItemChange.menu.key}/list-records`
        );
      } else {
        contentLibraryContext?.changeRecordFilterData('', '');
        contentLibraryContext?.changeFieldComponentLoader(true);
        contentLibraryContext?.changeWarningPopupVisible({
          version: false,
          sidebar: false,
          relation: false,
          refresh: false,
          goBack: false,
        });
        contentLibraryContext?.changeMenuItemChange({
          type: 'single',
          menu: contentLibraryContext.menuItemChange.menu,
          contentResult: contentLibraryContext?.menuItemChange.contentResult,
          ContentModalId: contentLibraryContext?.menuItemChange.menu.key,
          recordTitle: contentLibraryContext?.menuItemChange.recordTitle,
        });
        history.push(
          `/workspaces/${workspaceId}/content-library/single-type/${contentLibraryContext?.menuItemChange.menu.key}/list-records`
        );
      }
    }
  };

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const addNewComponent = (
    index: number,
    mappingObject: any,
    isItemDrag: boolean,
    dragItems?: []
  ) => {
    const uuid = nanoid();
    const newArray = [...mappingObject];
    const finalObject = fieldMappingFunction(
      fieldList.data[index].fields,
      {},
      getRecordBYId.data.contentModelData
    );
    if (isItemDrag) {
      newArray[index].values = [...dragItems];
    } else {
      newArray[index].values = [
        ...newArray[index].values,

        {
          rComponent: finalObject,
          id: uuid,
          childId: `${getRecordBYId.data.contentModelFieldData.id}-${uuid}`,
        },
      ];
    }
    setCollapseActiveKey([...collapseActiveKey, uuid]);
    setMappingObject(newArray);
  };

  const deleteNewComponent = (
    mainIndex: number,
    id: string,
    mappingObject: any
  ) => {
    const newArray = [...mappingObject];
    const index = newArray[mainIndex].values.findIndex(
      (item) => item.id === id
    );
    newArray[mainIndex].values.splice(index, 1);
    setMappingObject(newArray);
  };

  const onOkDeleteModelClick = () => {
    deleteRecord.mutate({
      contentModelDataIds: [`${contentModalDataId}`],
      environmentId: localStorage.getItem(`${workspaceId}/environmentId`),
    });
  };

  const iframeMediaManagerPopUp = (file: string[], url: string) => {
    const newImageList = file.map((item) => {
      return {
        id: item.id,
        publicUrl: item.publicUrl,
        type: item.type,
        name: item.name,
        altText: item.altText,
        absolutePath: item.absolutePath,
        caption: item.caption,
      };
    });

    contentLibraryContext?.changeIFrameMediaManagerValue(newImageList);
    contentLibraryContext?.ChangeIFrameORMediaManagerVisible(false);
    setTimeout(() => {
      window.document
        .getElementById('page_editor_iframe')
        .contentWindow.mediaManagerCallback(newImageList);
    }, 0);
    onSubSidebarCollapse(true);
  };

  const onCloseIframeMediaManagerPopUp = () => {
    contentLibraryContext?.ChangeIFrameORMediaManagerVisible(false);
    onSubSidebarCollapse(true);
  };

  const onSaveAsNewVersionClick = async (val: {
    versionName: string;
    versionNo: number;
  }) => {
    const findContentEpe = fieldList.data.find(
      (item) => item.type === 'page-editor'
    );
    try {
      const requestObject = await saveFormData();
      if (requestObject) {
        requestObject['versionName'] = val.versionName;
        requestObject['versionNo'] = val.versionNo;
        if (localStorage.getItem(`${versionId}/contentEpe`)) {
          requestObject.dynamic_fields_data[findContentEpe.fieldName] =
            localStorage.getItem(`${versionId}/contentEpe`);
        }
        saveAsNewVersion.mutate({ ...requestObject });
        setSpinnerActive(true);
      } else {
        SetIsSaveAsNewVersionModalVisible(false);
      }
    } catch (err) {
      openNotificationWithIcon(
        'error',
        t('common.messages.provide_all_details')
      );
    }
  };

  const onWaringPopUpSaveClick = async () => {
    const requestObject = await saveFormData();
    if (requestObject) {
      creatUpdateNewRecord.mutate({ ...requestObject });
    }
  };

  const onCollapseActiveKeyChange = (key) => {
    setCollapseActiveKey(key);
  };

  const onEditRecordButtonClick = (val: boolean) => {
    setEditRecordDetailsModalVisible(val);
  };

  const onDeleteRecordButtonClick = (val: boolean) => {
    setDeleteRecordModalVisible(val);
  };

  const onDeleteRecordModalCancelClick = () => {
    setDeleteRecordModalVisible(false);
  };

  const changerRightSideMenuClose = (val: string) => {
    setRightSideMenuClose(val);
  };

  const onRecordSaveButtonClick = async () => {
    if (isSaveAsNewDraftVersionConformationModalVisible) {
      setIsSaveAsNewDraftVersionConformationModalVisible(false);
    }
    const findContentEpe = fieldList.data.find(
      (item) => item.type === 'page-editor'
    );

    if (window.document.getElementById('page_editor_iframe')) {
      const requestObject = JSON.parse(
        localStorage.getItem(`${versionId}/contentFieldData`)
      );
      requestObject['isCallFromiFrame'] = true;

      const getCss = window.document
        .getElementById('page_editor_iframe')
        .contentWindow.editor.getCss();
      const getHtml = window.document
        .getElementById('page_editor_iframe')
        .contentWindow.editor.getHtml();
      requestObject.dynamic_fields_data[
        findContentEpe.fieldName
      ] = `${getHtml}<style>${getCss}</style>`;
      creatUpdatePageEditor.mutate({ ...requestObject });
    } else {
      const requestObject = await saveFormData();
      if (requestObject) {
        if (localStorage.getItem(`${versionId}/contentEpe`)) {
          requestObject.dynamic_fields_data[findContentEpe.fieldName] =
            localStorage.getItem(`${versionId}/contentEpe`);
        }
        creatUpdateNewRecord.mutate({ ...requestObject });
      }
    }
  };

  const changeSaveAsNewVersionModalVisibility = (val: boolean) => {
    SetIsSaveAsNewVersionModalVisible(val);
  };

  const onSaveAndPublishButtonClick = async () => {
    // contentLibraryContext?.changeSaveAndPublish(true);
    const findContentEpe = fieldList.data.find(
      (item) => item.type === 'page-editor'
    );
    try {
      if (query.get('isPageEditor') === 'true') {
        const requestObject = JSON.parse(
          localStorage.getItem(`${versionId}/contentFieldData`)
        );
        requestObject['isCallFromiFrame'] = true;

        const getCss = window.document
          .getElementById('page_editor_iframe')
          .contentWindow.editor.getCss();
        const getHtml = window.document
          .getElementById('page_editor_iframe')
          .contentWindow.editor.getHtml();
        requestObject.dynamic_fields_data[
          findContentEpe.fieldName
        ] = `${getHtml}<style>${getCss}</style>`;
        requestObject['environment_id'] = localStorage.getItem(
          `${workspaceId}/environmentId`
        );
        saveAndPublish.mutate({ ...requestObject });
      } else {
        const requestObject = await saveFormData();
        requestObject['environment_id'] = localStorage.getItem(
          `${workspaceId}/environmentId`
        );
        if (localStorage.getItem(`${versionId}/contentEpe`)) {
          requestObject.dynamic_fields_data[findContentEpe.fieldName] =
            localStorage.getItem(`${versionId}/contentEpe`);
        }

        saveAndPublish.mutate({ ...requestObject });
      }
    } catch (err) {}
  };

  const onScheduleVersionUnPublishClick = () => {
    // contentLibraryContext?.changeScheduleVersionPublish({
    //   publish: false,
    //   unpublish: true,
    // });
    unPublishVersion.mutate({
      contentModalId: contentModalId,
      contentModelDataId: contentModalDataId,
      versionId: versionId,
      environmentId: localStorage.getItem(`${workspaceId}/environmentId`),
    });
  };

  const changeScheduleVersionPublishModalVisibility = (val: boolean) => {
    setIsScheduleVersionPublishVisible(val);
  };

  const onContentLibraryPopupVisibilityChange = (val: boolean) => {
    setIsContentLibraryPopupOpen(val);
  };
  window.openContentLibrary = function (
    popUpContentModalId,
    popUpContentModalDataId,
    popUpVersionId,
    popUpContentModalInternalName
  ) {
    setViewContentModalInModalData({
      contentModalId: popUpContentModalId,
      contentModalDataId: popUpContentModalDataId,
      versionId: popUpVersionId,
      contentModalInternalName: popUpContentModalInternalName,
    });
    setIsContentLibraryPopupOpen(true);
  };

  window.openAddNewRecordModal = (
    popUpContentModalId,
    popUpContentModalInternalName
  ) => {
    setContentModalDataForNewRecordPopup({
      contentModalId: popUpContentModalId,
      contentModalInternalName: popUpContentModalInternalName,
    });
    setIsAddNewRecordInPopupOpen(true);
  };

  const onNewRecordInPopupVisibilityChange = (val: boolean) => {
    setIsAddNewRecordInPopupOpen(val);
  };

  const onSaveAsNewDraftVersionModalVisibilityChange = (val: boolean) => {
    setIsSaveAsNewDraftVersionConformationModalVisible(val);
  };

  const isModalVisible = useMemo(() => {
    return {
      warningModalOfVersion: contentLibraryContext?.warningPopupVisible.version,
      warningModalOfSidebar: contentLibraryContext?.warningPopupVisible.sidebar,
      warningModalOfGoBack: contentLibraryContext?.warningPopupVisible.goBack,
      warningModalOfRelation:
        contentLibraryContext?.warningPopupVisible.relation,
      isSaveAndPublish: contentLibraryContext?.isSaveAndPublishVisible,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    contentLibraryContext?.isScheduleVersionPublish,
    contentLibraryContext?.warningPopupVisible,
    contentLibraryContext?.isSaveAndPublishVisible,
  ]);

  useEffect(() => {
    contentLibraryContext?.changeForm(form);
    contentLibraryContext?.changeSubsideBarVisibility(false);
    return function () {
      if (history.action === 'POP') {
        removeCookies();

        contentLibraryContext?.changeIFrameVisible({
          isVisible: false,
          url: '',
        });
        contentLibraryContext?.ChangeIFrameORMediaManagerVisible(false);
        onSubSidebarCollapse(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const changeEnvironment = () => {
      setEnvironmentId(localStorage.getItem(`${workspaceId}/environmentId`));
      getRecordBYId.remove();
    };
    document.addEventListener('envChange', changeEnvironment);
    return () => {
      document.removeEventListener('envChange', changeEnvironment);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (query.get('is_iframe')) {
      Cookies.remove('pageEditorPopUp');
      contentLibraryContext?.changeIFrameVisible({
        isVisible: false,
        url: '',
      });
      contentLibraryContext?.ChangeIFrameORMediaManagerVisible(false);
      onSubSidebarCollapse(true);
      onMainSidebarCollapsed(true);
    } else if (query.get('isPageEditor') === 'true') {
      setTimeout(() => {
        onSubSidebarCollapse(true);
        onMainSidebarCollapsed(true);
      }, 0);

      contentLibraryContext?.changeIFrameVisible({
        isVisible: true,
        url: Cookies.get('pageEditorPopUp'),
      });
      onSubSidebarCollapse(true);
    } else {
      setTimeout(() => {
        onSubSidebarCollapse(false);
        onMainSidebarCollapsed(false);
      }, 0);
      contentLibraryContext?.changeIFrameVisible({
        isVisible: false,
        url: '',
      });
    }
    contentLibraryContext?.changeSubSidebarActiveKey({
      type: 'collection-type',
      id: contentModalId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    if (getRecordBYId.isSuccess) {
      if (fieldList.isSuccess) {
        if (fieldList.data && getRecordBYId.data) {
          setHeaderTitleAndSubtitle({
            title: getRecordBYId.data.contentModelData.title,
            subtitle: getRecordBYId.data.contentModelData.pageSlug,
          });
          const contentProvider = fieldList.data.find(
            (item) => item.fieldName === 'provider_esi'
          );
          if (contentProvider) {
            if (
              getRecordBYId.data.contentModelFieldData.providerEsi ===
                'BIGCOMMERCE' ||
              getRecordBYId.data.contentModelFieldData.providerEsi === 'SHOPIFY'
            ) {
              setEcommerceRedirectionTabVisible(true);
            } else {
              setEcommerceRedirectionTabVisible(false);
            }
          } else {
            setEcommerceRedirectionTabVisible(false);
          }

          const environmentStatusList = [];

          const finalObject = fieldMappingFunction(
            fieldList.data,
            getRecordBYId.data?.contentModelFieldData,
            getRecordBYId.data.contentModelData
          );

          if (getRecordBYId.data?.contentModelData?.title) {
            contentLibraryContext?.changeTitleAndSubtitle(
              getRecordBYId.data.contentModelData.title,
              getRecordBYId.data.contentModelData.pageSlug,
              getRecordBYId.data.contentModelFieldData.publishAt,
              getRecordBYId.data.contentModelFieldData.unpublishAt
            );

            contentLibraryContext?.changeNewRecordFieldDetails(
              contentModalId,
              contentModalDataId,
              getRecordBYId.data?.contentModelFieldData.id,
              versionId,
              getRecordBYId.data?.contentModelFieldData.template,
              languageName
            );
          }
          contentLibraryContext?.changeResponseValueObject({
            versionId: getRecordBYId.data?.contentModelFieldData.id,
            template: getRecordBYId.data?.contentModelFieldData.template,
            contentModalFieldDataId:
              getRecordBYId.data?.contentModelFieldData.id,
            contentFieldObject: finalObject,
          });

          const relationData = finalObject.filter(
            (item) => item.type === 'relation'
          );

          if (relationData.length > 0) {
            setRelationFieldListData(relationData);
            queryClient.removeQueries([API_QUERY_KEY.GET_RELATION_FIELD_LIST]);
          }

          contentLibraryContext?.changeHeaderButtonVisible({
            type: 'record-data',
            position: 'collection-type',
          });

          for (const item in finalObject) {
            if (finalObject[item].name) {
              if (
                finalObject[item].name.split('/')[0] === 'last_synced_at_edti'
              ) {
                setLastSyncAt(finalObject[item].editValue);
              }
            }
          }

          const findContentEpe = finalObject.find(
            (item) => item.type === 'page-editor'
          );
          if (findContentEpe && findContentEpe.editValue) {
            localStorage.setItem(
              `${versionId}/contentEpe`,
              findContentEpe.editValue
            );
          }

          setMappingObject(finalObject);

          contentLibraryContext?.environmentList.map((item) => {
            if (
              getRecordBYId.data?.contentModelFieldData[
                `${item.id.replaceAll('-', '')}Status`
              ]
            ) {
              environmentStatusList.push({
                id: item.id,
                name: item.title,
                status:
                  getRecordBYId.data?.contentModelFieldData[
                    `${item.id.replaceAll('-', '')}Status`
                  ],
              });
            } else {
              environmentStatusList.push({
                id: item.id,
                name: item.title,
                status: 'DRAFT',
              });
            }
            return '';
          });

          setCurrentVersionStatus([...environmentStatusList]);

          contentLibraryContext?.changeCurrentVersionStatus(
            getRecordBYId.data?.contentModelFieldData.versionName,
            getRecordBYId.data?.contentModelFieldData.versionNo,
            [...environmentStatusList]
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getRecordBYId.isSuccess,
    fieldList.data,
    getRecordBYId.data,
    fieldList.isSuccess,
  ]);

  useEffect(() => {
    if (getVersionList.isSuccess) {
      setVersionList(getVersionList.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getVersionList.isSuccess]);

  useEffect(() => {
    if (getWorkspaceLanguageList.isSuccess) {
      setWorkspaceLanguageList(getWorkspaceLanguageList.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getWorkspaceLanguageList.isSuccess]);

  useEffect(() => {
    if (getRecordBYId.isError) {
      handleForbiddenError(getRecordBYId.error.response.Error?.errorCode);
      openNotificationWithIcon(
        'error',
        t('common.messages.content_modal_record_not_exist')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getRecordBYId.isError, t]);

  useEffect(() => {
    if (getVersionList.isError) {
      handleForbiddenError(getVersionList.error.response.Error?.errorCode);
      openNotificationWithIcon(
        'error',
        t('common.messages.version_does_not_exist')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getVersionList.isError, t]);

  useEffect(() => {
    if (getWorkspaceLanguageList.isError) {
      openNotificationWithIcon(
        'error',
        t('common.messages.language_list_not_exist')
      );
    }
  }, [getWorkspaceLanguageList.isError, t]);

  useEffect(() => {
    if (
      fieldList.isFetched &&
      getRecordBYId.isFetched &&
      getVersionList.isFetched &&
      getWorkspaceLanguageList.isFetched &&
      relationFieldList.isFetched
    ) {
      contentLibraryContext?.changeFieldComponentLoader(false);
      setSpinnerActive(false);
    }
    return () => {
      contentLibraryContext?.changeFieldComponentLoader(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fieldList.isFetched,
    getRecordBYId.isFetched,
    getVersionList.isFetched,
    getWorkspaceLanguageList.isFetched,
    relationFieldList.isFetched,
    contentLibraryContext,
  ]);

  useEffect(() => {
    if (deleteRecord.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.record_deleted_successfully')
      );
      queryClient.removeQueries([
        API_QUERY_KEY.GET_RECORD_LIST,
        contentModalId,
        '',
      ]);
      setDeleteRecordModalVisible(false);
      history.push(
        `/workspaces/${workspaceId}/content-library/collection-type/${contentModalId}/list-records`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteRecord.isSuccess]);

  useError({
    mutation: deleteRecord,
    entity: t('common.labels.languages'),
  });

  useEffect(() => {
    if (saveAsNewVersion.isSuccess) {
      contentLibraryContext.ChangeIsFieldDirty({});
      localStorage.removeItem(`${versionId}/contentEpe`);
      localStorage.removeItem(`${versionId}/contentFieldData`);
      history.push(
        `/workspaces/${workspaceId}/content-library/collection-type/${contentModalId}/field/${contentModalDataId}/version/${saveAsNewVersion.data.versionId}/language/${languageName}`
      );

      getRecordBYId.refetch();

      getVersionList.refetch();

      SetIsSaveAsNewVersionModalVisible(false);
      openNotificationWithIcon(
        'success',
        t('common.messages.new_version_created_successfully')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveAsNewVersion.isSuccess]);

  useEffect(() => {
    if (saveAsNewVersion.isError) {
      openNotificationWithIcon(
        'error',
        t('common.messages.error_create_new_version')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveAsNewVersion.isError]);

  useEffect(() => {
    if (relationFieldList.isFetched) {
      if (relationFieldList.data.length > 0) {
        const tempArray = [];
        for (let i = 0; i < relationFieldList.data.length; i++) {
          if (relationFieldList.data[i].status === 'fulfilled') {
            tempArray.push(relationFieldList.data[i].value);
          }
        }
        setRelationFieldValues(tempArray);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relationFieldList.isFetched]);

  useEffect(() => {
    if (updateCurrentVersion.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.version_change_successfully')
      );
      localStorage.removeItem(`${versionId}/contentEpe`);
      localStorage.removeItem(`${versionId}/contentFieldData`);
      history.replace({
        pathname: `/workspaces/${workspaceId}/content-library/collection-type/${contentModalId}/field/${contentModalDataId}/version/${updateCurrentVersion.variables}/language/${languageName}`,
      });

      queryClient.removeQueries([
        API_QUERY_KEY.GET_RECORD_LIST,
        contentModalId,
        contentModalDataId,
        languageName,
        updateCurrentVersion.variables,
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateCurrentVersion.isSuccess]);

  useEffect(() => {
    if (updateCurrentVersion.isError) {
      openNotificationWithIcon(
        'error',
        t('common.messages.error_version_update')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateCurrentVersion.isError, updateCurrentVersion.error]);

  useEffect(() => {
    if (creatUpdateNewRecord.isSuccess) {
      contentLibraryContext.ChangeIsFieldDirty({});

      if (creatUpdateNewRecord.data.versionId) {
        localStorage.removeItem(`${versionId}/contentEpe`);
        localStorage.removeItem(`${versionId}/contentFieldData`);
        history.push(
          `/workspaces/${workspaceId}/content-library/${
            location.pathname.split('/')[4]
          }/${contentModalId}/field/${contentModalDataId}/version/${
            creatUpdateNewRecord.data.versionId
          }/language/${languageName}`
        );

        contentLibraryContext?.changeWarningPopupVisible({
          version: false,
          sidebar: false,
          relation: false,
          refresh: false,
          goBack: false,
        });
      } else {
        if (
          contentLibraryContext?.warningPopupVisible.sidebar ||
          contentLibraryContext?.warningPopupVisible.goBack ||
          contentLibraryContext?.warningPopupVisible.version ||
          contentLibraryContext?.warningPopupVisible.relation ||
          contentLibraryContext?.warningPopupVisible.refresh
        ) {
          contentLibraryContext?.changeFieldComponentLoader(true);
          onWorkingPopupDiscard();
        }
      }

      //TODO Remove refetchQueries
      getRecordBYId.refetch();
      openNotificationWithIcon(
        'success',
        t('common.messages.record_saved_successfully')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creatUpdateNewRecord.isSuccess]);

  useEffect(() => {
    if (creatUpdateNewRecord.isError) {
      openNotificationWithIcon('error', creatUpdateNewRecord.error?.message);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creatUpdateNewRecord.isError]);

  useEffect(() => {
    if (bigCommerceSync.isSuccess) {
      openNotificationWithIcon('success', t('common.messages.sync_success'));
      getRecordBYId.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bigCommerceSync.isSuccess, t]);

  useEffect(() => {
    if (bigCommerceSync.isError) {
      openNotificationWithIcon('error', t('common.messages.sync_error'));
    }
  }, [bigCommerceSync.isError, t]);

  useEffect(() => {
    if (creatUpdatePageEditor.isSuccess) {
      if (creatUpdatePageEditor.data) {
        if (creatUpdatePageEditor.data.versionId) {
          contentLibraryContext.ChangeIsFieldDirty({});
          if (query.get('isPageEditor') === 'true') {
            const oldVersionData = JSON.parse(
              localStorage.getItem(`${versionId}/contentFieldData`)
            );

            oldVersionData.versionId = creatUpdatePageEditor.data.versionId;

            oldVersionData.contentModelFieldDataId =
              creatUpdatePageEditor.data.versionId;

            localStorage.setItem(
              `${creatUpdatePageEditor.data.versionId}/contentFieldData`,
              JSON.stringify(oldVersionData)
            );

            localStorage.removeItem(`${versionId}/contentFieldData`);
            localStorage.removeItem(`${versionId}/contentEpe`);

            let result;
            if (query.get('env')) {
              result = contentLibraryContext?.environmentList.find(
                (item) => item.id === query.get('env')
              );
            } else {
              result = contentLibraryContext?.environmentList.find(
                (item) =>
                  item.id ===
                  localStorage.getItem(`${workspaceId}/environmentId`)
              );
            }
            contentLibraryContext?.changeTempPageEditor(false);
            removeCookies();

            contentLibraryContext?.changeIFrameVisible({
              isVisible: true,
              url: `${process.env.REACT_APP_PAGE_EDITOR_IFRAME_HOST}${headerTitleAndSubtitle.subtitle}?wh=${result?.workspaceDomain}&vid=${creatUpdatePageEditor.data.versionId}&lang=${languageName}`,
            });
            Cookies.set(
              'pageEditorPopUp',
              `${process.env.REACT_APP_PAGE_EDITOR_IFRAME_HOST}${headerTitleAndSubtitle.subtitle}?wh=${result?.workspaceDomain}&vid=${creatUpdatePageEditor.data.versionId}&lang=${languageName}`
            );

            // @ts-ignore
            window.openMediaManager = function () {
              contentLibraryContext?.ChangeIFrameORMediaManagerVisible(true);
              onSubSidebarCollapse(false);
              return true;
            };
            setTimeout(() => {
              contentLibraryContext?.changeTempPageEditor(true);
              if (query.get('env')) {
                history.push(
                  `/workspaces/${workspaceId}/content-library/${
                    location.pathname.split('/')[4]
                  }/${contentModalId}/field/${contentModalDataId}/version/${
                    creatUpdatePageEditor.data.versionId
                  }/language/${languageName}?isPageEditor=true&env=${query.get(
                    'env'
                  )}`
                );
              } else {
                history.push(
                  `/workspaces/${workspaceId}/content-library/${
                    location.pathname.split('/')[4]
                  }/${contentModalId}/field/${contentModalDataId}/version/${
                    creatUpdatePageEditor.data.versionId
                  }/language/${languageName}?isPageEditor=true&`
                );
              }
            }, 1000);
          }
        } else {
          getRecordBYId.refetch();
        }
      }
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creatUpdatePageEditor.isSuccess]);

  useError({
    mutation: creatUpdatePageEditor,
    entity: t('common.labels.field_page_editor_title'),
  });

  useEffect(() => {
    if (saveAndPublish.isSuccess) {
      contentLibraryContext?.ChangeIsFieldDirty({});

      localStorage.removeItem(`${versionId}/contentEpe`);

      queryClient.removeQueries([API_QUERY_KEY.VERSION_PUBLISH_QUEUE]);
      if (saveAndPublish.data) {
        if (query.get('isPageEditor') === 'true') {
          let result;
          if (query.get('env')) {
            result = contentLibraryContext?.environmentList.find(
              (item) => item.id === query.get('env')
            );
          } else {
            result = contentLibraryContext?.environmentList.find(
              (item) =>
                item.id === localStorage.getItem(`${workspaceId}/environmentId`)
            );
          }
          contentLibraryContext?.changeTempPageEditor(false);
          removeCookies();

          const oldVersionData = JSON.parse(
            localStorage.getItem(`${versionId}/contentFieldData`)
          );

          oldVersionData.versionId = saveAndPublish.data.versionId;

          oldVersionData.contentModelFieldDataId =
            saveAndPublish.data.versionId;

          localStorage.setItem(
            `${saveAndPublish.data.versionId}/contentFieldData`,
            JSON.stringify(oldVersionData)
          );

          localStorage.removeItem(`${versionId}/contentFieldData`);

          contentLibraryContext?.changeIFrameVisible({
            isVisible: true,
            url: `${process.env.REACT_APP_PAGE_EDITOR_IFRAME_HOST}${headerTitleAndSubtitle.subtitle}?wh=${result?.workspaceDomain}&vid=${saveAndPublish.data.versionId}&lang=${languageName}`,
          });
          Cookies.set(
            'pageEditorPopUp',
            `${process.env.REACT_APP_PAGE_EDITOR_IFRAME_HOST}${headerTitleAndSubtitle.subtitle}?wh=${result?.workspaceDomain}&vid=${saveAndPublish.data.versionId}&lang=${languageName}`
          );

          // @ts-ignore
          window.openMediaManager = function () {
            contentLibraryContext?.ChangeIFrameORMediaManagerVisible(true);
            onSubSidebarCollapse(false);
            return true;
          };
          setTimeout(() => {
            contentLibraryContext?.changeTempPageEditor(true);
            if (query.get('env')) {
              history.push(
                `/workspaces/${workspaceId}/content-library/${
                  location.pathname.split('/')[4]
                }/${contentModalId}/field/${contentModalDataId}/version/${
                  saveAndPublish.data.versionId
                }/language/${languageName}?isPageEditor=true&env=${query.get(
                  'env'
                )}`
              );
            } else {
              history.push(
                `/workspaces/${workspaceId}/content-library/${
                  location.pathname.split('/')[4]
                }/${contentModalId}/field/${contentModalDataId}/version/${
                  saveAndPublish.data.versionId
                }/language/${languageName}?isPageEditor=true&`
              );
            }
          }, 1000);
        } else {
          history.push(
            `/workspaces/${workspaceId}/content-library/${
              location.pathname.split('/')[4]
            }/${contentModalId}/field/${contentModalDataId}/version/${
              saveAndPublish.data.versionId
            }/language/${languageName}`
          );
        }
      }

      openNotificationWithIcon(
        'success',
        t('common.messages.save_and_publish_success')
      );
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveAndPublish.isSuccess]);

  useEffect(() => {
    if (saveAndPublish.isError) {
      openNotificationWithIcon(
        'error',
        t('common.messages.save_and_publish_error')
      );
      console.log(saveAndPublish.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveAndPublish.isError]);

  useEffect(() => {
    if (unPublishVersion.isSuccess) {
      contentLibraryContext?.ChangeIsFieldDirty({});
      getRecordBYId.refetch();
      queryClient.removeQueries([API_QUERY_KEY.VERSION_PUBLISH_QUEUE]);
      openNotificationWithIcon(
        'success',
        t('common.messages.version_un_published')
      );
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unPublishVersion.isSuccess]);

  useEffect(() => {
    if (unPublishVersion.isError) {
      openNotificationWithIcon('error', unPublishVersion.error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unPublishVersion.isError]);

  return {
    mappingObject,
    workspaceLanguageList,
    versionList,
    dataLoading: contentLibraryContext?.fieldComponentLoader,
    onLanguageChange,
    onVersionChange,
    addNewComponent,
    deleteNewComponent,
    iframeMediaManagerPopUp,
    onOkDeleteModelClick,
    deleteRecord,
    t,
    currentVersionId: getRecordBYId.data?.contentModelData?.currentVersionId,
    isSpinnerActive,
    onCloseIframeMediaManagerPopUp,
    onSaveAsNewVersionClick,
    form,
    nextVersionNumber: getRecordBYId?.data?.nextVersionNo,
    versionNo: getRecordBYId?.data?.contentModelFieldData.versionNo,
    relationFieldValues,
    versionName: getRecordBYId?.data?.contentModelFieldData.versionName,
    onWorkingPopupDiscard,
    onWaringPopUpSaveClick,
    waringPopUpLoading: creatUpdateNewRecord.isLoading,
    recordId: getRecordBYId?.data?.contentModelData.id,
    createdBy:
      userDetails?.listAllUser?.[
        getRecordBYId?.data?.contentModelData.createdBy
      ],
    modifiedBy:
      userDetails?.listAllUser?.[
        getRecordBYId?.data?.contentModelData.modifiedBy
      ],
    createdAt: getRecordBYId?.data?.contentModelData.createdAt,
    modifiedAt: getRecordBYId?.data?.contentModelData.modifiedAt,
    languageAvailableInRecord: getRecordBYId?.data?.contentModelData.language,
    rightSideMenuClose,
    isModalVisible,
    languagesList: userDetails?.languagesList,
    currentVersionStatus,
    environmentList: contentLibraryContext?.environmentList,
    collapseActiveKey,
    onCollapseActiveKeyChange,
    isEcommerceRedirectionTabVisible,
    lastSyncAt,
    editRecordDetailsModalVisible,
    onEditRecordButtonClick,
    deleteRecordModalVisible,
    onDeleteRecordButtonClick,
    onDeleteRecordModalCancelClick,
    changerRightSideMenuClose,
    providerIdEsi: getRecordBYId?.data?.contentModelFieldData?.providerIdEsi,
    defaultTemplateId: getRecordBYId?.data?.contentModelFieldData?.template,
    headerTitleAndSubtitle,
    onRecordSaveButtonClick,
    creatUpdateRecordIsLoading: creatUpdateNewRecord.isLoading,
    creatUpdatePageEditorIsLoading: creatUpdatePageEditor.isLoading,
    isSaveAsNewVersionModalVisible,
    changeSaveAsNewVersionModalVisibility,
    onSaveAndPublishButtonClick,
    onScheduleVersionUnPublishClick,
    onScheduleVersionUnPublishLoading: unPublishVersion.isLoading,
    isScheduleVersionPublishModalVisible,
    changeScheduleVersionPublishModalVisibility,
    saveFormData,
    isIFrameVisible: contentLibraryContext?.isIFrameVisible?.isVisible,
    pageEditorStatus: contentLibraryContext.tempStatePageEditor,
    IFrameUrl: contentLibraryContext?.isIFrameVisible?.url,
    iframeMediaManagerPopUpVisible:
      contentLibraryContext?.isIFrameORMediaManagerVisible,
    fieldComponentLoader: contentLibraryContext?.fieldComponentLoader,
    isContentLibraryPopupOpen,
    onContentLibraryPopupVisibilityChange,
    viewContentInModalData,
    isAddNewRecordInPopupOpen,
    onNewRecordInPopupVisibilityChange,
    contentModalDataForNewRecordPopup,
    isEcommerceModal:
      selectedContentModalDetails?.internalName?.includes('ecommerce_'),
    isSaveAsNewDraftVersionConformationModalVisible,
    onSaveAsNewDraftVersionModalVisibilityChange,
    providerEsi: getRecordBYId?.data?.contentModelFieldData?.providerEsi,
    storeHash: getRecordBYId?.data?.storeHash,
  };
};
export default useCreateUpdateCollectionController;
