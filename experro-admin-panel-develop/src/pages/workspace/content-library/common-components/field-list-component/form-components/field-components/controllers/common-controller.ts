//@ts-nocheck

import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { customAlphabet } from 'nanoid';
import _ from 'lodash';

import { ContentLibraryContext } from '../../../../../context';
import moment from 'moment/moment';
import { convertUtcToCurrentTimeZone } from '../../../../../../../../utills';

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 16);

const CommonController = () => {
  const contentLibraryContext = useContext(ContentLibraryContext);
  const { t } = useTranslation();

  const onBlurAction = (e, editValue?: string | string[]) => {
    const isFieldDirty = contentLibraryContext?.isFieldDirty;
    if (_.isEqual(editValue, e.target.value)) {
      isFieldDirty[e.target.id] = true;
    } else if (editValue === undefined && !e.target.value) {
      isFieldDirty[e.target.id] = true;
    } else {
      isFieldDirty[e.target.id] = false;
    }
    contentLibraryContext.ChangeIsFieldDirty(isFieldDirty);
  };

  const onBooleanBlurAction = (e, editValue?: string | string[]) => {
    const isFieldDirty = contentLibraryContext?.isFieldDirty;
    if (_.isEqual(editValue?.toString(), e.target.value.toString())) {
      isFieldDirty[e.target.id] = true;
    } else {
      isFieldDirty[e.target.id] = false;
    }
    contentLibraryContext.ChangeIsFieldDirty(isFieldDirty);
  };

  const onDateBlurAction = (e, editValue?: string | string[]) => {
    const isFieldDirty = contentLibraryContext?.isFieldDirty;
    if (
      e.target.id.split('/').shift().endsWith('_eds') ||
      e.target.id.split('/').shift().endsWith('_edsi')
    ) {
      if (
        moment(moment(e.target.value).format('YYYY-MM-DD')).isSame(
          moment(editValue).format('YYYY-MM-DD')
        )
      ) {
        isFieldDirty[e.target.id] = true;
      } else {
        isFieldDirty[e.target.id] = false;
      }
    } else if (
      e.target.id.split('/').shift().endsWith('_ets') ||
      e.target.id.split('/').shift().endsWith('_etsi')
    ) {
      if (
        moment(
          moment(e.target.value, 'HH:mm:ss a').format('YYYY-MM-DDTHH:mm:ss')
        ).isSame(moment(editValue, 'HH:mm:ss a').format('YYYY-MM-DDTHH:mm:ss'))
      ) {
        isFieldDirty[e.target.id] = true;
      } else {
        isFieldDirty[e.target.id] = false;
      }
    } else {
      if (
        moment(moment(e.target.value, 'YYYY-MM-DDThh:mm:ss')).isSame(
          moment(convertUtcToCurrentTimeZone(editValue), 'YYYY-MM-DDThh:mm:ss')
        )
      ) {
        isFieldDirty[e.target.id] = true;
      } else {
        isFieldDirty[e.target.id] = false;
      }
    }
    contentLibraryContext.ChangeIsFieldDirty(isFieldDirty);
  };

  const onNumberBlurAction = (e, editValue?: string | string[]) => {
    const isFieldDirty = contentLibraryContext?.isFieldDirty;
    if (_.isEqual(editValue?.toString(), e.target.value.toString())) {
      isFieldDirty[e.target.id] = true;
    } else if (editValue === undefined && !e.target.value) {
      isFieldDirty[e.target.id] = true;
    } else {
      isFieldDirty[e.target.id] = false;
    }
    contentLibraryContext.ChangeIsFieldDirty(isFieldDirty);
  };

  const onSelectBlurAction = (value, editValue?: string | string[], name) => {
    const isFieldDirty = contentLibraryContext?.isFieldDirty;
    if (_.isEqual(editValue, value)) {
      isFieldDirty[name] = true;
    } else {
      isFieldDirty[name] = false;
    }
    contentLibraryContext.ChangeIsFieldDirty(isFieldDirty);
  };

  const onRelationBlurAction = (value, editValue?: string | string[], name) => {
    const isFieldDirty = contentLibraryContext?.isFieldDirty;
    if (_.isEqual(editValue && editValue[0], value)) {
      isFieldDirty[name] = true;
    } else {
      isFieldDirty[name] = false;
    }
    contentLibraryContext.ChangeIsFieldDirty(isFieldDirty);
  };

  const onMultiSelectBlurAction = (
    value,
    editValue?: string | string[],
    name
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

  const onScriptTagBlurAction = (
    value: string,
    editValue?: string | string[],
    name
  ) => {
    const isFieldDirty = contentLibraryContext?.isFieldDirty;
    if (_.isEqual(editValue, value)) {
      isFieldDirty[name] = true;
    } else if (editValue === undefined && !value) {
      isFieldDirty[name] = true;
    } else {
      isFieldDirty[name] = false;
    }
    contentLibraryContext.ChangeIsFieldDirty(isFieldDirty);
  };

  return {
    language: contentLibraryContext?.newRecordFieldDetails?.language,
    t,
    nanoid,
    onBlurAction,
    onBooleanBlurAction,
    onDateBlurAction,
    onNumberBlurAction,
    onSelectBlurAction,
    onMultiSelectBlurAction,
    onRelationBlurAction,
    onScriptTagBlurAction,
  };
};
export default CommonController;
