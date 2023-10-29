import { useEffect, MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import type { FormInstance } from 'antd/es/form';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

import { useListInsight } from '../../services';
import { RoleFormObjectType } from '../../../../types';

const useInsights = (
  form: FormInstance,
  shouldUpdateComponent: boolean,
  workspaceId: string,
  selectedWorkspaceId?: string,
  editWorkspaceId?: string | null
) => {
  const listInsights = useListInsight(
    selectedWorkspaceId || editWorkspaceId || workspaceId
  );
  const { t } = useTranslation();

  const permissionArray = ['create', 'read', 'update', 'delete', 'publish'];

  const stopPropagation: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation();
  };

  const setInitialValues = () => {
    const fieldValue = form.getFieldsValue();

    const fieldsArray: string[] = [];

    let fieldsCheckedCount = 0;

    /* eslint-disable-next-line no-plusplus */
    const fieldsCheckedCountIncrement = () => fieldsCheckedCount++;

    listInsights.data?.items.insights.forEach((insight) => {
      fieldsArray.push(insight.value);
      if (
        fieldValue.insights[insight.value].create &&
        fieldValue.insights[insight.value].read &&
        fieldValue.insights[insight.value].update &&
        fieldValue.insights[insight.value].delete &&
        fieldValue.insights[insight.value].publish
      ) {
        form.setFieldsValue({
          [insight.label]: true,
        });
      }
    });

    permissionArray.forEach((permission) => {
      fieldsArray.forEach((field) => {
        if (fieldValue.insights[field][permission]) {
          fieldsCheckedCountIncrement();
        }
      });
      if (fieldsCheckedCount === fieldsArray.length) {
        form.setFieldsValue({
          [`insights-${permission}`]: true,
        });
      }
      fieldsCheckedCount = 0;
    });
  };

  const checkAllChilds = (e: CheckboxChangeEvent, parentId: string) => {
    const fieldValues = form.getFieldsValue();

    const insightData: RoleFormObjectType = {};

    const insightsLabelArr: string[] = [];

    let labelCheckedCount = 0;

    /* eslint-disable-next-line no-plusplus */
    const labelCheckedCountIncrement = () => labelCheckedCount++;

    listInsights.data?.items.insights.forEach((field) => {
      insightsLabelArr.push(field.label);
    });

    if (e.target.checked) {
      fieldValues.insights[parentId].create = true;
      fieldValues.insights[parentId].read = true;
      fieldValues.insights[parentId].update = true;
      fieldValues.insights[parentId].delete = true;
      fieldValues.insights[parentId].publish = true;
      insightData.insights = fieldValues.insights;

      form.setFieldsValue(insightData);

      const latestValues = form.getFieldsValue();

      insightsLabelArr.forEach((label) => {
        if (latestValues[label]) {
          labelCheckedCountIncrement();
        }
      });

      if (labelCheckedCount === insightsLabelArr.length) {
        form.setFieldsValue({
          'insights-create': true,
          'insights-read': true,
          'insights-update': true,
          'insights-delete': true,
          'insights-publish': true,
        });
      }
    } else {
      fieldValues.insights[parentId].create = false;
      fieldValues.insights[parentId].read = false;
      fieldValues.insights[parentId].update = false;
      fieldValues.insights[parentId].delete = false;
      fieldValues.insights[parentId].publish = false;
      insightData.insights = fieldValues.insights;

      form.setFieldsValue(insightData);

      form.setFieldsValue({
        'insights-create': false,
        'insights-read': false,
        'insights-update': false,
        'insights-delete': false,
        'insights-publish': false,
      });
    }
  };

  const checkAll = (e: CheckboxChangeEvent, permissionName: string) => {
    const fieldValues = form.getFieldsValue();

    const insightData: RoleFormObjectType = {};

    const insightsArray: string[] = [];

    let readPermissionCheckedCount = 0;

    /* eslint-disable-next-line no-plusplus */
    const readPermissionCheckedCountIncrement = () =>
      readPermissionCheckedCount++;

    listInsights.data?.items.insights.forEach((insight) => {
      insightsArray.push(insight.value);
    });

    if (e.target.checked) {
      if (
        fieldValues['insights-create'] &&
        fieldValues['insights-read'] &&
        fieldValues['insights-update'] &&
        fieldValues['insights-delete'] &&
        fieldValues['insights-publish']
      ) {
        listInsights.data?.items.insights.forEach((insight) => {
          form.setFieldsValue({
            [insight.label]: true,
          });
        });
      }
      if (
        permissionName === 'create' ||
        permissionName === 'update' ||
        permissionName === 'delete' ||
        permissionName === 'publish'
      ) {
        insightsArray.forEach((insight) => {
          fieldValues.insights[insight][permissionName] = true;
          fieldValues.insights[insight].read = true;
          insightData.insights = fieldValues.insights;
          form.setFieldsValue(insightData);
        });
      } else {
        insightsArray.forEach((insight) => {
          fieldValues.insights[insight][permissionName] = true;
          insightData.insights = fieldValues.insights;
          form.setFieldsValue(insightData);
        });
      }

      const latestValues = form.getFieldsValue();

      insightsArray.forEach((insight) => {
        if (latestValues.insights[insight].read) {
          readPermissionCheckedCountIncrement();
        }
      });

      if (readPermissionCheckedCount === insightsArray.length) {
        form.setFieldsValue({
          'insights-read': true,
        });
      }
    } else {
      listInsights.data?.items.insights.forEach((insight) => {
        form.setFieldsValue({
          [insight.label]: false,
        });
      });
      if (permissionName === 'read') {
        insightsArray.forEach((insight) => {
          fieldValues.insights[insight].read = false;
          fieldValues.insights[insight].create = false;
          fieldValues.insights[insight].update = false;
          fieldValues.insights[insight].delete = false;
          fieldValues.insights[insight].publish = false;
          insightData.insights = fieldValues.insights;
          form.setFieldsValue(insightData);
          form.setFieldsValue({
            'insights-create': false,
            'insights-read': false,
            'insights-delete': false,
            'insights-update': false,
            'insights-publish': false,
          });
        });
      } else {
        insightsArray.forEach((insight) => {
          fieldValues.insights[insight][permissionName] = false;

          insightData.insights = fieldValues.insights;
          form.setFieldsValue(insightData);
          form.setFieldsValue({
            [`insights-${permissionName}`]: false,
          });
        });
      }
    }
  };

  const singleCheckBoxSelect = (
    e: CheckboxChangeEvent,
    permissionName: string,
    eleValue: string,
    eleLabel: string
  ) => {
    const fieldValues = form.getFieldsValue();

    const insightData: RoleFormObjectType = {};

    const allInsights: string[] = [];

    let permissionCheckedCount = 0;

    /* eslint-disable-next-line no-plusplus */
    const permissionCheckedCountIncrement = () => permissionCheckedCount++;

    let readPermissionCheckedCount = 0;

    /* eslint-disable-next-line no-plusplus */
    const readPermissionCheckedCountIncrement = () =>
      readPermissionCheckedCount++;

    listInsights.data?.items.insights.forEach((insight) => {
      allInsights.push(insight.value);
    });

    if (e.target.checked) {
      if (
        fieldValues.insights[eleValue].create &&
        fieldValues.insights[eleValue].read &&
        fieldValues.insights[eleValue].update &&
        fieldValues.insights[eleValue].delete &&
        fieldValues.insights[eleValue].publish
      ) {
        form.setFieldsValue({
          [eleLabel]: true,
        });
      }
      if (
        permissionName === 'create' ||
        permissionName === 'update' ||
        permissionName === 'delete' ||
        permissionName === 'publish'
      ) {
        fieldValues.insights[eleValue].read = true;
        insightData.insights = fieldValues.insights;
        form.setFieldsValue(insightData);

        const latestValues = form.getFieldsValue();

        allInsights.forEach((insight) => {
          if (latestValues.insights[insight].read) {
            readPermissionCheckedCountIncrement();
          }
        });

        if (readPermissionCheckedCount === allInsights.length) {
          form.setFieldsValue({
            'insights-read': true,
          });
        }
      }

      allInsights.forEach((insight) => {
        if (fieldValues.insights[insight][permissionName]) {
          permissionCheckedCountIncrement();
        }
      });

      if (permissionCheckedCount === allInsights.length) {
        form.setFieldsValue({
          [`insights-${permissionName}`]: true,
        });
      }
    } else {
      form.setFieldsValue({
        [eleLabel]: false,
        [`insights-${permissionName}`]: false,
      });
      if (permissionName === 'read') {
        fieldValues.insights[eleValue].create = false;
        fieldValues.insights[eleValue].update = false;
        fieldValues.insights[eleValue].delete = false;
        fieldValues.insights[eleValue].publish = false;
        insightData.insights = fieldValues.insights;
        form.setFieldsValue(insightData);
        form.setFieldsValue({
          'insights-create': false,
          'insights-delete': false,
          'insights-update': false,
          'insights-publish': false,
        });
      }
    }
  };

  useEffect(() => {
    if (listInsights.isSuccess && shouldUpdateComponent) {
      setInitialValues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listInsights.isSuccess, shouldUpdateComponent]);

  return {
    t,
    listInsights,
    stopPropagation,
    singleCheckBoxSelect,
    checkAll,
    checkAllChilds,
  };
};

export default useInsights;
