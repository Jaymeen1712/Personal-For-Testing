import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd';
import { useParams } from 'react-router-dom';

import useEnums from '../enums';
import { FormFieldValues } from '../../../../types';
import {
  generateInternalFieldName,
  openNotificationWithIcon,
} from '../../../../utills';
import {
  useCreateComponentField,
  useGetComponentFieldById,
  useUpdateComponentField,
} from '../services/components';
import {
  useCreateField,
  useUpdateField,
  useGetFieldById,
} from '../services/models';
import useError from '../../../../hooks/error';
import queryClient from '../../../../query-client';
import { API_QUERY_KEY } from '../../../../utills';
import { camelToSnackCase } from '../../../../utills';
import usePermissions from '../../../../hooks/permissions';

const useFiledFormController = (
  fieldValueKey: string,
  editFieldIdAndStatus: { id: string; status: boolean },
  addNewType: string,
  hideUpdateModal?: () => void,
  isModalVisible?: boolean
) => {
  const { workspaceId, contentModelId, type } = useParams<{
    workspaceId: string;
    contentModelId: string;
    type: string;
  }>();

  const [form] = Form.useForm();

  const { t } = useTranslation();

  const { CONTENT_FIELD_TYPES } = useEnums();

  const permissions = usePermissions();

  const [minimumInputVisible, setMinimumInputVisible] = useState(false);
  const [maximumInputVisible, setMaximumInputVisible] = useState(false);
  const [tabValue, setTabValue] = useState('1');
  const [relationValue, setRelationValueData] = useState('oneToOne');

  const [defaultSelectValue, setDefaultSelectValue] = useState(['']);
  const [internalFieldName, setInternalFieldName] = useState('');
  const [minimumInputValue, setMinimumInputValue] = useState(0);
  const [maximumInputValue, setMaximumInputValue] = useState(0);
  const [editInternalFieldName, setEditInternalFieldName] = useState('');
  const [extensionName, setExtensionName] = useState('');

  const getFieldById = useGetFieldById(
    addNewType,
    workspaceId,
    contentModelId,
    editFieldIdAndStatus.id
  );

  const getComponentFieldById = useGetComponentFieldById(
    addNewType,
    workspaceId,
    contentModelId,
    editFieldIdAndStatus.id
  );

  const createContentField = useCreateField(workspaceId, contentModelId);

  const createComponentField = useCreateComponentField(
    workspaceId,
    contentModelId
  );

  const updateContentField = useUpdateField(
    workspaceId,
    contentModelId,
    editFieldIdAndStatus.id
  );

  const updateComponentField = useUpdateComponentField(
    workspaceId,
    contentModelId,
    editFieldIdAndStatus.id
  );

  const setRelationValue = (value: string) => {
    setRelationValueData(value);
  };

  useError({
    mutation: createContentField,
    entity: t('common.labels.content_field'),
    dependentEntities: t('common.labels.workspace'),
  });

  useError({
    mutation: createComponentField,
    entity: t('common.labels.content_field'),
    dependentEntities: t('common.labels.workspace'),
  });

  useError({
    mutation: updateContentField,
    entity: t('common.labels.content_field'),
    dependentEntities: t('common.labels.workspace'),
  });

  useError({
    mutation: updateComponentField,
    entity: t('common.labels.content_field'),
    dependentEntities: t('common.labels.workspace'),
  });

  const selectedField = useMemo(
    () => CONTENT_FIELD_TYPES.find((item) => item.key === fieldValueKey),
    [fieldValueKey, CONTENT_FIELD_TYPES]
  );

  const generateFieldName = useCallback(
    (
      values?: string | undefined,
      isSearchable?: string,
      number?: string,
      dateType?: string
    ) => {
      let internalFieldName = '';
      switch (values) {
        case 'text':
        case 'email':
        case 'rich-text':
          internalFieldName = '_et';
          if (isSearchable) {
            return internalFieldName.concat('i');
          }
          break;

        case 'password':
        case 'select':
        case 'uid':
        case 'color-picker':
          internalFieldName = '_es';
          if (isSearchable) {
            return internalFieldName.concat('i');
          }
          break;

        case 'number':
          switch (number) {
            case 'integer':
              internalFieldName = '_ei';
              if (isSearchable) {
                return internalFieldName.concat('i');
              }
              break;
            case 'double':
              internalFieldName = '_ed';
              if (isSearchable) {
                return internalFieldName.concat('i');
              }
              break;
            case 'long':
              internalFieldName = '_el';
              if (isSearchable) {
                return internalFieldName.concat('i');
              }
              break;
            case 'float':
              internalFieldName = '_ef';
              if (isSearchable) {
                return internalFieldName.concat('i');
              }
              break;
          }
          break;

        case 'multi-select':
          internalFieldName = '_esa';
          if (isSearchable) {
            return internalFieldName.concat('i');
          }
          break;

        case 'boolean':
          internalFieldName = '_eb';
          if (isSearchable) {
            return internalFieldName.concat('i');
          }
          break;

        case 'date':
          switch (dateType) {
            case 'date':
              internalFieldName = '_eds';
              if (isSearchable) {
                return internalFieldName.concat('i');
              }
              break;
            case 'datetime':
              internalFieldName = '_edt';
              if (isSearchable) {
                return internalFieldName.concat('i');
              }
              break;
            case 'time':
              internalFieldName = '_ets';
              if (isSearchable) {
                return internalFieldName.concat('i');
              }
              break;
          }
          break;

        case 'currency':
          internalFieldName = '_ec';
          if (isSearchable) {
            return internalFieldName.concat('i');
          }
          break;

        case 'json':
          internalFieldName = '_ej';
          break;

        case 'media':
          internalFieldName = '_emd';
          break;

        case 'page-editor':
          internalFieldName = '_epe';
          break;

        case 'component':
          internalFieldName = '_com';
          break;

        case 'relation':
          internalFieldName = '_exp_rel';
          break;

        case 'script':
          internalFieldName = '_script_etl';
          break;

        case 'style':
          internalFieldName = '_style_etl';
          break;

        case 'link-record':
          internalFieldName = '_elr';
          break;
      }

      return internalFieldName;
    },
    []
  );

  const onValueChange = (values: FormFieldValues) => {
    const internalFieldName = generateFieldName(
      selectedField?.key,
      form.getFieldValue('isSearchable'),
      form.getFieldValue('numberFormatSelect'),
      form.getFieldValue('dateTypeSelect')
    );

    setExtensionName(internalFieldName);

    if (form.getFieldValue('selectValues')) {
      const data = form
        .getFieldValue('selectValues')
        .split('\n')
        //@ts-ignore
        .filter((item) => item);
      setDefaultSelectValue(data);
    }

    if (values.fieldName) {
      setInternalFieldName(generateInternalFieldName(values.fieldName));

      form.setFieldsValue({
        internalFieldName: generateInternalFieldName(values.fieldName),
      });
    }

    if (values.validation) {
      if (values.validation?.includes('minimum_length')) {
        setMinimumInputVisible(true);
      }
      if (values.validation?.includes('maximum_length')) {
        setMaximumInputVisible(true);
      }
      if (!values.validation?.includes('minimum_length')) {
        setMinimumInputVisible(false);
        form.setFieldsValue({ minimumLengthValue: 0 });
      }
      if (!values.validation?.includes('maximum_length')) {
        setMaximumInputVisible(false);
      }
    }

    if (values.minimumLengthValue) {
      setMinimumInputValue(form.getFieldValue('minimumLengthValue'));
    }

    if (values.maximumLengthValue) {
      setMaximumInputValue(form.getFieldValue('maximumLengthValue'));
    }
  };

  const onSave = async () => {
    try {
      let isLocalizationEnabled = false;
      let isRequired = false;

      const value = await form.validateFields();
      value.fieldName = value.fieldName.trim();
      if (value.destinationFieldName) {
        value.destinationFieldName = value.destinationFieldName.trim();
      }

      if (
        value.fieldName.length < 3 ||
        (value.destinationFieldName && value.destinationFieldName.length < 3)
      ) {
        if (value.fieldName.length < 3) {
          form.setFields([
            {
              name: 'fieldName',
              errors: [
                t('common.messages.min_length', {
                  entity: t('common.labels.form_field_name'),
                }),
              ],
            },
          ]);
        }
        if (value.destinationFieldName) {
          if (value.destinationFieldName.length < 3) {
            form.setFields([
              {
                name: 'destinationFieldName',
                errors: [
                  t('common.messages.min_length', {
                    entity: t('common.labels.form_field_name'),
                  }),
                ],
              },
            ]);
          }
        }
      } else {
        if (value.validation) {
          if (value.validation.includes('enable_localization')) {
            isLocalizationEnabled = true;
          }
          if (value.validation.includes('required_field')) {
            isRequired = true;
          }
        }

        if (
          ['title', 'page_slug', 'page slug'].includes(
            value.fieldName?.toLowerCase()
          )
        ) {
          return openNotificationWithIcon(
            'error',
            t('common.messages.content_field_reserved')
          );
        }
        const internalFieldName = generateFieldName(
          selectedField?.key,
          value.isSearchable,
          value.numberFormatSelect,
          value.dateTypeSelect
        );
        const scriptTagPosition = Object.keys(value).find((item) =>
          item.endsWith('_script_position_es')
        );
        const scriptTagEnableSsr = Object.keys(value).find((item) =>
          item.endsWith('_script_ssr_es')
        );
        const contentFieldObject: {
          title: string;
          isRequired: boolean;
          isLocalizationEnabled: boolean;
          type?: string | undefined;
          fieldProperties: FormFieldValues;
          fieldName: string;
          destinationFieldName?: string;
          destinationTitle?: string;
          destinationContentModelId?: string;
          relationType?: string;
          isSearchable?: boolean;
          componentId?: string;
          isEditable?: boolean;
          isRemovable?: boolean;
          isDataEditable?: boolean;
          isRepeatable?: boolean;
        } = {
          title: value.fieldName,
          isRequired: isRequired,
          isLocalizationEnabled: isLocalizationEnabled,
          type: selectedField?.key,
          fieldProperties: value,
          fieldName: editFieldIdAndStatus.status
            ? generateInternalFieldName(editInternalFieldName).concat(
                internalFieldName
              )
            : generateInternalFieldName(value.internalFieldName).concat(
                internalFieldName
              ),
        };
        if (scriptTagPosition) {
          //@ts-ignore
          contentFieldObject[scriptTagPosition] = value[scriptTagPosition];
        }
        if (scriptTagEnableSsr) {
          //@ts-ignore
          contentFieldObject[scriptTagEnableSsr] = value[scriptTagEnableSsr];
        }
        if (value.relationSelect) {
          contentFieldObject['destinationFieldName'] =
            generateInternalFieldName(value.destinationFieldName).concat(
              internalFieldName
            );
          contentFieldObject['destinationTitle'] = value.destinationFieldName;
          contentFieldObject['destinationContentModelId'] =
            value.relationSelect;
          contentFieldObject['relationType'] = relationValue;
        }
        if (value.isSearchable) {
          contentFieldObject['isSearchable'] = value.isSearchable;
        } else {
          contentFieldObject['isSearchable'] = false;
        }

        if (selectedField?.key === 'component') {
          contentFieldObject['componentId'] = value.selectComponents;
          if (value.singleAndRepeatableComponents === 'repeatableComponents') {
            contentFieldObject['isRepeatable'] = true;
          } else {
            contentFieldObject['isRepeatable'] = false;
          }
        }
        contentFieldObject['isRemovable'] = true;
        contentFieldObject['isEditable'] = true;
        contentFieldObject['isDataEditable'] = true;

        if (editFieldIdAndStatus.status) {
          if (type === 'component') {
            // @ts-ignore
            updateComponentField.mutate(contentFieldObject);
          } else {
            // @ts-ignore
            updateContentField.mutate(contentFieldObject);
          }
        } else {
          if (type === 'component') {
            // @ts-ignore
            createComponentField.mutate(contentFieldObject);
          } else {
            // @ts-ignore
            createContentField.mutate(contentFieldObject);
          }
        }
      }
    } catch (error) {
      console.log(error);
      openNotificationWithIcon(
        'error',
        t('common.labels.field_required_field')
      );
    }
  };

  const onTabChange = (key: string) => {
    setTabValue(key);
  };

  const internalFieldNameChange = (val: string) => {
    setInternalFieldName(generateInternalFieldName(val));
  };

  useEffect(() => {
    setInternalFieldName('');
    form.resetFields();
    setTabValue('1');
    setMinimumInputVisible(false);
    setMaximumInputVisible(false);
    setDefaultSelectValue(['']);
    setExtensionName('');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldValueKey, isModalVisible]);

  useEffect(() => {
    if (createContentField.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.field_added_successfully')
      );
      form.resetFields();
      setInternalFieldName('');
      if (hideUpdateModal) {
        hideUpdateModal();
      }
      if (!permissions.canManageGlobalWorkspace()) {
        queryClient.resetQueries([
          API_QUERY_KEY.PERMISSIONS,
          workspaceId,
          false,
        ]);
      } else {
        queryClient.removeQueries([API_QUERY_KEY.CONTENT_FIELDS]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createContentField.isSuccess, t]);

  useEffect(() => {
    if (createComponentField.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.field_added_successfully')
      );

      form.resetFields();
      setInternalFieldName('');
      if (hideUpdateModal) {
        hideUpdateModal();
      }
      if (!permissions.canManageGlobalWorkspace()) {
        queryClient.resetQueries([
          API_QUERY_KEY.PERMISSIONS,
          workspaceId,
          false,
        ]);
      } else {
        queryClient.removeQueries([API_QUERY_KEY.COMPONENT_FIELDS]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createComponentField.isSuccess, t]);

  useEffect(() => {
    if (updateComponentField.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
      queryClient.removeQueries([
        API_QUERY_KEY.COMPONENT_FIELDS,
        contentModelId,
      ]);
      setInternalFieldName('');
      if (hideUpdateModal) {
        hideUpdateModal();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateComponentField.isSuccess, t]);

  useEffect(() => {
    if (updateContentField.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.content_field_updated_successfully')
      );
      queryClient.removeQueries([API_QUERY_KEY.CONTENT_FIELDS, contentModelId]);
      setInternalFieldName('');
      if (hideUpdateModal) {
        hideUpdateModal();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateContentField.isSuccess, t]);

  useEffect(() => {
    if (form.getFieldValue('validation')) {
      if (form.getFieldValue('validation').includes('minimum_length')) {
        setMinimumInputVisible(true);
      }
      if (form.getFieldValue('validation').includes('maximum_length')) {
        setMaximumInputVisible(true);
      }
    }

    if (form.getFieldValue('selectValues')) {
      const data = form
        .getFieldValue('selectValues')
        .split('\n')
        //@ts-ignore
        .filter((item) => item);
      setDefaultSelectValue(data);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getFieldValue('selectValues'), form.getFieldValue('validation')]);

  useEffect(() => {
    if (getFieldById.data) {
      if (getFieldById.data.fieldProperties) {
        const scriptTagPosition = Object.keys(
          getFieldById.data.fieldProperties
        ).find((item) => item.endsWith('ScriptPositionEs'));
        const scriptTagEnableSsr = Object.keys(
          getFieldById.data.fieldProperties
        ).find((item) => item.endsWith('ScriptSsrEs'));

        if (scriptTagPosition) {
          const convertName = camelToSnackCase(scriptTagPosition);
          form.setFieldsValue({
            //@ts-ignore
            [convertName]: getFieldById.data.fieldProperties[scriptTagPosition],
          });
        }
        if (scriptTagEnableSsr) {
          const convertName = camelToSnackCase(scriptTagEnableSsr);
          form.setFieldsValue({
            [convertName]:
              //@ts-ignore
              getFieldById.data.fieldProperties[scriptTagEnableSsr],
          });
        }
      }

      if (getFieldById.data.fieldName) {
        setEditInternalFieldName(getFieldById.data.fieldName);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFieldById.data]);

  useEffect(() => {
    if (getComponentFieldById.data) {
      if (getComponentFieldById.data.fieldName) {
        setEditInternalFieldName(getComponentFieldById.data.fieldName);
      }
    }
  }, [getComponentFieldById.data]);

  useEffect(() => {
    if (getFieldById.isSuccess) {
      if (getFieldById.data?.relationType) {
        form.resetFields();
        setRelationValueData(getFieldById.data?.relationType);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFieldById.isSuccess, getFieldById.data?.relationType]);

  const duplicateFieldOnBlur = () => {
    const destinationFieldName = form.getFieldValue('destinationFieldName');

    if (destinationFieldName.length < 3) {
      form.setFields([
        {
          name: 'destinationFieldName',
          errors: [
            t('common.messages.min_length', {
              entity: t('common.labels.form_field_name'),
            }),
          ],
        },
      ]);
    }
  };

  const onBlur = () => {
    const fieldName = form.getFieldValue('fieldName');

    if (fieldName.length < 3) {
      form.setFields([
        {
          name: 'fieldName',
          errors: [
            t('common.messages.min_length', {
              entity: t('common.labels.form_field_name'),
            }),
          ],
        },
      ]);
    }
  };

  return {
    t,
    selectedField,
    form,
    onSave,
    maximumInputVisible,
    minimumInputVisible,
    onValueChange,
    tabValue,
    onTabChange,
    relationValue,
    setRelationValue,
    defaultSelectValue,
    internalFieldName,
    fieldInitialValue:
      type === 'component'
        ? getComponentFieldById.data?.fieldProperties
        : getFieldById.data?.fieldProperties,
    minimumInputValue,
    maximumInputValue,
    onBlur,
    internalFieldNameChange,
    editInternalFieldName,
    extensionName,
    duplicateFieldOnBlur,
    createContentField,
    createComponentField,
    updateContentField,
    updateComponentField,
    type,
  };
};
export default useFiledFormController;
