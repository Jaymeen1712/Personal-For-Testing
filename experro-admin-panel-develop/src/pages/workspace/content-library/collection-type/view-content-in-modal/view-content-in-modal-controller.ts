//@ts-nocheck
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { customAlphabet } from 'nanoid';

import {
  useCreatUpdateNewRecord,
  useFieldList,
  useGetRecordListById,
} from '../../services';
import { fieldMappingFunction, RelationFinalObject } from '../../utils';
import { IContentLibraryFieldPops } from '../../../../../types';
import { useTranslation } from 'react-i18next';
import { openNotificationWithIcon } from '../../../../../utills';
import useFinalObject from '../../utils/final-object';
import { ContentLibraryContext } from '../../context';

const useViewContentInModalController = (
  contentModalId: string,
  contentModalDataId: string,
  versionId: string,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  form: any,
  onContentLibraryPopupVisibilityChange: (val: boolean) => void
) => {
  const alphabet =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const nanoid = customAlphabet(alphabet, 12);
  const contentLibraryContext = useContext(ContentLibraryContext);
  const { t } = useTranslation();
  const { finalObject } = useFinalObject();
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();

  const [mappingObject, setMappingObject] = useState<
    IContentLibraryFieldPops[]
  >([]);

  const [collapseActiveKey, setCollapseActiveKey] = useState<string[]>([]);

  const [headerTitleAndSubtitle, setHeaderTitleAndSubtitle] = useState({
    title: '',
    subtitle: '',
  });

  const creatUpdateNewRecord = useCreatUpdateNewRecord(workspaceId);

  const fieldList = useFieldList('collection', workspaceId, contentModalId);

  const getRecordBYId = useGetRecordListById(
    workspaceId,
    contentModalId,
    contentModalDataId,
    versionId,
    'en-us',
    localStorage.getItem(`${workspaceId}/environmentId`)
  );

  const onCollapseActiveKeyChange = (key) => {
    setCollapseActiveKey(key);
  };

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
      getRecordBYId.data?.contentModelFieldData,
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
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mappingObject: any
  ) => {
    const newArray = [...mappingObject];
    const index = newArray[mainIndex].values.findIndex(
      (item) => item.id === id
    );
    newArray[mainIndex].values.splice(index, 1);
    setMappingObject(newArray);
  };

  const onSaveButtonClick = async () => {
    try {
      const result = await form.validateFields();
      const requestObject = {
        node_type: 'parent',
        contentModelDataId: contentModalDataId,
        contentModelFieldDataId: getRecordBYId?.data?.contentModelFieldData.id,
        contentModalId: contentModalId,
        versionId: versionId,
        template: getRecordBYId.data?.versionData?.template,
        language: 'en-us',
        dynamic_fields_data: finalObject(mappingObject, result, true),
        dynamic_relation_fields: RelationFinalObject(mappingObject, result),
        isForceUpdate: true,
      };
      creatUpdateNewRecord.mutate({ ...requestObject });
    } catch (err) {
      console.error(err);
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

  useEffect(() => {
    if (getRecordBYId.isSuccess) {
      if (fieldList.isSuccess) {
        if (fieldList.data && getRecordBYId.data) {
          setHeaderTitleAndSubtitle({
            title: getRecordBYId.data.contentModelData.title,
            subtitle: getRecordBYId.data.contentModelData.pageSlug,
          });

          const finalObject = fieldMappingFunction(
            fieldList.data,
            getRecordBYId.data?.contentModelFieldData,
            getRecordBYId.data.contentModelData
          );
          setMappingObject(finalObject);
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
    if (creatUpdateNewRecord.isSuccess) {
      contentLibraryContext.ChangeIsFieldDirty({});

      window.document
        .getElementById('page_editor_iframe')
        .contentWindow.contentLibraryCallBack(contentModalDataId);
      onContentLibraryPopupVisibilityChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creatUpdateNewRecord.isSuccess]);

  useEffect(() => {
    if (creatUpdateNewRecord.isError) {
      openNotificationWithIcon('error', 'something went wrong.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creatUpdateNewRecord.isError]);

  return {
    mappingObject,
    headerTitleAndSubtitle,
    collapseActiveKey,
    onCollapseActiveKeyChange,
    addNewComponent,
    deleteNewComponent,
    onSaveButtonClick,
    t,
    saveButtonLoading: creatUpdateNewRecord.isLoading,
  };
};
export default useViewContentInModalController;
