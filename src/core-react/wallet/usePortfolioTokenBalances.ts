import {
  type GetPortfolioTokenBalancesParams,
  type Portfolio,
  getPortfolioTokenBalances,
} from '@/core/api/getPortfolioTokenBalances';
import { isApiError } from '@/core/utils/isApiResponseError';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';

export function usePortfolioTokenBalances({
  addresses,
}: GetPortfolioTokenBalancesParams): UseQueryResult<Portfolio[]> {
  const actionKey = `usePortfolioTokenBalances-${addresses}`;
  return useQuery({
    queryKey: ['usePortfolioTokenBalances', actionKey],
    queryFn: async () => {
      const response = await getPortfolioTokenBalances({
        addresses,
      });

      if (isApiError(response)) {
        throw new Error(response.message);
      }

      return response.tokens;
    },
    retry: false,
    enabled: !!addresses && addresses.length > 0,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // refresh on mount every 5 minutes
    refetchOnMount: true,
    refetchInterval: 1000 * 60 * 15, // refresh in background every 15 minutes
    refetchIntervalInBackground: true,
  });
}
