import { ColumnRendererPropType, RowRecord } from '../../../../types';
import React from 'react';

const redirectCellRender = (
  options: ColumnRendererPropType,
  text: string,
  record: object
) => {
  const redirectText = options.getText
    ? options.getText(record as RowRecord)
    : text;

  return (
    <>
      {redirectText !== '-' ? (
        <a
          href={`https://${redirectText}`}
          target="_blank"
          rel="noopener noreferrer">
          {redirectText}
        </a>
      ) : (
        <>{redirectText}</>
      )}
    </>
  );
};

export default redirectCellRender;
