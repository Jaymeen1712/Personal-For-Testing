//@ts-nocheck
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { customAlphabet } from 'nanoid';

import { ContentLibraryContext } from '../../../../../context';
import { IContentLibraryFieldPops } from '../../../../../../../../types';
import _ from 'lodash';

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 12);

const useJosnController = (data: IContentLibraryFieldPops) => {
  const contentLibraryContext = useContext(ContentLibraryContext);
  const { t } = useTranslation();
  const from = contentLibraryContext?.form;

  const [value, setValue] = useState('');
  const onChange = (val: string) => {
    setValue(val);
    from.setFieldsValue({ [data.name]: val });
  };

  const onBlurAction = () => {
    const isFieldDirty = contentLibraryContext?.isFieldDirty;
    if (_.isEqual(data.editValue, value)) {
      isFieldDirty[data.name] = true;
    } else if (data.editValue === undefined && !value) {
      isFieldDirty[data.name] = true;
    } else {
      isFieldDirty[data.name] = false;
    }
    contentLibraryContext.ChangeIsFieldDirty(isFieldDirty);
  };

  useEffect(() => {
    if (data.editValue) {
      from.setFieldsValue({ [data.name]: JSON.stringify(data.editValue) });
      setValue(JSON.stringify(data.editValue));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return { t, nanoid, value, onChange, onBlurAction };
};

export default useJosnController;
