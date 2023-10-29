// @ts-nocheck
import moment from 'moment/moment';
import { convertCurrentTimeZoneToUtc } from '../../../../utills';
import usePermissionCheck from './permission-check';
import useQuery from '../../../../hooks/queryParameter';

const useFinalObject = () => {
  const query = useQuery();
  const { fieldPermissionCheck } = usePermissionCheck();

  const dateChecking = (name: string, formObject) => {
    let result = '';
    if (
      name.split('/').shift().endsWith('_edt') ||
      name.split('/').shift().endsWith('_edti')
    ) {
      if (
        convertCurrentTimeZoneToUtc(formObject[name]) === 'Invalid date' ||
        !formObject[name]
      ) {
        result = formObject[name];
      } else {
        result = moment(formObject[name]).toISOString();
      }
    } else if (
      name.split('/').shift().endsWith('_ets') ||
      name.split('/').shift().endsWith('_etsi')
    ) {
      if (
        moment(formObject[name]).format('hh:mm:ss a') === 'Invalid date' ||
        !formObject[name]
      ) {
        result = formObject[name];
      } else {
        result = moment(formObject[name]).format('hh:mm:ss a');
      }
    } else {
      if (
        moment(formObject[name]).format('YYYY-MM-DD') === 'Invalid date' ||
        !formObject[name]
      ) {
        result = formObject[name];
      } else {
        result = moment(formObject[name]).format('YYYY-MM-DD');
      }
    }
    return result;
  };
  const finalObject = (fieldObject, formObject, IsContentLibraryPopupOpen) => {
    const finalRequest = {};
    fieldObject.map((item) => {
      if (item.name) {
        if (fieldPermissionCheck('edit', item.name.split('/').shift())) {
          if (item.type === 'date') {
            finalRequest[item.name.split('/').shift()] = dateChecking(
              item.name,
              formObject
            );
          } else if (
            item.type === 'page-editor' &&
            !IsContentLibraryPopupOpen
          ) {
            if (window.document.getElementById('page_editor_iframe')) {
              const getCss = window.document
                .getElementById('page_editor_iframe')
                .contentWindow.editor.getCss();
              const getHtml = window.document
                .getElementById('page_editor_iframe')
                .contentWindow.editor.getHtml();
              finalRequest[
                item.name.split('/').shift()
                ] = `${getHtml}<style>${getCss}</style>`;
            }
          } else if (item.type === 'relation') {
            return '';
          } else if (
            item.type === 'json' &&
            (!query.get('isPageEditor') || IsContentLibraryPopupOpen)
          ) {
            if (formObject[item.name]) {
              finalRequest[item.name.split('/').shift()] = JSON.parse(
                formObject[item.name]
              );
            } else {
              finalRequest[item.name.split('/').shift()] = '';
            }
          } else if (item.type === 'color-picker') {
            if (typeof formObject[item.name] === 'string') {
              finalRequest[item.name.split('/').shift()] =
                formObject[item.name];
            } else {
              finalRequest[item.name.split('/').shift()] =
                formObject[item.name]?.hex;
            }
          } else {
            finalRequest[item.name.split('/').shift()] = formObject[item.name];
          }
        }
      } else {
        if (
          item.RepeatableComponent &&
          (!query.get('isPageEditor') || IsContentLibraryPopupOpen)
        ) {
          const temArray = [];
          if (fieldPermissionCheck('edit', item.fieldName)) {
            item.values.map((value) => {
              const tempObject = {};
              tempObject['node_type'] = 'child';
              tempObject['id'] = value.childId;
              value.rComponent.map((data) => {
                if (data.type === 'date') {
                  tempObject[data.name.split('/').shift()] = dateChecking(
                    data.name,
                    formObject
                  );
                } else if (data.type === 'json') {
                  if (formObject[data.name]) {
                    tempObject[data.name.split('/').shift()] = JSON.parse(
                      formObject[data.name]
                    );
                  } else {
                    tempObject[data.name.split('/').shift()] = '';
                  }
                } else if (data.type === 'color-picker') {
                  if (typeof formObject[data.name] === 'string') {
                    tempObject[data.name.split('/').shift()] =
                      formObject[data.name];
                  } else {
                    tempObject[data.name.split('/').shift()] =
                      formObject[data.name]?.hex;
                  }
                } else {
                  tempObject[data.name.split('/').shift()] =
                    formObject[data.name];
                }
                return true;
              });
              temArray.push(tempObject);
              return true;
            });
            finalRequest[item.fieldName] = temArray;
          }
        } else {
          const tempObject = {};
          if (
            fieldPermissionCheck('edit', item.fieldName) &&
            (!query.get('isPageEditor') || IsContentLibraryPopupOpen)
          ) {
            item.values.map((value) => {
              tempObject['node_type'] = 'child';
              tempObject['id'] = item.childId;
              if (value.type === 'date') {
                tempObject[value.name.split('/').shift()] = dateChecking(
                  value.name,
                  formObject
                );
              } else if (value.type === 'json') {
                if (formObject[value.name]) {
                  tempObject[value.name.split('/').shift()] = JSON.parse(
                    formObject[value.name]
                  );
                } else {
                  tempObject[value.name.split('/').shift()] = '';
                }
              } else if (value.type === 'color-picker') {
                if (typeof formObject[value.name] === 'string') {
                  tempObject[value.name.split('/').shift()] =
                    formObject[value.name];
                } else {
                  tempObject[value.name.split('/').shift()] =
                    formObject[value.name]?.hex;
                }
              } else {
                tempObject[value.name.split('/').shift()] =
                  formObject[value.name];
              }
              return '';
            });
            finalRequest[item.fieldName] = [tempObject];
          }
        }
      }
      return '';
    });
    return finalRequest;
  };
  return {
    finalObject,
  };
};

export default useFinalObject;
