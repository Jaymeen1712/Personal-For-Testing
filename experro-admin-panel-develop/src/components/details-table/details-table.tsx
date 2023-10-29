import React from 'react';
import { useTranslation } from 'react-i18next';

import { DetailsTableProps } from '../../types';

const DetailsTable: React.FC<DetailsTableProps> = ({ rows }) => {
  const { t } = useTranslation();
  return (
    <div className="ant-vertical-table">
      <div className="formitem-withtitle">
        <h5>{t('common.labels.about')}</h5>
      </div>
      {rows.map((row) => (
        <div className="ant-vertical-table-row" key={row.label}>
          <span className="table-label">{row.label}</span>
          <span className="table-value">{row.value}</span>
        </div>
      ))}
    </div>
  );
};

export default DetailsTable;
