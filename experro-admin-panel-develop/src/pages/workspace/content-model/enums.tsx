import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import TextIcon from '../../../images/icons/text-icon';
import MediaIcon from '../../../images/icons/media-icon';
import EmailIcon from '../../../images/icons/email-icon';
import BooleanIcon from '../../../images/icons/boolean-icon';
import RichTextIcon from '../../../images/icons/richtext-icon';
import JsonIcon from '../../../images/icons/json-icon';
import PasswordIcon from '../../../images/icons/password-icon';
import RelationIcon from '../../../images/icons/relation-icon';
import SelectIcon from '../../../images/icons/select-icon';
// import UidIcon from '../../../images/icons/uid-icon';
import NumberIcon from '../../../images/icons/number-icon';
import EditorIcon from '../../../images/icons/editor-icon';
import MultiIcon from '../../../images/icons/multi-icon';
import DateIcon from '../../../images/icons/date-icon';
import ComponentIcon from '../../../images/icons/component-icon';
import { FORMFIELD } from '../../../../src/utills/enums';
import RelationHasAndBelongsToOneIcon from '../../../images/icons/relation-has-and-belongs-to-one-icon';
import RelationHasAndBelongsToManyIcon from '../../../images/icons/relation-has-and-belongs-to-many-icon';
import RelationBelongsToManyIcon from '../../../images/icons/relation-belongs-to-many-icon';
import RelationLeftHasManyIcon from '../../../images/icons/relation-left-has-many-icon';
import CurrencyIcon from '../../../images/icons/currency-icon';
import ColorPickerIcon from '../../../images/icons/color-picker-icon';
import ScriptTagIcon from '../../../images/icons/script-tag-icon';
import StyleIcon from '../../../images/icons/style-icon';
import DynamicFieldIcon from '../../../images/icons/dynamic-field-icon';

const useEnums = () => {
  const { t } = useTranslation();

  const CONTENT_FIELD_TYPES = useMemo(
    () => [
      {
        key: 'text',
        icon: <TextIcon />,
        title: t('common.labels.field_text_title'),
        subTitle: t('common.labels.field_text_sub_title'),
        fields: {
          default: [
            FORMFIELD.DEFAULT.FIELD_NAME,
            FORMFIELD.DEFAULT.SHORT_TEXT,
            FORMFIELD.DEFAULT.LONG_TEXT,
            FORMFIELD.DEFAULT.SEARCHABLE,
          ],
          validation: [
            FORMFIELD.VALIDATION.REGEXP_PATTERN,
            FORMFIELD.VALIDATION.REQUIRED_FIELD,
            FORMFIELD.VALIDATION.ENABLE_LOCALIZATION,
            FORMFIELD.VALIDATION.PRIVATE_FIELD,
            FORMFIELD.VALIDATION.MINIMUM_LENGTH,
            FORMFIELD.VALIDATION.MAXIMUM_LENGTH,
          ],
          more: [
            FORMFIELD.MORE.DEFAULT_VALUE,
            FORMFIELD.MORE.HELP_TEXT,
            FORMFIELD.MORE.PLACEHOLDER,
          ],
        },
      },
      {
        key: 'media',
        icon: <MediaIcon />,
        title: t('common.labels.field_media_title'),
        subTitle: t('common.labels.field_media_sub_title'),
        fields: {
          default: [
            FORMFIELD.DEFAULT.FIELD_NAME,
            FORMFIELD.DEFAULT.MULTIPLE_MEDIA,
            FORMFIELD.DEFAULT.SINGLE_MEDIA,
            FORMFIELD.DEFAULT.SINGLE_MEDIA,
          ],
          validation: [
            FORMFIELD.VALIDATION.ATTACHED_FIELD,
            FORMFIELD.VALIDATION.REQUIRED_FIELD,
            FORMFIELD.VALIDATION.PRIVATE_FIELD,
          ],
          more: [FORMFIELD.MORE.HELP_TEXT],
        },
      },
      {
        key: 'email',
        icon: <EmailIcon />,
        title: t('common.labels.field_email_title'),
        subTitle: t('common.labels.field_email_sub_title'),
        fields: {
          default: [FORMFIELD.DEFAULT.FIELD_NAME, FORMFIELD.DEFAULT.SEARCHABLE],
          validation: [
            FORMFIELD.VALIDATION.REQUIRED_FIELD,
            FORMFIELD.VALIDATION.PRIVATE_FIELD,
            FORMFIELD.VALIDATION.MINIMUM_LENGTH,
            FORMFIELD.VALIDATION.MAXIMUM_LENGTH,
          ],
          more: [
            FORMFIELD.MORE.DEFAULT_VALUE,
            FORMFIELD.MORE.HELP_TEXT,
            FORMFIELD.MORE.PLACEHOLDER,
          ],
        },
      },
      {
        key: 'boolean',
        icon: <BooleanIcon />,
        title: t('common.labels.field_boolean_title'),
        subTitle: t('common.labels.field_boolean_sub_title'),
        fields: {
          default: [FORMFIELD.DEFAULT.FIELD_NAME, FORMFIELD.DEFAULT.SEARCHABLE],
          validation: [
            FORMFIELD.VALIDATION.SELECT_DEFAULT_VALUE,
            FORMFIELD.VALIDATION.REQUIRED_FIELD,
            FORMFIELD.VALIDATION.PRIVATE_FIELD,
          ],
          more: [FORMFIELD.MORE.HELP_TEXT],
        },
      },
      {
        key: 'rich-text',
        icon: <RichTextIcon />,
        title: t('common.labels.field_rich_text_title'),
        subTitle: t('common.labels.field_rich_text_sub_title'),
        fields: {
          default: [
            FORMFIELD.DEFAULT.FIELD_NAME,
            FORMFIELD.DEFAULT.SEARCHABLE,
            FORMFIELD.DEFAULT.RICH_TEXT_INLINE,
          ],
          validation: [
            FORMFIELD.VALIDATION.ENABLE_LOCALIZATION,
            FORMFIELD.VALIDATION.REQUIRED_FIELD,
            FORMFIELD.VALIDATION.PRIVATE_FIELD,
          ],
          more: [
            FORMFIELD.MORE.DEFAULT_VALUE,
            FORMFIELD.MORE.HELP_TEXT,
            FORMFIELD.MORE.MIN_HEIGHT,
            FORMFIELD.MORE.MAX_HEIGHT,
          ],
        },
      },
      {
        key: 'json',
        icon: <JsonIcon />,
        title: t('common.labels.field_json_title'),
        subTitle: t('common.labels.field_json_sub_title'),
        fields: {
          default: [FORMFIELD.DEFAULT.FIELD_NAME],
          validation: [
            FORMFIELD.VALIDATION.REQUIRED_FIELD,
            FORMFIELD.VALIDATION.PRIVATE_FIELD,
          ],
          more: [FORMFIELD.MORE.HELP_TEXT],
        },
      },
      {
        key: 'password',
        icon: <PasswordIcon />,
        title: t('common.labels.field_password_title'),
        subTitle: t('common.labels.field_password_sub_title'),
        fields: {
          default: [FORMFIELD.DEFAULT.FIELD_NAME],
          validation: [
            FORMFIELD.VALIDATION.REQUIRED_FIELD,
            FORMFIELD.VALIDATION.PRIVATE_FIELD,
            FORMFIELD.VALIDATION.MINIMUM_LENGTH,
            FORMFIELD.VALIDATION.MAXIMUM_LENGTH,
          ],
          more: [
            FORMFIELD.MORE.DEFAULT_VALUE,
            FORMFIELD.MORE.HELP_TEXT,
            FORMFIELD.MORE.PLACEHOLDER,
          ],
        },
      },
      {
        key: 'relation',
        icon: <RelationIcon />,
        title: t('common.labels.field_relation_title'),
        subTitle: t('common.labels.field_relation_sub_title'),
        fields: {
          base_setting: [
            FORMFIELD.BASE_SETTING.RELATION.FIRST_TITLE,
            FORMFIELD.BASE_SETTING.RELATION.FIRST_FIELD_NAME,
            // 'icon',
            FORMFIELD.BASE_SETTING.RELATION.SECOND_TITLE,
            FORMFIELD.BASE_SETTING.RELATION.SECOND_FIELD_NAME,
          ],
          advanced_setting: [
            FORMFIELD.VALIDATION.PRIVATE_FIELD,
            FORMFIELD.MORE.PLACEHOLDER,
          ],
        },
      },
      {
        key: 'select',
        icon: <SelectIcon />,
        title: t('common.labels.field_select_title'),
        subTitle: t('common.labels.field_select_sub_title'),
        fields: {
          default: [
            FORMFIELD.DEFAULT.FIELD_NAME,
            FORMFIELD.DEFAULT.SEARCHABLE,
            FORMFIELD.DEFAULT.VALUES,
          ],
          validation: [
            FORMFIELD.VALIDATION.DEFAULT_VALUE,
            FORMFIELD.VALIDATION.REQUIRED_FIELD,
            FORMFIELD.VALIDATION.ENABLE_LOCALIZATION,
            FORMFIELD.VALIDATION.PRIVATE_FIELD,
          ],
          more: [FORMFIELD.MORE.HELP_TEXT, FORMFIELD.MORE.PLACEHOLDER],
        },
      },
      {
        key: 'color-picker',
        icon: <ColorPickerIcon />,
        title: t('common.labels.color_picker'),
        subTitle: t('common.labels.color_picker_subtitle'),
        fields: {
          default: [FORMFIELD.DEFAULT.FIELD_NAME],
        },
      },
      // {
      //   key: 'uid',
      //   icon: <UidIcon />,
      //   title: t('common.labels.field_uid_title'),
      //   subTitle: t('common.labels.field_uid_sub_title'),
      //   fields: {
      //     default: [FORMFIELD.DEFAULT.FIELD_NAME, FORMFIELD.DEFAULT.SEARCHABLE],
      //     validation: [
      //       FORMFIELD.VALIDATION.REQUIRED_FIELD,
      //       FORMFIELD.VALIDATION.PRIVATE_FIELD,
      //     ],
      //     more: [
      //       FORMFIELD.MORE.DEFAULT_VALUE,
      //       FORMFIELD.MORE.HELP_TEXT,
      //       FORMFIELD.MORE.PLACEHOLDER,
      //     ],
      //   },
      // },
      {
        key: 'number',
        icon: <NumberIcon />,
        title: t('common.labels.field_number_title'),
        subTitle: t('common.labels.field_number_sub_title'),
        fields: {
          default: [
            FORMFIELD.DEFAULT.FIELD_NAME,
            FORMFIELD.DEFAULT.SEARCHABLE,
            FORMFIELD.DEFAULT.NUMBER_FORMAT,
          ],
          validation: [
            FORMFIELD.VALIDATION.REQUIRED_FIELD,
            FORMFIELD.VALIDATION.PRIVATE_FIELD,
            FORMFIELD.VALIDATION.MINIMUM_LENGTH,
            FORMFIELD.VALIDATION.MAXIMUM_LENGTH,
          ],
          more: [
            FORMFIELD.MORE.DEFAULT_VALUE,
            FORMFIELD.MORE.HELP_TEXT,
            FORMFIELD.MORE.PLACEHOLDER,
          ],
        },
      },
      {
        key: 'script',
        icon: <ScriptTagIcon />,
        title: t('common.labels.script'),
        subTitle: t('common.labels.script_subtitle'),
        fields: {
          default: [
            FORMFIELD.DEFAULT.FIELD_NAME,
            FORMFIELD.DEFAULT.SCRIPT_POSITION,
            FORMFIELD.DEFAULT.ENABLE_SSR,
          ],
        },
      },
      {
        key: 'multi-select',
        icon: <MultiIcon />,
        title: t('common.labels.field_multi_select_title'),
        subTitle: t('common.labels.field_multi_select_sub_title'),
        fields: {
          default: [
            FORMFIELD.DEFAULT.FIELD_NAME,
            FORMFIELD.DEFAULT.SEARCHABLE,
            FORMFIELD.DEFAULT.VALUES,
          ],
          validation: [
            FORMFIELD.VALIDATION.DEFAULT_VALUE,
            FORMFIELD.VALIDATION.REQUIRED_FIELD,
            FORMFIELD.VALIDATION.ENABLE_LOCALIZATION,
            FORMFIELD.VALIDATION.PRIVATE_FIELD,
          ],
          more: [FORMFIELD.MORE.HELP_TEXT, FORMFIELD.MORE.PLACEHOLDER],
        },
      },
      {
        key: 'date',
        icon: <DateIcon />,
        title: t('common.labels.field_date_title'),
        subTitle: t('common.labels.field_date_sub_title'),
        fields: {
          default: [
            FORMFIELD.DEFAULT.FIELD_NAME,
            FORMFIELD.DEFAULT.SEARCHABLE,
            FORMFIELD.DEFAULT.TYPE,
          ],
          validation: [
            FORMFIELD.VALIDATION.REQUIRED_FIELD,
            FORMFIELD.VALIDATION.PRIVATE_FIELD,
          ],
          more: [FORMFIELD.MORE.HELP_TEXT],
        },
      },
      {
        key: 'component',
        icon: <ComponentIcon />,
        title: t('common.labels.field_component_title'),
        subTitle: t('common.labels.field_component_sub_title'),
        fields: {
          base_setting: ['create_new_components', 'use_existing_components'],
          advanced_setting: [FORMFIELD.VALIDATION.REQUIRED_FIELD],
        },
      },
      {
        key: 'currency',
        icon: <CurrencyIcon />,
        title: t('common.labels.field_currency_title'),
        subTitle: t('common.labels.field_currency_subtitle'),
        fields: {
          default: [FORMFIELD.DEFAULT.FIELD_NAME, FORMFIELD.DEFAULT.SEARCHABLE],
          validation: [
            FORMFIELD.VALIDATION.REQUIRED_FIELD,
            FORMFIELD.VALIDATION.PRIVATE_FIELD,
          ],
          more: [
            FORMFIELD.MORE.DEFAULT_VALUE,
            FORMFIELD.MORE.HELP_TEXT,
            FORMFIELD.MORE.PLACEHOLDER,
          ],
        },
      },

      {
        key: 'style',
        icon: <StyleIcon />,
        title: t('common.labels.style'),
        subTitle: t('common.labels.style_subtitle'),
        fields: {
          default: [FORMFIELD.DEFAULT.FIELD_NAME],
        },
      },
      {
        key: 'page-editor',
        icon: <EditorIcon />,
        title: t('common.labels.field_page_editor_title'),
        subTitle: t('common.labels.field_page_editor_sub_title'),
        fields: {
          default: [FORMFIELD.DEFAULT.FIELD_NAME],
        },
      },
      {
        key: 'link-record',
        icon: <DynamicFieldIcon />,
        title: t('common.labels.dynamic_field_title'),
        subTitle: t('common.labels.dynamic_field_subtitle'),
        fields: {
          default: [
            FORMFIELD.DEFAULT.FIELD_NAME,
            FORMFIELD.DEFAULT.CONTENT_MODEL_LIST,
          ],
          validation: [
            FORMFIELD.VALIDATION.REQUIRED_FIELD,
            FORMFIELD.VALIDATION.PRIVATE_FIELD,
            FORMFIELD.VALIDATION.MULTIPLE_RECORDS_SELECT,
          ],
          more: [FORMFIELD.MORE.HELP_TEXT],
        },
      },
    ],
    [t]
  );

  const RELATIONS = useMemo(
    () => [
      {
        key: 'oneToOne',
        icon: <RelationHasAndBelongsToOneIcon />,
        label: t('common.labels.has_one'),
      },
      {
        key: 'oneToMany',
        icon: <RelationHasAndBelongsToManyIcon />,
        label: t('common.labels.has_one'),
      },
      {
        key: 'manyToOne',
        icon: <RelationBelongsToManyIcon />,
        label: t('common.labels.has_one'),
      },
      {
        key: 'manyToMany',
        icon: <RelationLeftHasManyIcon />,
        label: t('common.labels.has_one'),
      },
    ],
    [t]
  );

  return {
    CONTENT_FIELD_TYPES,
    RELATIONS,
  };
};
export default useEnums;
