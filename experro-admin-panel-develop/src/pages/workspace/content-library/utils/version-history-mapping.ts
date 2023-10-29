//@ts-nocheck

import shapeCollection from '../../../../utills/convert-request-response';

const versionHistoryMapping = (fieldList, contentModalFieldData) => {
  const mappingObjectArray = [];

  const convertedObject = shapeCollection(
    contentModalFieldData,
    false,
    'camelToSnackCase'
  );

  try {
    for (let i = 0; i < fieldList.length; i++) {
      if (fieldList[i].type !== 'component') {
        if (Object.keys(convertedObject).length > 0) {
          if (
            fieldList[i].type !== 'page-editor' &&
            fieldList[i].type !== 'media' &&
            fieldList[i].type !== 'relation' &&
            fieldList[i].type !== 'link-record'
          ) {
            mappingObjectArray.push({
              name: fieldList[i].fieldName,
              title: fieldList[i].title,
              value: convertedObject[fieldList[i].fieldName],
              status: '',
              type: 'field',
              isFieldChange: false,
              fieldType: fieldList[i].type,
            });
          } else if (fieldList[i].type === 'media') {
            let convertedMediaObject = [];
            try {
              convertedMediaObject = convertedObject[
                fieldList[i].fieldName
              ].map((item) => JSON.parse(item));
            } catch (e) {
              convertedMediaObject = convertedObject[fieldList[i].fieldName];
            }
            mappingObjectArray.push({
              name: fieldList[i].fieldName,
              title: fieldList[i].title,
              value: convertedMediaObject,
              status: '',
              type: 'field',
              isFieldChange: false,
              fieldType: fieldList[i].type,
            });
          }
        } else {
          mappingObjectArray.push({
            name: fieldList[i].fieldName,
            title: fieldList[i].title,
            value: undefined,
            status: '',
            type: 'field',
            isFieldChange: false,
            fieldType: fieldList[i].type,
          });
        }
      } else {
        if (convertedObject[fieldList[i].fieldName]) {
          if (
            fieldList[i].fieldProperties?.singleAndRepeatableComponents ===
            'repeatableComponents'
          ) {
            const tempArray = [];
            const length = convertedObject[fieldList[i].fieldName].length;
            for (let j = 0; j < length; j++) {
              const data = versionHistoryMapping(
                fieldList[i].fields,
                convertedObject[fieldList[i].fieldName][j]
              );
              tempArray.push({ isFieldChange: false, value: data });
            }
            mappingObjectArray.push({
              name: fieldList[i].fieldName,
              title: fieldList[i].title,
              value: tempArray,
              status: '',
              type: 'component',
              isRepeatable: true,
              isFieldChange: false,
              fieldType: fieldList[i].type,
            });
          } else {
            const data = versionHistoryMapping(
              fieldList[i].fields,
              convertedObject[fieldList[i].fieldName][0]
            );
            mappingObjectArray.push({
              name: fieldList[i].fieldName,
              title: fieldList[i].title,
              value: data,
              status: '',
              type: 'component',
              isRepeatable: false,
              isFieldChange: false,
              fieldType: fieldList[i].type,
            });
          }
        } else {
          const data = versionHistoryMapping(fieldList[i].fields, {});
          if (
            fieldList[i].fieldProperties?.singleAndRepeatableComponents ===
            'repeatableComponents'
          ) {
            mappingObjectArray.push({
              name: fieldList[i].fieldName,
              title: fieldList[i].title,
              value: [{ isFieldChange: false, value: data }],
              status: '',
              type: 'component',
              isFieldChange: false,
              fieldType: fieldList[i].type,
              isRepeatable: true,
            });
          } else {
            mappingObjectArray.push({
              name: fieldList[i].fieldName,
              title: fieldList[i].title,
              value: data,
              status: '',
              type: 'component',
              isFieldChange: false,
              fieldType: fieldList[i].type,
              isRepeatable: false,
            });
          }
        }
      }
    }
  } catch (err) {
    console.log('test', err);
  }
  return mappingObjectArray;
};
export default versionHistoryMapping;
