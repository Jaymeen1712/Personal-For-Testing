//@ts-nocheck
import { useHistory, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { customAlphabet } from 'nanoid';
import { ContentLibraryContext } from '../../../../../context';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const nanoid = customAlphabet(alphabet, 12);

const useRelationController = (
  internalName: string,
  relationType: string,
  editValue?: string,
  recordList?: []
) => {
  const contentLibraryContext = useContext(ContentLibraryContext);
  const form = contentLibraryContext?.form;
  const { t } = useTranslation();

  const [urlData, setUrlData] = useState('');
  const [multiSelectUrl, setMultiSelectUrl] = useState<string[] | string>([]);
  const [isSeeMoreButtonEnabled, setIsSeeMoreButtonEnabled] =
    useState<boolean>();
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();
  const history = useHistory();

  const onRelationDetailClick = () => {
    if (urlData) {
      if (!Object.values(contentLibraryContext?.isFieldDirty).includes(false)) {
        history.push(
          `/workspaces/${workspaceId}/content-library/${urlData.contentModalType}-type/${urlData.contentModalId}/field/${urlData.id}/version/${urlData.currentVersionId}/language/en-us`
        );
      } else {
        contentLibraryContext?.changeWarningPopupVisible({
          version: false,
          sidebar: false,
          relation: true,
          refresh: false,
          goBack: false,
        });
        contentLibraryContext?.changeRelationUrl(
          `/workspaces/${workspaceId}/content-library/${urlData.contentModalType}-type/${urlData.contentModalId}/field/${urlData.id}/version/${urlData.currentVersionId}/language/en-us`
        );
      }
    }
  };

  const onChange = (val: string) => {
    if (typeof val === 'object') {
      const result = recordList?.find((item) => item.id === val[0]);
      if (result) {
        setUrlData({
          id: result.id,
          name: result.title,
          currentVersionId: result.currentVersionId,
          contentModalId: result.contentModelId,
          contentModalType: result.type,
        });
      }
    } else {
      const result = recordList?.find((item) => item.id === val);
      if (result) {
        setUrlData({
          id: result.id,
          name: result.title,
          currentVersionId: result.currentVersionId,
          contentModalId: result.contentModelId,
          contentModalType: result.type,
        });
      }
    }
  };

  const onMultipleSelectChange = (val: string[]) => {
    const tempObject = [];
    for (let i = 0; i < val.length; i++) {
      const result = tempObject.find((item) => item.id === val[i]);
      if (result) {
      } else {
        const result = recordList?.find((item) => item.id === val[i]);
        if (result) {
          tempObject.push({
            id: result.id,
            name: result.title,
            currentVersionId: result.currentVersionId,
            contentModalId: result.contentModelId,
            contentModalType: result.type,
          });
        }
      }
    }
    setMultiSelectUrl(tempObject);
  };

  const multiSelectDetailClick = (val: string) => {
    if (val) {
      if (!Object.values(contentLibraryContext?.isFieldDirty).includes(false)) {
        history.push(
          `/workspaces/${workspaceId}/content-library/${val.contentModalType}-type/${val.contentModalId}/field/${val.id}/version/${val.currentVersionId}/language/en-us`
        );
      } else {
        contentLibraryContext?.changeRelationUrl(
          `/workspaces/${workspaceId}/content-library/${val.contentModalType}-type/${val.contentModalId}/field/${val.id}/version/${val.currentVersionId}/language/en-us`
        );
        contentLibraryContext?.changeWarningPopupVisible({
          version: false,
          sidebar: false,
          relation: true,
          refresh: false,
          goBack: false,
        });
      }
    }
  };

  const onMultiSelectBlurAction = (
    value: string[],
    editValue?: string | string[],
    name?: string
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

  const onDeleteClick = (index: number, name: string) => {
    const arrayOfId = [];
    const tempArray = [...multiSelectUrl];
    tempArray.splice(index, 1);
    for (let i = 0; i < tempArray.length; i++) {
      arrayOfId.push(tempArray[i].id);
    }
    onMultiSelectBlurAction(tempArray, editValue, name);
    setMultiSelectUrl([...tempArray]);
    form.setFieldsValue({
      [name]: arrayOfId,
    });
  };

  const onSeeMoreButtonClick = () => {
    setIsSeeMoreButtonEnabled(!isSeeMoreButtonEnabled);
  };

  useEffect(() => {
    if (relationType === 'oneToOne' || relationType === 'oneToMany') {
      if (editValue) {
        onChange(editValue);
        const result = recordList?.find((item) => item.id === editValue[0]);
        if (result) {
          form.setFieldsValue({ [internalName]: editValue });
        }
        setMultiSelectUrl([]);
      } else {
        setUrlData('');
      }
    } else {
      if (editValue) {
        onMultipleSelectChange(editValue);
        form.setFieldsValue({ [internalName]: editValue });
        setUrlData('');
      } else {
        setMultiSelectUrl([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editValue]);

  return {
    onRelationDetailClick,
    onChange,
    urlData,
    onMultipleSelectChange,
    multiSelectUrl,
    multiSelectDetailClick,
    nanoid,
    onDeleteClick,
    t,
    isSeeMoreButtonEnabled,
    onSeeMoreButtonClick,
  };
};
export default useRelationController;
