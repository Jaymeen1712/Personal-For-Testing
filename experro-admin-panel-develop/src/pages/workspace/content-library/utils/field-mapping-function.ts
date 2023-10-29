// @ts-nocheck
import shapeCollection from '../../../../utills/convert-request-response';

import { customAlphabet } from 'nanoid';

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const nanoid = customAlphabet(alphabet, 12);

export const fieldMappingFunction = (
  fieldListObject,
  mockObject,
  relationObject
) => {
  const demoObject = shapeCollection(mockObject, false, 'camelToSnackCase');
  const relationDemoObject = shapeCollection(
    relationObject,
    false,
    'camelToSnackCase'
  );
  const finalObject = [];

  if (fieldListObject) {
    fieldListObject.map((item) => {
      if (item.type === 'component') {
        if (item.fields) {
          const tempVariable = mockObject[
            item.fieldName.replace(/_([a-z])/g, (c) => c[1].toUpperCase())
          ]
            ? mockObject[
                item.fieldName.replace(/_([a-z])/g, (c) => c[1].toUpperCase())
              ]
            : [{}];

          if (tempVariable.length > 1) {
            if (
              item.fieldProperties.singleAndRepeatableComponents ===
              'repeatableComponents'
            ) {
              const tempArray = [];
              tempVariable.map((data) => {
                const temp = fieldMappingFunction(item.fields, data);
                tempArray.push({
                  rComponent: temp,
                  id: nanoid(),
                  childId: data.id,
                });
                return true;
              });

              finalObject.push({
                parentId: mockObject.id,
                componentName: item.title,
                fieldName: item.fieldName,
                values: tempArray,
                RepeatableComponent:
                  item.fieldProperties.singleAndRepeatableComponents ===
                  'repeatableComponents',
              });
            } else {
              const temp = fieldMappingFunction(item.fields, tempVariable[0]);

              finalObject.push({
                componentName: item.title,
                fieldName: item.fieldName,
                values: temp,
                RepeatableComponent:
                  item.fieldProperties.singleAndRepeatableComponents ===
                  'repeatableComponents',
              });
            }
          } else {
            tempVariable.map((Data) => {
              const temp = fieldMappingFunction(item.fields, Data);
              if (
                item.fieldProperties.singleAndRepeatableComponents ===
                'repeatableComponents'
              ) {
                finalObject.push({
                  componentName: item.title,
                  fieldName: item.fieldName,
                  values: [
                    {
                      rComponent: temp,
                      id: nanoid(),
                      childId: Data.id
                        ? Data.id
                        : `${mockObject.id}-${nanoid()}`,
                    },
                  ],
                  RepeatableComponent:
                    item.fieldProperties.singleAndRepeatableComponents ===
                    'repeatableComponents',
                });
              } else {
                finalObject.push({
                  childId: Data.id ? Data.id : `${mockObject.id}-${nanoid()}`,
                  componentName: item.title,
                  fieldName: item.fieldName,
                  values: temp,
                  RepeatableComponent:
                    item.fieldProperties.singleAndRepeatableComponents ===
                    'repeatableComponents',
                });
              }
              return true;
            });
          }
        } else {
          finalObject.push({
            componentName: item.fieldName,
            values: [],
          });
        }
      } else if (item.type === 'relation') {
        finalObject.push({
          name: `${item.fieldName}/${nanoid()}`,
          title: item.title,
          type: item.type,
          isRequired: item.isRequired,
          fieldProperties: item.fieldProperties,
          editValue: relationDemoObject[item.fieldName],
          relationType: item.relationType,
          destinationContentModalId: item.destinationContentModelId,
        });
      } else if (item.type === 'text') {
        if (typeof demoObject[item.fieldName] === 'object') {
          finalObject.push({
            name: `${item.fieldName}/${nanoid()}`,
            title: item.title,
            type: item.type,
            isRequired: item.isRequired,
            fieldProperties: {},
            editValue: demoObject[item.fieldName].toString(),
            isDataEditable: item.isDataEditable,
            isSystemField: item.isSystemField,
          });
        } else {
          finalObject.push({
            name: `${item.fieldName}/${nanoid()}`,
            title: item.title,
            type: item.type,
            isRequired: item.isRequired,
            fieldProperties: item.fieldProperties ? item.fieldProperties : {},
            editValue: demoObject[item.fieldName],
            isDataEditable: item.isDataEditable,
            isSystemField: item.isSystemField,
          });
        }
      } else if (item.type === 'json-text') {
        finalObject.push({
          name: `${item.fieldName}/${nanoid()}`,
          title: item.title,
          type: item.type,
          isRequired: item.isRequired,
          fieldProperties: {},
          editValue: JSON.stringify(demoObject[item.fieldName]),
          isDataEditable: item.isDataEditable,
          isSystemField: item.isSystemField,
        });
      } else {
        finalObject.push({
          name: `${item.fieldName}/${nanoid()}`,
          title: item.title,
          type: item.type,
          isRequired: item.isRequired,
          fieldProperties: item.fieldProperties,
          editValue: demoObject[item.fieldName],
          isDataEditable: item.isDataEditable,
          isSystemField: item.isSystemField,
        });
      }
      return finalObject;
    });
    return finalObject;
  } else {
    return finalObject;
  }
};
