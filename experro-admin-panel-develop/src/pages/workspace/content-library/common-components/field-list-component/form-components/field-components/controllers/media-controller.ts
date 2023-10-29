//@ts-nocheck
import {useParams} from 'react-router-dom';
import {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {ContentLibraryContext} from '../../../../../context';
import {IContentLibraryFieldPops} from '../../../../../../../../types';
import {customAlphabet} from 'nanoid';
import _ from 'lodash';
import {onSubSidebarCollapse} from '../../../../../../../../utills';

const useMediaController = (
  data: IContentLibraryFieldPops,
  isViewContentInPopupOpen?: boolean
) => {
  const contentLibraryContext = useContext(ContentLibraryContext);
  const from = contentLibraryContext?.form;
  const {t} = useTranslation();

  const alphabet =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const nanoid = customAlphabet(alphabet, 12);

  const {workspaceId} = useParams<{
    workspaceId: string;
  }>();
  const [isVisible, setIsVisible] = useState(false);
  const [imageList, setImageList] = useState<ISelectedFiles[]>([]);
  const [cacheDomain, setCacheDomain] = useState<string>();

  const changeIsVisible = (val: boolean) => {
    if (isViewContentInPopupOpen) {
      if (val) {
        onSubSidebarCollapse(false);
      } else {
        onSubSidebarCollapse(true);
      }
    } else {
      onSubSidebarCollapse(false);
    }
    setIsVisible(val);
  };

  const onMultiSelectBlurAction = (
    value: string[],
    editValue?: string | string[],
    name?: string
  ) => {
    const isFieldDirty = contentLibraryContext?.isFieldDirty;
    if (_.isEqual(editValue, value)) {
      isFieldDirty[name] = true;
    } else if (editValue === undefined && value.length <= 0) {
      isFieldDirty[name] = true;
    } else {
      isFieldDirty[name] = false;
    }
    contentLibraryContext.ChangeIsFieldDirty(isFieldDirty);
  };

  const changeImageList = (val?: IFile[]) => {
    if (data.fieldProperties.mediaRadioButton === 'multipleMedia') {
      const newImageList = val.map((item) => {
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
      const arr = [...imageList, ...newImageList];
      setImageList(arr);
      onMultiSelectBlurAction(arr, data.editValue, data.name);
      const stringifyArray = arr.map((item) => {
        return JSON.stringify(item);
      });
      from.setFieldsValue({[data.name]: stringifyArray});
    } else {
      const {id, publicUrl, type, name, altText, absolutePath, caption} =
        val[0];
      setImageList([
        {id, publicUrl, type, name, altText, absolutePath, caption},
      ]);

      from.setFieldsValue({
        [data.name]: [
          JSON.stringify({
            id,
            publicUrl,
            type,
            name,
            altText,
            absolutePath,
            caption,
          }),
        ],
      });
    }
  };

  const deleteImages = (val: number) => {
    const arr = [...imageList];
    arr.splice(val, 1);
    setImageList(arr);
    onMultiSelectBlurAction(arr, data.editValue, data.name);
    const stringifyArray = arr.map((item) => {
      return JSON.stringify(item);
    });
    from.setFieldsValue({ [data.name]: stringifyArray });
  };

  const onCancel = () => {
    if (isViewContentInPopupOpen) {
      onSubSidebarCollapse(true);
    } else {
      onSubSidebarCollapse(false);
    }
    setIsVisible(false);
  };

  const onMediaSelectAction = (
    value?: IFile[],
    name?: string,
    editValue?: string | string[]
  ) => {
    const isFieldDirty = contentLibraryContext?.isFieldDirty;
    if (_.isEqual(editValue && editValue.sort(), value.sort())) {
      isFieldDirty[name] = true;
    } else if (editValue === undefined && value.length <= 0) {
      isFieldDirty[name] = true;
    } else {
      isFieldDirty[name] = false;
    }
    contentLibraryContext.ChangeIsFieldDirty(isFieldDirty);
  };

  useEffect(() => {
    if (data.editValue) {
      try {
        const newImageList = data.editValue.map((item) => {
          return JSON.parse(item);
        });
        setImageList(newImageList);
        from.setFieldsValue({[data.name]: data.editValue});
      } catch (err) {
        setImageList(data.editValue);
        from.setFieldsValue({[data.name]: data.editValue});
      }
    } else {
      setImageList([]);
      from.resetFields([data.name]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.editValue]);

  useEffect(() => {
    const environmentDetails = contentLibraryContext?.environmentList.find(
      (item) => item.type === 'PRODUCTION'
    );
    if (environmentDetails) {
      setCacheDomain(environmentDetails.cacheDomain);
    }
  }, [contentLibraryContext?.environmentList]);

  return {
    workspaceId,
    isVisible,
    changeIsVisible,
    imageList,
    changeImageList,
    deleteImages,
    t,
    onCancel,
    nanoid,
    onMediaSelectAction,
    cacheDomain,
  };
};
export default useMediaController;
