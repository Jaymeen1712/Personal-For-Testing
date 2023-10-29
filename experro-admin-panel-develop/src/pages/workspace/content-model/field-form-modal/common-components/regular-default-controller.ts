import { useGetModelListPublicApi } from '../../services/models';
import { useParams } from 'react-router-dom';
import { ContentModelList, IWorkspaceParams } from '../../../../../types';
import { useEffect, useState } from 'react';

const useRegularDefaultController = (selectedType?: string) => {
  const { workspaceId } = useParams<IWorkspaceParams>();
  const [modelList, setModelList] = useState<ContentModelList[]>([]);
  const [selectedModalLength, setSelectedModalLength] = useState(0);

  const getContentModalListPublicApi = useGetModelListPublicApi(
    workspaceId,
    selectedType
  );

  const onModalSelectChange = (val: string[]) => {
    setSelectedModalLength(val.length - 4);
  };
  useEffect(() => {
    if (getContentModalListPublicApi.isSuccess) {
      if (getContentModalListPublicApi.data.length > 0) {
        setModelList(getContentModalListPublicApi.data);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getContentModalListPublicApi.isSuccess]);
  return { modelList, selectedModalLength, onModalSelectChange };
};
export default useRegularDefaultController;
