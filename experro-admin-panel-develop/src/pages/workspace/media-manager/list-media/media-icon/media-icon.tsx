import {
  AUDIO_EXTENSIONS,
  IMAGE_EXTENSIONS,
  TEXT_EXTENSIONS,
} from '../../../../../utills';
import FolderMicrophoneIcon from '../../../../../images/icons/folder-microphone-icon';
import FolderPdfIcon from '../../../../../images/icons/folder-pdf-icon';
import FolderZipIcon from '../../../../../images/icons/folder-zip-icon';
import FolderDocIcon from '../../../../../images/icons/folder-doc-icon';
import React from 'react';
import { useParams } from 'react-router-dom';
import { IWorkspaceParams } from '../../../../../types';
import useMediaIconController from './media-icon-controller';

interface MediaIconProps {
  // eslint-disable-next-line
  fileDetails: any;
  type?: string;
  url?: string;
  isDetailsPage?: boolean;
  showViewControl?: boolean;
  isListMediaPage?: boolean;
  onClickHover?: (fileId: string) => void;
  isPopUp?: boolean;
}

const MediaIcon: React.FC<MediaIconProps> = ({
  fileDetails,
  type,
  url,
  isDetailsPage = false,
  showViewControl = true,
  isListMediaPage = false,
  onClickHover,
  isPopUp,
}) => {
  const { workspaceId } = useParams<IWorkspaceParams>();
  const { cacheDomain, isLoading } = useMediaIconController();
  return (
    <>
      {/* <div
        onClick={isPopUp ? undefined : () => onClickHover && onClickHover(id)}> */}
      {IMAGE_EXTENSIONS.includes(type as string) && !isLoading ? (
        cacheDomain ? (
          <>
            <picture>
              <source
                srcSet={`https://${cacheDomain}/${fileDetails.absolutePath}?width=380`}
              />
              <img
                src={`https://${cacheDomain}/${fileDetails.absolutePath}?width=380`}
                alt={fileDetails.altText ? fileDetails.altText : ''}
                title={fileDetails.caption ? fileDetails.caption : ''}
              />
            </picture>
          </>
        ) : (
          <picture>
            <source
              type="image/avif"
              srcSet={`${process.env.REACT_APP_API_THUMBNAIL_URL}/${workspaceId}/${fileDetails.id}?height=500&expected_file_type=avif`}
            />
            <source
              type="image/webp"
              srcSet={`${process.env.REACT_APP_API_THUMBNAIL_URL}/${workspaceId}/${fileDetails.id}?height=500&expected_file_type=webp`}
            />
            <source
              type="image/jpg"
              srcSet={`${process.env.REACT_APP_API_THUMBNAIL_URL}/${workspaceId}/${fileDetails.id}?height=500&expected_file_type=jpg`}
            />
            <source
              type="image/jpg"
              srcSet={`${process.env.REACT_APP_API_THUMBNAIL_URL}/${workspaceId}/${fileDetails.id}?height=500&expected_file_type=png`}
            />
            <img alt="Experro" />
          </picture>
        )
      ) : // ) : VIDEO_EXTENSIONS.includes(type) ? (
      // <>
      // {isListMediaPage ? (
      // <video>
      // <source src={url} />
      // </video>
      // ) : (
      // <video controls={showViewControl}>
      // <source src={url} />
      // </video>
      // )}
      // </>
      AUDIO_EXTENSIONS.includes(type as string) ? (
        <>
          <div className="media-default-icon">
            <FolderMicrophoneIcon />
          </div>
          {isDetailsPage && (
            <audio controls>
              <source src={url} type="audio/mpeg" />
            </audio>
          )}
        </>
      ) : type === 'pdf' ? (
        <div className="media-default-icon">
          <FolderPdfIcon />
        </div>
      ) : type === 'zip' ? (
        <div className="media-default-icon">
          <FolderZipIcon />
        </div>
      ) : TEXT_EXTENSIONS.includes(type as string) ? (
        <div className="media-default-icon">
          <FolderDocIcon />
        </div>
      ) : (
        <div></div>
      )}
      {/* </div> */}
    </>
  );
};
export default MediaIcon;
