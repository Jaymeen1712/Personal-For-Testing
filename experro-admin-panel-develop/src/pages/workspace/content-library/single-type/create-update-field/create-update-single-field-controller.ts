// @ts-nocheck
import { useContext, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  fieldMappingFunction,
  RelationFinalObject,
  useHandleForbiddenError,
} from '../../utils';
import { IContentLibraryFieldPops, ILanguage } from '../../../../../types';
import { ContentLibraryContext } from '../../context';
import {
  useCreatUpdateNewRecord,
  useFieldList,
  useGetRecordListById,
  useGetRelationRecordList,
  useGetVersionList,
  useSaveAndPublish,
  useSaveAsNewVersion,
  useUnPublishVersion,
  useUpdateCurrentVersion,
  useListWorkspaceLanguage,
} from '../../services';
import { Form } from 'antd';
import queryClient from '../../../../../query-client';
import {
  API_QUERY_KEY,
  onSubSidebarCollapse,
  openNotificationWithIcon,
} from '../../../../../utills';
import { customAlphabet } from 'nanoid';
import useUser from '../../../../../hooks/user';
import useFinalObject from '../../utils/final-object';

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const nanoid = customAlphabet(alphabet, 12);

const useCreateUpdateSingleFieldController = () => {
  const contentLibraryContext = useContext(ContentLibraryContext);
  const userDetails = useUser();
  const [form] = Form.useForm();
  const { finalObject } = useFinalObject();

  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const { handleForbiddenError } = useHandleForbiddenError();

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

  const [workspaceLanguageList, setWorkspaceLanguageList] =
    useState<ILanguage[]>();
  const [versionList, setVersionList] = useState<
    {
      id: string;
      versionName: string;
      versionNo: number;
    }[]
  >();

  const [relationFieldListData, setRelationFieldListData] = useState([]);

  const [relationFieldValues, setRelationFieldValues] = useState([]);

  const [isSpinnerActive, setSpinnerActive] = useState(true);

  const [warningPopupValues, setWarningPopupValues] = useState({
    version: '',
    language: '',
  });

  const [currentVersionStatus, setCurrentVersionStatus] = useState([]);

  const [collapseActiveKey, setCollapseActiveKey] = useState([]);

  const [environmentId, setEnvironmentId] = useState(
    localStorage.getItem(`${workspaceId}/environmentId`)
  );

  const [isSaveAsNewVersionModalVisible, SetIsSaveAsNewVersionModalVisible] =
    useState(false);

  const [
    isScheduleVersionPublishModalVisible,
    setIsScheduleVersionPublishVisible,
  ] = useState(false);

  const [
    isSaveAsNewDraftVersionConformationModalVisible,
    setIsSaveAsNewDraftVersionConformationModalVisible,
  ] = useState(false);

  const fieldList = useFieldList('single', workspaceId, contentModalId);

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

  const saveAsNewVersion = useSaveAsNewVersion(workspaceId);

  const creatUpdateNewRecord = useCreatUpdateNewRecord(workspaceId);

  const saveAndPublish = useSaveAndPublish(workspaceId);

  const unPublishVersion = useUnPublishVersion(workspaceId);

  const [mappingObject, setMappingObject] = useState<
    IContentLibraryFieldPops[]
  >([]);

  const [rightSideMenuClose, setRightSideMenuClose] = useState('');

  const [headerTitleAndSubtitle, setHeaderTitleAndSubtitle] = useState({
    title: '',
    subtitle: '',
  });

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

  const onLanguageChange = async (value: string) => {
    setWarningPopupValues({ version: '', language: value });
    if (!Object.values(contentLibraryContext?.isFieldDirty).includes(false)) {
      setSpinnerActive(true);
      history.replace({
        pathname: `/workspaces/${workspaceId}/content-library/single-type/${contentModalId}/field/${contentModalDataId}/version/${versionId}/language/${value}`,
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

  const onVersionChange = async (value: string) => {
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
    if (contentLibraryContext?.warningPopupVisible.version) {
      contentLibraryContext?.changeWarningPopupVisible({
        version: false,
        sidebar: false,
        relation: false,
        refresh: false,
        goBack: false,
      });
      contentLibraryContext.ChangeIsFieldDirty({});
      if (warningPopupValues.version) {
        updateCurrentVersion.mutate(warningPopupValues.version);
        // history.replace({
        //   pathname: `/workspaces/${workspaceId}/content-library/single-type/${contentModalId}/field/${contentModalDataId}/version/${warningPopupValues.version}/language/${languageName}`,
        // });
        //
        // queryClient.removeQueries([
        //   API_QUERY_KEY.GET_RECORD_LIST,
        //   contentModalId,
        //   contentModalDataId,
        //   languageName,
        //   warningPopupValues.version,
        // ]);
      } else {
        history.replace({
          pathname: `/workspaces/${workspaceId}/content-library/single-type/${contentModalId}/field/${contentModalDataId}/version/${versionId}/language/${warningPopupValues.language}`,
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
    } else {
      contentLibraryContext?.changeIFrameVisible({
        isVisible: false,
        url: '',
      });

      contentLibraryContext?.changeSubSidebarActiveKey({
        type: contentLibraryContext?.menuItemChange.menu.keyPath[0],
        id: contentLibraryContext?.menuItemChange.menu.key,
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
          contentModalId: contentLibraryContext?.menuItemChange.menu.key,
          recordTitle: contentLibraryContext?.menuItemChange.recordTitle,
        });

        history.push(
          `/workspaces/${workspaceId}/content-library/single-type/${contentLibraryContext?.menuItemChange.menu.key}/list-records`
        );
      }
    }
  };

  const onWaringPopUpSaveClick = async () => {
    const requestObject = await saveFormData();
    if (requestObject) {
      creatUpdateNewRecord.mutate({ ...requestObject });
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

  const onSaveAsNewVersionClick = async (val: {
    versionName: string;
    versionNo: number;
  }) => {
    try {
      const requestObject = await saveFormData();
      if (requestObject) {
        requestObject['versionName'] = val.versionName;
        requestObject['versionNo'] = val.versionNo;
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
  const onCancelSaveAsNewVersionClick = () => {
    contentLibraryContext?.changeSaveAsNewVersionModalVisible(false);
  };

  const onCollapseActiveKeyChange = (key) => {
    setCollapseActiveKey(key);
  };

  const changerRightSideMenuClose = (val: string) => {
    setRightSideMenuClose(val);
  };

  const changeSaveAsNewVersionModalVisibility = (val: boolean) => {
    SetIsSaveAsNewVersionModalVisible(val);
  };

  const onRecordSaveButtonClick = async () => {
    if (isSaveAsNewDraftVersionConformationModalVisible) {
      setIsSaveAsNewDraftVersionConformationModalVisible(false);
    }
    const requestObject = await saveFormData();
    if (requestObject) {
      if (window.document.getElementById('page_editor_iframe')) {
        requestObject['isCallFromiFrame'] = true;
        creatUpdatePageEditor.mutate({ ...requestObject });
      } else {
        creatUpdateNewRecord.mutate({ ...requestObject });
      }
    }
  };

  const onSaveAndPublishButtonClick = async () => {
    try {
      const requestObject = await saveFormData();
      requestObject['environment_id'] = localStorage.getItem(
        `${workspaceId}/environmentId`
      );
      saveAndPublish.mutate({ ...requestObject });
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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentLibraryContext?.warningPopupVisible]);

  useEffect(() => {
    contentLibraryContext?.changeSubSidebarActiveKey({
      type: 'single-type',
      id: contentModalId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    onSubSidebarCollapse(false);
    contentLibraryContext?.changeForm(form);
    contentLibraryContext?.changeSubsideBarVisibility(false);
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
    if (getRecordBYId.isSuccess) {
      if (fieldList.isSuccess) {
        if (fieldList.data && getRecordBYId.data) {
          setHeaderTitleAndSubtitle({
            title: getRecordBYId.data.contentModelData.title,
            subtitle: getRecordBYId.data.contentModelData.pageSlug,
          });
          const environmentStatusList = [];
          const finalObject = fieldMappingFunction(
            fieldList.data,
            getRecordBYId.data?.contentModelFieldData,
            getRecordBYId.data.contentModelData
          );

          if (getRecordBYId.data?.contentModelData?.title) {
            contentLibraryContext?.changeTitleAndSubtitle(
              getRecordBYId.data.contentModelData.title,
              getRecordBYId.data.contentModelData.pageSlug
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
            // @ts-ignore
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
            position: 'single-type',
          });
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
    if (saveAsNewVersion.isSuccess) {
      history.push(
        `/workspaces/${workspaceId}/content-library/single-type/${contentModalId}/field/${contentModalDataId}/version/${saveAsNewVersion.data.versionId}/language/${languageName}`
      );

      getRecordBYId.refetch();

      getVersionList.refetch();

      SetIsSaveAsNewVersionModalVisible(false);
      openNotificationWithIcon(
        'success',
        t('common.messages.new_version_created_successfully')
      );
      contentLibraryContext.ChangeIsFieldDirty({});
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
      history.replace({
        pathname: `/workspaces/${workspaceId}/content-library/single-type/${contentModalId}/field/${contentModalDataId}/version/${updateCurrentVersion.variables}/language/${languageName}`,
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
    if (saveAndPublish.isSuccess) {
      contentLibraryContext.ChangeIsFieldDirty({});
      queryClient.removeQueries([API_QUERY_KEY.VERSION_PUBLISH_QUEUE]);
      history.push(
        `/workspaces/${workspaceId}/content-library/${
          location.pathname.split('/')[4]
        }/${contentModalId}/field/${contentModalDataId}/version/${
          saveAndPublish.data.versionId
        }/language/${languageName}`
      );

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
      getRecordBYId.refetch();
      contentLibraryContext?.ChangeIsFieldDirty({});
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
    t,
    currentVersionId: getRecordBYId.data?.contentModelData?.currentVersionId,
    isSpinnerActive,
    onSaveAsNewVersionClick,
    onCancelSaveAsNewVersionClick,
    form,
    nextVersionNumber: getRecordBYId?.data?.nextVersionNo,
    versionNo: getRecordBYId?.data?.contentModelFieldData.versionNo,
    relationFieldValues,
    versionName: getRecordBYId?.data?.contentModelFieldData.versionName,
    nanoid,
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
    collapseActiveKey,
    onCollapseActiveKeyChange,
    changerRightSideMenuClose,
    headerTitleAndSubtitle,
    onRecordSaveButtonClick,
    creatUpdateRecordIsLoading: creatUpdateNewRecord.isLoading,
    isSaveAsNewVersionModalVisible,
    changeSaveAsNewVersionModalVisibility,
    onSaveAndPublishButtonClick,
    onScheduleVersionUnPublishClick,
    onScheduleVersionUnPublishLoading: unPublishVersion.isLoading,
    isScheduleVersionPublishModalVisible,
    changeScheduleVersionPublishModalVisibility,
    saveFormData,
    fieldComponentLoader: contentLibraryContext?.fieldComponentLoader,
    isSaveAsNewDraftVersionConformationModalVisible,
    onSaveAsNewDraftVersionModalVisibilityChange,
    t,
  };
};
export default useCreateUpdateSingleFieldController;
