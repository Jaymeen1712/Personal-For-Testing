import { useEffect, useState } from 'react';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { FormInstance } from 'antd';

import { useListContentModelField } from '../../services';
import {
  ContentField,
  // ILanguage,
  ISubmitRoleValuesType,
  IListEnvironments,
  IListContentResponse,
  IAPIError,
  ContentLibraryIndeterminateState,
} from '../../../../types';
import { UseQueryResult } from 'react-query';

const useContentLibraryTabController = (
  selectedWorkspaceId: string,
  editWorkspaceId: string | null,
  workspaceId: string,
  allContentModels: UseQueryResult<
    IListContentResponse[] | undefined,
    IAPIError
  >
) => {
  const [contentModelId, setContentModelId] = useState<string>('');

  const [contentModelFieldsFlag, setContentModelFieldsFlag] = useState<
    Record<string, boolean>
  >({});

  const [checkAllPermissionMethodFlag, setCheckAllPermissionMethodFlag] =
    useState<Record<string, boolean>>({});

  const [contentModelFields, setContentModelFields] = useState<ContentField[]>(
    []
  );

  const [formInstance, setFormInstance] = useState<FormInstance>();
  const [event, setEvent] = useState<CheckboxChangeEvent>();
  const [contentModelInternalName, setContentModelInternalName] =
    useState<string>();
  // const [languageData, setLanguageData] = useState<ILanguage[]>();
  const [environmentData, setEnvironmentData] = useState<IListEnvironments[]>();
  const [permissionType, setPermissionType] = useState<string>();

  const [indeterminateStates, setIndeterminateStates] =
    useState<ContentLibraryIndeterminateState>({});

  const contentFields = useListContentModelField(
    editWorkspaceId || selectedWorkspaceId || workspaceId,
    contentModelId
  );

  const collapseChange = (data: string | string[]) => {
    if (data.length) {
      setContentModelId(data[data.length - 1]);
    }
  };

  // To give specific permissions to all records of the content model
  const checkAllChildPermissions = (
    form: FormInstance,
    e: CheckboxChangeEvent,
    contentModelId: string,
    contentModelInternalName: string,
    contentModelFields: ContentField[],
    // languageData: ILanguage[],
    environmentData: IListEnvironments[],
    permissionType: string
  ) => {
    const methodFlag = { ...checkAllPermissionMethodFlag };
    methodFlag[contentModelId] = true;
    setCheckAllPermissionMethodFlag(methodFlag);

    setContentModelId(contentModelId);
    setFormInstance(form);
    setEvent(e);
    setContentModelInternalName(contentModelInternalName);
    // setLanguageData(languageData);
    setEnvironmentData(environmentData);
    setPermissionType(permissionType);

    const fieldValues = form.getFieldsValue();
    if (e.target.checked) {
      const obj = {} as ISubmitRoleValuesType;
      if (permissionType === 'publish') {
        // const allStates = { ...indeterminateStates };
        // allStates[contentModelId].read = false;
        // setIndeterminateStates(allStates);
        fieldValues['contentLibrary'][contentModelInternalName][
          'permissions'
        ].read = true;

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
        // languageData.forEach((language) => {
        //   fieldValues['contentLibrary'][contentModelInternalName][
        //     'localePermissions'
        //   ][language.locale].read = true;
        //   fieldValues['contentLibrary'][contentModelInternalName][
        //     'localePermissions'
        //   ][language.locale][permissionType] = true;
        // });
        environmentData.forEach((env) => {
          fieldValues['contentLibrary'][contentModelInternalName]['publish'][
            env.id
          ] = true;
        });
      } else {
        if (permissionType === 'read' || permissionType === 'update') {
          const allStates = { ...indeterminateStates };
          allStates[contentModelId].read = false;
          if (!allStates[contentModelId].update) {
            allStates[contentModelId].update = false;
          }
          setIndeterminateStates(allStates);
        }
        if (permissionType === 'update') {
          const allStates = { ...indeterminateStates };

          allStates[contentModelId].update = false;

          setIndeterminateStates(allStates);
        }
        fieldValues['contentLibrary'][contentModelInternalName][
          'permissions'
        ].read = true;

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
        // languageData.forEach((language) => {
        //   fieldValues['contentLibrary'][contentModelInternalName][
        //     'localePermissions'
        //   ][language.locale].read = true;
        //   fieldValues['contentLibrary'][contentModelInternalName][
        //     'localePermissions'
        //   ][language.locale][permissionType] = true;
        // });
      }
      obj['contentLibrary'] = fieldValues['contentLibrary'];
      form.setFieldsValue(obj);
    } else {
      if (permissionType === 'read') {
        const allStates = { ...indeterminateStates };
        allStates[contentModelId].read = false;
        allStates[contentModelId].update = false;
        allStates[contentModelId].publish = false;
        setIndeterminateStates(allStates);
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
        // languageData.forEach((language) => {
        //   fieldValues['contentLibrary'][contentModelInternalName][
        //     'localePermissions'
        //   ][language.locale].read = false;
        //   fieldValues['contentLibrary'][contentModelInternalName][
        //     'localePermissions'
        //   ][language.locale].update = false;
        // });
        environmentData.forEach((env) => {
          fieldValues['contentLibrary'][contentModelInternalName]['publish'][
            env.id
          ] = false;
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
        // languageData.forEach((language) => {
        //   fieldValues['contentLibrary'][contentModelInternalName][
        //     'localePermissions'
        //   ][language.locale][permissionType] = false;
        // });
        obj['contentLibrary'] = fieldValues['contentLibrary'];
        form.setFieldsValue(obj);
      } else if (permissionType === 'publish') {
        const obj = {} as ISubmitRoleValuesType;
        environmentData.forEach((env) => {
          fieldValues['contentLibrary'][contentModelInternalName]['publish'][
            env.id
          ] = false;
          obj['contentLibrary'] = fieldValues['contentLibrary'];
          form.setFieldsValue(obj);
        });
      }
    }
  };

  useEffect(() => {
    if (contentFields.isSuccess) {
      if (contentModelId) {
        if (
          !contentModelFields.some(
            (content) => content.contentModelId === contentModelId
          )
        ) {
          const fieldsArray: ContentField[] = [];
          contentFields.data.forEach((field) => {
            fieldsArray.push(field);
          });

          // @ts-ignore
          setContentModelFields((previous) => [
            ...previous,
            {
              contentModelId: contentModelId,
              fields: fieldsArray,
            },
          ]);
        } else {
          const fieldsArray: ContentField[] = [];
          contentFields.data.forEach((field) => {
            fieldsArray.push(field);
          });

          const newContentFields = [...contentModelFields];

          newContentFields.forEach((field) => {
            if (field.contentModelId === contentModelId) {
              field.fields = fieldsArray;
            }
          });

          setContentModelFields(newContentFields);
        }

        if (!contentModelFieldsFlag[contentModelId]) {
          const fieldFlag = { ...contentModelFieldsFlag };

          fieldFlag[contentModelId] = true;

          setContentModelFieldsFlag(fieldFlag);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentFields.isSuccess]);

  useEffect(() => {
    if (
      contentModelFieldsFlag[contentModelId] &&
      checkAllPermissionMethodFlag[contentModelId]
    ) {
      checkAllChildPermissions(
        // @ts-ignore
        formInstance,
        event,
        contentModelId,
        contentModelInternalName,
        contentModelFields,
        // languageData,
        environmentData,
        permissionType
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentModelFieldsFlag]);

  useEffect(() => {
    if (allContentModels.isSuccess) {
      const tempIndeterminateState: ContentLibraryIndeterminateState = {
        ...indeterminateStates,
      };

      allContentModels.data?.forEach((model) => {
        tempIndeterminateState[model.id] = {
          read: false,
          update: false,
          create: false,
          delete: false,
          publish: false,
        };
      });
      setIndeterminateStates(tempIndeterminateState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allContentModels.isSuccess]);

  return {
    collapseChange,
    contentModelFields,
    contentModelFieldsFlag,
    checkAllChildPermissions,
    indeterminateStates,
    setIndeterminateStates,
  };
};

export default useContentLibraryTabController;
