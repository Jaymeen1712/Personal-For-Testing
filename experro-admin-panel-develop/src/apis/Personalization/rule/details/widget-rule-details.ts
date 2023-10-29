import { useQuery } from 'react-query';
import apiClient from '../../../api-client';
import { IAPIError, IAxiosResponse, IWidgetRuleList } from '../../../../types';
import { APIS_ROUTES, API_QUERY_KEY } from '../../../../utills';

const widgetRuleDetails = async (
  workspaceId: string,
  contentModelId?: string,
  contentModelDataId?: string,
  versionId?: string,
  environmentId?: string | null
) => {
  if (
    !contentModelId ||
    !contentModelDataId ||
    !workspaceId ||
    !versionId ||
    !environmentId
  )
    return;
  const response = await apiClient.get<
    string,
    IAxiosResponse<{ item: IWidgetRuleList }>
  >(
    `${APIS_ROUTES.PERSONALIZATION_SERVICE}/${workspaceId}/${API_QUERY_KEY.CONTENTS}/${contentModelId}/${APIS_ROUTES.CONTENT_MODAL_DATA}/${contentModelDataId}/widget-rules`,
    {
      params: {
        version_id: versionId,
        metaDataFieldsToQuery:
          'environment_id,keyword_esai,content_model_data_id,content_model_id,created_at,created_by,description_eti,end_date_edti,start_date_edti,is_system_generated_ebi,keyword_esi,modified_at,modified_by,name,primary_algorithm_ej,custom_primary_algorithm_ej,secondary_algorithm_ej,rule_title_eti,status_esi,widget_description_eti,widget_id_esi,widget_rule_applicable_on_esi,widget_title_eti,version_id,algorithm_internal_name_esi,is_fallback_ebi,keyword_esai,page_url_esi',
        environments_id: environmentId,
      },
    }
  );

  if (
    response.response.Data.item &&
    response.response.Data.item.contentModelFieldData.keywordEsai !== undefined
  ) {
    if (response.response.Data.item.contentModelFieldData.searchTerms) {
      response.response.Data.item.contentModelFieldData.searchTerms =
        response.response.Data.item.contentModelFieldData.searchTerms[0];
    } else {
      if (
        response.response.Data.item.contentModelFieldData.keywordEsai.length > 0
      ) {
        response.response.Data.item.contentModelFieldData.searchTerms =
          response.response.Data.item.contentModelFieldData.keywordEsai[
            response.response.Data.item.contentModelFieldData.keywordEsai
              .length - 1
          ];
      } else {
        response.response.Data.item.contentModelFieldData.searchTerms = '';
      }
    }

    response.response.Data.item.contentModelFieldData.keywordEsai =
      response.response.Data.item.contentModelFieldData.keywordEsai?.map(
        (product: string) =>
          product ===
          response.response.Data.item.contentModelFieldData.searchTerms
            ? {
                //Here it is an object of that search Term whose data is currently shown on the page,
                // and with the help of toggle property it will be marked as a blue.
                text: product,
                id: product,
                className: 'custom_tag',
              }
            : {
                text: product,
                id: product,
              }
      );
  }
  return response.response.Data.item;
};

const useWidgetRuleDetails = (
  workspaceId: string,
  contentModelId?: string,
  contentModelDataId?: string,
  versionId?: string,
  environmentId?: string | null
) =>
  useQuery<IWidgetRuleList | undefined, IAPIError>(
    [
      API_QUERY_KEY.WIDGET_RULE_DETAILS,
      workspaceId,
      contentModelId,
      contentModelDataId,
      versionId,
      environmentId,
    ],
    () =>
      widgetRuleDetails(
        workspaceId,
        contentModelId,
        contentModelDataId,
        versionId,
        environmentId
      ),
    { cacheTime: 0 }
  );

export default useWidgetRuleDetails;
