import { useQuery } from 'react-query';

import apiClient from '../../../../apis/api-client';
import { IAPIError, IAxiosResponse, IRuleList } from '../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../utills';

const getRuleDetails = async (
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
    IAxiosResponse<{ item: IRuleList }>
  >(
    `${APIS_ROUTES.MERCHANDISING_SERVICE}/${workspaceId}/${API_QUERY_KEY.CONTENTS}/${contentModelId}/${APIS_ROUTES.CONTENT_MODAL_DATA}/${contentModelDataId}/rules`,
    {
      params: {
        version_id: versionId,
        environments_id: environmentId,
      },
    }
  );

  if (response.response.Data.item.contentModelFieldData.isLocalizationEnabled) {
    // @ts-ignore
    delete response.response.Data.item.contentModelFieldData
      .isLocalizationEnabled;
  }

  if (
    response.response.Data.item &&
    response.response.Data.item.contentModelFieldData.categoriesEslai !==
      undefined &&
    response.response.Data.item.contentModelFieldData.categoryIdEsai !==
      undefined &&
    response.response.Data.item.contentModelFieldData.categoryIdEsai.length ===
      response.response.Data.item.contentModelFieldData.categoriesEslai.length
  ) {
    response.response.Data.item.contentModelFieldData.categoriesEslai =
      response.response.Data.item.contentModelFieldData.categoryIdEsai?.map(
        (productId: string, index: number) =>
          productId ===
          response.response.Data.item.contentModelFieldData.categoryId
            ? {
                //Here it is an object of that category whose data is currently shown on the page,
                // and with the help of toggle property it will be marked as a blue.
                label:
                  response.response.Data.item.contentModelFieldData.categoriesEslai[
                    index
                  ]
                    .charAt(0)
                    .toUpperCase() +
                  response.response.Data.item.contentModelFieldData.categoriesEslai[
                    index
                  ].slice(1),
                value:
                  response.response.Data.item.contentModelFieldData
                    .categoriesEslai[index],
                toggle: true,
                id: response.response.Data.item.contentModelFieldData
                  .categoryIdEsai[index],
              }
            : {
                label:
                  response.response.Data.item.contentModelFieldData.categoriesEslai[
                    index
                  ]
                    .charAt(0)
                    .toUpperCase() +
                  response.response.Data.item.contentModelFieldData.categoriesEslai[
                    index
                  ].slice(1),
                value:
                  response.response.Data.item.contentModelFieldData
                    .categoriesEslai[index],
                id: response.response.Data.item.contentModelFieldData
                  .categoryIdEsai[index],
              }
      );
  }

  if (
    response.response.Data.item &&
    response.response.Data.item.contentModelFieldData.searchTermsEslai !==
      undefined
  ) {
    if (response.response.Data.item.contentModelFieldData.searchTerms) {
      response.response.Data.item.contentModelFieldData.searchTerms =
        response.response.Data.item.contentModelFieldData.searchTerms[0];
    } else {
      if (
        response.response.Data.item.contentModelFieldData.searchTermsEslai
          .length > 0
      ) {
        response.response.Data.item.contentModelFieldData.searchTerms =
          response.response.Data.item.contentModelFieldData.searchTermsEslai[
            response.response.Data.item.contentModelFieldData.searchTermsEslai
              .length - 1
          ];
      } else {
        response.response.Data.item.contentModelFieldData.searchTerms = '';
      }
    }

    response.response.Data.item.contentModelFieldData.searchTermsEslai =
      response.response.Data.item.contentModelFieldData.searchTermsEslai?.map(
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

const useGetRuleDetails = (
  workspaceId: string,
  contentModelId?: string,
  contentModelDataId?: string,
  versionId?: string,
  environmentId?: string | null
) =>
  useQuery<IRuleList | undefined, IAPIError>(
    [
      API_QUERY_KEY.RULES_DATA,
      workspaceId,
      contentModelId,
      environmentId,
      contentModelDataId,
      versionId,
    ],
    () =>
      getRuleDetails(
        workspaceId,
        contentModelId,
        contentModelDataId,
        versionId,
        environmentId
      ),
    { cacheTime: 0 }
  );

export default useGetRuleDetails;
