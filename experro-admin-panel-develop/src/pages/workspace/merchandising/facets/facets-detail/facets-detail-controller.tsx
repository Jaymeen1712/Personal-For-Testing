import type { ColumnsType } from 'antd/es/table';
import { arrayMoveImmutable } from 'array-move';
import React, { useEffect, useState, useImperativeHandle } from 'react';
import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc';
import { Form, Switch, Skeleton, Dropdown, Menu, Button } from 'antd';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { FacetByCategory } from '../../../../../types';
import { useListEnvironments } from '../../../../../apis/environments';
import useError from '../../../../../hooks/error';
import DragIcon from '../../../../../images/icons/drag-icon';
import { openNotificationWithIcon } from '../../../../../utills';
import {
  useCreateFacet,
  useDeleteFacet,
  useFacetRecordByCategory,
  useFacetsCategoryList,
  useMasterFacetsRecordList,
  //useGetFacetValueCount
} from '../../services';
import EllipsisIcon from '../../../../../images/icons/ellipsis-icon';

interface DataType {
  key: string;
  facet: string;
  count: number;
  details: string;
  index?: number;
  fieldName: string;
  isEnable?: boolean;
  facetType?: string;
}

interface InternalFacet {
  fieldName: string;
  isEnabled: boolean;
}

interface FacetData {
  type: string;
  displayName: string;
  facetType: string;
  fieldName: string;
  isEnabled?: boolean;
  isFieldOrderingEnable?: boolean;
  sortOrder?: number;
  isShowFacet?: boolean;
  showCount?: boolean;
  displayAs?: string;
  defaultCollapse?: string;
  minValue?: string;
  maxValue?: string;
  rangeSelect?: string;
  roundOffValue?: number;
  roundDown?: number;
  roundUp?: number;
  sliderMinValue?: number;
  sliderMaxValue?: number;
  sliderStepSize?: number;
  order?: string;
  orderItem?: {
    index: number;
    name: string;
    count: number;
  }[];
}

//@ts-ignore
const useFacetsDetailController = (ref) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const history = useHistory();
  const { workspaceId, environmentId, facetName } = useParams<{
    workspaceId: string;
    environmentId: string;
    facetName: string;
  }>();

  const [category, setCategory] = useState(facetName);

  const [categoryList, setCategoryList] = useState<
    { id: string; title: string; current_version_id: string }[] | []
  >([]);

  const [facetDetail, setFacetDetail] = useState<FacetByCategory>();

  const [checkedFacet, setCheckedFacet] = useState<{ [k: string]: boolean }>(
    {}
  );

  const [isFacetsEnable, setIsFacetEnable] = useState(true);

  const [internalFacetDetails, setInternalFacetDetails] = useState<
    InternalFacet[]
  >([]);

  const [isCheckBoxChecked, setIsCheckBoxChecked] = useState(false);

  const [environmentName, setEnvironmentName] = useState('');

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [updateFacetDetail, setUpdateFacetDetail] = useState<{
    [k: string]: FacetData;
  }>({
    test: {
      type: '',
      displayName: '',
      facetType: '',
      fieldName: '',
    },
  });

  const [selectedFacetName, setSelectedFacetName] = useState('');

  const [ChangeFacetValue, setChangeFacetValue] = useState(false);

  const [isEditingExistingFacet, setIsEditingExistingFacet] =
    useState<boolean>(true);

  // const [fieldNameList, setFieldNameList] = useState<string[]>([]);
  //
  // const [fieldNameForCount, setFieldNameForCount] = useState('');

  const getMasterFacetsList = useMasterFacetsRecordList(
    workspaceId,
    environmentId
  );
  const getFacetCategoryList = useFacetsCategoryList(
    workspaceId,
    environmentId
  );

  const getEnvironmentList = useListEnvironments(workspaceId);

  const getFacetByCategory = useFacetRecordByCategory(
    workspaceId,
    environmentId,
    category
  );
  const createFacet = useCreateFacet(workspaceId, environmentId);

  const deleteFacet = useDeleteFacet(workspaceId);

  // const getFacetValueCount = useGetFacetValueCount(
  //   workspaceId,
  //   environmentId,
  //   fieldNameForCount
  // );

  const DragHandle = SortableHandle(() => <DragIcon />);

  const isChecked = (val: DataType) => {
    if (internalFacetDetails) {
      const matchedValue = internalFacetDetails.find(
        //@ts-ignore
        (item) => item.fieldName === val.fieldName
      );
      if (matchedValue) {
        checkedFacet[val.fieldName] = matchedValue?.isEnabled;
      }
      return matchedValue?.isEnabled;
    }
  };

  useError({
    mutation: deleteFacet,
    entity: t('common.labels.category'),
  });

  useError({
    mutation: createFacet,
    entity: t('common.labels.store'),
  });

  const columns: ColumnsType<DataType> = [
    {
      dataIndex: 'sort',
      width: '16%',
      className: 'drag-visible dragable-icon',
      render: (value, record, index) => (
        <>
          <div className="ant-row ant-space-align-center">
            <div className="dragHandleIcon m-r-16">
              <DragHandle />
            </div>
            <Form.Item name={record.fieldName} className="m-0">
              <Switch defaultChecked={isChecked(record)} />
            </Form.Item>
          </div>
        </>
      ),
    },
    {
      title: t('common.labels.facet'),
      dataIndex: 'facet',
      className: 'drag-visible dragable-icon',
      width: '25%',
      render: (value, record, index) => (
        <>
          <div
            className={`ant-row ant-space-align-center ant-row-space-between w-100 table-text-button ${
              isChecked(record) ? 'active' : ''
            }`}>
            <div className="table-text">
              <span
                className={`${
                  isChecked(record) ? 'cursor-pointer' : ''
                } switch-custom-label`}
                onClick={() => {
                  if (isChecked(record)) {
                    setSelectedFacetName(record.fieldName);
                    setIsModalVisible(true);
                    setChangeFacetValue(!ChangeFacetValue);
                  }
                }}>
                {value}
              </span>
            </div>
            {isChecked(record) && (
              <Dropdown
                placement="bottomRight"
                trigger={['click']}
                overlay={
                  <div className="table-dropdown">
                    <Menu>
                      <Menu.Item
                        onClick={() => {
                          // if (checkedFacet[record.fieldName]) {
                          setSelectedFacetName(record.fieldName);
                          setIsModalVisible(true);
                          setChangeFacetValue(!ChangeFacetValue);
                          // }
                        }}>
                        {t('common.labels.configure')}
                      </Menu.Item>
                    </Menu>
                  </div>
                }>
                <Button
                  type="text"
                  size="small"
                  className="on-hover"
                  icon={<EllipsisIcon />}
                  style={{ float: 'right' }}
                />
              </Dropdown>
            )}
          </div>
        </>
      ),
    },
    {
      title: t('common.labels.count_and_details'),
      dataIndex: 'count',
      width: '25%',
      render: (value, record, index) => (
        <>
          {value || value === 0 ? (
            value
          ) : (
            <>
              <Skeleton.Input active size="small" />
            </>
          )}
        </>
      ),
    },
    {
      title: t('common.labels.display_as'),
      dataIndex: 'facetType',
      width: '50%',
      render: (value, record, index) => (
        <>
          <span className="text-capitalize">{value}</span>
        </>
      ),
    },
  ];

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

  const onCategoryChange = (val: string) => {
    setCategory(val);
    getFacetByCategory.remove();
    history.push(
      `/workspaces/${workspaceId}/discovery/${environmentId}/facets/${val}/add-facet`
    );
  };

  const onTableFromValueChange = (val: { [k: string]: boolean }) => {
    const key = Object.keys(val)[0];
    const value = Object.values(val)[0];
    const tempObject = updateFacetDetail;

    if (key === 'isFacetEnable') {
      setIsFacetEnable(value);
    } else if (key === 'category') {
    } else {
      checkedFacet[key] = value;
      const dataCheck = internalFacetDetails.find(
        (item) => item.fieldName === key
      );
      if (dataCheck) {
        const tempArray = [...internalFacetDetails];
        const findIndex = internalFacetDetails.findIndex(
          (item) => item.fieldName === key
        );
        tempArray.splice(findIndex, 1);
        tempArray.push({
          fieldName: key,
          isEnabled: value,
        });
        setInternalFacetDetails([...tempArray]);
      } else {
        setInternalFacetDetails([
          ...internalFacetDetails,
          {
            fieldName: key,
            isEnabled: value,
          },
        ]);
      }

      if (updateFacetDetail) {
        if (updateFacetDetail[key]) {
          if (tempObject) {
            tempObject[key] = updateFacetDetail[key];
          }
        } else {
          const matchedData = dataSource.find((item) => item.fieldName === key);
          if (matchedData) {
            if (tempObject) {
              tempObject[key] = {
                type: matchedData.details,
                displayName: matchedData.facet,
                facetType: 'list',
                fieldName: matchedData.fieldName,
              };
            }
          }
        }
      }
      setUpdateFacetDetail(tempObject);
    }
  };

  const onCheckBoxClick = (val: boolean) => {
    if (val) {
      if (facetName) {
        deleteFacet.mutate(facetName);
      }
    }
    setIsCheckBoxChecked(val);
  };

  const onModalCancelClick = () => {
    setIsModalVisible(false);
  };

  const onFacetApply = (val: { [k: string]: FacetData }) => {
    setUpdateFacetDetail(val);
  };

  useImperativeHandle(ref, () => ({
    onSave() {
      const finalFacets: {
        sortOrder: number;
        isEnabled: boolean;
        type?: string;
        displayName?: string;
        facetType?: string;
        fieldName?: string;
        minValue?: string;
        maxValue?: string;
        isShowFacet?: boolean;
        showCount?: boolean;
        displayAs?: string;
        defaultCollapse?: string;
        rangeSelect?: string;
        roundOffValue?: number;
        roundDown?: number;
        roundUp?: number;
        sliderMinValue?: number;
        sliderMaxValue?: number;
        sliderStepSize?: number;
        isFieldOrderingEnable?: boolean;
        order?: string;
        orderItem?: {
          index: number;
          name: string;
          count: number;
        }[];
      }[] = [];

      // Object.keys(checkedFacet).map((item) => {
      //   if (checkedFacet[item]) {
      //     const indexObject = dataSource.findIndex(
      //       (data) => data.fieldName === item
      //     );
      //     if (updateFacetDetail) {
      //       finalFacets.push({
      //         type: updateFacetDetail[item]?.type,
      //         displayName: updateFacetDetail[item]?.displayName,
      //         facetType: updateFacetDetail[item]?.facetType,
      //         fieldName: updateFacetDetail[item]?.fieldName,
      //         sortOrder: indexObject,
      //         isEnabled: true,
      //         minValue: updateFacetDetail[item]?.minValue,
      //         maxValue: updateFacetDetail[item]?.maxValue,
      //         isShowFacet: updateFacetDetail[item]?.isShowFacet,
      //         showCount: updateFacetDetail[item]?.showCount,
      //         displayAs: updateFacetDetail[item]?.displayAs,
      //         defaultCollapse: updateFacetDetail[item]?.defaultCollapse,
      //       });
      //     }
      //   }
      //   return '';
      // });

      const keyArray = Object.keys(checkedFacet);
      dataSource.map((item, index) => {
        if (keyArray.includes(item.fieldName)) {
          if (checkedFacet[item.fieldName]) {
            if (updateFacetDetail) {
              finalFacets.push({
                type: updateFacetDetail[item.fieldName]?.type,
                displayName: updateFacetDetail[item.fieldName]?.displayName,
                facetType: updateFacetDetail[item.fieldName]?.facetType,
                fieldName: updateFacetDetail[item.fieldName]?.fieldName,
                sortOrder: index,
                isEnabled: true,
                minValue: updateFacetDetail[item.fieldName]?.minValue,
                maxValue: updateFacetDetail[item.fieldName]?.maxValue,
                isShowFacet: updateFacetDetail[item.fieldName]?.isShowFacet,
                showCount: updateFacetDetail[item.fieldName]?.showCount,
                displayAs: updateFacetDetail[item.fieldName]?.displayAs,
                defaultCollapse:
                  updateFacetDetail[item.fieldName]?.defaultCollapse,
                roundOffValue: updateFacetDetail[item.fieldName]?.roundOffValue,
                roundDown: updateFacetDetail[item.fieldName]?.roundDown,
                roundUp: updateFacetDetail[item.fieldName]?.roundUp,
                rangeSelect: updateFacetDetail[item.fieldName]?.rangeSelect,
                sliderMinValue:
                  updateFacetDetail[item.fieldName]?.sliderMinValue,
                sliderMaxValue:
                  updateFacetDetail[item.fieldName]?.sliderMaxValue,
                sliderStepSize:
                  updateFacetDetail[item.fieldName]?.sliderStepSize,
                isFieldOrderingEnable:
                  updateFacetDetail[item.fieldName]?.isFieldOrderingEnable,
                order: updateFacetDetail[item.fieldName]?.order,
                orderItem: updateFacetDetail[item.fieldName]?.orderItem,
              });
            }
          } else {
            finalFacets.push({
              type: item.details,
              displayName: item.facet,
              facetType: 'list',
              fieldName: item.fieldName,
              sortOrder: index,
              isEnabled: false,
            });
          }
        } else {
          finalFacets.push({
            type: item.details,
            displayName: item.facet,
            facetType: 'list',
            fieldName: item.fieldName,
            sortOrder: index,
            isEnabled: false,
          });
        }
        return '';
      });

      const result = categoryList.find((item) => item.id === category);

      if (result) {
        const finalObject: {
          id?: string;
          category: string;
          provider: string;
          isEnabled: boolean;
          categoryName: string;
          facets: {
            sortOrder: number;
            isEnabled: boolean;
            type?: string | undefined;
            displayName?: string | undefined;
            facetType?: string | undefined;
            facetName?: string | undefined;
          }[];
          storeId?: string;
        } = {
          id: facetDetail?.id,
          category: category,
          provider: 'BIGCOMMERCE',
          storeId: facetDetail?.storeId,
          isEnabled: isFacetsEnable,
          facets: finalFacets,
          categoryName: result.title,
        };
        createFacet.mutate(finalObject);
      } else if (category === 'All') {
        const finalObject: {
          id?: string;
          category: string;
          provider: string;
          isEnabled: boolean;
          categoryName: string;
          facets: {
            sortOrder: number;
            isEnabled: boolean;
            type?: string | undefined;
            displayName?: string | undefined;
            facetType?: string | undefined;
            facetName?: string | undefined;
          }[];
          storeId?: string;
        } = {
          id: facetDetail?.id,
          category: category,
          provider: 'BIGCOMMERCE',
          storeId: facetDetail?.storeId,
          isEnabled: isFacetsEnable,
          facets: finalFacets,
          categoryName: 'All',
        };
        createFacet.mutate(finalObject);
      }
    },
  }));

  useEffect(() => {
    if (
      getMasterFacetsList.isFetched &&
      getFacetCategoryList.isFetched &&
      getFacetByCategory.isFetched &&
      getEnvironmentList.isFetched
    ) {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getFacetCategoryList.isFetched,
    getMasterFacetsList.isFetched,
    getFacetByCategory.isFetched,
    getEnvironmentList.isFetched,
  ]);

  useEffect(() => {
    if (getMasterFacetsList.isSuccess) {
      const arr: DataType[] = [];
      const fieldNameArray: string[] = [];
      getMasterFacetsList.data.map((item, index) => {
        fieldNameArray.push(item.fieldName);
        if (updateFacetDetail[item.fieldName]) {
          arr.push({
            key: item.id,
            facet: item.title,
            count: item.count,
            details: item.type,
            index: updateFacetDetail[item.fieldName].sortOrder,
            fieldName: item.fieldName,
            isEnable: updateFacetDetail[item.fieldName].isEnabled,
            facetType: updateFacetDetail[item.fieldName].facetType,
          });
        } else {
          arr.push({
            key: item.id,
            facet: item.title,
            count: item.count,
            details: item.type,
            index: index,
            fieldName: item.fieldName,
            isEnable: false,
            facetType: item.type,
          });
        }

        return '';
      });
      //@ts-ignore
      const finalArray = arr.sort((a, b) => a.index - b.index);
      setDataSource([...finalArray]);
      // setFieldNameList([...fieldNameArray]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getMasterFacetsList.isSuccess, updateFacetDetail]);

  useEffect(() => {
    if (getMasterFacetsList.isError) {
      setDataSource([]);
    }
  }, [getMasterFacetsList.isError]);

  useEffect(() => {
    if (getFacetCategoryList.isSuccess) {
      setCategoryList(getFacetCategoryList.data.items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFacetCategoryList.isSuccess]);

  useEffect(() => {
    if (getFacetCategoryList.isError) {
      setCategoryList([]);
    }
  }, [getFacetCategoryList.isError]);

  useEffect(() => {
    const temObject = {};
    // const finalObject: { [k: string]: string | number | boolean } = {};
    if (getFacetByCategory.isSuccess) {
      if (getFacetByCategory.data) {
        if (getFacetByCategory.data.isExist) {
          setIsEditingExistingFacet(true);
        } else {
          setIsEditingExistingFacet(false);
        }
        setFacetDetail(getFacetByCategory.data);
        setIsFacetEnable(getFacetByCategory.data.isEnabled);
        if (getFacetByCategory.data.facets) {
          //@ts-ignore
          const data = getFacetByCategory.data.facets.filter(
            //@ts-ignore
            (item) => item.isEnabled
          );
          setInternalFacetDetails(data);
        }

        if (Object.keys(getFacetByCategory.data).length > 0) {
          //@ts-ignore
          getFacetByCategory.data.facets.map((item: InternalFacet) => {
            //@ts-ignore
            temObject[item.fieldName] = item;
            return '';
          });
        }

        setUpdateFacetDetail(temObject);
      } else {
        setCheckedFacet({});
        setIsFacetEnable(true);
        setInternalFacetDetails([
          {
            fieldName: '',
            isEnabled: false,
          },
        ]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFacetByCategory.isSuccess, getFacetByCategory.data]);

  useEffect(() => {
    if (getFacetByCategory.isError) {
      setCheckedFacet({});
      setIsFacetEnable(true);
      setInternalFacetDetails([
        {
          fieldName: '',
          isEnabled: false,
        },
      ]);
    }
  }, [getFacetByCategory.isError]);

  useEffect(() => {
    if (createFacet.isSuccess) {
      history.push(`/workspaces/${workspaceId}/discovery/facets`);
      isEditingExistingFacet
        ? openNotificationWithIcon(
            'success',
            t('common.messages.facet_saved_successfully')
          )
        : openNotificationWithIcon(
            'success',
            t('common.messages.facet_added_successfully')
          );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createFacet.isSuccess]);

  useEffect(() => {
    if (createFacet.isError) {
      openNotificationWithIcon('error', 'Error in Facet Created');
    }
  }, [createFacet.isError]);

  useEffect(() => {
    if (deleteFacet.isSuccess) {
      setCheckedFacet({});
      setIsFacetEnable(true);
      getFacetByCategory.remove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteFacet.isSuccess]);

  useEffect(() => {
    if (getEnvironmentList.isSuccess) {
      const data = getEnvironmentList.data.find(
        (item) => item.id === environmentId
      );
      if (data) {
        setEnvironmentName(data.title);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEnvironmentList.isSuccess]);

  // useEffect(() => {
  //   if (fieldNameList.length > 0) {
  //     if (fieldNameList.length >= 10) {
  //       setFieldNameForCount(
  //         [
  //           fieldNameList[0],
  //           fieldNameList[1],
  //           fieldNameList[2],
  //           fieldNameList[3],
  //           fieldNameList[4],
  //           fieldNameList[5],
  //           fieldNameList[6],
  //           fieldNameList[7],
  //           fieldNameList[8],
  //           fieldNameList[9],
  //         ].join(',')
  //       );
  //     } else {
  //       setFieldNameForCount(fieldNameList.join(','));
  //     }
  //     getFacetValueCount.remove();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [fieldNameList]);
  //
  // useEffect(() => {
  //   if (getFacetValueCount.isSuccess) {
  //     if (Object.keys(getFacetValueCount.data).length > 0) {
  //       const tempMasterArray = [...dataSource];
  //       Object.keys(getFacetValueCount.data).map((item) => {
  //         const findIndex = tempMasterArray.findIndex(
  //           (data) =>
  //             data.fieldName ===
  //             item.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase())
  //         );
  //         if (findIndex !== -1) {
  //           //@ts-ignore
  //           tempMasterArray[findIndex].count = getFacetValueCount.data[item];
  //         }
  //         return true;
  //       });
  //       setDataSource([...tempMasterArray]);
  //       if (fieldNameList.length > 0) {
  //         if (fieldNameList.length >= 10) {
  //           const tempArray = [...fieldNameList];
  //           tempArray.splice(0, 10);
  //           setFieldNameList([...tempArray]);
  //         } else {
  //           const tempArray = [...fieldNameList];
  //           tempArray.splice(0, fieldNameList.length);
  //           setFieldNameList(tempArray);
  //         }
  //       }
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [getFacetValueCount.isSuccess, getFacetValueCount.data]);
  // useEffect(() => {
  //   if (getFacetValueCount.isError) {
  //     console.log(getFacetValueCount.error);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [getFacetValueCount.isError]);

  const onBackButtonClick = () => {
    history.push(`/workspaces/${workspaceId}/discovery/facets`);
  };

  return {
    DraggableContainer,
    DraggableBodyRow,
    dataSource,
    columns,
    form,
    t,
    onCategoryChange,
    categoryList,
    onTableFromValueChange,
    isFacetsEnable,
    onCheckBoxClick,
    isCheckBoxChecked,
    environmentName,
    isModalVisible,
    onModalCancelClick,
    category,
    updateFacetDetail,
    selectedFacetName,
    onFacetApply,
    ChangeFacetValue,
    isLoading,
    onBackButtonClick,
    isEditingExistingFacet,
  };
};

export default useFacetsDetailController;
