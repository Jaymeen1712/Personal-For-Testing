import { useQuery } from 'react-query';

import {
  API_QUERY_KEY,
  APIS_ROUTES,
  BLUE_COLOR_SHADES,
  BROWN_COLOR_SHADES,
  GREEN_COLOR_SHADES,
  RED_COLOR_SHADES,
} from '../../../utills';
import { RootObject } from '../../../types';
import apiClient from '../../api-client';

const pieChartDashboard = async (
  workspaceId: string,
  environmentId: string | null,
  breakBy: string[],
  startDate?: string,
  endDate?: string
) => {
  if (!workspaceId || !environmentId || !startDate || !endDate) {
    return;
  } else {
    const pieChartsData = [];
    const pieChartModuleWiseData: {
      [k: string]: {
        totalModuleCount: number;
        moduleWiseData: [string, number][];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        colorData: string[] | any;
      };
    } = {};

    await Promise.all(
      breakBy.map(async (breakBy) => {
        const selectedModuleData: [string, number][] = [];
        let totalModuleCount = 0;
        const response = await apiClient.get<string, RootObject>(
          `${APIS_ROUTES.DASHBOARD_COUNT}`,
          {
            params: {
              date_range: 'CUSTOM',
              break_by: breakBy,
              start_date: startDate,
              end_date: endDate,
            },
            headers: {
              'x-workspace-id': workspaceId,
              'x-env-id': environmentId,
            },
          }
        );

        if (response) {
          if (
            response.response.totalCount &&
            response.response.totalCount.data &&
            response.response.totalCount.data.length > 0
          ) {
            const tempPieChartDashboardTopCategoriesData: {
              name: string;
              total: number;
            }[] = [];

            response.response.totalCount.data.map((totalCountData) => {
              let totalModuleDataCount = 0;
              totalCountData.data.map((object) => {
                totalModuleDataCount += object;
                return true;
              });
              tempPieChartDashboardTopCategoriesData.push({
                name: totalCountData.name,
                total: totalModuleDataCount,
              });
              return true;
            });

            tempPieChartDashboardTopCategoriesData.sort(function (a, b) {
              return b.total - a.total;
            });

            if (tempPieChartDashboardTopCategoriesData.length > 10) {
              let othersDataTotalModuleCount = 0;

              tempPieChartDashboardTopCategoriesData
                .splice(0, 9)
                .map((data) => {
                  totalModuleCount += data.total;
                  selectedModuleData.push([
                    data.name && data.name !== ''
                      ? data.name === 'pc'
                        ? 'Desktop'
                        : data.name
                      : 'N/A',
                    data.total,
                  ]);
                  return true;
                });

              tempPieChartDashboardTopCategoriesData.map((data) => {
                othersDataTotalModuleCount += data.total;
                totalModuleCount += data.total;
                return true;
              });

              selectedModuleData.push(['others', othersDataTotalModuleCount]);
            } else {
              //This is a logic for creating an array of type [string,number][] to show the values inside a pie chart.
              tempPieChartDashboardTopCategoriesData.map((data) => {
                totalModuleCount += data.total;
                selectedModuleData.push([
                  data.name && data.name !== ''
                    ? data.name === 'pc'
                      ? 'Desktop'
                      : data.name
                    : 'N/A',
                  data.total,
                ]);
                return true;
              });
            }
          }
        }

        if (selectedModuleData && selectedModuleData.length > 0) {
          selectedModuleData.map((module) => {
            //This is a logic for creating an array of Percentage of each and every item of array,
            // so with the help of this we are able to show the tooltip on each item inside the pie-chart.
            if (totalModuleCount > 0) {
              module[1] = (module[1] / totalModuleCount) * 100;
            } else {
              module[1] = 0;
            }
            return true;
          });
        }

        pieChartModuleWiseData[breakBy] = {
          totalModuleCount: totalModuleCount,
          moduleWiseData: selectedModuleData,
          colorData:
            breakBy === 'device_category'
              ? BLUE_COLOR_SHADES
              : breakBy === 'os_name'
              ? BROWN_COLOR_SHADES
              : breakBy === 'device_name'
              ? GREEN_COLOR_SHADES
              : breakBy === 'country' && RED_COLOR_SHADES,
        };
      })
    );

    pieChartsData.push(pieChartModuleWiseData);

    return pieChartsData;
  }
};

const usePieChartsDashboard = (
  workspaceId: string,
  environmentId: string | null,
  breakBy: string[],
  startDate?: string,
  endDate?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.PIE_CHART_DASHBOARD,
      workspaceId,
      environmentId,
      breakBy,
      startDate,
      endDate,
    ],
    () =>
      pieChartDashboard(
        workspaceId,
        environmentId,
        breakBy,
        startDate,
        endDate
      ),
    { cacheTime: 0 }
  );

export default usePieChartsDashboard;
