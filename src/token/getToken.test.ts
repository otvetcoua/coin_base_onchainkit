import { getTokens } from './getTokens';
import { sendRequest } from '../queries/request';
import { ListSwapAssets } from '../definitions/swap';

jest.mock('../queries/request');

describe('getTokens', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an array of tokens', async () => {
    const mockResponse = {
      result: [
        {
          address: '0x123',
          chainId: 1,
          decimals: 18,
          imageURL: 'https://example.com/token.png',
          name: 'Token 1',
          currencyCode: 'TKN1',
        },
        {
          address: '0x456',
          chainId: 1,
          decimals: 18,
          imageURL: 'https://example.com/token.png',
          name: 'Token 2',
          currencyCode: 'TKN2',
        },
      ],
      error: null,
    };

    (sendRequest as jest.Mock).mockResolvedValue(mockResponse);

    const tokens = await getTokens();

    expect(tokens).toEqual([
      {
        address: '0x123',
        chainId: 1,
        decimals: 18,
        image: 'https://example.com/token.png',
        name: 'Token 1',
        symbol: 'TKN1',
      },
      {
        address: '0x456',
        chainId: 1,
        decimals: 18,
        image: 'https://example.com/token.png',
        name: 'Token 2',
        symbol: 'TKN2',
      },
    ]);

    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(ListSwapAssets, [{ limit: '50', page: '1' }]);
  });

  it('should accept options parameters', async () => {
    const mockResponse = {
      result: [
        {
          address: '0x123',
          chainId: 1,
          decimals: 18,
          imageURL: 'https://example.com/token.png',
          name: 'Token 1',
          currencyCode: 'TKN1',
        },
      ],
      error: null,
    };

    (sendRequest as jest.Mock).mockResolvedValue(mockResponse);

    const tokens = await getTokens({ limit: '1', page: '1' });

    expect(tokens).toEqual([
      {
        address: '0x123',
        chainId: 1,
        decimals: 18,
        image: 'https://example.com/token.png',
        name: 'Token 1',
        symbol: 'TKN1',
      },
    ]);

    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(ListSwapAssets, [{ limit: '1', page: '1' }]);
  });

  it('should throw an error if sendRequest returns an error', async () => {
    const mockError = new Error('Request failed');

    (sendRequest as jest.Mock).mockResolvedValue({
      result: null,
      error: {
        code: -1,
        message: 'Request failed',
        data: null,
      },
    });

    await expect(getTokens()).resolves.toEqual({
      code: -1,
      message: 'Request failed',
      data: null,
    });

    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(ListSwapAssets, [{ limit: '50', page: '1' }]);
  });

  it('should rethrow the error if an error occurs during token retrieval', async () => {
    const mockError = new Error('getTokens: error retrieving tokens: Token retrieval failed');

    (sendRequest as jest.Mock).mockRejectedValue(mockError);

    await expect(getTokens()).rejects.toThrow(
      'getTokens: error retrieving tokens: Token retrieval failed',
    );

    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(ListSwapAssets, [{ limit: '50', page: '1' }]);
  });
});
