import React, { ReactNode } from 'react';
import { Checkbox, Typography, Card, Col, Tooltip } from 'antd';
import GridMenu from '../../../../../../components/grid-menu';
import CopyIcon from '../../../../../../images/icons/copy-icon';
import { IFile } from '../../../../../../types';
import MediaIcon from '../../media-icon';
import { formatFileSize, VIDEO_EXTENSIONS } from '../../../../../../utills';
import { TFunction } from 'react-i18next';

const { Paragraph } = Typography;

interface FileCardProps {
  t: TFunction<'translation', undefined>;
  file: IFile;
  selectedFiles?: IFile[];
  onFileSelectChange: (file: IFile) => void;
  onLinkCopy: () => void;
  onClickHover?: (fileId: string) => void;
  menuList: {
    key: string;
    onClick?: (fileId: string) => void;
    label: string | ReactNode;
  }[];
  multiple?: boolean;
  isPopUp?: boolean;
}

const FileCard: React.FC<FileCardProps> = ({
  t,
  file,
  onFileSelectChange,
  selectedFiles,
  onLinkCopy,
  menuList,
  onClickHover,
  multiple,
  isPopUp,
}) => {
  const isChecked =
    selectedFiles?.findIndex((selectedFile) => selectedFile.id === file.id) !==
    -1;

  const onCheckboxClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  return (
    <Col md={8} xl={6} className="m-b-16">
      <Card
        hoverable
        cover={
          <>
            {file && (
              <MediaIcon
                isPopUp={isPopUp}
                onClickHover={onClickHover}
                fileDetails={file}
                type={file.type}
                url={file.url}
              />
            )}
            <div
              className={`media-hover-section ${
                VIDEO_EXTENSIONS.includes(file.type as string)
                  ? 'video-hover'
                  : ''
              } ${isChecked ? 'checked' : ''}`}
              onClick={
                isPopUp
                  ? () => onFileSelectChange(file)
                  : () => onClickHover && onClickHover(file.id)
              }>
              <div className="ant-row ant-row-middle ant-row-space-between w-100">
                <div onClick={(event) => onCheckboxClick(event)}>
                  <Checkbox
                    onChange={onFileSelectChange.bind(this, file)}
                    checked={isChecked}
                  />
                </div>
                <div
                  className="ant-row ant-space-align-center"
                  onClick={(event) => onCheckboxClick(event)}>
                  <Tooltip placement="top" title={t('common.labels.copy_link')}>
                    <Paragraph
                      className="OnlyIcon m-r-8"
                      copyable={{
                        text: file.url,
                        icon: <CopyIcon />,
                        tooltips: false,
                        onCopy: onLinkCopy,
                      }}
                    />
                  </Tooltip>
                  {!isPopUp && !(selectedFiles && selectedFiles.length > 0) && (
                    <GridMenu menuList={menuList} id={file.id} />
                  )}
                </div>
              </div>
            </div>
          </>
        }>
        <div
          className="media-grid-layout-content p-8"
          onClick={
            isPopUp
              ? () => onFileSelectChange(file)
              : () => onClickHover && onClickHover(file.id)
          }>
          <h4 className="dark-black title-sm font-normal m-b-4">{file.name}</h4>
          <p className="ant-row ant-row-middle ant-row-space-between m-0 light-gray">
            {file.sizeWithType
              ? file.sizeWithType
              : formatFileSize(Number(file.size))}
            <span>{`${file.type}`}</span>
          </p>
        </div>
      </Card>
    </Col>
  );
};

export default FileCard;
