import React from 'react';
import { Table } from 'antd';
import { useTranslation } from 'react-i18next';

import { ISortableTable } from '../../types';
import NoDataFound from '../no-data-found/no-data-found';
import LanguageIcon from '../../images/icons/language-icon';

const SortableGrid: React.FC<ISortableTable> = ({
  dataSource,
  columns,
  DraggableContainer,
  DraggableBodyRow,
  canReorderEntity,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      {dataSource?.length === 0 ? (
        <NoDataFound
          icon={<LanguageIcon />}
          title={t('common.labels.no_data_found_in_table')}
          description={t('common.labels.no_data_found_in_table_subtitle')}
        />
      ) : (
        <Table
          pagination={false}
          showHeader={false}
          dataSource={dataSource}
          columns={columns}
          rowKey="index"
          style={{ width: 300 }}
          className="drag-content"
          components={
            canReorderEntity
              ? {
                  body: {
                    wrapper: DraggableContainer,
                    row: DraggableBodyRow,
                  },
                }
              : {}
          }
        />
      )}
    </div>
  );
};

export default SortableGrid;
