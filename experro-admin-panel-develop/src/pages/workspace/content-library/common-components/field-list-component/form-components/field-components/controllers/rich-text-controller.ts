//@ts-nocheck
import { useCallback, useContext, useEffect, useState } from 'react';
import _ from 'lodash';

import { ContentLibraryContext } from '../../../../../context';
import { useTranslation } from 'react-i18next';
import { IContentLibraryFieldPops } from '../../../../../../../../types';
import { useFieldPermission } from '../controllers';

const useRichTextController = (
  name: string,
  editValue: string,
  defaultValue: string,
  contentModalInternalName: string,
  componentName: string,
  data: IContentLibraryFieldPops
) => {
  const contentLibraryContext = useContext(ContentLibraryContext);
  const [cacheDomain, setCacheDomain] = useState<string>();

  const from = contentLibraryContext?.form;
  const [value, setValue] = useState('');
  const [isFroalaInitialized] = useState(false);
  const [editor] = useState(undefined);
  const { t } = useTranslation();
  const [editorInstance, setEditorInstance] = useState();
  const [isVisible, setIsVisible] = useState(false);

  const { canEditField } = useFieldPermission(
    contentModalInternalName,
    data,
    componentName
  );

  const onRichTextBlurAction = () => {
    const isFieldDirty = contentLibraryContext?.isFieldDirty;
    if (_.isEqual(editValue, from.getFieldValue(name))) {
      isFieldDirty[name] = true;
    } else if (
      editValue === undefined &&
      !from.getFieldValue(name).replace(/<[^>]*>?/gm, '')
    ) {
      isFieldDirty[name] = true;
    } else {
      isFieldDirty[name] = false;
    }
    contentLibraryContext.ChangeIsFieldDirty(isFieldDirty);
  };

  const onChange = (val: string) => {
    setValue(val);
    from.setFieldsValue({ [name]: val });
  };

  const setEditorInstanceValue = useCallback(
    (value) => setEditorInstance(value),
    []
  );

  useEffect(() => {
    const environmentDetails = contentLibraryContext?.environmentList.find(
      (item) => item.type === 'PRODUCTION'
    );
    if (environmentDetails) {
      setCacheDomain(environmentDetails.cacheDomain);
    }
  }, [contentLibraryContext?.environmentList]);

  useEffect(() => {
    if (editorInstance) {
      if (!canEditField) {
        editorInstance?.edit?.off();
      }
    }
  }, [editorInstance, canEditField]);

  useEffect(() => {
    if (isFroalaInitialized) {
      editor?.html.set(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFroalaInitialized]);

  useEffect(() => {
    if (editValue) {
      setValue(editValue);
      from.setFieldsValue({ [name]: editValue });
    } else if (defaultValue) {
      setValue(defaultValue);
      from.setFieldsValue({ [name]: defaultValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editValue, defaultValue]);

  const froalaImageModalVisible = (editorRef) => {
    if (editorRef?.current) {
      editorRef.current.editor.selection.save();
    }
    setIsVisible(true);
  };

  const onImageSelection = (val: string[], editorRef) => {
    if (editorRef.current) {
      editorRef.current.editor.selection.restore();

      const imageList = val.map((item) => {
        return `<img src="https://${cacheDomain}/${item.absolutePath}?height=160"  alt={item.altText ? item.altText : ''} title={item.caption ? item.caption : ''}>`;
      });
      const finalImageList = imageList.join('');
      editorRef.current.editor.html.insert(finalImageList, false);
      onRichTextBlurAction();
    }
  };

  return {
    t,
    value,
    onRichTextBlurAction,
    onChange,
    setEditorInstanceValue,
    froalaImageModalVisible,
    onImageSelection,
    isVisible,
    setIsVisible,
  };
};
export default useRichTextController;
