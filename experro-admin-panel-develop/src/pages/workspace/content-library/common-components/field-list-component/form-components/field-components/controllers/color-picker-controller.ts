import { useContext, useEffect, useState } from 'react';
import { IContentLibraryFieldPops } from '../../../../../../../../types';
import { ContentLibraryContext } from '../../../../../context';
import _ from 'lodash';

const useColorPickerController = (data: IContentLibraryFieldPops) => {
  const contentLibraryContext = useContext(ContentLibraryContext);
  const from = contentLibraryContext?.form;
  const [color, setColor] = useState('');
  const onChangeComplete = (val: { hex: string }) => {
    setColor(val.hex);
    const isFieldDirty = contentLibraryContext?.isFieldDirty;
    if (_.isEqual(data.editValue, val.hex)) {
      //@ts-ignore
      isFieldDirty[data.name] = true;
    } else if (data.editValue === undefined && !val.hex) {
      //@ts-ignore
      isFieldDirty[data.name] = true;
    } else {
      //@ts-ignore
      isFieldDirty[data.name] = false;
    }
    //@ts-ignore
    contentLibraryContext.ChangeIsFieldDirty(isFieldDirty);
  };
  useEffect(() => {
    if (data.editValue) {
      //@ts-ignore
      from.setFieldsValue({ [data.name]: data.editValue });
      //@ts-ignore
      setColor(data.editValue);
    } else {
      setColor('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return { color, onChangeComplete };
};
export default useColorPickerController;
