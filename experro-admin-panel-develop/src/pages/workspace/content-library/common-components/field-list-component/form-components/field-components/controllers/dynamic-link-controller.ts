import { useEffect, useState, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';

import {
  ContentModelList,
  IContentLibraryFieldPops,
  IWorkspaceParams,
  ListRecordResponse,
} from '../../../../../../../../types';
import {
  useGetModelListPublicApi,
  useGetRecordListPublicApi,
  useGetContentModelData,
} from '../../../../../services';
import { ContentLibraryContext } from '../../../../../context';
import shapeCollection from '../../../../../../../../utills/convert-request-response';
import _ from 'lodash';

const useDynamicLinkController = (data: IContentLibraryFieldPops) => {
  const contentLibraryContext = useContext(ContentLibraryContext);
  const { t } = useTranslation();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const inputRef = useRef(null);

  const form = contentLibraryContext?.form;

  const [contentModalDetailObject, setContentModalDetailObject] = useState<{
    [k: string]: string;
  }>({});
  const [contentModalList, setContentModalList] = useState<ContentModelList[]>(
    []
  );
  const [recordList, setRecordList] = useState<ListRecordResponse[]>([]);
  const [selectContentModal, setSelectContentModal] = useState<string>('');
  const [isSelectRecordModalOpen, setIsSelectRecordModalOpen] =
    useState<boolean>(false);
  const [selectedRecordList, setSelectedRecordList] = useState<
    {
      contentModalId: string;
      contentModalName: string;
      records: { id: string; name?: string }[];
    }[]
  >([]);
  const [searchData, setSearchData] = useState('');

  const [finalList, setFinalList] = useState<
    {
      contentModalId: string;
      contentModelDataId: string[];
    }[]
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // const [isSeeMoreEnabled, setIsSeeMoreEnabled] = useState<boolean>(true);

  const [copyRecordList, setCopyRecordList] = useState<ListRecordResponse[]>(
    []
  );

  const [copySelectedRecordList, setCopySelectedRecordList] = useState<
    {
      contentModalId: string;
      contentModalName: string;
      records: { id: string; name?: string }[];
    }[]
  >([]);

  const [copyFinalList, setCopyFinalList] = useState<
    {
      contentModalId: string;
      contentModelDataId: string[];
    }[]
  >([]);

  const [totalSelectedRecordCount, setTotalSelectedRecordCount] = useState(0);

  const [copyTotalSelectedRecordCount, setCopyTotalSelectedRecordCount] =
    useState(0);

  const getContentModalListPublicApi = useGetModelListPublicApi(workspaceId);

  const getRecordListPublicApi = useGetRecordListPublicApi(
    workspaceId,
    selectContentModal,
    1,
    100,
    searchData
  );

  const getContentModelData = useGetContentModelData(workspaceId);

  const selectRecordModalOpenChange = (val: boolean) => {
    setIsSelectRecordModalOpen(val);
  };

  const dirtyCheck = (
    value: {
      contentModalId: string;
      contentModelDataId: string[];
    }[]
  ) => {
    const convertedValue = shapeCollection(
      data.editValue,
      false,
      'snackCaseToCamel'
    );
    const isFieldDirty = contentLibraryContext?.isFieldDirty;
    if (_.isEqual(convertedValue, value)) {
      //@ts-ignore
      isFieldDirty[data.name] = true;
    } else if (convertedValue === undefined && !value) {
      //@ts-ignore
      isFieldDirty[data.name] = true;
    } else {
      //@ts-ignore
      isFieldDirty[data.name] = false;
    }
    //@ts-ignore
    contentLibraryContext.ChangeIsFieldDirty(isFieldDirty);
  };

  const onModalCancelButtonClick = () => {
    setRecordList(JSON.parse(JSON.stringify(copyRecordList)));
    setCopySelectedRecordList(JSON.parse(JSON.stringify(selectedRecordList)));
    setCopyFinalList(JSON.parse(JSON.stringify(finalList)));
    setIsSelectRecordModalOpen(false);
  };

  const onModalSaveButtonClick = () => {
    // const count = 0;
    setCopyRecordList(JSON.parse(JSON.stringify(recordList)));
    setSelectedRecordList(JSON.parse(JSON.stringify(copySelectedRecordList)));
    setFinalList(JSON.parse(JSON.stringify(copyFinalList)));
    setIsSelectRecordModalOpen(false);
    //@ts-ignore
    form.setFieldsValue({ [data.name]: copyFinalList });
    setTotalSelectedRecordCount(copyTotalSelectedRecordCount);
    dirtyCheck(copyFinalList);
  };

  const onSelectContentModalChange = (val: string) => {
    setSearchData('');
    //@ts-ignore
    inputRef.current.value = '';
    setSelectContentModal(val);
    getRecordListPublicApi.remove();
  };

  const changeInSelectRecordState = (recordId: string) => {
    const tempRecordListData = [...recordList];
    const findRecordIndex = tempRecordListData.findIndex(
      (item) => item.id === recordId
    );
    if (data.fieldProperties.validation?.includes('multiple_records_select')) {
      if (findRecordIndex !== -1) {
        tempRecordListData[findRecordIndex].isSelected =
          !tempRecordListData[findRecordIndex].isSelected;
      }
    } else {
      for (let i = 0; i < tempRecordListData.length; i++) {
        if (tempRecordListData[i].id === recordId) {
          tempRecordListData[i].isSelected = !tempRecordListData[i].isSelected;
        } else {
          tempRecordListData[i].isSelected = false;
        }
      }
    }

    setRecordList([...tempRecordListData]);
  };

  const onRecordClick = (record: { id: string; name?: string }) => {
    let count = 0;
    let tempData = [...copySelectedRecordList];
    let finalData = [...copyFinalList];
    const isContentModalAvailable = copySelectedRecordList?.findIndex(
      (item) => item.contentModalId === selectContentModal
    );

    if (data.fieldProperties.validation?.includes('multiple_records_select')) {
      if (isContentModalAvailable !== -1) {
        const isRecordAvailable = copySelectedRecordList[
          isContentModalAvailable
        ]?.records?.findIndex((item) => item.id === record.id);
        if (isRecordAvailable !== -1) {
          tempData[isContentModalAvailable].records.splice(
            isRecordAvailable,
            1
          );
          finalData[isContentModalAvailable].contentModelDataId.splice(
            isRecordAvailable,
            1
          );
          if (tempData[isContentModalAvailable].records.length === 0) {
            tempData.splice(isContentModalAvailable, 1);
            finalData.splice(isContentModalAvailable, 1);
          }
        } else {
          tempData[isContentModalAvailable].records.push(record);
          finalData[isContentModalAvailable].contentModelDataId.push(record.id);
        }
      } else {
        tempData.push({
          contentModalId: selectContentModal,
          contentModalName: contentModalDetailObject[selectContentModal],
          records: [record],
        });
        finalData.push({
          contentModalId: selectContentModal,
          contentModelDataId: [record.id],
        });
      }
    } else {
      if (isContentModalAvailable !== -1) {
        const isRecordAvailable = copySelectedRecordList[
          isContentModalAvailable
        ]?.records?.findIndex((item) => item.id === record.id);
        if (isRecordAvailable !== -1) {
          tempData = [];
          finalData = [];
        } else {
          tempData = [
            {
              contentModalId: selectContentModal,
              contentModalName: contentModalDetailObject[selectContentModal],
              records: [record],
            },
          ];
          finalData = [
            {
              contentModalId: selectContentModal,
              contentModelDataId: [record.id],
            },
          ];
        }
      } else {
        tempData = [
          {
            contentModalId: selectContentModal,
            contentModalName: contentModalDetailObject[selectContentModal],
            records: [record],
          },
        ];
        finalData = [
          {
            contentModalId: selectContentModal,
            contentModelDataId: [record.id],
          },
        ];
      }
    }
    if (tempData.length > 0) {
      for (let i = 0; i < tempData.length; i++) {
        if (tempData[i].records.length > 0) {
          count += tempData[i].records.length;
        }
      }
    }
    setCopyTotalSelectedRecordCount(count);
    setCopySelectedRecordList(JSON.parse(JSON.stringify(tempData)));
    setCopyFinalList(JSON.parse(JSON.stringify(finalData)));
    changeInSelectRecordState(record.id);
  };

  const onDeleteRecordClick = (
    contentModalIndex: number,
    recordIndex: number
  ) => {
    const tempData = [...selectedRecordList];
    const finalData = [...finalList];
    changeInSelectRecordState(
      tempData[contentModalIndex].records[recordIndex].id
    );
    tempData[contentModalIndex].records.splice(recordIndex, 1);
    finalData[contentModalIndex].contentModelDataId.splice(recordIndex, 1);
    if (tempData[contentModalIndex].records.length === 0) {
      tempData.splice(contentModalIndex, 1);
      finalData.splice(contentModalIndex, 1);
    }
    //@ts-ignore
    form.setFieldsValue({ [data.name]: finalData });
    setFinalList(JSON.parse(JSON.stringify(finalData)));
    setSelectedRecordList(JSON.parse(JSON.stringify(tempData)));
    setCopyFinalList(JSON.parse(JSON.stringify(finalData)));
    setCopySelectedRecordList(JSON.parse(JSON.stringify(tempData)));
    setCopyRecordList(JSON.parse(JSON.stringify(recordList)));
    setTotalSelectedRecordCount(totalSelectedRecordCount - 1);
    setCopyTotalSelectedRecordCount(copyTotalSelectedRecordCount - 1);
    dirtyCheck(finalData);
  };

  const onSearchChange = debounce((value: string) => {
    setSearchData(value.trim());
    getRecordListPublicApi.remove();
  }, 500);

  useEffect(() => {
    if (getContentModalListPublicApi.isSuccess) {
      if (getContentModalListPublicApi.data.length > 0) {
        const tempArray = [];
        const tempObject: { [k: string]: string } = {};
        for (let i = 0; i < getContentModalListPublicApi.data.length; i++) {
          if (
            data.fieldProperties.selectModels?.includes(
              getContentModalListPublicApi.data[i].id
            )
          ) {
            tempObject[getContentModalListPublicApi.data[i].id] =
              getContentModalListPublicApi.data[i].name;
            tempArray.push(getContentModalListPublicApi.data[i]);
          }
        }
        setContentModalDetailObject(tempObject);
        setContentModalList(tempArray);
        setSelectContentModal(tempArray[0].id);
        getRecordListPublicApi.remove();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getContentModalListPublicApi.isSuccess]);

  useEffect(() => {
    if (getRecordListPublicApi.isSuccess) {
      if (getRecordListPublicApi.data.length > 0) {
        const isContentModalAvailable = copySelectedRecordList?.find(
          (item) => item.contentModalId === selectContentModal
        );
        if (isContentModalAvailable?.contentModalName) {
          for (let i = 0; isContentModalAvailable?.records.length > i; i++) {
            const findIndex = getRecordListPublicApi.data.findIndex(
              (item) => item.id === isContentModalAvailable?.records[i].id
            );
            if (findIndex !== -1) {
              getRecordListPublicApi.data[findIndex]['isSelected'] = true;
            }
          }
        }
        setRecordList([...getRecordListPublicApi.data]);
        setCopyRecordList(
          JSON.parse(JSON.stringify(getRecordListPublicApi.data))
        );
        // if (!data.editValue || data.editValue.length === 0) {
        setIsLoading(false);
        // }
      } else {
        setRecordList([]);
        setCopyRecordList([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getRecordListPublicApi.isSuccess, data.editValue]);

  useEffect(() => {
    if (getContentModelData.isSuccess) {
      if (
        getContentModelData.data.items &&
        Object.keys(contentModalDetailObject).length > 0 &&
        getContentModelData.data.items.length > 0
      ) {
        setTotalSelectedRecordCount(getContentModelData.data.items.length);
        setCopyTotalSelectedRecordCount(getContentModelData.data.items.length);
        const convertedData = shapeCollection(
          data.editValue,
          false,
          'snackCaseToCamel'
        );
        const tempArray: {
          contentModalId: string;
          contentModalName: string;
          records: { id: string; name?: string }[];
        }[] = [];
        //@ts-ignore
        for (let i = 0; i < convertedData.length; i++) {
          const tempContentModalData = [];
          //@ts-ignore
          for (let j = 0; j < convertedData[i].contentModelDataId.length; j++) {
            const findRecordDetails = getContentModelData.data.items.find(
              //@ts-ignore
              (item) => item.id === convertedData[i].contentModelDataId[j]
            );
            if (findRecordDetails) {
              tempContentModalData.push({
                id: findRecordDetails.id,
                name: findRecordDetails.title,
              });
            }
          }
          //@ts-ignore
          tempArray.push({
            //@ts-ignore
            contentModalId: convertedData[i].contentModalId,
            contentModalName:
              //@ts-ignore
              contentModalDetailObject[convertedData[i].contentModalId],
            records: tempContentModalData,
          });
        }

        setSelectedRecordList([...tempArray]);
        //@ts-ignore
        setFinalList([...convertedData]);
        //@ts-ignore
        setCopyFinalList(JSON.parse(JSON.stringify(convertedData)));
        setCopySelectedRecordList(JSON.parse(JSON.stringify(tempArray)));
        setIsLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getContentModelData.isSuccess, contentModalDetailObject, data.editValue]);

  useEffect(() => {
    if (getContentModelData.isError) {
      console.log(getContentModelData.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getContentModelData.isError]);

  useEffect(() => {
    if (data.editValue) {
      getContentModelData.mutate({
        //@ts-ignore
        contentModelData: data.editValue,
      });
      // @ts-ignore
      form.setFieldsValue({ [data.name]: data.editValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.editValue]);

  return {
    t,
    contentModalList,
    isSelectRecordModalOpen,
    selectRecordModalOpenChange,
    selectContentModal,
    onSelectContentModalChange,
    recordList,
    isRecordListLoading:
      getRecordListPublicApi.isLoading || getRecordListPublicApi.isFetching,
    onRecordClick,
    selectedRecordList,
    onDeleteRecordClick,
    onSearchChange,
    inputRef,
    isLoading,
    // isSeeMoreEnabled,
    onModalCancelButtonClick,
    onModalSaveButtonClick,
    totalSelectedRecordCount,
    copyTotalSelectedRecordCount,
  };
};
export default useDynamicLinkController;
