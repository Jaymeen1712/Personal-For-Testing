import { useContentLibraryCountsDashboard } from '../../services';

const useTotalPublishRecordCountContentLibraryCmsDashboardController = ({
  workspaceId,
  environment,
  startDate,
  endDate,
}: {
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
}) => {
  const contentLibraryPublishedAndAllCount = useContentLibraryCountsDashboard(
    workspaceId,
    environment,
    startDate,
    endDate
  );

  return { contentLibraryPublishedAndAllCount };
};

export default useTotalPublishRecordCountContentLibraryCmsDashboardController;
