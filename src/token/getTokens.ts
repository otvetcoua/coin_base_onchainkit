import { ListSwapAssets } from '../definitions/swap';
import { Token, RawTokenData, GetTokensOptions } from './types';
import { sendRequest, JSONRPCError } from '../queries/request';

/**
 * Retrieves a list of tokens on Base.
 * 
 * @param {GetTokensOptions} options - An optional object that can be used to filter the list of tokens.
 *  options.limit - The maximum number of tokens to return (default: 50).
 *  options.search - A string to search for in the token name or symbol.
 *  options.page - The page number to return (default: 1).
 * @returns A promise that resolves to an array of `Token` objects.
 * @throws Will throw an error if the request to the RPC URL fails.
 * @example
import { getTokens } from '@coinbase/onchainkit'

const tokens = await getTokens({ limit: '1', search: 'degen' });
// [
//   {
//     address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
//     chainId: 8453,
//     decimals: 18,
//     image: 'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
//     name: 'DEGEN',
//     symbol: 'DEGEN'
//   }
// ]
*/
export async function getTokens(options?: GetTokensOptions): Promise<Token[] | JSONRPCError> {
  // Default filter values
  const defaultFilter: GetTokensOptions = {
    limit: '50',
    page: '1',
  };

  const filters = { ...defaultFilter, ...options };

  try {
    const res = await sendRequest<GetTokensOptions, RawTokenData[]>(ListSwapAssets, [filters]);

    if (res.error) {
      return res.error;
    }

    // Map the data from the response to the `OnchainKit` Token type
    return res.result.map((token) => ({
      address: token.address,
      chainId: token.chainId,
      decimals: token.decimals,
      image: token.imageURL,
      name: token.name,
      symbol: token.currencyCode,
    }));
  } catch (error) {
    throw new Error(`getTokens: ${error}`);
  }
}
