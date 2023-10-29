// @ts-nocheck
import React from 'react';
import { Button, Form, Select } from 'antd';

import { IContentLibraryFieldPops } from '../../../../../../../types';
import {
  useRelationController,
  CommonController,
  useFieldPermission,
} from './controllers';
import DeleteIcon from '../../../../../../../images/icons/delete';
import DownArrowIcon from '../../../../../../../images/icons/downarrow-icon';
import SearchIcon from '../../../../../../../images/icons/search-icon';
import DownfillIcon from '../../../../../../../images/icons/down-fill-arrow';

interface FieldProps {
  contentModalInternalName: string;
  data: IContentLibraryFieldPops;
  componentName?: string;
}

const RelationComponent: React.FC<FieldProps> = ({
  contentModalInternalName,
  data,
  componentName,
}) => {
  const { onRelationBlurAction, onMultiSelectBlurAction } = CommonController();

  const {
    onRelationDetailClick,
    onChange,
    urlData,
    onMultipleSelectChange,
    multiSelectUrl,
    multiSelectDetailClick,
    onDeleteClick,
    t,
    isSeeMoreButtonEnabled,
    onSeeMoreButtonClick,
  } = useRelationController(
    data.internalName,
    data.relationType,
    data.editValue,
    data.values
  );
  const { canEditField } = useFieldPermission(
    contentModalInternalName,
    data,
    componentName
  );

  return (
    <>
      {data.relationType === 'oneToOne' || data.relationType === 'oneToMany' ? (
        <>
          <Form.Item name={data.internalName} className="m-0">
            <Select
              disabled={!canEditField}
              placeholder={t('common.labels.select')}
              suffixIcon={<DownArrowIcon />}
              onChange={(value) => {
                onChange(value);
                onRelationBlurAction(value, data.editValue, data.internalName);
              }}>
              {data.values.map((item) => (
                <Select.Option value={`${item.id}`}>{item.title}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button
            type="link"
            onClick={onRelationDetailClick}
            className="m-t-8 btn-height-auto content-right-btn"
            disabled={urlData === '' || !canEditField}>
            View
          </Button>
        </>
      ) : (
        <>
          <Form.Item name={data.internalName} className="m-0">
            <Select
              disabled={!canEditField}
              tagRender={() => <p></p>}
              placeholder={t('common.labels.select')}
              mode="multiple"
              showArrow
              showSearch
              suffixIcon={
                <span className="select-search-icon">
                  <SearchIcon />
                </span>
              }
              onChange={(value) => {
                onMultipleSelectChange(value);
                onMultiSelectBlurAction(
                  value,
                  data.editValue,
                  data.internalName
                );
              }}>
              {data.values &&
                data.values.map((item) => (
                  <Select.Option value={item.id}>{item.title}</Select.Option>
                ))}
            </Select>
          </Form.Item>
          <ul className="delete-row-list">
            {multiSelectUrl.length > 0 &&
              multiSelectUrl.map(
                (item, index) =>
                  ((!isSeeMoreButtonEnabled && index < 2) ||
                    isSeeMoreButtonEnabled) && (
                    <li>
                      <span
                      className='text-truncate'
                        onClick={() => {
                          multiSelectDetailClick(item);
                        }}>
                        {item?.name}
                      </span>
                      {canEditField && (
                        <span
                          onClick={() => {
                            onDeleteClick(index, data.internalName);
                          }}>
                          <DeleteIcon />
                        </span>
                      )}
                    </li>
                  )
              )}
            {multiSelectUrl.length > 2 && (
              <div className="see-more-btn text-center">
                <Button
                  className={`gray-text font-normal ${isSeeMoreButtonEnabled ? 'active' : ''}`}
                  onClick={onSeeMoreButtonClick}
                  type="link"
                  icon={
                    <span className="anticon">
                      <DownfillIcon />
                    </span>
                  }>
                  {isSeeMoreButtonEnabled ? t('common.labels.see_less') : t('common.labels.see_more')}
                </Button>
              </div>
            )}
          </ul>
        </>
      )}
    </>
  );
};
export default RelationComponent;
