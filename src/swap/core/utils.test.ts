import type { Token } from '../../token';
import { getParamsForToken } from './utils';

describe('getParamsForToken', () => {
  it('should return the correct GetQuoteAPIParams object', () => {
    const from: Token = {
      name: 'ETH',
      address: '',
      symbol: 'ETH',
      decimals: 18,
      image: 'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
      chainId: 8453,
    };
    const to: Token = {
      name: 'DEGEN',
      address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
      symbol: 'DEGEN',
      decimals: 18,
      image:
        'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
      chainId: 8453,
    };
    const amount = '1.5';
    const amountReference = 'from';

    const expectedParams = {
      from: 'ETH',
      to: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
      amount: '1.5',
      amountReference: 'from',
    };

    const result = getParamsForToken({
      from,
      to,
      amount,
      amountReference,
    });

    expect(result).toEqual(expectedParams);
  });
});
