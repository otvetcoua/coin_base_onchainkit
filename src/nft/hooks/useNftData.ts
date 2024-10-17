import { useMemo } from 'react';
import { useTokenDetails } from './useTokenDetails';
import type { ContractType, NftData } from '../types';
import { useMintDate } from './useMintDate';
import { useOnchainKit } from '../../useOnchainKit';

export function useNftData(
  contractAddress: `0x${string}`,
  tokenId?: string,
): NftData {
  const { chain } = useOnchainKit();

  const { data: tokenDetails } = useTokenDetails({
    contractAddress,
    tokenId: tokenId ?? '1',
    chainId: chain.id,
  });

  const { data: mintDate } = useMintDate({ contractAddress, tokenId, chain });

  return useMemo(
    () => ({
      contractAddress,
      tokenId,
      name: tokenDetails?.name,
      description: tokenDetails?.description,
      imageUrl:
        tokenDetails?.imageUrl || tokenDetails?.cachedImageUrl?.originalUrl,
      animationUrl:
        tokenDetails?.animationUrl ||
        tokenDetails?.cachedAnimationUrl?.originalUrl,
      mimeType:
        tokenDetails?.cachedAnimationUrl?.mimeType ||
        tokenDetails?.cachedImageUrl?.mimeType,
      ownerAddress: tokenDetails?.ownerAddress as `0x${string}`,
      lastSoldPrice: {
        price: tokenDetails?.lastSoldPrice,
        currency: tokenDetails?.paymentCurrency,
      },
      contractType: tokenDetails?.tokenType as ContractType,
      mintDate: mintDate ? mintDate : undefined,
    }),
    [contractAddress, mintDate, tokenDetails, tokenId],
  );
}
