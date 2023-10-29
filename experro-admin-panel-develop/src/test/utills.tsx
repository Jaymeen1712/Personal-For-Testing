import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

export const renderWithClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={testQueryClient}>
      <Router>{ui}</Router>
    </QueryClientProvider>
  );
};

export const testQueryClient = createTestQueryClient();

export const wrapper = ({ children }: { children?: React.ReactNode }) => {
  return render(
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  ) as unknown as React.ReactElement;
};

export const generateApiUrl = (apiUrl: string, urlSegment: string) =>
  `${apiUrl}${urlSegment}`;
