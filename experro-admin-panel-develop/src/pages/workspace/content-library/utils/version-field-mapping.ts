// @ts-nocheck

import shapeCollection from '../../../../utills/convert-request-response';

export const versionFieldMapping = (recordField, contentModalFields) => {
  const resultData = {};
  const convertedObject = shapeCollection(
    recordField.contentModelFieldData,
    false,
    'camelToSnackCase'
  );

  if (contentModalFields) {
    contentModalFields.map((contentModalFieldData) => {
      if (
        Object.keys(convertedObject).includes(contentModalFieldData.fieldName)
      ) {
        if (
          contentModalFieldData.fieldName.endsWith('_eti') ||
          contentModalFieldData.fieldName.endsWith('_et') ||
          contentModalFieldData.fieldName.endsWith('_ebi') ||
          contentModalFieldData.fieldName.endsWith('_eb') ||
          contentModalFieldData.fieldName.endsWith('_esi') ||
          contentModalFieldData.fieldName.endsWith('_es') ||
          contentModalFieldData.fieldName.endsWith('_ei') ||
          contentModalFieldData.fieldName.endsWith('_eii') ||
          contentModalFieldData.fieldName.endsWith('_eli') ||
          contentModalFieldData.fieldName.endsWith('_el') ||
          contentModalFieldData.fieldName.endsWith('_edi') ||
          contentModalFieldData.fieldName.endsWith('_ed') ||
          contentModalFieldData.fieldName.endsWith('_efi') ||
          contentModalFieldData.fieldName.endsWith('_ef') ||
          contentModalFieldData.fieldName.endsWith('_edti') ||
          contentModalFieldData.fieldName.endsWith('_edt') ||
          contentModalFieldData.fieldName.endsWith('_eci') ||
          contentModalFieldData.fieldName.endsWith('_ec')
        ) {
          resultData[contentModalFieldData.title] =
            convertedObject[contentModalFieldData.fieldName];
        }
        return '';
      }
      return '';
    });
  } else {
    return resultData;
  }

  resultData['nextVersionNumber'] = recordField.nextVersionNo;
  resultData['versionName'] = recordField.contentModelFieldData.versionName;
  resultData['versionNo'] = recordField.contentModelFieldData.versionNo;
  resultData['versionStatus'] = recordField.contentModelFieldData.status;
  if (recordField.contentModelFieldData.createdAt) {
    resultData['Created At'] = recordField.contentModelFieldData.createdAt;
  }
  if (recordField.contentModelFieldData.modifiedAt) {
    resultData['Modified At'] = recordField.contentModelFieldData.modifiedAt;
  }
  resultData['versionId'] = recordField.contentModelFieldData.id;

  return resultData;
};
