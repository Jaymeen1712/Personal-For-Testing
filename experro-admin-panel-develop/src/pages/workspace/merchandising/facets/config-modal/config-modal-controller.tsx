//@ts-nocheck
import { useTranslation } from 'react-i18next';
import { Form } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  SortableContainer,
  SortableContainerProps,
  SortableElement,
  SortableHandle,
  SortEnd,
} from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import { ColumnsType } from 'antd/es/table';
import { useParams } from 'react-router-dom';

import DragIcon from '../../../../../images/icons/drag-icon';
import { useGetFacetSortValue } from '../../services';
import { openNotificationWithIcon } from '../../../../../utills';

interface DataType {
  index: number;
  name: string;
}

const useConfigModalController = (
  selectedFacetName: string,
  onFacetApply: (val: {
    [k: string]: {
      type: string;
      displayName: string;
      facetType: string;
      fieldName: string;
      isEnabled?: boolean;
      sortOrder?: number;
    };
  }) => void,
  updateFacetDetail: {
    [k: string]: {
      type: string;
      displayName: string;
      facetType: string;
      fieldName: string;
      isEnabled?: boolean;
      sortOrder?: number;
    };
  },
  ChangeFacetValue: boolean,
  onCancelClick: () => void
) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { workspaceId, environmentId } = useParams<{
    workspaceId: string;
    environmentId: string;
  }>();

  const [displayAsValue, setDisplayAsValue] = useState('list');
  const [selectedRange, setSelectedRange] = useState('calculateByRange');
  const [roundOfCheck, setRoundOfCheck] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [defaultCollapse, setDefaultCollapse] = useState(false);
  const [isFieldOrderingEnable, setIsFieldOrderingEnable] = useState(false);
  const [orderBy, setOrderBy] = useState('');
  const [shortBy, setShortBy] = useState('');
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);
  const [isFacetSortDataLoading, setIsFacetSortDataLoading] = useState(false);
  const getFieldSortValue = useGetFacetSortValue(
    workspaceId,
    environmentId,
    selectedFacetName,
    shortBy,
    orderBy,
    isFieldOrderingEnable
  );

  const onSave = async () => {
    const tempObject = updateFacetDetail;
    const result = await form.validateFields();
    tempObject[selectedFacetName].displayName = result.facetName;

    tempObject[selectedFacetName]['minValue'] = result.minValue;

    tempObject[selectedFacetName]['maxValue'] = result.maxValue;

    tempObject[selectedFacetName]['displayAs'] = result.displayAs;

    tempObject[selectedFacetName]['isShowFacet'] = result.isShowFacet;

    tempObject[selectedFacetName]['defaultCollapse'] = result.defaultCollapse;

    tempObject[selectedFacetName]['showCount'] = result.showCount;

    tempObject[selectedFacetName]['sortOrder'] = sortOrder;

    tempObject[selectedFacetName]['facetType'] = result.displayAs;

    tempObject[selectedFacetName]['roundOffValue'] = result.roundOffValue;

    tempObject[selectedFacetName]['roundDown'] = result.roundDown;

    tempObject[selectedFacetName]['roundUp'] = result.roundUp;

    tempObject[selectedFacetName]['rangeSelect'] = result.rangeSelect;

    tempObject[selectedFacetName]['sliderMinValue'] = result.sliderMinValue;

    tempObject[selectedFacetName]['sliderMaxValue'] = result.sliderMaxValue;

    tempObject[selectedFacetName]['sliderStepSize'] = result.sliderStepSize;

    tempObject[selectedFacetName]['isFieldOrderingEnable'] =
      isFieldOrderingEnable;
    if (result.order) {
      if (result.order === 'asc') {
        tempObject[selectedFacetName]['order'] = 'index asc';
      } else if (result.order === 'desc') {
        tempObject[selectedFacetName]['order'] = 'index desc';
      } else if (result.order === 'highestCount') {
        tempObject[selectedFacetName]['order'] = 'count desc';
      } else if (result.order === 'custom') {
        const tempArray: {
          index: number;
          name: string;
          count: number;
        }[] = [];
        dataSource.map((item, index) => {
          tempArray.push({
            index: index,
            name: item.name,
            count: item.count,
          });
          return '';
        });
        tempObject[selectedFacetName]['order'] = 'custom';
        tempObject[selectedFacetName]['orderItem'] = tempArray;
      }
    }

    setDefaultCollapse(false);
    // setLimitSwitch(true);
    setSortOrder(false);
    setIsFieldOrderingEnable(false);
    onFacetApply(tempObject);
    onCancelClick();
    openNotificationWithIcon(
      'success',
      t('common.messages.facet_updated_successfully')
    );
    // form.resetFields();
  };

  const DragHandle = SortableHandle(() => <DragIcon />);

  const columns: ColumnsType<DataType> = [
    {
      dataIndex: 'sort',
      width: '1%',
      className: 'drag-visible dragable-icon',
      render: (value, record, index) => (
        <>
          <div className="ant-row ant-space-align-center ">
            <div className="dragHandleIcon m-r-16">
              <DragHandle />
            </div>
          </div>
        </>
      ),
    },
    {
      dataIndex: 'name',
      width: '100%',
      className: 'drag-visible dragable-icon',
      title: 'Name',
    },
    {
      dataIndex: 'count',
      width: '100%',
      className: 'drag-visible dragable-icon',
      title: 'Count',
    },
  ];

  const onValueChange = (val: {
    facetName: string;
    isShowFacet: string;
    displayAs: string;
    minValue: string;
    maxValue: string;
    stepSize: string;
    rangeSelect: string;
    defaultCollapse: boolean;
    roundOffValue: boolean;
    sortOrder: boolean;
    showCount: boolean;
    collapseCheck: string[];
  }) => {
    setIsSaveButtonEnabled(true);
    if (val.displayAs) {
      setDisplayAsValue(val.displayAs);
    }
    if (val.rangeSelect) {
      setSelectedRange(val.rangeSelect);
    }
    if (val.order) {
      if (val.order === 'asc') {
        setShortBy('index');
        setOrderBy('asc');
      } else if (val.order === 'desc') {
        setShortBy('index');
        setOrderBy('desc');
      } else if (val.order === 'highestCount') {
        setShortBy('count');
        setOrderBy('desc');
      } else if (val.order === 'custom') {
        setShortBy('custom');
        setOrderBy('');
      }
      getFieldSortValue.remove();
    }
    if (val.isFieldOrderingEnable) {
      form.setFieldsValue({ order: 'highestCount' });
      setShortBy('count');
      setOrderBy('desc');
    }
    if (form.getFieldValue('isFieldOrderingEnable') !== isFieldOrderingEnable) {
      setIsFieldOrderingEnable(form.getFieldValue('isFieldOrderingEnable'));
      getFieldSortValue.remove();
    }
    // setLimitSwitch(form.getFieldValue('showCount'));
    setRoundOfCheck(form.getFieldValue('roundOffValue'));
  };
  const [dataSource, setDataSource] = useState<DataType[]>([]);

  const SortableItem = SortableElement(
    (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />
  );
  const SortableBody = SortableContainer(
    (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <tbody {...props} />
    )
  );

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(
        dataSource.slice(),
        oldIndex,
        newIndex
      ).filter((el: DataType) => !!el);

      setDataSource(newData);
      form.setFieldsValue({
        order: 'custom',
      });
      if (!isSaveButtonEnabled) {
        setIsSaveButtonEnabled(true);
      }
    }
  };

  const DraggableContainer = (props: SortableContainerProps) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );
  //@ts-ignore
  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    const index = dataSource.findIndex(
      (x) => x.index === restProps['data-row-key']
    );
    return <SortableItem index={index} {...restProps} />;
  };

  useEffect(() => {
    setIsSaveButtonEnabled(false);
    form.setFieldsValue({
      facetName: updateFacetDetail[selectedFacetName]?.displayName,
      isShowFacet: updateFacetDetail[selectedFacetName]?.isShowFacet || 10,
      displayAs:
        updateFacetDetail[selectedFacetName]?.facetType ||
        updateFacetDetail[selectedFacetName]?.displayAs ||
        'list',
      minValue: updateFacetDetail[selectedFacetName]?.minValue,
      maxValue: updateFacetDetail[selectedFacetName]?.maxValue,
      showCount:
        typeof updateFacetDetail[selectedFacetName]?.showCount === 'undefined'
          ? 'checked'
          : updateFacetDetail[selectedFacetName]?.showCount,
      defaultCollapse: updateFacetDetail[selectedFacetName]?.defaultCollapse,
      roundOffValue: updateFacetDetail[selectedFacetName]?.roundOffValue,
      roundDown: updateFacetDetail[selectedFacetName]?.roundDown,
      roundUp: updateFacetDetail[selectedFacetName]?.roundUp,
      rangeSelect:
        updateFacetDetail[selectedFacetName]?.rangeSelect || 'calculateByRange',
      sliderMinValue: updateFacetDetail[selectedFacetName]?.sliderMinValue,
      sliderMaxValue: updateFacetDetail[selectedFacetName]?.sliderMaxValue,
      sliderStepSize: updateFacetDetail[selectedFacetName]?.sliderStepSize,
      isFieldOrderingEnable:
        updateFacetDetail[selectedFacetName]?.isFieldOrderingEnable,
    });
    if (updateFacetDetail[selectedFacetName]?.isFieldOrderingEnable) {
      setIsFieldOrderingEnable(true);
      if (updateFacetDetail[selectedFacetName]?.order) {
        if (updateFacetDetail[selectedFacetName]?.order === 'index asc') {
          setShortBy('index');
          setOrderBy('asc');

          form.setFieldsValue({
            order: 'asc',
          });
        } else if (
          updateFacetDetail[selectedFacetName]?.order === 'index desc'
        ) {
          setShortBy('index');
          setOrderBy('desc');

          form.setFieldsValue({
            order: 'desc',
          });
        } else if (
          updateFacetDetail[selectedFacetName]?.order === 'count desc'
        ) {
          setShortBy('count');
          setOrderBy('desc');

          form.setFieldsValue({
            order: 'highestCount',
          });
        } else if (updateFacetDetail[selectedFacetName]?.order === 'custom') {
          setShortBy('custom');
          setOrderBy('');

          form.setFieldsValue({
            order: 'custom',
          });

          if (updateFacetDetail[selectedFacetName]?.orderItem) {
            setDataSource(updateFacetDetail[selectedFacetName]?.orderItem);
          }
        }
      }
    } else {
      setShortBy('');
      setOrderBy('');
      setIsFieldOrderingEnable(false);
      form.resetFields(['order']);
    }
    setDisplayAsValue(updateFacetDetail[selectedFacetName]?.displayAs);
    setSortOrder(updateFacetDetail[selectedFacetName]?.sortOrder);
    setSelectedRange(
      updateFacetDetail[selectedFacetName]?.rangeSelect || 'calculateByRange'
    );
    setRoundOfCheck(
      updateFacetDetail[selectedFacetName]?.roundOffValue || false
    );
    if (updateFacetDetail[selectedFacetName]?.order !== 'custom') {
      getFieldSortValue.remove();
    }
    return () => setDataSource([{}]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateFacetDetail, ChangeFacetValue]);

  useEffect(() => {
    if (getFieldSortValue.isSuccess) {
      if (getFieldSortValue.data.buckets) {
        if (getFieldSortValue.data.buckets.length > 0) {
          const tempArray: {
            name: string;
            index: number;
            count: number;
          }[] = [];
          getFieldSortValue.data.buckets.map((item, index) => {
            if (item.val) {
              tempArray.push({
                index: index,
                name: item.val,
                count: item.count,
              });
            }

            return '';
          });
          setDataSource([...tempArray]);
          setIsFacetSortDataLoading(false);
        } else {
          setDataSource([]);
          setIsFacetSortDataLoading(false);
        }
      }
    }
  }, [getFieldSortValue.isSuccess, getFieldSortValue.data]);

  useEffect(() => {
    if (isFieldOrderingEnable) {
      if (isFieldOrderingEnable && getFieldSortValue.isLoading) {
        setIsFacetSortDataLoading(true);
      }
    } else {
      setIsFacetSortDataLoading(false);
    }
  }, [isFieldOrderingEnable, getFieldSortValue.isLoading]);

  useEffect(() => {
    if (getFieldSortValue.isError) {
      console.log(getFieldSortValue.error);
      setIsFacetSortDataLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFieldSortValue.isError, getFieldSortValue.data]);
  return {
    t,
    onSave,
    form,
    onValueChange,
    displayAsValue,
    selectedRange,
    roundOfCheck,
    dataSource,
    columns,
    DraggableContainer,
    DraggableBodyRow,
    defaultCollapse,
    isFieldOrderingEnable,
    loading: getFieldSortValue.isLoading || isFacetSortDataLoading,
    isSaveButtonEnabled,
  };
};

export default useConfigModalController;
