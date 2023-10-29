import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { FormInstance } from 'antd/es/form';

type FieldsType = {
  [key: string]: {
    [key: string]: object;
  };
};

// This method is executed when we click on single checkbox. If create,update,delete permission checkbox is selcted read permission checkbox checked by this method.
// If read permission checkbox unselected than this method unselect create,update and delete permission checkbox.
export const singleCheckboxSelect = (
  e: CheckboxChangeEvent,
  componentName: string,
  elementValue: string,
  permissionName: string,
  form: FormInstance
) => {
  const fieldValues = form.getFieldsValue();
  const fields: FieldsType = {};

  if (e.target.checked) {
    if (
      permissionName === 'create' ||
      permissionName === 'update' ||
      permissionName === 'delete'
    ) {
      fieldValues[componentName][elementValue].read = true;
      fields[componentName] = fieldValues[componentName];
      form.setFieldsValue(fields);
    }
  } else {
    if (permissionName === 'read') {
      fieldValues[componentName][elementValue].create = false;
      fieldValues[componentName][elementValue].update = false;
      fieldValues[componentName][elementValue].delete = false;
      fields[componentName] = fieldValues[componentName];
      form.setFieldsValue(fields);
    }
  }
};

// This method works same as above only difference is extra parameter for subrules in Settings and Merchandising permissions tab
export const nestedCheckboxSelect = (
  e: CheckboxChangeEvent,
  componentName: string,
  elementValue: string,
  subElementValue: string,
  permissionName: string,
  form: FormInstance
) => {
  const fieldValues = form.getFieldsValue();
  const fields: FieldsType = {};
  if (e.target.checked) {
    if (
      permissionName === 'create' ||
      permissionName === 'update' ||
      permissionName === 'delete'
    ) {
      fieldValues[componentName][elementValue][subElementValue].read = true;
      if (elementValue === 'cmsTokens' || elementValue === 'emailTemplates') {
        fieldValues[componentName][elementValue]['permissions'].read = true;
      }
      fields[componentName] = fieldValues[componentName];
      form.setFieldsValue(fields);
    } else {
      if (elementValue === 'cmsTokens' || elementValue === 'emailTemplates') {
        fieldValues[componentName][elementValue]['permissions'].read = true;
      }
      fields[componentName] = fieldValues[componentName];
      form.setFieldsValue(fields);
    }
  } else {
    if (permissionName === 'read') {
      fieldValues[componentName][elementValue][subElementValue].create = false;
      fieldValues[componentName][elementValue][subElementValue].update = false;
      fieldValues[componentName][elementValue][subElementValue].delete = false;

      if (elementValue === 'cmsTokens') {
        if (
          !fieldValues[componentName][elementValue]['apiTokens'].read &&
          !fieldValues[componentName][elementValue]['cliTokens'].read
        ) {
          fieldValues[componentName][elementValue]['permissions'].read = false;
        }
      } else if (elementValue === 'emailTemplates') {
        if (
          !fieldValues[componentName][elementValue]['emailTemplate'].read &&
          !fieldValues[componentName][elementValue]['smtp'].read
        ) {
          fieldValues[componentName][elementValue]['permissions'].read = false;
        }
      }

      fields[componentName] = fieldValues[componentName];
      form.setFieldsValue(fields);
    }
  }
};

export const mediaLibraryCheckboxSelect = (
  e: CheckboxChangeEvent,
  form: FormInstance,
  permissionType: string
) => {
  const fieldValues = form.getFieldsValue();
  const fields: FieldsType = {};
  if (e.target.checked) {
    if (
      permissionType === 'add' ||
      permissionType === 'update' ||
      permissionType === 'delete'
    ) {
      fieldValues['settings']['mediaLibrary'].view = true;
      fields['settings'] = fieldValues['settings'];
    }
  } else {
    if (permissionType === 'view') {
      fieldValues['settings']['mediaLibrary'].add = false;
      fieldValues['settings']['mediaLibrary'].update = false;
      fieldValues['settings']['mediaLibrary'].delete = false;
      fields['settings'] = fieldValues['settings'];
    }
  }
  form.setFieldsValue(fields);
};

export const emailTemplatesCheckboxSelect = (
  e: CheckboxChangeEvent,
  form: FormInstance,
  type: string
) => {
  const fieldValues = form.getFieldsValue();
  const fields: FieldsType = {};
  if (e.target.checked) {
    if (type === 'emailTemplates') {
      fieldValues['settings']['emailTemplates']['emailTemplate'].read = true;
      fieldValues['settings']['emailTemplates']['smtp'].read = true;
      fields['settings'] = fieldValues['settings'];
    } else {
      fieldValues['settings']['cmsTokens']['apiTokens'].read = true;
      fieldValues['settings']['cmsTokens']['cliTokens'].read = true;
      fields['settings'] = fieldValues['settings'];
    }
  } else {
    if (type === 'emailTemplates') {
      fieldValues['settings']['emailTemplates']['emailTemplate'].read = false;
      fieldValues['settings']['emailTemplates']['emailTemplate'].create = false;
      fieldValues['settings']['emailTemplates']['emailTemplate'].update = false;
      fieldValues['settings']['emailTemplates']['emailTemplate'].delete = false;

      fieldValues['settings']['emailTemplates']['smtp'].read = false;
      fieldValues['settings']['emailTemplates']['smtp'].update = false;

      fields['settings'] = fieldValues['settings'];
    } else {
      fieldValues['settings']['cmsTokens']['apiTokens'].read = false;
      fieldValues['settings']['cmsTokens']['apiTokens'].create = false;
      fieldValues['settings']['cmsTokens']['apiTokens'].update = false;
      fieldValues['settings']['cmsTokens']['apiTokens'].delete = false;

      fieldValues['settings']['cmsTokens']['cliTokens'].read = false;
      fieldValues['settings']['cmsTokens']['cliTokens'].create = false;
      fieldValues['settings']['cmsTokens']['cliTokens'].update = false;
      fieldValues['settings']['cmsTokens']['cliTokens'].delete = false;

      fields['settings'] = fieldValues['settings'];
    }
  }
  form.setFieldsValue(fields);
};
