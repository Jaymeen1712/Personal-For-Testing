import { useMemo } from 'react';

const useEnums = () => {
  const queryBuilderFieldValues = useMemo(
    () => [
      {
        value: 'device_id',
        label: 'Device ID',
        type: 'Text',
      },
      {
        value: 'country',
        label: 'Country',
        type: 'Text',
      },
      {
        value: 'region',
        label: 'Region',
        type: 'Text',
      },
      {
        value: 'city',
        label: 'City',
        type: 'Text',
      },
      {
        value: 'last_seen_at',
        label: 'Last Seen At',
        type: 'Date',
      },
      {
        value: 'name',
        label: 'Name',
        type: 'Text',
      },
      {
        value: 'username',
        label: 'Username',
        type: 'Text',
      },
      {
        value: 'email',
        label: 'Email',
        type: 'Text',
      },
      {
        value: 'phone',
        label: 'Phone',
        type: 'Text',
      },
      {
        value: 'organization',
        label: 'Organization',
        type: 'Text',
      },
      {
        value: 'gender',
        label: 'Gender',
        type: 'Text',
      },
      {
        value: 'device_name',
        label: 'Device Name',
        type: 'Text',
      },
      {
        value: 'device_type',
        label: 'Device Type',
        type: 'Text',
      },
      {
        value: 'os_name',
        label: 'OS Name',
        type: 'Text',
      },
      {
        value: 'device_category',
        label: 'Device Category',
        type: 'Text',
      },
      {
        value: 'last_purchase_date',
        label: 'Last Purchase Date',
        type: 'Date',
      },
      {
        value: 'last_purchase_amount',
        label: 'Last Purchase Amount',
        type: 'Integer',
      },
      {
        value: 'last_purchase_count',
        label: 'Last Purchase Count',
        type: 'Integer',
      },
      {
        value: 'locale',
        label: 'Locale',
        type: 'Text',
      },
      {
        value: 'lat',
        label: 'Latitude',
        type: 'Integer',
      },
      {
        value: 'long',
        label: 'Longitude',
        type: 'Integer',
      },
      {
        value: 'continent',
        label: 'Continent',
        type: 'Text',
      },
      {
        value: 'postal_code',
        label: 'Postal Code',
        type: 'Text',
      },
      {
        value: 'id',
        label: 'IP Address',
        type: 'Text',
      },
    ],
    []
  );

  const queryBuilderConditionValues = useMemo(() => {
    return {
      Text: [
        {
          value: 'EQUALS',
          label: 'Equals',
        },
        {
          value: 'NOT_EQUALS',
          label: 'Not equals to',
        },
        {
          value: 'CONTAINS',
          label: 'Contains',
        },
        {
          value: 'DOES_NOT_CONTAINS',
          label: 'Does not contain',
        },
        {
          value: 'STARTS_WITH',
          label: 'Starts with',
        },
        {
          value: 'ENDS_WITH',
          label: 'Ends with',
        },
        {
          label: 'Empty',
          value: 'EMPTY',
        },
        {
          value: 'NOT_EMPTY',
          label: 'Not empty',
        },
      ],
      Integer: [
        {
          value: '=',
          label: 'Equal to',
        },
        {
          value: '<>',
          label: 'Not equal to',
        },
        {
          value: '>',
          label: 'Greater than',
        },
        {
          value: '<',
          label: 'Less than',
        },
        {
          value: '<=',
          label: 'Less than or equal to',
        },
        {
          value: '>=',
          label: 'Greater than or equal to',
        },
        {
          value: 'EMPTY',
          label: 'Empty',
        },
        {
          value: 'NOT_EMPTY',
          label: 'Not empty',
        },
      ],
      Date: [
        {
          value: 'IS',
          label: 'Is',
        },
        {
          value: 'IS_NOT',
          label: 'Is not',
        },
        {
          value: 'IS_AFTER',
          label: 'Is after',
        },
        {
          value: 'IS_BEFORE',
          label: 'Is before',
        },
        {
          value: 'BETWEEN',
          label: 'Between',
        },
        {
          value: 'NOT_BETWEEN',
          label: 'Not between',
        },
      ],
    };
  }, []);
  return { queryBuilderFieldValues, queryBuilderConditionValues };
};
export default useEnums;
