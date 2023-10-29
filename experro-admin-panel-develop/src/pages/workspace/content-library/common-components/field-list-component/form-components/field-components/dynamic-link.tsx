import React from 'react';
import { Button, Form, Modal, Select, Spin, Tooltip } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { IContentLibraryFieldPops } from '../../../../../../../types';
import useDynamicLinkController from './controllers/dynamic-link-controller';
import SelectedCircleIcon from '../../../../../../../images/icons/selected-circle-icon';
import PlusIcon from '../../../../../../../images/icons/plus-icon';
import DeleteNotooltipIcon from '../../../../../../../images/icons/delete-no-tooltip';
// import DownfillIcon from '../../../../../../../images/icons/down-fill-arrow';
import { useFieldPermission } from './controllers';
import InfoIconCircleTooltip from '../../../../../../../images/icons/Info-icon-circle-tootltip';
import NoDataFound from '../../../../../../../components/no-data-found';
import NoRecordIcon from '../../../../../../../images/icons/no-records-icon';

interface FieldProps {
  contentModalInternalName: string;
  data: IContentLibraryFieldPops;
  componentName?: string;
}

const DynamicLink: React.FC<FieldProps> = ({
  data,
  componentName,
  contentModalInternalName,
}) => {
  const {
    t,
    contentModalList,
    isSelectRecordModalOpen,
    selectRecordModalOpenChange,
    selectContentModal,
    onSelectContentModalChange,
    recordList,
    isRecordListLoading,
    onRecordClick,
    selectedRecordList,
    onDeleteRecordClick,
    onSearchChange,
    inputRef,
    isLoading,
    // isSeeMoreEnabled,
    onModalCancelButtonClick,
    onModalSaveButtonClick,
    totalSelectedRecordCount,
    copyTotalSelectedRecordCount,
  } = useDynamicLinkController(data);

  const { canEditField } = useFieldPermission(
    contentModalInternalName,
    data,
    componentName
  );

  return (
    <>
      <Form.Item
        className="dyanamic-label-field"
        label={
          <>
            <div className="ant-row ant-space-align-center">
              {data.title}
              {data.fieldProperties.helpText && (
                <Tooltip title={data.fieldProperties?.helpText} placement="top">
                  <span className="anticon m-l-2">
                    <InfoIconCircleTooltip />
                  </span>
                </Tooltip>
              )}
            </div>
            {selectedRecordList.length > 0 && (
              <div className="ant-row ant-row-space-between ant-space-align-center w-100">
                <span className="font-sm">{`${totalSelectedRecordCount} ${
                  totalSelectedRecordCount > 1
                    ? t('common.labels.records_linked')
                    : t('common.labels.record_linked')
                }`}</span>
                <Button
                  onClick={() => selectRecordModalOpenChange(true)}
                  size="small"
                  type="primary"
                  disabled={!canEditField}
                  icon={
                    <span className="anticon">
                      <PlusIcon />
                    </span>
                  }>
                  {data.fieldProperties.validation?.includes(
                    'multiple_records_select'
                  )
                    ? t('common.labels.add')
                    : t('common.labels.change')}
                </Button>
              </div>
            )}
          </>
        }
        name={data.name}
        initialValue={
          data.editValue
            ? data.editValue
            : data.fieldProperties.multiSelectDefaultValue
        }
        rules={[
          {
            required: data.isRequired,
            message: t('common.messages.required', { entity: data.title }),
          },
        ]}
        normalize={(value) => value.trimStart()}>
        <ul className="delete-row-list">
          {selectedRecordList.length > 0 && (
            <div className="table-section tableCellPadding-10">
              <div className="ant-table">
                <table>
                  <thead className="ant-table-thead">
                    <tr>
                      <th className="ant-table-cell">
                        {t(
                          'common.labels.content_library_table_column_record_title'
                        )}
                      </th>
                      <th className="ant-table-cell">
                        {t('common.labels.model')}
                      </th>
                      {canEditField && (
                        <th className="ant-table-cell action-cell">
                          {t('common.labels.action')}
                        </th>
                      )}
                    </tr>
                  </thead>
                  {/*{console.log('test', selectedRecordList)}*/}
                  <tbody className="ant-table-tbody">
                    {selectedRecordList.map(
                      (item, contentModalIndex) =>
                        item.records.map((record, recordIndex) => (
                          // (totalSelectedRecordCount <= 5 ||
                          // (isSeeMoreEnabled && recordIndex > 6)) && (
                          <tr>
                            <td className="ant-table-cell text-truncate with-pixel-small">{`${record?.name}`}</td>
                            <td className="ant-table-cell">
                              {item.contentModalName}
                            </td>
                            {canEditField && (
                              <td
                                className="ant-table-cell action-cell"
                                onClick={() =>
                                  onDeleteRecordClick(
                                    contentModalIndex,
                                    recordIndex
                                  )
                                }>
                                <DeleteNotooltipIcon />
                              </td>
                            )}
                          </tr>
                        ))
                      // )
                    )}
                  </tbody>
                </table>
              </div>
              {/*{totalSelectedRecordCount > 5 && (*/}
              {/*  <div className="see-more-btn text-center">*/}
              {/*    <Button*/}
              {/*      type="link"*/}
              {/*      icon={*/}
              {/*        <span className="anticon">*/}
              {/*          <DownfillIcon />*/}
              {/*        </span>*/}
              {/*      }>*/}
              {/*      {t('common.labels.see_more')}*/}
              {/*    </Button>*/}
              {/*  </div>*/}
              {/*)}*/}
            </div>
          )}
        </ul>
        {selectedRecordList.length === 0 && (
          <div className="link-record ant-row ant-row-center">
            <p className="m-b-16 font-sm">
              {t('common.labels.no_records_links')}
            </p>
            <Button
              className={isLoading ? 'ant-btn-loading' : ''}
              size="small"
              onClick={() => selectRecordModalOpenChange(true)}
              type="primary"
              icon={
                isLoading ? (
                  ''
                ) : (
                  <span className="anticon">
                    <PlusIcon />
                  </span>
                )
              }>
              {isLoading ? (
                <Spin
                  className="HV-center"
                  indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />}
                  size="large"
                />
              ) : (
                t('common.labels.link_record')
              )}
            </Button>
          </div>
        )}
      </Form.Item>

      <Modal
        open={isSelectRecordModalOpen}
        className="CustomModal CustomModal-medium dynamic-link-popup"
        title={t('common.labels.dynamic_field_title')}
        centered
        onCancel={onModalCancelButtonClick}
        footer={[
          <>
            <div className="ant-row ant-space-align-center ant-row-space-between ">
              <div className="record-list-info">
                <span className="gray-text">{`${copyTotalSelectedRecordCount} ${
                  copyTotalSelectedRecordCount > 1
                    ? t('common.labels.records_selected')
                    : t('common.labels.record_selected')
                } `}</span>
              </div>
              <div>
                <Button key="cancel" onClick={onModalCancelButtonClick}>
                  {t('common.labels.cancel')}
                </Button>
                <Button
                  key="save"
                  type="primary"
                  onClick={onModalSaveButtonClick}>
                  {t('common.labels.save')}
                </Button>
              </div>
            </div>
          </>,
        ]}>
        <div className="dynamic-select-intput">
          <div className="ant-row">
            <div>
              <Select
                onChange={onSelectContentModalChange}
                value={selectContentModal}
                placeholder={t('common.labels.select')}
                style={{ width: 120 }}
                options={contentModalList.map((item) => ({
                  key: item.id,
                  label: item.name,
                  value: item.id,
                }))}
              />
            </div>
            <div className={'ant-form-item-control-input'}>
              <input
                ref={inputRef}
                placeholder={t('common.labels.search_records')}
                onChange={(e) => onSearchChange(e.target.value)}
                className="ant-input"
              />
            </div>
          </div>

          {isRecordListLoading ? (
            <Spin
              className="HV-center table-center"
              indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
              size="large"
            />
          ) : (
            <ul className="delete-row-list dynamic-link-list">
              {recordList.length > 0 ? (
                recordList.map((item) => (
                  <li
                    className={`${item.isSelected ? 'row-selected' : ''}`}
                    onClick={() =>
                      onRecordClick({ id: item.id, name: item.title })
                    }>
                    <span>{item?.title}</span>
                    <span>{item.isSelected && <SelectedCircleIcon />}</span>
                  </li>
                ))
              ) : (
                <NoDataFound
                  icon={<NoRecordIcon />}
                  title={t('common.labels.no_record_added')}
                  description={t('common.labels.add_content_field_above')}
                />
              )}
            </ul>
          )}
        </div>
      </Modal>
    </>
  );
};
export default DynamicLink;
