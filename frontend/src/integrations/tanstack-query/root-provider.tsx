import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getContext() {
  if (typeof window === 'undefined') {
    return { queryClient: makeQueryClient() };
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return { queryClient: browserQueryClient };
}

export function Provider({
  queryClient,
  children,
}: {
  queryClient: QueryClient;
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
