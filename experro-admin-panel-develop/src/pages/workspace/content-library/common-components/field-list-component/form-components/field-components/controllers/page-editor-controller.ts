import { useContext } from 'react';
import Cookies from 'js-cookie';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ContentLibraryContext } from '../../../../../context';
import { RelationFinalObject } from '../../../../../utils';
import {
  onSubSidebarCollapse,
  openNotificationWithIcon,
} from '../../../../../../../../utills';
import useFinalObject from '../../../../../utils/final-object';
import { onMainSidebarCollapsed } from '../../../../../../../../utills';

const usePageEditor = () => {
  const {
    workspaceId,
    contentModalId,
    contentModalDataId,
    versionId,
    languageName,
  } = useParams<{
    workspaceId: string;
    contentModalId: string;
    contentModalDataId: string;
    versionId: string;
    languageName: string;
  }>();
  const location = useLocation();
  const contentLibraryContext = useContext(ContentLibraryContext);
  const history = useHistory();
  const { finalObject } = useFinalObject();
  const { t } = useTranslation();

  const form = contentLibraryContext?.form;

  const onPageEditorClick = async () => {
    try {
      const result = await form.validateFields();
      //@ts-ignore
      const { contentFieldObject } = contentLibraryContext?.responseValueObject;

      const requestObject = {
        node_type: 'parent',
        contentModelDataId: contentModalDataId,
        contentModelFieldDataId: versionId,
        contentModalId: contentModalId,
        versionId: versionId,
        template: contentLibraryContext?.newRecordFieldDetails?.template,
        language: languageName,
        dynamic_fields_data: finalObject(contentFieldObject, result, false),
        dynamic_relation_fields: RelationFinalObject(
          contentFieldObject,
          result
        ),
      };

      localStorage.setItem(
        `${versionId}/contentFieldData`,
        JSON.stringify(requestObject)
      );
      if (contentLibraryContext?.environmentList) {
        const result = contentLibraryContext?.environmentList.find(
          (item) =>
            item.id === localStorage.getItem(`${workspaceId}/environmentId`)
        );
        if (result) {
          contentLibraryContext?.changeIFrameVisible({
            isVisible: true,
            url: `${process.env.REACT_APP_PAGE_EDITOR_IFRAME_HOST}${contentLibraryContext?.titleAndSubtitle?.subTitle}?wh=${result.workspaceDomain}&vid=${contentLibraryContext?.newRecordFieldDetails?.versionId}&lang=${contentLibraryContext?.newRecordFieldDetails?.language}`,
          });

          Cookies.set(
            'pageEditorPopUp',
            `${process.env.REACT_APP_PAGE_EDITOR_IFRAME_HOST}${contentLibraryContext?.titleAndSubtitle?.subTitle}?wh=${result.workspaceDomain}&vid=${contentLibraryContext?.newRecordFieldDetails?.versionId}&lang=${contentLibraryContext?.newRecordFieldDetails?.language}`
          );
        }
      }

      history.push(`${location.pathname}?isPageEditor=true`);
      onMainSidebarCollapsed(true);
      onSubSidebarCollapse(true);

      // @ts-ignore
      window.openMediaManager = function () {
        contentLibraryContext?.ChangeIFrameORMediaManagerVisible(true);
        onSubSidebarCollapse(false);
        return true;
      };
    } catch (err) {
      if (err instanceof SyntaxError) {
        openNotificationWithIcon(
          'error',
          t('common.messages.error_enter_valid_json')
        );
      } else {
        openNotificationWithIcon(
          'error',
          t('common.messages.provide_all_details')
        );
      }
      return false;
    }
  };

  return {
    onPageEditorClick,
    t,
  };
};
export default usePageEditor;
