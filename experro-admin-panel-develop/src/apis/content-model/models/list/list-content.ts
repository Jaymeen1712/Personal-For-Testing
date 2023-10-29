import { useQuery } from 'react-query';
import _ from 'lodash';

import { API_QUERY_KEY, APIS_ROUTES } from '../../../../utills';
import { IAPIError, IAxiosResponse, IContent } from '../../../../types';
import apiClient from '../../../api-client';

interface IListContentResponse {
  key: string;
  label: string;
  internalName: string;
  description?: string;
  actAsWebPage?: string;
  template?: string;
}

const listContent = async (
  type: string,
  workspaceId: string,
  addNewType: string
) => {
  if (addNewType === 'component') return [];
  const response = await apiClient.get<
    null,
    IAxiosResponse<{ items: IContent[] }>
  >(`${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}${APIS_ROUTES.CONTENTS}`, {
    params: {
      fields:
        'name,type,description,template,act_as_web_page,internal_name,group_id',
      type: type,
    },
  });

  const data = response.response.Data.items.map((item) => ({
    key: item.id,
    label: item.name,
    description: item.description,
    actAsWebPage: item.actAsWebPage,
    template: item.template,
    internalName: item.internalName,
  }));
  return _.orderBy(data, ['label']);
};

const useListContent = (
  type: string,
  workspaceId: string,
  addNewType: string
) =>
  useQuery<IListContentResponse[], IAPIError>(
    [API_QUERY_KEY.CONTENTS, type],
    () => listContent(type, workspaceId, addNewType)
  );

export default useListContent;
