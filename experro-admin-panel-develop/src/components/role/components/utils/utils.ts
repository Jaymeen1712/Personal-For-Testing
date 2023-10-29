import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { FormInstance } from 'antd/es/form';
import { Dispatch, SetStateAction } from 'react';

import {
  ContentField,
  ILanguage,
  IListContentResponse,
  IListEnvironments,
  ISubmitRoleValuesType,
  ContentLibraryIndeterminateState,
  ContentModelIndeterminateState,
} from '../../../../types';

// const permissionArray = ['create', 'read', 'update', 'delete', 'publish'];

// To verify checkbox is field type or language type and perform operations according to that.
// To check all parent labels are checked or not.
// To check all parent fields are checked or not.
// To check parent field of clicked checkbox is checked or not.
// export const singleCheckBoxSelect = (
//   collectionOrSingleTypeData: CollectionAndSingleType[],
//   languageData: ILanguage[],
//   e: CheckboxChangeEvent,
//   eleName: string,
//   parentId: string,
//   upperParentId: string,
//   lowerParentId: string,
//   checkAllId: string,
//   permissionName: string,
//   checkBoxType: string,
//   componentType: string,
//   form: FormInstance
// ) => {
//   if (checkBoxType === 'Field') {
//     singleFieldCheckBoxSelect(
//       form,
//       collectionOrSingleTypeData,
//       languageData,
//       componentType,
//       e,
//       eleName,
//       parentId,
//       upperParentId,
//       lowerParentId,
//       checkAllId,
//       permissionName
//     );
//   } else if (checkBoxType === 'Language') {
//     singleLanguageCheckBoxSelect(
//       form,
//       collectionOrSingleTypeData,
//       languageData,
//       componentType,
//       e,
//       eleName,
//       parentId,
//       upperParentId,
//       lowerParentId,
//       checkAllId,
//       permissionName
//     );
//   }

//   checkAllLabels(
//     form,
//     collectionOrSingleTypeData,
//     languageData,
//     parentId,
//     checkAllId
//   );
//   checkSpecificParentFields(
//     form,
//     collectionOrSingleTypeData,
//     componentType,
//     permissionName
//   );
//   checkAllParents(form, collectionOrSingleTypeData, componentType);
// };

// Method to check and uncheck create,read,update,delete,publish permissions when clicked on lower parent checkbox.
// export const checkAllPermissions = (
//   collectionOrSingleTypeData: CollectionAndSingleType[],
//   languageData: ILanguage[],
//   e: CheckboxChangeEvent,
//   eleName: string,
//   parentId: string,
//   type: string,
//   checkAllId: string,
//   fieldType: string,
//   componentType: string,
//   form: FormInstance
// ) => {
//   const fieldValues = form.getFieldsValue();

//   const obj: RoleFormObjectType = {};

//   if (e.target.checked) {
//     fieldValues.collectionType[parentId][fieldType][eleName].create = true;
//     fieldValues.collectionType[parentId][fieldType][eleName].read = true;
//     fieldValues.collectionType[parentId][fieldType][eleName].update = true;
//     fieldValues.collectionType[parentId][fieldType][eleName].delete = true;
//     fieldValues.collectionType[parentId][fieldType][eleName].publish = true;
//   } else {
//     fieldValues.collectionType[parentId][fieldType][eleName].create = false;
//     fieldValues.collectionType[parentId][fieldType][eleName].read = false;
//     fieldValues.collectionType[parentId][fieldType][eleName].update = false;
//     fieldValues.collectionType[parentId][fieldType][eleName].delete = false;
//     fieldValues.collectionType[parentId][fieldType][eleName].publish = false;
//     form.setFieldsValue({
//       [`${parentId}-create-${type}`]: false,
//       [`${parentId}-read-${type}`]: false,
//       [`${parentId}-update-${type}`]: false,
//       [`${parentId}-delete-${type}`]: false,
//       [`${parentId}-publish-${type}`]: false,
//       [`${parentId}-create`]: false,
//       [`${parentId}-read`]: false,
//       [`${parentId}-update`]: false,
//       [`${parentId}-delete`]: false,
//       [`${parentId}-publish`]: false,
//       [checkAllId]: false,
//       [`${componentType}-create`]: false,
//       [`${componentType}-read`]: false,
//       [`${componentType}-update`]: false,
//       [`${componentType}-delete`]: false,
//       [`${componentType}-publish`]: false,
//     });
//   }

//   obj.collectionType = fieldValues.collectionType;

//   form.setFieldsValue(obj);

//   if (type === 'Field') {
//     checkAllFieldPermissions(
//       form,
//       collectionOrSingleTypeData,
//       e,
//       eleName,
//       parentId,
//       checkAllId
//     );
//   } else if (type === 'Language') {
//     checkAllLanguagePermissions(
//       form,
//       languageData,
//       e,
//       eleName,
//       parentId,
//       checkAllId
//     );
//   }
//   checkAllLabels(
//     form,
//     collectionOrSingleTypeData,
//     languageData,
//     parentId,
//     checkAllId
//   );
//   checkAllParents(form, collectionOrSingleTypeData, componentType);
// };

// Method to set initial values to edit roles and check lower and upper parents according to fields and language checked checkboxes.
// export const setInitialValues = (
//   collectionOrSingleTypeData: CollectionAndSingleType[],
//   componentType: string,
//   form: FormInstance,
//   languageData: ILanguage[]
// ) => {
//   const fieldValues = form.getFieldsValue();

//   let fieldArray: string[] = [];

//   let languageArray: string[] = [];

//   let allLabelArray: string[] = [];

//   let allParentArray: string[] = [];

//   let allParentLabelArray: string[] = [];

//   let fieldsCheckedCount = 0;

//   let languageCheckedCount = 0;

//   let allLabelCheckedCount = 0;

//   let allParentPermissionCheckedCount = 0;

//   let allParentLabelCheckedCount = 0;

//   /* eslint-disable-next-line no-plusplus */
//   const fieldsCheckedCountIncrement = () => fieldsCheckedCount++;

//   /* eslint-disable-next-line no-plusplus */
//   const languageCheckedCountIncrement = () => languageCheckedCount++;

//   /* eslint-disable-next-line no-plusplus */
//   const labelCheckedCountIncrement = () => allLabelCheckedCount++;

//   /* eslint-disable-next-line no-plusplus */
//   const parentCheckedCount = () => allParentPermissionCheckedCount++;

//   /* eslint-disable-next-line no-plusplus */
//   const parentCheckedCountIncrement = () => allParentLabelCheckedCount++;

//   collectionOrSingleTypeData.forEach(
//     (singleOrCollectionType: RoleAPIElementType) => {
//       singleOrCollectionType.fields.forEach((fields) => {
//         fieldArray.push(fields.value);
//         allLabelArray.push(fields.label);
//         if (
//           fieldValues[componentType][singleOrCollectionType.value]
//             .fieldPermissions[fields.value].create &&
//           fieldValues[componentType][singleOrCollectionType.value]
//             .fieldPermissions[fields.value].read &&
//           fieldValues[componentType][singleOrCollectionType.value]
//             .fieldPermissions[fields.value].update &&
//           fieldValues[componentType][singleOrCollectionType.value]
//             .fieldPermissions[fields.value].delete &&
//           fieldValues[componentType][singleOrCollectionType.value]
//             .fieldPermissions[fields.value].publish
//         ) {
//           form.setFieldsValue({
//             [`${singleOrCollectionType.value}-${fields.label}`]: true,
//           });
//         }
//       });
//       languageData.forEach((language) => {
//         languageArray.push(language.locale);
//         allLabelArray.push(language.name);
//         if (
//           fieldValues[componentType][singleOrCollectionType.value]
//             .localePermissions[language.locale].create &&
//           fieldValues[componentType][singleOrCollectionType.value]
//             .localePermissions[language.locale].read &&
//           fieldValues[componentType][singleOrCollectionType.value]
//             .localePermissions[language.locale].update &&
//           fieldValues[componentType][singleOrCollectionType.value]
//             .localePermissions[language.locale].delete &&
//           fieldValues[componentType][singleOrCollectionType.value]
//             .localePermissions[language.locale].publish
//         ) {
//           form.setFieldsValue({
//             [`${singleOrCollectionType.value}-${language.name}`]: true,
//           });
//         }
//       });

//       permissionArray.forEach((permission) => {
//         fieldArray.forEach((field) => {
//           if (
//             fieldValues[componentType][singleOrCollectionType.value]
//               .fieldPermissions[field][permission]
//           ) {
//             fieldsCheckedCountIncrement();
//           }
//         });

//         languageArray.forEach((languages) => {
//           if (
//             fieldValues[componentType][singleOrCollectionType.value]
//               .localePermissions[languages][permission]
//           ) {
//             languageCheckedCountIncrement();
//           }
//         });

//         if (fieldsCheckedCount === fieldArray.length) {
//           form.setFieldsValue({
//             [`${singleOrCollectionType.value}-${permission}-Field`]: true,
//           });
//         }

//         if (languageCheckedCount === languageArray.length) {
//           form.setFieldsValue({
//             [`${singleOrCollectionType.value}-${permission}-Language`]: true,
//           });
//         }

//         fieldsCheckedCount = 0;
//         languageCheckedCount = 0;

//         const latestValues = form.getFieldsValue();

//         if (
//           latestValues[`${singleOrCollectionType.value}-${permission}-Field`] &&
//           latestValues[`${singleOrCollectionType.value}-${permission}-Language`]
//         ) {
//           form.setFieldsValue({
//             [`${singleOrCollectionType.value}-${permission}`]: true,
//           });
//         }
//       });

//       fieldArray = [];
//       languageArray = [];

//       const latestValues1 = form.getFieldsValue();

//       allLabelArray.forEach((label) => {
//         if (latestValues1[`${singleOrCollectionType.value}-${label}`]) {
//           labelCheckedCountIncrement();
//         }
//       });

//       if (allLabelCheckedCount === allLabelArray.length) {
//         form.setFieldsValue({
//           [`${singleOrCollectionType.label}`]: true,
//           [`${singleOrCollectionType.value}-create`]: true,
//           [`${singleOrCollectionType.value}-read`]: true,
//           [`${singleOrCollectionType.value}-update`]: true,
//           [`${singleOrCollectionType.value}-delete`]: true,
//           [`${singleOrCollectionType.value}-publish`]: true,
//         });
//       }

//       allLabelArray = [];
//       allLabelCheckedCount = 0;
//     }
//   );

//   const latestValues2 = form.getFieldsValue();

//   collectionOrSingleTypeData.forEach((collectionOrSingleType) => {
//     allParentArray.push(collectionOrSingleType.value);
//     allParentLabelArray.push(collectionOrSingleType.label);
//   });

//   permissionArray.forEach((permissions) => {
//     allParentArray.forEach((parent) => {
//       if (latestValues2[`${parent}-${permissions}`]) {
//         parentCheckedCount();
//       }
//     });
//     if (allParentPermissionCheckedCount === allParentArray.length) {
//       form.setFieldsValue({
//         [`${componentType}-${permissions}`]: true,
//       });
//     }
//     allParentPermissionCheckedCount = 0;
//   });

//   allParentArray = [];

//   allParentLabelArray.forEach((parentLabel) => {
//     if (latestValues2[`${parentLabel}`]) {
//       parentCheckedCountIncrement();
//     }
//   });

//   if (allParentLabelCheckedCount === allParentLabelArray.length) {
//     form.setFieldsValue({
//       [`${componentType}-create`]: true,
//       [`${componentType}-read`]: true,
//       [`${componentType}-update`]: true,
//       [`${componentType}-delete`]: true,
//       [`${componentType}-publish`]: true,
//     });
//   }

//   allParentLabelCheckedCount = 0;
//   allParentLabelArray = [];
// };

export const checkAllChildPermissions = (
  form: FormInstance,
  e: CheckboxChangeEvent,
  contentModelId: string,
  contentModelInternalName: string,
  contentModelType: string,
  contentModelFields: ContentField[],
  languageData: ILanguage[],
  permissionType: string
) => {
  const fieldValues = form.getFieldsValue();
  if (e.target.checked) {
    fieldValues['contentLibrary'][contentModelInternalName][
      'permissions'
    ].read = true;
    const obj = {} as ISubmitRoleValuesType;
    contentModelFields.forEach((contentModel) => {
      if (contentModel.contentModelId === contentModelId) {
        contentModel.fields?.forEach((fields) => {
          fieldValues['contentLibrary'][contentModelInternalName][
            'fieldPermissions'
          ][fields.fieldName].read = true;
          fieldValues['contentLibrary'][contentModelInternalName][
            'fieldPermissions'
          ][fields.fieldName][permissionType] = true;
        });
      }
    });
    languageData.forEach((language) => {
      fieldValues['contentLibrary'][contentModelInternalName][
        'localePermissions'
      ][language.locale].read = true;
      fieldValues['contentLibrary'][contentModelInternalName][
        'localePermissions'
      ][language.locale][permissionType] = true;
    });
    obj['contentLibrary'] = fieldValues['contentLibrary'];
    form.setFieldsValue(obj);
  } else {
    if (permissionType === 'read') {
      fieldValues['contentLibrary'][contentModelInternalName][
        'permissions'
      ].create = false;
      fieldValues['contentLibrary'][contentModelInternalName][
        'permissions'
      ].update = false;
      fieldValues['contentLibrary'][contentModelInternalName][
        'permissions'
      ].delete = false;
      fieldValues['contentLibrary'][contentModelInternalName][
        'permissions'
      ].publish = false;
      const obj = {} as ISubmitRoleValuesType;
      contentModelFields.forEach((contentModel) => {
        if (contentModel.contentModelId === contentModelId) {
          contentModel.fields?.forEach((fields) => {
            fieldValues['contentLibrary'][contentModelInternalName][
              'fieldPermissions'
            ][fields.fieldName].read = false;
            fieldValues['contentLibrary'][contentModelInternalName][
              'fieldPermissions'
            ][fields.fieldName].update = false;
          });
        }
      });
      languageData.forEach((language) => {
        fieldValues['contentLibrary'][contentModelInternalName][
          'localePermissions'
        ][language.locale].read = false;
        fieldValues['contentLibrary'][contentModelInternalName][
          'localePermissions'
        ][language.locale].update = false;
      });
      obj['contentLibrary'] = fieldValues['contentLibrary'];
      form.setFieldsValue(obj);
    } else if (permissionType === 'update') {
      const obj = {} as ISubmitRoleValuesType;
      contentModelFields.forEach((contentModel) => {
        if (contentModel.contentModelId === contentModelId) {
          contentModel.fields?.forEach((fields) => {
            fieldValues['contentLibrary'][contentModelInternalName][
              'fieldPermissions'
            ][fields.fieldName][permissionType] = false;
          });
        }
      });
      languageData.forEach((language) => {
        fieldValues['contentLibrary'][contentModelInternalName][
          'localePermissions'
        ][language.locale][permissionType] = false;
      });
      obj['contentLibrary'] = fieldValues['contentLibrary'];
      form.setFieldsValue(obj);
    }
  }
};

// To manage contentmodel record permissions
export const singleCheckboxSelect = (
  form: FormInstance,
  e: CheckboxChangeEvent,
  contentModelId: string,
  contentModelInternalName: string,
  permissionType: string,
  contentModelFields: ContentField[],
  // languageData: ILanguage[],
  environmentData: IListEnvironments[],
  contentFieldName: string,
  indeterminateStates: ContentLibraryIndeterminateState,
  setIndeterminateStates: Dispatch<
    SetStateAction<ContentLibraryIndeterminateState>
  >
) => {
  const fieldValues = form.getFieldsValue();
  const obj = {} as ISubmitRoleValuesType;

  let fieldsCount = 0;
  let fieldsCheckedCount = 0;
  let fieldsUncheckedCount = 0;
  let readCheckedCount = 0;
  let readUncheckedCount = 0;

  /* eslint-disable-next-line no-plusplus */
  const fieldsCountIncrement = () => fieldsCount++;

  /* eslint-disable-next-line no-plusplus */
  const fieldsCheckedCountIncrement = () => fieldsCheckedCount++;

  /* eslint-disable-next-line no-plusplus */
  const fieldsUncheckedCountIncrement = () => fieldsUncheckedCount++;

  /* eslint-disable-next-line no-plusplus */
  const readCheckedCountIncrement = () => readCheckedCount++;

  /* eslint-disable-next-line no-plusplus */
  const readUncheckedCountIncrement = () => readUncheckedCount++;

  if (e.target.checked) {
    if (permissionType === 'read') {
      fieldValues['contentLibrary'][contentModelInternalName][
        'permissions'
      ].read = true;

      obj['contentLibrary'] = fieldValues['contentLibrary'];

      form.setFieldsValue(obj);

      contentModelFields.forEach((contentModel) => {
        if (contentModel.contentModelId === contentModelId) {
          contentModel.fields?.forEach((field) => {
            fieldsCountIncrement();
            if (
              fieldValues['contentLibrary'][contentModelInternalName][
                'fieldPermissions'
              ][field.fieldName].read
            ) {
              fieldsCheckedCountIncrement();
            }
          });
        }
      });
      // languageData.forEach((lan) => {
      //   fieldsCountIncrement();
      //   if (
      //     fieldValues['contentLibrary'][contentModelInternalName][
      //       'localePermissions'
      //     ][lan.locale].read
      //   ) {
      //     fieldsCheckedCountIncrement();
      //   }
      // });
    } else {
      fieldValues['contentLibrary'][contentModelInternalName][
        'fieldPermissions'
      ][contentFieldName].read = true;

      fieldValues['contentLibrary'][contentModelInternalName][
        'permissions'
      ].update = true;

      fieldValues['contentLibrary'][contentModelInternalName][
        'permissions'
      ].read = true;

      // fieldValues['contentLibrary'][contentModelInternalName]['localePermissions'][contentFieldName].read = true
      contentModelFields.forEach((contentModel) => {
        if (contentModel.contentModelId === contentModelId) {
          contentModel.fields?.forEach((field) => {
            fieldsCountIncrement();
            if (
              fieldValues['contentLibrary'][contentModelInternalName][
                'fieldPermissions'
              ][field.fieldName].update
            ) {
              fieldsCheckedCountIncrement();
            }
            if (
              fieldValues['contentLibrary'][contentModelInternalName][
                'fieldPermissions'
              ][field.fieldName].read
            ) {
              readCheckedCountIncrement();
            }
          });
        }
      });
      // languageData.forEach((lan) => {
      //   fieldsCountIncrement();
      //   if (
      //     fieldValues['contentLibrary'][contentModelInternalName][
      //       'localePermissions'
      //     ][lan.locale].update
      //   ) {
      //     fieldsCheckedCountIncrement();
      //   }
      // });
    }
  } else {
    contentModelFields.forEach((contentModel) => {
      // fieldsCountIncrement();
      if (contentModel.contentModelId === contentModelId) {
        contentModel.fields?.forEach((field) => {
          fieldsCountIncrement();
          if (
            fieldValues['contentLibrary'][contentModelInternalName][
              'fieldPermissions'
            ][field.fieldName][permissionType]
          ) {
            fieldsCheckedCountIncrement();
          } else {
            fieldsUncheckedCountIncrement();
          }
          if (
            !fieldValues['contentLibrary'][contentModelInternalName][
              'fieldPermissions'
            ][field.fieldName].read
          ) {
            readUncheckedCountIncrement();
          }
        });
      }
    });
    // languageData.forEach((lan) => {
    //   fieldsCountIncrement();
    //   if (
    //     fieldValues['contentLibrary'][contentModelInternalName][
    //       'localePermissions'
    //     ][lan.locale][permissionType]
    //   ) {
    //     fieldsCheckedCountIncrement();
    //   } else {
    //     fieldsUncheckedCountIncrement();
    //   }
    // });

    // if (fieldsCount === fieldsUncheckedCount) {

    //   if (permissionType === 'read') {
    //     fieldValues['contentLibrary'][contentModelInternalName][
    //       'permissions'
    //     ].create = false;
    //     fieldValues['contentLibrary'][contentModelInternalName][
    //       'permissions'
    //     ].update = false;
    //     fieldValues['contentLibrary'][contentModelInternalName][
    //       'permissions'
    //     ].delete = false;
    //     fieldValues['contentLibrary'][contentModelInternalName][
    //       'permissions'
    //     ].publish = false;
    //     const obj = {} as ISubmitRoleValuesType;
    //     contentModelFields.forEach((contentModel) => {
    //       if (contentModel.contentModelId === contentModelId) {
    //         contentModel.fields?.forEach((fields) => {
    //           fieldValues['contentLibrary'][contentModelInternalName][
    //             'fieldPermissions'
    //           ][fields.fieldName].read = false;
    //           fieldValues['contentLibrary'][contentModelInternalName][
    //             'fieldPermissions'
    //           ][fields.fieldName].update = false;
    //         });
    //       }
    //     });
    //     // languageData.forEach((language) => {
    //     //   fieldValues['contentLibrary'][contentModelInternalName][
    //     //     'localePermissions'
    //     //   ][language.locale].read = false;
    //     //   fieldValues['contentLibrary'][contentModelInternalName][
    //     //     'localePermissions'
    //     //   ][language.locale].update = false;
    //     // });
    //     environmentData.forEach((env) => {
    //       fieldValues['contentLibrary'][contentModelInternalName]['publish'][
    //         env.id
    //       ] = false;
    //     });
    //     obj['contentLibrary'] = fieldValues['contentLibrary'];
    //     form.setFieldsValue(obj);
    //   }
    //   obj['contentLibrary'] = fieldValues['contentLibrary'];
    //   setIndeterminateStates(allStates);
    //   }
    //   if (permissionType === 'update' || permissionType === 'read') {
    //     const obj = {} as ISubmitRoleValuesType;
    //     // fieldValues['contentLibrary'][contentModelInternalName][
    //     //   'permissions'
    //     // ].update = false;
    //     // fieldValues['contentLibrary'][contentModelInternalName]['permissions'].read = false
    //     obj['contentLibrary'] = fieldValues['contentLibrary'];
    //     form.setFieldsValue(obj);
    //   } else {
    //     const obj = {} as ISubmitRoleValuesType;
    //     fieldValues['contentLibrary'][contentModelInternalName][
    //       'permissions'
    //     ].update = false;
    //     fieldValues['contentLibrary'][contentModelInternalName][
    //       'permissions'
    //     ].read = false;
    //     fieldValues['contentLibrary'][contentModelInternalName][
    //       'fieldPermissions'
    //     ][contentFieldName].update = false;
    //     obj['contentLibrary'] = fieldValues['contentLibrary'];
    //     form.setFieldsValue(obj);
    //   }
    if (permissionType === 'read') {
      // if(fieldsCount === readUncheckedCount){
      //   fieldValues['contentLibrary'][contentModelInternalName]['permissions'].update= false;
      //       obj['contentLibrary'] = fieldValues['contentLibrary'];
      // }

      fieldValues['contentLibrary'][contentModelInternalName][
        'fieldPermissions'
      ][contentFieldName].update = false;
      // fieldValues['contentLibrary'][contentModelInternalName][
      //   'permissions'
      // ].update = false;
      // fieldValues['contentLibrary'][contentModelInternalName]['permissions'].publish = false;
      obj['contentLibrary'] = fieldValues['contentLibrary'];
    }
  }
  obj['contentLibrary'] = fieldValues['contentLibrary'];
  form.setFieldsValue(obj);
};

// export const singleLanguageCheckboxSelect = (
//   form: FormInstance,
//   e: CheckboxChangeEvent,
//   contentModelId: string,
//   contentModelInternalName: string,
//   permissionType: string,
//   contentModelFields: ContentField[],
//   languageData: ILanguage[],
//   localeName: string
// ) => {
//   const fieldValues = form.getFieldsValue();
//   const obj = {} as ISubmitRoleValuesType;

//   let fieldsCount = 0;
//   let fieldsCheckedCount = 0;
//   let fieldsUncheckedCount = 0;

//   /* eslint-disable-next-line no-plusplus */
//   const fieldsCountIncrement = () => fieldsCount++;

//   /* eslint-disable-next-line no-plusplus */
//   const fieldsCheckedCountIncrement = () => fieldsCheckedCount++;

//   /* eslint-disable-next-line no-plusplus */
//   const fieldsUncheckedCountIncrement = () => fieldsUncheckedCount++;

//   if (e.target.checked) {
//     if (permissionType === 'read') {
//       contentModelFields.forEach((contentModel) => {
//         if (contentModel.contentModelId === contentModelId) {
//           contentModel.fields?.forEach((field) => {
//             fieldsCountIncrement();
//             if (
//               fieldValues['contentLibrary'][contentModelInternalName][
//                 'fieldPermissions'
//               ][field.fieldName].read
//             ) {
//               fieldsCheckedCountIncrement();
//             }
//           });
//         }
//       });
//       languageData.forEach((lan) => {
//         fieldsCountIncrement();
//         if (
//           fieldValues['contentLibrary'][contentModelInternalName][
//             'localePermissions'
//           ][lan.locale].read
//         ) {
//           fieldsCheckedCountIncrement();
//         }
//       });
//       if (fieldsCount === fieldsCheckedCount) {
//         fieldValues['contentLibrary'][contentModelInternalName][
//           'permissions'
//         ].read = true;
//         obj['contentLibrary'] = fieldValues['contentLibrary'];
//         // form.setFieldsValue(obj);
//       }
//     } else {
//       fieldValues['contentLibrary'][contentModelInternalName][
//         'localePermissions'
//       ][localeName].read = true;
//       // fieldValues['contentLibrary'][contentModelInternalName]['localePermissions'][contentFieldName].read = true
//       contentModelFields.forEach((contentModel) => {
//         if (contentModel.contentModelId === contentModelId) {
//           contentModel.fields?.forEach((field) => {
//             fieldsCountIncrement();
//             if (
//               fieldValues['contentLibrary'][contentModelInternalName][
//                 'fieldPermissions'
//               ][field.fieldName].update
//             ) {
//               fieldsCheckedCountIncrement();
//             }
//           });
//         }
//       });
//       languageData.forEach((lan) => {
//         fieldsCountIncrement();
//         if (
//           fieldValues['contentLibrary'][contentModelInternalName][
//             'localePermissions'
//           ][lan.locale].update
//         ) {
//           fieldsCheckedCountIncrement();
//         }
//       });
//       if (fieldsCount === fieldsCheckedCount) {
//         fieldValues['contentLibrary'][contentModelInternalName][
//           'permissions'
//         ].update = true;
//         fieldValues['contentLibrary'][contentModelInternalName][
//           'permissions'
//         ].read = true;
//       }
//       obj['contentLibrary'] = fieldValues['contentLibrary'];
//       // form.setFieldsValue(obj);
//     }
//   } else {
//     contentModelFields.forEach((contentModel) => {
//       // fieldsCountIncrement();
//       if (contentModel.contentModelId === contentModelId) {
//         contentModel.fields?.forEach((field) => {
//           fieldsCountIncrement();
//           if (
//             fieldValues['contentLibrary'][contentModelInternalName][
//               'fieldPermissions'
//             ][field.fieldName][permissionType]
//           ) {
//             fieldsCheckedCountIncrement();
//           } else {
//             fieldsUncheckedCountIncrement();
//           }
//         });
//       }
//     });
//     languageData.forEach((lan) => {
//       fieldsCountIncrement();
//       if (
//         fieldValues['contentLibrary'][contentModelInternalName][
//           'localePermissions'
//         ][lan.locale][permissionType]
//       ) {
//         fieldsCheckedCountIncrement();
//       } else {
//         fieldsUncheckedCountIncrement();
//       }
//     });
//     if (fieldsCount === fieldsCheckedCount) {
//       fieldValues['contentLibrary'][contentModelInternalName]['permissions'][
//         permissionType
//       ] = true;
//       obj['contentLibrary'] = fieldValues['contentLibrary'];
//     }
//     if (fieldsCount === fieldsUncheckedCount) {
//       fieldValues['contentLibrary'][contentModelInternalName]['permissions'][
//         permissionType
//       ] = false;
//       obj['contentLibrary'] = fieldValues['contentLibrary'];
//     }
//     if (permissionType === 'read') {
//       fieldValues['contentLibrary'][contentModelInternalName][
//         'localePermissions'
//       ][localeName].update = false;
//       obj['contentLibrary'] = fieldValues['contentLibrary'];
//     }
//   }
//   form.setFieldsValue(obj);
// };

// To check or uncheck publish permission for environments
export const singleEnvironmentCheckboxSelect = (
  form: FormInstance,
  e: CheckboxChangeEvent,
  contentModelId: string,
  contentModelInternalName: string,
  environmentData: IListEnvironments[],
  contentModelFields: ContentField[],
  // languageData: ILanguage[],
  indeterminateStates: ContentLibraryIndeterminateState,
  setIndeterminateStates: Dispatch<
    SetStateAction<ContentLibraryIndeterminateState>
  >
) => {
  const fieldValues = form.getFieldsValue();
  const obj = {} as ISubmitRoleValuesType;

  let environmentsCount = 0;

  let environmentsCheckedCount = 0;

  let environmentUncheckedCount = 0;

  /* eslint-disable-next-line no-plusplus */
  const environmentsCountIncrement = () => environmentsCount++;

  /* eslint-disable-next-line no-plusplus */
  const environmentsCheckedCountIncrement = () => environmentsCheckedCount++;

  /* eslint-disable-next-line no-plusplus */
  const environmentsUncheckedCountIncrement = () => environmentUncheckedCount++;

  if (e.target.checked) {
    environmentData.forEach((env) => {
      environmentsCountIncrement();
      if (
        fieldValues['contentLibrary'][contentModelInternalName]['publish'][
          env.id
        ]
      ) {
        environmentsCheckedCountIncrement();
      }
    });
    if (environmentsCount === environmentsCheckedCount) {
      const allStates = { ...indeterminateStates };
      allStates[contentModelId].publish = false;
      allStates[contentModelId].read = false;
      setIndeterminateStates(allStates);
      fieldValues['contentLibrary'][contentModelInternalName][
        'permissions'
      ].publish = true;
    } else {
      const allStates = { ...indeterminateStates };
      allStates[contentModelId].publish = true;
      allStates[contentModelId].read = false;
      setIndeterminateStates(allStates);
    }

    contentModelFields.forEach((content) => {
      if (content.contentModelId === contentModelId) {
        fieldValues['contentLibrary'][contentModelInternalName][
          'permissions'
        ].read = true;
        content.fields?.forEach((field) => {
          fieldValues['contentLibrary'][contentModelInternalName][
            'fieldPermissions'
          ][field.fieldName].read = true;
        });
      }
    });

    // languageData.forEach((lan) => {
    //   fieldValues['contentLibrary'][contentModelInternalName][
    //     'localePermissions'
    //   ][lan.locale].read = true;
    // });

    obj['contentLibrary'] = fieldValues['contentLibrary'];
  } else {
    // fieldValues['contentLibrary'][contentModelInternalName]['permissions'].publish = false
    fieldValues['contentLibrary'][contentModelInternalName][
      'permissions'
    ].publish = false;
    environmentData.forEach((env) => {
      environmentsCountIncrement();
      if (
        !fieldValues['contentLibrary'][contentModelInternalName]['publish'][
          env.id
        ]
      ) {
        environmentsUncheckedCountIncrement();
      }
    });

    if (environmentsCount === environmentUncheckedCount) {
      const allStates = { ...indeterminateStates };
      allStates[contentModelId].publish = false;
      setIndeterminateStates(allStates);
    } else {
      const allStates = { ...indeterminateStates };
      allStates[contentModelId].publish = true;
      setIndeterminateStates(allStates);
    }

    // if (environmentsCount === environmentUncheckedCount) {
    //   fieldValues['contentLibrary'][contentModelInternalName][
    //     'permissions'
    //   ].publish = false;
    // }

    obj['contentLibrary'] = fieldValues['contentLibrary'];
  }
  form.setFieldsValue(obj);
};

// To manage content model's field permissions
export const contentModelPermissionMethod = (
  form: FormInstance,
  e: CheckboxChangeEvent,
  contentModelInternalName: string,
  permissionType: string,
  indeterminateStates: ContentModelIndeterminateState,
  setIndeterminateStates: Dispatch<
    SetStateAction<ContentModelIndeterminateState>
  >,
  allContentModelData?: IListContentResponse[]
  // singleTypeContentModelData?: IListContentResponse[]
) => {
  const fieldValues = form.getFieldsValue();
  const obj = {} as ISubmitRoleValuesType;

  let countOfContentFields = 0;

  let checkedCountOfContentFields = 0;

  let uncheckedCountOfContentFields = 0;

  /* eslint-disable-next-line no-plusplus */
  const countOfContentFieldsIncrement = () => (countOfContentFields += 2);

  /* eslint-disable-next-line no-plusplus */
  const checkedCountOfContentFieldsIncrement = () =>
    checkedCountOfContentFields++;

  /* eslint-disable-next-line no-plusplus */
  const uncheckedCountOfContentFieldsIncrement = () =>
    uncheckedCountOfContentFields++;

  allContentModelData?.forEach((content) => {
    countOfContentFieldsIncrement();
  });

  if (e.target.checked) {
    if (permissionType === 'update' || permissionType === 'delete') {
      fieldValues['contentModel']['model'][contentModelInternalName][
        'permissions'
      ].read = true;
      fieldValues['contentModel']['model'][contentModelInternalName][
        'fieldPermissions'
      ].read = true;
      fieldValues['contentModel']['model'][contentModelInternalName][
        'fieldPermissions'
      ][permissionType] = true;
      obj['contentModel'] = fieldValues['contentModel'];

      form.setFieldsValue(obj);

      const latestValues = form.getFieldsValue();

      allContentModelData?.forEach((content) => {
        if (
          latestValues['contentModel']['model'][content.internalName][
            'permissions'
          ][permissionType]
        ) {
          checkedCountOfContentFieldsIncrement();
        }
        if (
          latestValues['contentModel']['model'][content.internalName][
            'fieldPermissions'
          ][permissionType]
        ) {
          checkedCountOfContentFieldsIncrement();
        }
      });

      if (countOfContentFields === checkedCountOfContentFields) {
        latestValues['contentModel']['model']['permissions'].read = true;
        latestValues['contentModel']['model']['permissions'][permissionType] =
          true;
        const tempIndeterminateStates = { ...indeterminateStates };

        tempIndeterminateStates[permissionType] = false;
        tempIndeterminateStates.read = false;
        setIndeterminateStates(tempIndeterminateStates);
      } else {
        const tempIndeterminateStates = { ...indeterminateStates };

        tempIndeterminateStates[permissionType] = true;
        if (!latestValues['contentModel']['model']['permissions'].read) {
          tempIndeterminateStates.read = true;
        }
        setIndeterminateStates(tempIndeterminateStates);
      }

      obj['contentModel'] = latestValues['contentModel'];

      form.setFieldsValue(obj);
    } else {
      fieldValues['contentModel']['model'][contentModelInternalName][
        'fieldPermissions'
      ].read = true;

      obj['contentModel'] = fieldValues['contentModel'];

      form.setFieldsValue(obj);

      const latestValues = form.getFieldsValue();

      allContentModelData?.forEach((content) => {
        if (
          latestValues['contentModel']['model'][content.internalName][
            'permissions'
          ][permissionType]
        ) {
          checkedCountOfContentFieldsIncrement();
        }
        if (
          latestValues['contentModel']['model'][content.internalName][
            'fieldPermissions'
          ][permissionType]
        ) {
          checkedCountOfContentFieldsIncrement();
        }
      });

      if (countOfContentFields === checkedCountOfContentFields) {
        // fieldValues['contentModel']['model']['permissions'].read = true;
        latestValues['contentModel']['model']['permissions'][permissionType] =
          true;
        const tempIndeterminateStates = { ...indeterminateStates };

        tempIndeterminateStates[permissionType] = false;
        setIndeterminateStates(tempIndeterminateStates);
      } else {
        const tempIndeterminateStates = { ...indeterminateStates };

        tempIndeterminateStates[permissionType] = true;
        setIndeterminateStates(tempIndeterminateStates);
      }

      obj['contentModel'] = latestValues['contentModel'];

      form.setFieldsValue(obj);
    }
  } else {
    if (permissionType === 'read') {
      fieldValues['contentModel']['model'][contentModelInternalName][
        'permissions'
      ].update = false;
      fieldValues['contentModel']['model'][contentModelInternalName][
        'permissions'
      ].delete = false;
      fieldValues['contentModel']['model'][contentModelInternalName][
        'fieldPermissions'
      ].create = false;
      fieldValues['contentModel']['model'][contentModelInternalName][
        'fieldPermissions'
      ].read = false;
      fieldValues['contentModel']['model'][contentModelInternalName][
        'fieldPermissions'
      ].update = false;
      fieldValues['contentModel']['model'][contentModelInternalName][
        'fieldPermissions'
      ].delete = false;
      obj['contentModel'] = fieldValues['contentModel'];
      form.setFieldsValue(obj);

      const latestValues = form.getFieldsValue();

      allContentModelData?.forEach((content) => {
        if (
          !latestValues['contentModel']['model'][content.internalName][
            'permissions'
          ][permissionType]
        ) {
          uncheckedCountOfContentFieldsIncrement();
        }
        if (
          !latestValues['contentModel']['model'][content.internalName][
            'fieldPermissions'
          ][permissionType]
        ) {
          uncheckedCountOfContentFieldsIncrement();
        }
      });

      latestValues['contentModel']['model']['permissions'].read = false;
      // latestValues['contentModel']['model']['permissions'].create = false;
      latestValues['contentModel']['model']['permissions'].update = false;
      latestValues['contentModel']['model']['permissions'].delete = false;

      // if (countOfContentFields === uncheckedCountOfContentFields) {
      //   // fieldValues['contentModel']['model']['permissions'].read = false;
      //   latestValues['contentModel']['model']['permissions'].read = false;
      //   latestValues['contentModel']['model']['permissions'].create = false;
      //   latestValues['contentModel']['model']['permissions'].update = false;
      //   latestValues['contentModel']['model']['permissions'].delete = false;
      // }

      if (countOfContentFields === uncheckedCountOfContentFields) {
        const tempIndeterminateStates = { ...indeterminateStates };

        tempIndeterminateStates[permissionType] = false;
        setIndeterminateStates(tempIndeterminateStates);
      } else {
        const tempIndeterminateStates = { ...indeterminateStates };

        tempIndeterminateStates[permissionType] = true;
        if (fieldValues['contentModel']['model']['permissions'].update) {
          tempIndeterminateStates.update = true;
        }
        if (fieldValues['contentModel']['model']['permissions'].delete) {
          tempIndeterminateStates.delete = true;
        }
        // tempIndeterminateStates.delete = true;
        // tempIndeterminateStates.update = true;
        setIndeterminateStates(tempIndeterminateStates);
      }

      obj['contentModel'] = latestValues['contentModel'];

      form.setFieldsValue(obj);
    } else {
      fieldValues['contentModel']['model'][contentModelInternalName][
        'fieldPermissions'
      ][permissionType] = false;
      obj['contentModel'] = fieldValues['contentModel'];
      form.setFieldsValue(obj);

      const latestValues = form.getFieldsValue();

      allContentModelData?.forEach((content) => {
        if (
          !latestValues['contentModel']['model'][content.internalName][
            'permissions'
          ][permissionType]
        ) {
          uncheckedCountOfContentFieldsIncrement();
        }
        if (
          !latestValues['contentModel']['model'][content.internalName][
            'fieldPermissions'
          ][permissionType]
        ) {
          uncheckedCountOfContentFieldsIncrement();
        }
      });

      if (countOfContentFields === uncheckedCountOfContentFields) {
        // fieldValues['contentModel']['model']['permissions'].read = false;
        latestValues['contentModel']['model']['permissions'][permissionType] =
          false;
        const tempIndeterminateStates = { ...indeterminateStates };

        tempIndeterminateStates[permissionType] = false;
        setIndeterminateStates(tempIndeterminateStates);
      } else {
        latestValues['contentModel']['model']['permissions'][permissionType] =
          false;
        const tempIndeterminateStates = { ...indeterminateStates };

        tempIndeterminateStates[permissionType] = true;
        setIndeterminateStates(tempIndeterminateStates);
      }

      obj['contentModel'] = latestValues['contentModel'];

      form.setFieldsValue(obj);
    }
  }
  // form.setFieldsValue(obj);
};

// To manage content model field permissions
export const contentModelSingleCheckboxSelect = (
  form: FormInstance,
  e: CheckboxChangeEvent,
  contentModelInternalName: string,
  permissionType: string,
  indeterminateStates: ContentModelIndeterminateState,
  setIndeterminateStates: Dispatch<
    SetStateAction<ContentModelIndeterminateState>
  >,
  allContentModelData?: IListContentResponse[]
) => {
  const fieldValues = form.getFieldsValue();
  const obj = {} as ISubmitRoleValuesType;

  // let countOfContentFields = 0;

  let countOfCreateFields = 0;

  // let checkedCountOfContentFields = 0;

  // let uncheckedCountOfContentFields = 0;

  let checkedCountOfCreateFields = 0;

  let uncheckedCountOfCreateFields = 0;

  let countOfContentFields = 0;

  let checkedCountOfContentFields = 0;

  // let uncheckedCountOfContentFields = 0;

  /* eslint-disable-next-line no-plusplus */
  const countOfContentFieldsIncrement = () => (countOfContentFields += 2);

  /* eslint-disable-next-line no-plusplus */
  const checkedCountOfContentFieldsIncrement = () =>
    checkedCountOfContentFields++;

  /* eslint-disable-next-line no-plusplus */
  // const uncheckedCountOfContentFieldsIncrement = () =>
  //   uncheckedCountOfContentFields++;

  /* eslint-disable-next-line no-plusplus */
  // const countOfContentFieldsIncrement = () => countOfContentFields+=2;

  /* eslint-disable-next-line no-plusplus */
  const countOfCreateFieldsIncrement = () => countOfCreateFields++;

  /* eslint-disable-next-line no-plusplus */
  const checkedCountOfCreateFieldsIncrement = () =>
    checkedCountOfCreateFields++;

  /* eslint-disable-next-line no-plusplus */
  const uncheckedCountOfCreateFieldsIncrement = () =>
    uncheckedCountOfCreateFields++;

  /* eslint-disable-next-line no-plusplus */
  // const checkedCountOfContentFieldsIncrement = () => checkedCountOfContentFields++;

  /* eslint-disable-next-line no-plusplus */
  // const uncheckedCountOfContentFieldsIncrement = () => uncheckedCountOfContentFields++;

  allContentModelData?.forEach((content) => {
    countOfContentFieldsIncrement();
    countOfCreateFieldsIncrement();
  });

  if (e.target.checked) {
    if (
      permissionType === 'create' ||
      permissionType === 'update' ||
      permissionType === 'delete'
    ) {
      fieldValues['contentModel']['model'][contentModelInternalName][
        'fieldPermissions'
      ].read = true;
      fieldValues['contentModel']['model'][contentModelInternalName][
        'permissions'
      ].read = true;
      fieldValues['contentModel']['model'][contentModelInternalName][
        'permissions'
      ][permissionType] = true;

      if (permissionType === 'create') {
        allContentModelData?.forEach((content) => {
          if (
            fieldValues['contentModel']['model'][content.internalName][
              'fieldPermissions'
            ][permissionType]
          ) {
            checkedCountOfCreateFieldsIncrement();
          }
          // else{
          //   if(fieldValues['contentModel']['model'][content.internalName]['permissions'][permissionType]){
          //     checkedCountOfContentFieldsIncrement();
          //   }
          //   if(fieldValues['contentModel']['model'][content.internalName]['fieldPermissions'][permissionType]){
          //     checkedCountOfContentFieldsIncrement();
          //   }
          // }
        });
      }

      // if(countOfContentFields === checkedCountOfContentFields){
      //   fieldValues['contentModel']['model']['permissions'].read = true;
      //   fieldValues['contentModel']['model']['permissions'][permissionType] = true;
      // }

      if (countOfCreateFields === checkedCountOfCreateFields) {
        fieldValues['contentModel']['model']['permissions'].create = true;
        // fieldValues['contentModel']['model']['permissions'].read = true;
      }

      obj['contentModel'] = fieldValues['contentModel'];

      allContentModelData?.forEach((content) => {
        if (
          fieldValues['contentModel']['model'][content.internalName][
            'permissions'
          ][permissionType]
        ) {
          checkedCountOfContentFieldsIncrement();
        }
        if (
          fieldValues['contentModel']['model'][content.internalName][
            'fieldPermissions'
          ][permissionType]
        ) {
          checkedCountOfContentFieldsIncrement();
        }
      });

      if (countOfContentFields === checkedCountOfContentFields) {
        fieldValues['contentModel']['model']['permissions'].read = true;
        fieldValues['contentModel']['model']['permissions'][permissionType] =
          true;
        const tempIndeterminateStates = { ...indeterminateStates };

        tempIndeterminateStates[permissionType] = false;
        tempIndeterminateStates.read = false;
        setIndeterminateStates(tempIndeterminateStates);
      } else {
        const tempIndeterminateStates = { ...indeterminateStates };

        tempIndeterminateStates[permissionType] = true;
        if (!fieldValues['contentModel']['model']['permissions'].read) {
          tempIndeterminateStates.read = true;
        }
        setIndeterminateStates(tempIndeterminateStates);
      }
    } else {
      allContentModelData?.forEach((content) => {
        if (
          fieldValues['contentModel']['model'][content.internalName][
            'permissions'
          ][permissionType]
        ) {
          checkedCountOfContentFieldsIncrement();
        }
        if (
          fieldValues['contentModel']['model'][content.internalName][
            'fieldPermissions'
          ][permissionType]
        ) {
          checkedCountOfContentFieldsIncrement();
        }
      });

      if (countOfContentFields === checkedCountOfContentFields) {
        fieldValues['contentModel']['model']['permissions'].read = true;
        fieldValues['contentModel']['model']['permissions'][permissionType] =
          true;
        const tempIndeterminateStates = { ...indeterminateStates };

        tempIndeterminateStates[permissionType] = false;
        tempIndeterminateStates.read = false;
        setIndeterminateStates(tempIndeterminateStates);
      } else {
        const tempIndeterminateStates = { ...indeterminateStates };

        tempIndeterminateStates[permissionType] = true;
        if (!fieldValues['contentModel']['model']['permissions'].read) {
          tempIndeterminateStates.read = true;
        }
        setIndeterminateStates(tempIndeterminateStates);
      }

      fieldValues['contentModel']['model'][contentModelInternalName][
        'permissions'
      ].read = true;
      obj['contentModel'] = fieldValues['contentModel'];
    }
  } else {
    if (permissionType === 'read') {
      fieldValues['contentModel']['model'][contentModelInternalName][
        'fieldPermissions'
      ].create = false;
      fieldValues['contentModel']['model'][contentModelInternalName][
        'fieldPermissions'
      ].update = false;
      fieldValues['contentModel']['model'][contentModelInternalName][
        'fieldPermissions'
      ].delete = false;
    } else {
      if (permissionType === 'create') {
        allContentModelData?.forEach((content) => {
          if (
            !fieldValues['contentModel']['model'][content.internalName][
              'fieldPermissions'
            ][permissionType]
          ) {
            uncheckedCountOfCreateFieldsIncrement();
          }
          // else{
          //   if(!fieldValues['contentModel']['model'][content.internalName]['permissions'][permissionType]){
          //     uncheckedCountOfContentFieldsIncrement();
          //   }
          //   if(!fieldValues['contentModel']['model'][content.internalName]['fieldPermissions'][permissionType]){
          //     uncheckedCountOfContentFieldsIncrement();
          //   }
          // }
        });
      }

      // if(countOfContentFields === uncheckedCountOfContentFields){
      //   fieldValues['contentModel']['model']['permissions'][permissionType] = false;
      // }

      if (countOfCreateFields === uncheckedCountOfCreateFields) {
        fieldValues['contentModel']['model']['permissions'].create = false;
      }
    }
  }
  obj['contentModel'] = fieldValues['contentModel'];
  form.setFieldsValue(obj);
};

export const contentModelComponentPermission = (
  form: FormInstance,
  e: CheckboxChangeEvent,
  // permissionName: string,
  permissionType: string
) => {
  const fieldValues = form.getFieldsValue();

  const obj = {} as ISubmitRoleValuesType;
  if (e.target.checked) {
    if (
      permissionType === 'create' ||
      permissionType === 'update' ||
      permissionType === 'delete'
    ) {
      fieldValues['contentModel']['components']['permissions'].read = true;
      obj['contentModel'] = fieldValues['contentModel'];
    }
  } else {
    if (permissionType === 'read') {
      fieldValues['contentModel']['components']['permissions'].create = false;
      fieldValues['contentModel']['components']['permissions'].update = false;
      fieldValues['contentModel']['components']['permissions'].delete = false;
      obj['contentModel'] = fieldValues['contentModel'];
    }
  }
  form.setFieldsValue(obj);
};

// To manage all content model permissions
export const checkAllChildModelPermissions = (
  form: FormInstance,
  e: CheckboxChangeEvent,
  permissionType: string,
  indeterminateStates: ContentModelIndeterminateState,
  setIndeterminateStates: Dispatch<
    SetStateAction<ContentModelIndeterminateState>
  >,
  allContentModelData?: IListContentResponse[]
) => {
  const obj = {} as ISubmitRoleValuesType;
  const fieldValues = form.getFieldsValue();

  if (e.target.checked) {
    // const tempIndeterminateStates = {...indeterminateStates};

    // tempIndeterminateStates[permissionType] = false;
    // tempIndeterminateStates.read = false
    // setIndeterminateStates(tempIndeterminateStates);
    if (
      permissionType === 'create' ||
      permissionType === 'update' ||
      permissionType === 'delete'
    ) {
      const tempIndeterminateStates = { ...indeterminateStates };

      tempIndeterminateStates[permissionType] = false;
      tempIndeterminateStates.read = false;
      setIndeterminateStates(tempIndeterminateStates);
      fieldValues['contentModel']['model']['permissions'].read = true;
      allContentModelData?.forEach((model) => {
        fieldValues['contentModel']['model'][model.internalName][
          'permissions'
        ].read = true;
        fieldValues['contentModel']['model'][model.internalName][
          'fieldPermissions'
        ].read = true;
        fieldValues['contentModel']['model'][model.internalName][
          'fieldPermissions'
        ][permissionType] = true;
        if (permissionType !== 'create') {
          fieldValues['contentModel']['model'][model.internalName][
            'permissions'
          ][permissionType] = true;
        }
      });
      obj['contentModel'] = fieldValues['contentModel'];
    } else {
      const tempIndeterminateStates = { ...indeterminateStates };

      tempIndeterminateStates[permissionType] = false;
      setIndeterminateStates(tempIndeterminateStates);

      allContentModelData?.forEach((model) => {
        fieldValues['contentModel']['model'][model.internalName][
          'fieldPermissions'
        ][permissionType] = true;

        fieldValues['contentModel']['model'][model.internalName]['permissions'][
          permissionType
        ] = true;
      });
      obj['contentModel'] = fieldValues['contentModel'];
    }
  } else {
    if (permissionType === 'read') {
      fieldValues['contentModel']['model']['permissions'].create = false;
      fieldValues['contentModel']['model']['permissions'].update = false;
      fieldValues['contentModel']['model']['permissions'].delete = false;
      allContentModelData?.forEach((model) => {
        fieldValues['contentModel']['model'][model.internalName][
          'permissions'
        ].read = false;
        fieldValues['contentModel']['model'][model.internalName][
          'fieldPermissions'
        ].read = false;
        //fieldValues['contentModel']['model'][model.internalName]['permissions'].read = false;
        fieldValues['contentModel']['model'][model.internalName][
          'fieldPermissions'
        ].create = false;
        fieldValues['contentModel']['model'][model.internalName][
          'permissions'
        ].update = false;
        fieldValues['contentModel']['model'][model.internalName][
          'fieldPermissions'
        ].update = false;
        fieldValues['contentModel']['model'][model.internalName][
          'permissions'
        ].delete = false;
        fieldValues['contentModel']['model'][model.internalName][
          'fieldPermissions'
        ].delete = false;
      });
      obj['contentModel'] = fieldValues['contentModel'];
      const tempIndeterminateStates = { ...indeterminateStates };

      tempIndeterminateStates[permissionType] = false;
      tempIndeterminateStates.update = false;
      tempIndeterminateStates.delete = false;

      setIndeterminateStates(tempIndeterminateStates);
    } else {
      allContentModelData?.forEach((model) => {
        fieldValues['contentModel']['model'][model.internalName][
          'fieldPermissions'
        ][permissionType] = false;
        if (permissionType !== 'create') {
          fieldValues['contentModel']['model'][model.internalName][
            'permissions'
          ][permissionType] = false;
        }
      });

      obj['contentModel'] = fieldValues['contentModel'];

      const tempIndeterminateStates = { ...indeterminateStates };

      tempIndeterminateStates[permissionType] = false;

      setIndeterminateStates(tempIndeterminateStates);
    }
  }
  form.setFieldsValue(obj);
};

// Method to check parent field when all child fields are checked
// export const checkSpecificParentFields = (
//   form: FormInstance,
//   collectionOrSingleTypeData: CollectionAndSingleType[],
//   componentType: string,
//   permissionName: string
// ) => {
//   const fieldValues = form.getFieldsValue();

//   let parentCheckedCount = 0;

//   /* eslint-disable-next-line no-plusplus */
//   const parentCheckedCountIncrement = () => parentCheckedCount++;

//   const parentIdArray: string[] = [];

//   collectionOrSingleTypeData.forEach(
//     (singleOrCollectionType: RoleAPIElementType) => {
//       parentIdArray.push(singleOrCollectionType.value);
//     }
//   );

//   parentIdArray.forEach((parentId) => {
//     if (fieldValues[`${parentId}-${permissionName}`]) {
//       parentCheckedCountIncrement();
//     }
//   });

//   if (parentCheckedCount === parentIdArray.length) {
//     form.setFieldsValue({
//       [`${componentType}-${permissionName}`]: true,
//     });
//   }
// };

// // Method to check all parent checkbox when all lower parent checkboxes are checked
// export const checkAllParents = (
//   form: FormInstance,
//   collectionOrSingleTypeData: CollectionAndSingleType[],
//   componentType: string
// ) => {
//   const fieldValues = form.getFieldsValue();

//   let parentCheckedCount = 0;

//   /* eslint-disable-next-line no-plusplus */
//   const parentCheckedCountIncrement = () => parentCheckedCount++;

//   const parentLabelArray: string[] = [];

//   collectionOrSingleTypeData.forEach(
//     (singleOrCollectionType: RoleAPIElementType) => {
//       parentLabelArray.push(singleOrCollectionType.label);
//     }
//   );

//   parentLabelArray.forEach((parentLabel) => {
//     if (fieldValues[parentLabel]) {
//       parentCheckedCountIncrement();
//     }
//   });

//   if (parentCheckedCount === parentLabelArray.length) {
//     form.setFieldsValue({
//       [`${componentType}-create`]: true,
//       [`${componentType}-read`]: true,
//       [`${componentType}-update`]: true,
//       [`${componentType}-delete`]: true,
//       [`${componentType}-publish`]: true,
//     });
//   }
// };

// // Method to check specific permission's all field and language checkboxes are selected or not.
// // And all fields and languages of specific permissions are checked than parent field of that specific permission is checked by this method.
// export const checkSpecificPermission = (
//   form: FormInstance,
//   parentId: string,
//   permissionName: string,
//   collectionOrSingleTypeData: CollectionAndSingleType[],
//   languageData: ILanguage[],
//   componentType: string
// ) => {
//   const fieldValues = form.getFieldsValue();

//   let checkboxCheckedCount = 0;

//   /* eslint-disable-next-line no-plusplus */
//   const checkboxCheckedIncrement = () => checkboxCheckedCount++;

//   const allFields: string[] = [];
//   const allLanguage: string[] = [];
//   const allValues: string[] = [];

//   collectionOrSingleTypeData.forEach(
//     (singleOrCollectionType: RoleAPIElementType) => {
//       if (singleOrCollectionType.value === parentId) {
//         singleOrCollectionType.fields.forEach((fields) => {
//           allFields.push(fields.value);
//           allValues.push(fields.value);
//         });
//         languageData.forEach((language) => {
//           allLanguage.push(language.locale);
//           allValues.push(language.locale);
//         });
//       }
//     }
//   );

//   allFields.forEach((fields) => {
//     if (
//       fieldValues[componentType][parentId].fieldPermissions[fields][
//         permissionName
//       ]
//     ) {
//       checkboxCheckedIncrement();
//     }
//   });

//   allLanguage.forEach((language) => {
//     if (
//       fieldValues[componentType][parentId].localePermissions[language][
//         permissionName
//       ]
//     ) {
//       checkboxCheckedIncrement();
//     }
//   });

//   if (checkboxCheckedCount === allValues.length) {
//     form.setFieldsValue({ [`${parentId}-${permissionName}`]: true });
//   }
// };

// // To check all read permissions are selected or not when we click on create,update,delete or publish permissions.
// // And according to that read permissions parent of read permission is checked
// export const checkReadPermissions = (
//   form: FormInstance,
//   parentId: string,
//   collectionOrSingleTypeData: CollectionAndSingleType[],
//   languageData: ILanguage[],
//   componentType: string
// ) => {
//   const fieldValues = form.getFieldsValue();

//   let readCheckedCount = 0;

//   /* eslint-disable-next-line no-plusplus */
//   const readCheckedCountIncrement = () => readCheckedCount++;

//   const allFields: string[] = [];
//   const allLanguages: string[] = [];
//   const allValues: string[] = [];

//   collectionOrSingleTypeData.forEach(
//     (singleOrCollectionType: RoleAPIElementType) => {
//       if (singleOrCollectionType.value === parentId) {
//         singleOrCollectionType.fields.forEach((fields) => {
//           allFields.push(fields.value);
//           allValues.push(fields.value);
//         });
//         languageData.forEach((language) => {
//           allLanguages.push(language.locale);
//           allValues.push(language.name);
//         });
//       }
//     }
//   );

//   allFields.forEach((fields) => {
//     if (fieldValues[componentType][parentId].fieldPermissions[fields].read) {
//       readCheckedCountIncrement();
//     }
//   });

//   allLanguages.forEach((language) => {
//     if (fieldValues[componentType][parentId].localePermissions[language].read) {
//       readCheckedCountIncrement();
//     }
//   });

//   if (readCheckedCount === allValues.length) {
//     form.setFieldsValue({ [`${parentId}-read`]: true });
//   }
// };

// export const checkSpecificPermissions = (
//   form: FormInstance,
//   parentId: string,
//   collectionOrSingleTypeData: CollectionAndSingleType[],
//   languageData: ILanguage[],
//   componentType: string,
//   permissionName: string
// ) => {
//   const fieldValues = form.getFieldsValue();

//   let permissionCheckedCount = 0;

//   /* eslint-disable-next-line no-plusplus */
//   const readCheckedCountIncrement = () => permissionCheckedCount++;

//   const allFields: string[] = [];
//   const allLanguages: string[] = [];
//   const allValues: string[] = [];

//   collectionOrSingleTypeData.forEach(
//     (singleOrCollectionType: RoleAPIElementType) => {
//       if (singleOrCollectionType.value === parentId) {
//         singleOrCollectionType.fields.forEach((fields) => {
//           allFields.push(fields.value);
//           allValues.push(fields.value);
//         });
//         languageData.forEach((language) => {
//           allLanguages.push(language.locale);
//           allValues.push(language.name);
//         });
//       }
//     }
//   );

//   allFields.forEach((fields) => {
//     if (
//       fieldValues[componentType][parentId].fieldPermissions[fields][
//         permissionName
//       ]
//     ) {
//       readCheckedCountIncrement();
//     }
//   });

//   allLanguages.forEach((language) => {
//     if (
//       fieldValues[componentType][parentId].localePermissions[language][
//         permissionName
//       ]
//     ) {
//       readCheckedCountIncrement();
//     }
//   });

//   if (permissionCheckedCount === allValues.length) {
//     form.setFieldsValue({ [`${parentId}-${permissionName}`]: true });
//   }
// };

// // Function to check if all permissions of the same field or language is checked or not
// export const sameFieldsCheckboxChecked = (
//   form: FormInstance,
//   parentId: string,
//   eleName: string,
//   componentType: string,
//   permissionType: string
// ) => {
//   const fieldValues = form.getFieldsValue();

//   if (
//     fieldValues[componentType][parentId][permissionType][eleName].create ===
//       true &&
//     fieldValues[componentType][parentId][permissionType][eleName].read ===
//       true &&
//     fieldValues[componentType][parentId][permissionType][eleName].update ===
//       true &&
//     fieldValues[componentType][parentId][permissionType][eleName].delete ===
//       true &&
//     fieldValues[componentType][parentId][permissionType][eleName].publish ===
//       true
//   ) {
//     return true;
//   }
//   return false;
// };

// // Function for single field checkbox change
// // When field permission checkbox clicked this method check if all permissions of that field is checked or not and perform lower parent checkbox change.
// // This method also check same permissions of all fields are checked or not and perform parent checkobx change according to all child permissions.
// export const singleFieldCheckBoxSelect = (
//   form: FormInstance,
//   collectionOrSingleTypeData: CollectionAndSingleType[],
//   languageData: ILanguage[],
//   componentType: string,
//   e: CheckboxChangeEvent,
//   eleName: string,
//   parentId: string,
//   upperParentId: string,
//   lowerParentId: string,
//   checkAllId: string,
//   permissionName: string
// ) => {
//   const fieldValues = form.getFieldsValue();

//   const fields: string[] = [];

//   let permissionFieldCheckedCount = 0;

//   let readFieldCheckedCount = 0;

//   /* eslint-disable-next-line no-plusplus */
//   const permissionCheckedCountIncrement = () => permissionFieldCheckedCount++;

//   /* eslint-disable-next-line no-plusplus */
//   const readCheckedCountIncrement = () => readFieldCheckedCount++;

//   collectionOrSingleTypeData.forEach(
//     (singleOrCollectionType: RoleAPIElementType) => {
//       if (singleOrCollectionType.value === parentId) {
//         singleOrCollectionType.fields.forEach((field) => {
//           fields.push(field.value);
//         });
//       }
//     }
//   );

//   // To check if all permissions in the same group is checked or not
//   if (e.target.checked) {
//     if (
//       permissionName === 'create' ||
//       permissionName === 'update' ||
//       permissionName === 'delete' ||
//       permissionName === 'publish'
//     ) {
//       fieldValues[componentType][parentId].fieldPermissions[eleName].read =
//         true;
//       const obj: RoleFormObjectType = {};

//       obj[componentType] = fieldValues[componentType];

//       form.setFieldsValue(obj);
//     }

//     const allSameFieldChecked = sameFieldsCheckboxChecked(
//       form,
//       parentId,
//       eleName,
//       componentType,
//       'fieldPermissions'
//     );

//     if (allSameFieldChecked) {
//       form.setFieldsValue({ [lowerParentId]: true });
//     }

//     fields.forEach((field) => {
//       if (
//         fieldValues[componentType][parentId].fieldPermissions[field][
//           permissionName
//         ]
//       ) {
//         permissionCheckedCountIncrement();
//       }
//     });

//     fields.forEach((field) => {
//       if (fieldValues[componentType][parentId].fieldPermissions[field].read) {
//         readCheckedCountIncrement();
//       }
//     });

//     if (permissionFieldCheckedCount === fields.length) {
//       form.setFieldsValue({ [`${parentId}-${permissionName}-Field`]: true });
//     }

//     if (readFieldCheckedCount === fields.length) {
//       form.setFieldsValue({ [`${parentId}-read-Field`]: true });
//     }

//     checkSpecificPermission(
//       form,
//       parentId,
//       permissionName,
//       collectionOrSingleTypeData,
//       languageData,
//       componentType
//     );

//     checkReadPermissions(
//       form,
//       parentId,
//       collectionOrSingleTypeData,
//       languageData,
//       componentType
//     );
//     checkSpecificPermissions(
//       form,
//       parentId,
//       collectionOrSingleTypeData,
//       languageData,
//       componentType,
//       permissionName
//     );
//   } else {
//     if (permissionName === 'read') {
//       form.setFieldsValue({
//         [`${componentType}-create`]: false,
//         [`${componentType}-update`]: false,
//         [`${componentType}-delete`]: false,
//         [`${componentType}-publish`]: false,
//         [`${parentId}-create-Field`]: false,
//         [`${parentId}-update-Field`]: false,
//         [`${parentId}-delete-Field`]: false,
//         [`${parentId}-publish-Field`]: false,
//         [`${parentId}-create`]: false,
//         [`${parentId}-update`]: false,
//         [`${parentId}-delete`]: false,
//         [`${parentId}-publish`]: false,
//       });

//       fieldValues[componentType][parentId].fieldPermissions[eleName].create =
//         false;
//       fieldValues[componentType][parentId].fieldPermissions[eleName].update =
//         false;
//       fieldValues[componentType][parentId].fieldPermissions[eleName].delete =
//         false;
//       fieldValues[componentType][parentId].fieldPermissions[eleName].publish =
//         false;
//       const obj: RoleFormObjectType = {};

//       obj[componentType] = fieldValues[componentType];

//       form.setFieldsValue(obj);
//     }

//     form.setFieldsValue({
//       [lowerParentId]: false,
//       [`${parentId}-${permissionName}-Field`]: false,
//       [upperParentId]: false,
//       [`${componentType}-${permissionName}`]: false,
//       [checkAllId]: false,
//     });
//   }
// };

// // Function for single language checkbox change
// // When language permission checkbox clicked this method check if all permissions of that field is checked or not and perform lower parent checkbox change.
// // This method also check same permissions of all languages are checked or not and perform parent checkobx change according to all child permissions.
// export const singleLanguageCheckBoxSelect = (
//   form: FormInstance,
//   collectionOrSingleTypeData: CollectionAndSingleType[],
//   languageData: ILanguage[],
//   componentType: string,
//   e: CheckboxChangeEvent,
//   eleName: string,
//   parentId: string,
//   upperParentId: string,
//   lowerParentId: string,
//   checkAllId: string,
//   permissionName: string
// ) => {
//   const fieldValues = form.getFieldsValue();

//   const languageFields: string[] = [];

//   let permissionLanguageCheckedCount = 0;

//   let readLanguageCheckedCount = 0;

//   /* eslint-disable-next-line no-plusplus */
//   const permissionCheckedCountIncrement = () =>
//     permissionLanguageCheckedCount++;

//   /* eslint-disable-next-line no-plusplus */
//   const readCheckedCountIncrement = () => readLanguageCheckedCount++;

//   collectionOrSingleTypeData.forEach(
//     (singleOrCollectionType: RoleAPIElementType) => {
//       if (singleOrCollectionType.value === parentId) {
//         languageData.forEach((language) => {
//           languageFields.push(language.locale);
//         });
//       }
//     }
//   );

//   if (e.target.checked) {
//     if (
//       permissionName === 'create' ||
//       permissionName === 'update' ||
//       permissionName === 'delete' ||
//       permissionName === 'publish'
//     ) {
//       fieldValues[componentType][parentId].localePermissions[eleName].read =
//         true;
//       const obj: RoleFormObjectType = {};

//       obj[componentType] = fieldValues[componentType];

//       form.setFieldsValue(obj);
//     }

//     const allSameFieldChecked = sameFieldsCheckboxChecked(
//       form,
//       parentId,
//       eleName,
//       componentType,
//       'localePermissions'
//     );

//     if (allSameFieldChecked) {
//       form.setFieldsValue({ [lowerParentId]: true });
//     }

//     languageFields.forEach((fields) => {
//       if (
//         fieldValues[componentType][parentId].localePermissions[fields][
//           permissionName
//         ]
//       ) {
//         permissionCheckedCountIncrement();
//       }
//     });

//     languageFields.forEach((fields) => {
//       if (fieldValues[componentType][parentId].localePermissions[fields].read) {
//         readCheckedCountIncrement();
//       }
//     });

//     if (permissionLanguageCheckedCount === languageFields.length) {
//       form.setFieldsValue({ [`${parentId}-${permissionName}-Language`]: true });
//     }

//     if (readLanguageCheckedCount === languageFields.length) {
//       form.setFieldsValue({ [`${parentId}-read-Language`]: true });
//     }

//     checkSpecificPermission(
//       form,
//       parentId,
//       permissionName,
//       collectionOrSingleTypeData,
//       languageData,
//       componentType
//     );

//     checkReadPermissions(
//       form,
//       parentId,
//       collectionOrSingleTypeData,
//       languageData,
//       componentType
//     );
//     checkSpecificPermissions(
//       form,
//       parentId,
//       collectionOrSingleTypeData,
//       languageData,
//       componentType,
//       permissionName
//     );
//   } else {
//     if (permissionName === 'read') {
//       form.setFieldsValue({
//         [`${componentType}-create`]: false,
//         [`${componentType}-update`]: false,
//         [`${componentType}-delete`]: false,
//         [`${componentType}-publish`]: false,
//         [`${parentId}-create-Language`]: false,
//         [`${parentId}-update-Language`]: false,
//         [`${parentId}-delete-Language`]: false,
//         [`${parentId}-publish-Language`]: false,
//         [`${parentId}-create`]: false,
//         [`${parentId}-update`]: false,
//         [`${parentId}-delete`]: false,
//         [`${parentId}-publish`]: false,
//       });

//       fieldValues[componentType][parentId].localePermissions[eleName].create =
//         false;
//       fieldValues[componentType][parentId].localePermissions[eleName].update =
//         false;
//       fieldValues[componentType][parentId].localePermissions[eleName].delete =
//         false;
//       fieldValues[componentType][parentId].localePermissions[eleName].publish =
//         false;
//       const obj: RoleFormObjectType = {};

//       obj[componentType] = fieldValues[componentType];

//       form.setFieldsValue(obj);
//     }

//     form.setFieldsValue({
//       [lowerParentId]: false,
//       [`${parentId}-${permissionName}-Language`]: false,
//       [upperParentId]: false,
//       [`${componentType}-${permissionName}`]: false,
//       [checkAllId]: false,
//     });
//   }
// };

// // Function to check if all lower parent (Field label and language label) are checked or not.
// // And if all lower parent are checked than this method check all upper parents.
// export const checkAllLabels = (
//   form: FormInstance,
//   collectionOrSingleTypeData: CollectionAndSingleType[],
//   languageData: ILanguage[],
//   parentId: string,
//   checkAllId: string
// ) => {
//   const fieldsValue = form.getFieldsValue();

//   let labelCheckedCount = 0;

//   /* eslint-disable-next-line no-plusplus */
//   const labelCheckedCountIncrement = () => labelCheckedCount++;

//   const labelArray: string[] = [];

//   collectionOrSingleTypeData.forEach(
//     (singleOrCollectionType: RoleAPIElementType) => {
//       if (singleOrCollectionType.value === parentId) {
//         singleOrCollectionType.fields.forEach((fields) => {
//           labelArray.push(fields.label);
//         });
//         languageData.forEach((languageField) => {
//           labelArray.push(languageField.name);
//         });
//       }
//     }
//   );

//   labelArray.forEach((label) => {
//     if (fieldsValue[`${parentId}-${label}`]) {
//       labelCheckedCountIncrement();
//     }
//   });

//   if (labelCheckedCount === labelArray.length) {
//     form.setFieldsValue({
//       [`${parentId}-create`]: true,
//       [`${parentId}-read`]: true,
//       [`${parentId}-update`]: true,
//       [`${parentId}-delete`]: true,
//       [`${parentId}-publish`]: true,
//       [checkAllId]: true,
//     });
//   }
// };

// // Function to check if all field's lower parents are checked or not
// // And if all field's lower parents are checked this method checkes all field permissions checkbox
// export const checkAllFieldPermissions = (
//   form: FormInstance,
//   collectionOrSingleTypeData: CollectionAndSingleType[],
//   e: CheckboxChangeEvent,
//   eleName: string,
//   parentId: string,
//   checkAllId: string
// ) => {
//   const fieldValues = form.getFieldsValue();

//   let fieldLabelCheckedCount = 0;

//   /* eslint-disable-next-line no-plusplus */
//   const fieldCheckedCountIncrement = () => fieldLabelCheckedCount++;

//   const labelArray: string[] = [];

//   collectionOrSingleTypeData.forEach(
//     (singleOrCollectionType: RoleAPIElementType) => {
//       if (singleOrCollectionType.value === parentId) {
//         singleOrCollectionType.fields.forEach((field) => {
//           labelArray.push(field.label);
//         });
//       }
//     }
//   );

//   labelArray.forEach((label) => {
//     if (fieldValues[`${parentId}-${label}`]) {
//       fieldCheckedCountIncrement();
//     }
//   });

//   if (fieldLabelCheckedCount === labelArray.length) {
//     form.setFieldsValue({
//       [`${parentId}-create-Field`]: true,
//       [`${parentId}-read-Field`]: true,
//       [`${parentId}-update-Field`]: true,
//       [`${parentId}-delete-Field`]: true,
//       [`${parentId}-publish-Field`]: true,
//     });
//   }
// };

// // Function to check if all language's lower parents are checked or not
// // And if all language's lower parents are checked this method checkes all language permissions checkbox
// export const checkAllLanguagePermissions = (
//   form: FormInstance,
//   languageData: ILanguage[],
//   e: CheckboxChangeEvent,
//   eleName: string,
//   parentId: string,
//   checkAllId: string
// ) => {
//   const fieldValues = form.getFieldsValue();

//   let languageLabelCheckedCount = 0;

//   /* eslint-disable-next-line no-plusplus */
//   const languageLabelCountIncrement = () => languageLabelCheckedCount++;

//   const labelArray: string[] = [];

//   languageData.forEach((language) => {
//     labelArray.push(language.name);
//   });

//   labelArray.forEach((label) => {
//     if (fieldValues[`${parentId}-${label}`]) {
//       languageLabelCountIncrement();
//     }
//   });

//   if (languageLabelCheckedCount === labelArray.length) {
//     form.setFieldsValue({
//       [`${parentId}-create-Language`]: true,
//       [`${parentId}-read-Language`]: true,
//       [`${parentId}-update-Language`]: true,
//       [`${parentId}-delete-Language`]: true,
//       [`${parentId}-publish-Language`]: true,
//     });
//   }
// };

// // Function to check all permission's parent checkboxes are checked or not
// // And if all permissions's parent checkbox are checked than this method checkes all lower parents
// export const checkParentPermissions = (
//   form: FormInstance,
//   collectionOrSingleTypeData: CollectionAndSingleType[],
//   languageData: ILanguage[],
//   parentId: string,
//   checkAllId: string
// ) => {
//   const fieldValues = form.getFieldsValue();

//   if (
//     fieldValues[`${parentId}-create`] &&
//     fieldValues[`${parentId}-read`] &&
//     fieldValues[`${parentId}-update`] &&
//     fieldValues[`${parentId}-delete`] &&
//     fieldValues[`${parentId}-publish`]
//   ) {
//     form.setFieldsValue({ [checkAllId]: true });
//     collectionOrSingleTypeData.forEach(
//       (singleOrCollectionType: RoleAPIElementType) => {
//         if (singleOrCollectionType.value === parentId) {
//           singleOrCollectionType.fields.forEach((field) => {
//             form.setFieldsValue({ [`${parentId}-${field.label}`]: true });
//           });
//           languageData.forEach((language) => {
//             form.setFieldsValue({
//               [`${parentId}-${language.name}`]: true,
//             });
//           });
//         }
//       }
//     );
//   } else {
//     form.setFieldsValue({ [checkAllId]: false });
//   }
// };

// // Function to check all permission's super parents are checked or not
// // If all permission's super parents are checked than this function checkes all lower parent chekboxes
// export const checkAllParentPermissions = (
//   form: FormInstance,
//   collectionOrSingleTypeData: CollectionAndSingleType[],
//   languageData: ILanguage[],
//   componentType: string
// ) => {
//   const fieldValues = form.getFieldsValue();

//   if (
//     fieldValues[`${componentType}-create`] &&
//     fieldValues[`${componentType}-read`] &&
//     fieldValues[`${componentType}-update`] &&
//     fieldValues[`${componentType}-delete`] &&
//     fieldValues[`${componentType}-publish`]
//   ) {
//     collectionOrSingleTypeData.forEach(
//       (singleOrCollectionType: RoleAPIElementType) => {
//         form.setFieldsValue({
//           [singleOrCollectionType.label]: true,
//         });
//         singleOrCollectionType.fields.forEach((field) => {
//           form.setFieldsValue({
//             [`${singleOrCollectionType.value}-${field.label}`]: true,
//           });
//         });
//         languageData.forEach((language) => {
//           form.setFieldsValue({
//             [`${singleOrCollectionType.value}-${language.name}`]: true,
//           });
//         });
//       }
//     );
//   }
// };

// // Function to check all child permissions, fields, languages, lower parent when clicked on parent
// export const checkAllChilds = (
//   form: FormInstance,
//   collectionOrSingleTypeData: CollectionAndSingleType[],
//   languageData: ILanguage[],
//   componentType: string,
//   e: CheckboxChangeEvent,
//   parentId: string
// ) => {
//   const values = form.getFieldsValue();

//   const obj: RoleFormObjectType = {};

//   if (e.target.checked) {
//     permissionArray.forEach((permission) => {
//       form.setFieldsValue({
//         [`${parentId}-${permission}`]: true,
//         [`${parentId}-${permission}-Field`]: true,
//         [`${parentId}-${permission}-Language`]: true,
//       });
//     });

//     collectionOrSingleTypeData.forEach(
//       (singleOrCollectionType: RoleAPIElementType) => {
//         if (singleOrCollectionType.value === parentId) {
//           singleOrCollectionType.fields.forEach((field) => {
//             form.setFieldsValue({ [`${parentId}-${field.label}`]: true });
//           });
//           languageData.forEach((language) => {
//             form.setFieldsValue({
//               [`${parentId}-${language.name}`]: true,
//             });
//           });
//         }
//       }
//     );

//     permissionArray.forEach((permission) => {
//       collectionOrSingleTypeData.forEach(
//         (singleOrCollectionType: RoleAPIElementType) => {
//           if (singleOrCollectionType.value === parentId) {
//             singleOrCollectionType.fields.forEach((field) => {
//               values[componentType][parentId].fieldPermissions[field.value][
//                 permission
//               ] = true;
//             });
//             languageData.forEach((language) => {
//               values[componentType][parentId].localePermissions[
//                 language.locale
//               ][permission] = true;
//             });
//           }
//         }
//       );
//     });

//     obj[componentType] = values[componentType];

//     form.setFieldsValue(obj);
//   } else {
//     permissionArray.forEach((permission) => {
//       form.setFieldsValue({
//         [`${parentId}-${permission}`]: false,
//         [`${parentId}-${permission}-Field`]: false,
//         [`${parentId}-${permission}-Language`]: false,
//         [`${componentType}-create`]: false,
//         [`${componentType}-read`]: false,
//         [`${componentType}-update`]: false,
//         [`${componentType}-delete`]: false,
//         [`${componentType}-publish`]: false,
//       });
//     });

//     collectionOrSingleTypeData.forEach(
//       (singleOrCollectionType: RoleAPIElementType) => {
//         if (singleOrCollectionType.value === parentId) {
//           singleOrCollectionType.fields.forEach((field) => {
//             form.setFieldsValue({ [`${parentId}-${field.label}`]: false });
//           });
//           languageData.forEach((language) => {
//             form.setFieldsValue({
//               [`${parentId}-${language.name}`]: false,
//             });
//           });
//         }
//       }
//     );

//     permissionArray.forEach((permission) => {
//       collectionOrSingleTypeData.forEach(
//         (singleOrCollectionType: RoleAPIElementType) => {
//           if (singleOrCollectionType.value === parentId) {
//             singleOrCollectionType.fields.forEach((field) => {
//               values[componentType][parentId].fieldPermissions[field.value][
//                 permission
//               ] = false;
//             });
//             languageData.forEach((language) => {
//               values[componentType][parentId].localePermissions[
//                 language.locale
//               ][permission] = false;
//             });
//           }
//         }
//       );
//     });

//     obj[componentType] = values[componentType];

//     form.setFieldsValue(obj);
//   }

//   checkAllParents(form, collectionOrSingleTypeData, componentType);
// };

// // function to check all child field and language permissions when click on parent permission
// export const checkAllChildPermissions = (
//   form: FormInstance,
//   collectionOrSingleTypeData: CollectionAndSingleType[],
//   languageData: ILanguage[],
//   componentType: string,
//   e: CheckboxChangeEvent,
//   permissionName: string,
//   parentId: string,
//   checkAllId: string
// ) => {
//   const fieldsValue = form.getFieldsValue();

//   const obj: RoleFormObjectType = {};

//   const parentArray: string[] = [];

//   let parentFieldCheckedCount = 0;

//   /* eslint-disable-next-line no-plusplus */
//   const parentCheckedCountIncrement = () => parentFieldCheckedCount++;

//   if (e.target.checked) {
//     if (
//       permissionName === 'create' ||
//       permissionName === 'update' ||
//       permissionName === 'delete' ||
//       permissionName === 'publish'
//     ) {
//       form.setFieldsValue({
//         [`${parentId}-read`]: true,
//         [`${parentId}-read-Field`]: true,
//         [`${parentId}-read-Language`]: true,
//         [`${parentId}-${permissionName}-Field`]: true,
//         [`${parentId}-${permissionName}-Language`]: true,
//       });
//       collectionOrSingleTypeData.forEach(
//         (singleOrCollectionType: RoleAPIElementType) => {
//           parentArray.push(singleOrCollectionType.value);
//           if (singleOrCollectionType.value === parentId) {
//             singleOrCollectionType.fields.forEach((field) => {
//               fieldsValue[componentType][parentId].fieldPermissions[
//                 field.value
//               ][permissionName] = true;
//               fieldsValue[componentType][parentId].fieldPermissions[
//                 field.value
//               ].read = true;
//             });
//             languageData.forEach((language) => {
//               fieldsValue[componentType][parentId].localePermissions[
//                 language.locale
//               ][permissionName] = true;
//               fieldsValue[componentType][parentId].localePermissions[
//                 language.locale
//               ].read = true;
//             });
//           }
//         }
//       );

//       obj[componentType] = fieldsValue[componentType];

//       form.setFieldsValue(obj);

//       const latestValues = form.getFieldsValue();

//       parentArray.forEach((parentId) => {
//         if (latestValues[`${parentId}-read`]) {
//           parentCheckedCountIncrement();
//         }
//       });

//       if (parentFieldCheckedCount === parentArray.length) {
//         form.setFieldsValue({ [`${componentType}-read`]: true });
//       }
//     } else {
//       form.setFieldsValue({
//         [`${parentId}-${permissionName}-Field`]: true,
//         [`${parentId}-${permissionName}-Language`]: true,
//       });
//       collectionOrSingleTypeData.forEach(
//         (singleOrCollectionType: RoleAPIElementType) => {
//           parentArray.push(singleOrCollectionType.value);
//           if (singleOrCollectionType.value === parentId) {
//             singleOrCollectionType.fields.forEach((field) => {
//               fieldsValue[componentType][parentId].fieldPermissions[
//                 field.value
//               ][permissionName] = true;
//             });
//             languageData.forEach((language) => {
//               fieldsValue[componentType][parentId].localePermissions[
//                 language.locale
//               ][permissionName] = true;
//             });
//           }
//         }
//       );

//       obj[componentType] = fieldsValue[componentType];

//       form.setFieldsValue(obj);

//       const latestValues = form.getFieldsValue();

//       parentArray.forEach((parentId) => {
//         if (latestValues[`${parentId}-read`]) {
//           parentCheckedCountIncrement();
//         }
//       });

//       if (parentFieldCheckedCount === parentArray.length) {
//         form.setFieldsValue({ [`${componentType}-read`]: true });
//       }
//     }

//     checkParentPermissions(
//       form,
//       collectionOrSingleTypeData,
//       languageData,
//       parentId,
//       checkAllId
//     );
//     checkSpecificParentFields(
//       form,
//       collectionOrSingleTypeData,
//       componentType,
//       permissionName
//     );
//     checkAllParents(form, collectionOrSingleTypeData, componentType);
//   } else {
//     form.setFieldsValue({ [checkAllId]: false });
//     collectionOrSingleTypeData.forEach(
//       (singleOrCollectionType: RoleAPIElementType) => {
//         if (singleOrCollectionType.value === parentId) {
//           singleOrCollectionType.fields.forEach((field) => {
//             form.setFieldsValue({
//               [`${parentId}-${field.label}`]: false,
//             });
//           });
//           languageData.forEach((language) => {
//             form.setFieldsValue({
//               [`${parentId}-${language.name}`]: false,
//             });
//           });
//         }
//       }
//     );

//     if (permissionName === 'read') {
//       form.setFieldsValue({
//         [`${componentType}-create`]: false,
//         [`${componentType}-read`]: false,
//         [`${componentType}-update`]: false,
//         [`${componentType}-delete`]: false,
//         [`${componentType}-publish`]: false,
//         [`${parentId}-read-Field`]: false,
//         [`${parentId}-read-Language`]: false,
//         [`${parentId}-create`]: false,
//         [`${parentId}-create-Field`]: false,
//         [`${parentId}-create-Language`]: false,
//         [`${parentId}-update`]: false,
//         [`${parentId}-update-Field`]: false,
//         [`${parentId}-update-Language`]: false,
//         [`${parentId}-delete`]: false,
//         [`${parentId}-delete-Field`]: false,
//         [`${parentId}-delete-Language`]: false,
//         [`${parentId}-publish`]: false,
//         [`${parentId}-publish-Field`]: false,
//         [`${parentId}-publish-Language`]: false,
//       });
//       collectionOrSingleTypeData.forEach(
//         (singleOrCollectionType: RoleAPIElementType) => {
//           if (singleOrCollectionType.value === parentId) {
//             singleOrCollectionType.fields.forEach((field) => {
//               fieldsValue[componentType][parentId].fieldPermissions[
//                 field.value
//               ][permissionName] = false;
//               fieldsValue[componentType][parentId].fieldPermissions[
//                 field.value
//               ].create = false;
//               fieldsValue[componentType][parentId].fieldPermissions[
//                 field.value
//               ].update = false;
//               fieldsValue[componentType][parentId].fieldPermissions[
//                 field.value
//               ].delete = false;
//               fieldsValue[componentType][parentId].fieldPermissions[
//                 field.value
//               ].publish = false;
//             });
//             languageData.forEach((language) => {
//               fieldsValue[componentType][parentId].localePermissions[
//                 language.locale
//               ][permissionName] = false;
//               fieldsValue[componentType][parentId].localePermissions[
//                 language.locale
//               ].create = false;
//               fieldsValue[componentType][parentId].localePermissions[
//                 language.locale
//               ].update = false;
//               fieldsValue[componentType][parentId].localePermissions[
//                 language.locale
//               ].delete = false;
//               fieldsValue[componentType][parentId].localePermissions[
//                 language.locale
//               ].publish = false;
//             });
//           }
//         }
//       );

//       obj[componentType] = fieldsValue[componentType];

//       form.setFieldsValue(obj);
//     } else {
//       form.setFieldsValue({
//         [`${componentType}-${permissionName}`]: false,
//         [`${parentId}-${permissionName}`]: false,
//         [`${parentId}-${permissionName}-Field`]: false,
//         [`${parentId}-${permissionName}-Language`]: false,
//       });
//       collectionOrSingleTypeData.forEach(
//         (singleOrCollectionType: RoleAPIElementType) => {
//           if (singleOrCollectionType.value === parentId) {
//             singleOrCollectionType.fields.forEach((field) => {
//               fieldsValue[componentType][parentId].fieldPermissions[
//                 field.value
//               ][permissionName] = false;
//             });
//             languageData.forEach((language) => {
//               fieldsValue[componentType][parentId].localePermissions[
//                 language.locale
//               ][permissionName] = false;
//             });
//           }
//         }
//       );

//       obj[componentType] = fieldsValue[componentType];

//       form.setFieldsValue(obj);
//     }
//   }
// };

// // Function to check all child fields permission when we click on parent field permission
// export const checkAllChildFields = (
//   form: FormInstance,
//   collectionOrSingleTypeData: CollectionAndSingleType[],
//   languageData: ILanguage[],
//   componentType: string,
//   e: CheckboxChangeEvent,
//   permissionName: string,
//   parentId: string,
//   checkAllId: string
// ) => {
//   const fieldsValue = form.getFieldsValue();

//   const fieldArray: string[] = [];

//   const labelArray: string[] = [];

//   const obj: RoleFormObjectType = {};

//   const parentArray: string[] = [];

//   let permissionCheckedCount = 0;

//   let parentFieldCheckedCount = 0;

//   /* eslint-disable-next-line no-plusplus */
//   const permissionCountIncrement = () => permissionCheckedCount++;

//   /* eslint-disable-next-line no-plusplus */
//   const parentFieldCountIncrement = () => parentFieldCheckedCount++;

//   collectionOrSingleTypeData.forEach(
//     (singleOrCollectionType: RoleAPIElementType) => {
//       parentArray.push(singleOrCollectionType.value);
//       if (singleOrCollectionType.value === parentId) {
//         singleOrCollectionType.fields.forEach((field) => {
//           fieldArray.push(field.value);
//           labelArray.push(field.label);
//         });
//       }
//     }
//   );

//   if (e.target.checked) {
//     if (
//       permissionName === 'create' ||
//       permissionName === 'update' ||
//       permissionName === 'delete' ||
//       permissionName === 'publish'
//     ) {
//       fieldArray.forEach((field) => {
//         fieldsValue[componentType][parentId].fieldPermissions[field][
//           permissionName
//         ] = true;
//         fieldsValue[componentType][parentId].fieldPermissions[field].read =
//           true;
//       });

//       obj[componentType] = fieldsValue[componentType];

//       form.setFieldsValue(obj);

//       form.setFieldsValue({ [`${parentId}-read-Field`]: true });

//       const latestValues1 = form.getFieldsValue();

//       if (
//         latestValues1[`${parentId}-${permissionName}-Field`] &&
//         latestValues1[`${parentId}-${permissionName}-Language`] &&
//         latestValues1[`${parentId}-read-Field`] &&
//         latestValues1[`${parentId}-read-Language`]
//       ) {
//         form.setFieldsValue({
//           [`${parentId}-read`]: true,
//           [`${parentId}-${permissionName}`]: true,
//         });
//       } else if (
//         latestValues1[`${parentId}-${permissionName}-Field`] &&
//         latestValues1[`${parentId}-${permissionName}-Language`]
//       ) {
//         form.setFieldsValue({
//           [`${parentId}-${permissionName}`]: true,
//         });
//       }

//       const latestValues2 = form.getFieldsValue();

//       parentArray.forEach((parentId) => {
//         if (latestValues2[`${parentId}-read`]) {
//           parentFieldCountIncrement();
//         }
//       });

//       if (parentFieldCheckedCount === parentArray.length) {
//         form.setFieldsValue({ [`${componentType}-read`]: true });
//       }
//     } else {
//       fieldArray.forEach((field) => {
//         fieldsValue[componentType][parentId].fieldPermissions[field][
//           permissionName
//         ] = true;
//       });

//       obj[componentType] = fieldsValue[componentType];

//       form.setFieldsValue(obj);

//       const latestFields = form.getFieldsValue();

//       if (
//         latestFields[`${parentId}-${permissionName}-Field`] &&
//         fieldsValue[`${parentId}-${permissionName}-Language`]
//       ) {
//         form.setFieldsValue({
//           [`${parentId}-${permissionName}`]: true,
//         });
//       }
//     }

//     const latestValues = form.getFieldsValue();

//     permissionArray.forEach((permission) => {
//       if (latestValues[`${parentId}-${permission}-Field`]) {
//         permissionCountIncrement();
//       }
//     });

//     if (permissionCheckedCount === permissionArray.length) {
//       labelArray.forEach((label) => {
//         form.setFieldsValue({
//           [`${parentId}-${label}`]: true,
//         });
//       });
//     }
//   } else {
//     if (permissionName === 'read') {
//       form.setFieldsValue({
//         [`${componentType}-create`]: false,
//         [`${componentType}-read`]: false,
//         [`${componentType}-update`]: false,
//         [`${componentType}-delete`]: false,
//         [`${componentType}-publish`]: false,
//         [`${parentId}-create`]: false,
//         [`${parentId}-read`]: false,
//         [`${parentId}-update`]: false,
//         [`${parentId}-delete`]: false,
//         [`${parentId}-publish`]: false,
//         [`${parentId}-create-Field`]: false,
//         [`${parentId}-update-Field`]: false,
//         [`${parentId}-delete-Field`]: false,
//         [`${parentId}-publish-Field`]: false,
//       });
//       fieldArray.forEach((field) => {
//         fieldsValue[componentType][parentId].fieldPermissions[field].create =
//           false;
//         fieldsValue[componentType][parentId].fieldPermissions[field].update =
//           false;
//         fieldsValue[componentType][parentId].fieldPermissions[field].delete =
//           false;
//         fieldsValue[componentType][parentId].fieldPermissions[field].publish =
//           false;
//       });
//     }

//     form.setFieldsValue({
//       [checkAllId]: false,
//       [`${componentType}-${permissionName}`]: false,
//       [`${parentId}-${permissionName}`]: false,
//     });

//     fieldArray.forEach((field) => {
//       fieldsValue[componentType][parentId].fieldPermissions[field][
//         permissionName
//       ] = false;
//     });

//     obj[componentType] = fieldsValue[componentType];

//     form.setFieldsValue(obj);

//     labelArray.forEach((label) => {
//       form.setFieldsValue({
//         [`${parentId}-${label}`]: false,
//       });
//     });
//   }

//   checkAllLabels(
//     form,
//     collectionOrSingleTypeData,
//     languageData,
//     parentId,
//     checkAllId
//   );
//   checkSpecificParentFields(
//     form,
//     collectionOrSingleTypeData,
//     componentType,
//     permissionName
//   );
//   checkReadPermissions(
//     form,
//     parentId,
//     collectionOrSingleTypeData,
//     languageData,
//     componentType
//   );
//   checkSpecificPermissions(
//     form,
//     parentId,
//     collectionOrSingleTypeData,
//     languageData,
//     componentType,
//     permissionName
//   );
//   checkAllParents(form, collectionOrSingleTypeData, componentType);
// };

// // Function to check all child language permissions when we click on parent language permission
// export const checkAllChildLanguages = (
//   form: FormInstance,
//   collectionOrSingleTypeData: CollectionAndSingleType[],
//   languageData: ILanguage[],
//   componentType: string,
//   e: CheckboxChangeEvent,
//   permissionName: string,
//   parentId: string,
//   checkAllId: string
// ) => {
//   const fieldsValue = form.getFieldsValue();

//   const fieldArray: string[] = [];

//   const labelArray: string[] = [];

//   const obj: RoleFormObjectType = {};

//   const parentArray: string[] = [];

//   let permissionCheckedCount = 0;

//   let parentLanguageCheckedCount = 0;

//   /* eslint-disable-next-line no-plusplus */
//   const permissionCountIncrement = () => permissionCheckedCount++;

//   /* eslint-disable-next-line no-plusplus */
//   const parentLanguageCountIncrement = () => parentLanguageCheckedCount++;

//   collectionOrSingleTypeData.forEach(
//     (singleOrCollectionType: RoleAPIElementType) => {
//       parentArray.push(singleOrCollectionType.value);
//     }
//   );

//   languageData.forEach((language) => {
//     fieldArray.push(language.locale);
//     labelArray.push(language.name);
//   });

//   if (e.target.checked) {
//     if (
//       permissionName === 'create' ||
//       permissionName === 'update' ||
//       permissionName === 'delete' ||
//       permissionName === 'publish'
//     ) {
//       fieldArray.forEach((field) => {
//         fieldsValue[componentType][parentId].localePermissions[field][
//           permissionName
//         ] = true;
//         fieldsValue[componentType][parentId].localePermissions[field].read =
//           true;
//       });

//       obj[componentType] = fieldsValue[componentType];

//       form.setFieldsValue(obj);

//       form.setFieldsValue({ [`${parentId}-read-Language`]: true });

//       const latestValues1 = form.getFieldsValue();

//       if (
//         latestValues1[`${parentId}-${permissionName}-Field`] &&
//         latestValues1[`${parentId}-${permissionName}-Language`] &&
//         latestValues1[`${parentId}-read-Field`] &&
//         latestValues1[`${parentId}-read-Language`]
//       ) {
//         form.setFieldsValue({
//           [`${parentId}-read`]: true,
//           [`${parentId}-${permissionName}`]: true,
//         });
//       } else if (
//         latestValues1[`${parentId}-${permissionName}-Field`] &&
//         latestValues1[`${parentId}-${permissionName}-Language`]
//       ) {
//         form.setFieldsValue({
//           [`${parentId}-${permissionName}`]: true,
//         });
//       }

//       const latestValues2 = form.getFieldsValue();

//       parentArray.forEach((parentId) => {
//         if (latestValues2[`${parentId}-read`]) {
//           parentLanguageCountIncrement();
//         }
//       });

//       if (parentLanguageCheckedCount === parentArray.length) {
//         form.setFieldsValue({ [`${componentType}-read`]: true });
//       }
//     } else {
//       fieldArray.forEach((field) => {
//         fieldsValue[componentType][parentId].localePermissions[field][
//           permissionName
//         ] = true;
//       });

//       obj[componentType] = fieldsValue[componentType];

//       form.setFieldsValue(obj);

//       const latestFields = form.getFieldsValue();

//       if (
//         latestFields[`${parentId}-${permissionName}-Field`] &&
//         latestFields[`${parentId}-${permissionName}-Language`]
//       ) {
//         form.setFieldsValue({
//           [`${parentId}-${permissionName}`]: true,
//         });
//       }
//     }

//     const latestValues = form.getFieldsValue();

//     permissionArray.forEach((permission) => {
//       if (latestValues[`${parentId}-${permission}-Language`]) {
//         permissionCountIncrement();
//       }
//     });

//     if (permissionCheckedCount === permissionArray.length) {
//       labelArray.forEach((label) => {
//         form.setFieldsValue({
//           [`${parentId}-${label}`]: true,
//         });
//       });
//     }
//   } else {
//     if (permissionName === 'read') {
//       form.setFieldsValue({
//         [`${componentType}-create`]: false,
//         [`${componentType}-read`]: false,
//         [`${componentType}-update`]: false,
//         [`${componentType}-delete`]: false,
//         [`${componentType}-publish`]: false,
//         [`${parentId}-create`]: false,
//         [`${parentId}-read`]: false,
//         [`${parentId}-update`]: false,
//         [`${parentId}-delete`]: false,
//         [`${parentId}-publish`]: false,
//         [`${parentId}-create-Language`]: false,
//         [`${parentId}-update-Language`]: false,
//         [`${parentId}-delete-Language`]: false,
//         [`${parentId}-publish-Language`]: false,
//       });
//       fieldArray.forEach((field) => {
//         fieldsValue[componentType][parentId].localePermissions[field].create =
//           false;
//         fieldsValue[componentType][parentId].localePermissions[field].update =
//           false;
//         fieldsValue[componentType][parentId].localePermissions[field].delete =
//           false;
//         fieldsValue[componentType][parentId].localePermissions[field].publish =
//           false;
//       });
//     }

//     form.setFieldsValue({
//       [checkAllId]: false,
//       [`${componentType}-${permissionName}`]: false,
//       [`${parentId}-${permissionName}`]: false,
//     });

//     fieldArray.forEach((field) => {
//       fieldsValue[componentType][parentId].localePermissions[field][
//         permissionName
//       ] = false;
//     });

//     obj[componentType] = fieldsValue[componentType];

//     form.setFieldsValue(obj);

//     labelArray.forEach((label) => {
//       form.setFieldsValue({
//         [`${parentId}-${label}`]: false,
//       });
//     });
//   }

//   checkAllLabels(
//     form,
//     collectionOrSingleTypeData,
//     languageData,
//     parentId,
//     checkAllId
//   );
//   checkSpecificParentFields(
//     form,
//     collectionOrSingleTypeData,
//     componentType,
//     permissionName
//   );
//   checkReadPermissions(
//     form,
//     parentId,
//     collectionOrSingleTypeData,
//     languageData,
//     componentType
//   );
//   checkSpecificPermissions(
//     form,
//     parentId,
//     collectionOrSingleTypeData,
//     languageData,
//     componentType,
//     permissionName
//   );
//   checkAllParents(form, collectionOrSingleTypeData, componentType);
// };

// Function to check all the same permissions when we click on super parent.
// export const checkAll = (
//   form: FormInstance,
//   collectionOrSingleTypeData: CollectionAndSingleType[],
//   languageData: ILanguage[],
//   componentType: string,
//   e: CheckboxChangeEvent,
//   permissionName: string
// ) => {
//   const fieldValues = form.getFieldsValue();

//   const roleInfo: RoleFormObjectType = {};

//   if (e.target.checked) {
//     if (
//       permissionName === 'create' ||
//       permissionName === 'update' ||
//       permissionName === 'delete' ||
//       permissionName === 'publish'
//     ) {
//       collectionOrSingleTypeData.forEach(
//         (singleOrCollectionType: RoleAPIElementType) => {
//           form.setFieldsValue({
//             [`${componentType}-read`]: true,
//             [`${singleOrCollectionType.value}-read`]: true,
//             [`${singleOrCollectionType.value}-read-Field`]: true,
//             [`${singleOrCollectionType.value}-read-Language`]: true,
//             [`${singleOrCollectionType.value}-${permissionName}`]: true,
//             [`${singleOrCollectionType.value}-${permissionName}-Field`]: true,
//             [`${singleOrCollectionType.value}-${permissionName}-Language`]:
//               true,
//           });
//           singleOrCollectionType.fields.forEach((field) => {
//             fieldValues[componentType][
//               singleOrCollectionType.value
//             ].fieldPermissions[field.value][permissionName] = true;
//             fieldValues[componentType][
//               singleOrCollectionType.value
//             ].fieldPermissions[field.value].read = true;
//           });
//           languageData.forEach((language) => {
//             fieldValues[componentType][
//               singleOrCollectionType.value
//             ].localePermissions[language.locale][permissionName] = true;
//             fieldValues[componentType][
//               singleOrCollectionType.value
//             ].localePermissions[language.locale].read = true;
//           });

//           roleInfo[componentType] = fieldValues[componentType];
//         }
//       );

//       form.setFieldsValue(roleInfo);
//     }

//     collectionOrSingleTypeData.forEach(
//       (singleOrCollectionType: RoleAPIElementType) => {
//         form.setFieldsValue({
//           [`${singleOrCollectionType.value}-${permissionName}`]: true,
//           [`${singleOrCollectionType.value}-${permissionName}-Field`]: true,
//           [`${singleOrCollectionType.value}-${permissionName}-Language`]: true,
//         });
//         singleOrCollectionType.fields.forEach((field) => {
//           fieldValues[componentType][
//             singleOrCollectionType.value
//           ].fieldPermissions[field.value][permissionName] = true;
//         });
//         languageData.forEach((language) => {
//           fieldValues[componentType][
//             singleOrCollectionType.value
//           ].localePermissions[language.locale][permissionName] = true;
//         });

//         roleInfo[componentType] = fieldValues[componentType];
//       }
//     );

//     form.setFieldsValue(roleInfo);

//     checkAllParentPermissions(
//       form,
//       collectionOrSingleTypeData,
//       languageData,
//       componentType
//     );
//   } else {
//     if (permissionName === 'read') {
//       collectionOrSingleTypeData.forEach(
//         (singleOrCollectionType: RoleAPIElementType) => {
//           form.setFieldsValue({
//             [`${componentType}-create`]: false,
//             [`${componentType}-update`]: false,
//             [`${componentType}-delete`]: false,
//             [`${componentType}-publish`]: false,
//             [singleOrCollectionType.label]: false,
//             [`${singleOrCollectionType.value}-${permissionName}`]: false,
//             [`${singleOrCollectionType.value}-create`]: false,
//             [`${singleOrCollectionType.value}-update`]: false,
//             [`${singleOrCollectionType.value}-delete`]: false,
//             [`${singleOrCollectionType.value}-publish`]: false,
//             [`${singleOrCollectionType.value}-${permissionName}-Field`]: false,
//             [`${singleOrCollectionType.value}-create-Field`]: false,
//             [`${singleOrCollectionType.value}-update-Field`]: false,
//             [`${singleOrCollectionType.value}-delete-Field`]: false,
//             [`${singleOrCollectionType.value}-publish-Field`]: false,
//             [`${singleOrCollectionType.value}-${permissionName}-Language`]:
//               false,
//             [`${singleOrCollectionType.value}-create-Language`]: false,
//             [`${singleOrCollectionType.value}-update-Language`]: false,
//             [`${singleOrCollectionType.value}-delete-Language`]: false,
//             [`${singleOrCollectionType.value}-publish-Language`]: false,
//           });
//           singleOrCollectionType.fields.forEach((field) => {
//             fieldValues[componentType][
//               singleOrCollectionType.value
//             ].fieldPermissions[field.value][permissionName] = false;
//             fieldValues[componentType][
//               singleOrCollectionType.value
//             ].fieldPermissions[field.value].create = false;
//             fieldValues[componentType][
//               singleOrCollectionType.value
//             ].fieldPermissions[field.value].update = false;
//             fieldValues[componentType][
//               singleOrCollectionType.value
//             ].fieldPermissions[field.value].delete = false;
//             fieldValues[componentType][
//               singleOrCollectionType.value
//             ].fieldPermissions[field.value].publish = false;
//             form.setFieldsValue({
//               [`${singleOrCollectionType.value}-${field.label}`]: false,
//             });
//           });
//           languageData.forEach((language) => {
//             fieldValues[componentType][
//               singleOrCollectionType.value
//             ].localePermissions[language.locale][permissionName] = false;
//             fieldValues[componentType][
//               singleOrCollectionType.value
//             ].localePermissions[language.locale].create = false;
//             fieldValues[componentType][
//               singleOrCollectionType.value
//             ].localePermissions[language.locale].update = false;
//             fieldValues[componentType][
//               singleOrCollectionType.value
//             ].localePermissions[language.locale].delete = false;
//             fieldValues[componentType][
//               singleOrCollectionType.value
//             ].localePermissions[language.locale].publish = false;
//             form.setFieldsValue({
//               [`${singleOrCollectionType.value}-${language.locale}`]: false,
//             });
//           });

//           roleInfo[componentType] = fieldValues[componentType];
//         }
//       );

//       form.setFieldsValue(roleInfo);
//     }

//     collectionOrSingleTypeData.forEach(
//       (singleOrCollectionType: RoleAPIElementType) => {
//         form.setFieldsValue({
//           [singleOrCollectionType.label]: false,
//           [`${singleOrCollectionType.value}-${permissionName}`]: false,
//           [`${singleOrCollectionType.value}-${permissionName}-Field`]: false,
//           [`${singleOrCollectionType.value}-${permissionName}-Language`]: false,
//         });
//         singleOrCollectionType.fields.forEach((field) => {
//           fieldValues[componentType][
//             singleOrCollectionType.value
//           ].fieldPermissions[field.value][permissionName] = false;
//           form.setFieldsValue({
//             [`${singleOrCollectionType.value}-${field.label}`]: false,
//           });
//         });
//         languageData.forEach((language) => {
//           fieldValues[componentType][
//             singleOrCollectionType.value
//           ].localePermissions[language.locale][permissionName] = false;
//           form.setFieldsValue({
//             [`${singleOrCollectionType.value}-${language.name}`]: false,
//           });
//         });

//         roleInfo[componentType] = fieldValues[componentType];
//       }
//     );

//     form.setFieldsValue(roleInfo);
//   }
// };
