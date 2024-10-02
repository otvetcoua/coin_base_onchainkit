import { useCallback, useMemo, useState } from 'react';
import { infoSvg } from '../../../internal/svg/infoSvg';
import { background, border, cn, text } from '../../../styles/theme';
import { formatAmount } from '../../../token/utils/formatAmount';
import { getPricePerQuantity } from '../../utils/getPricePerQuantity';
import { useNftMintContext } from '../NftMintProvider';

type NftTotalCostProps = {
  className?: string;
  label?: string;
};

export function NftTotalCost({
  className,
  label = 'Total cost',
}: NftTotalCostProps) {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const { price, mintFee, quantity } = useNftMintContext();

  const toggleOverlay = useCallback(() => {
    setIsOverlayVisible((prev) => !prev);
  }, []);

  const showOverlay = useCallback(() => {
    setIsOverlayVisible(true);
  }, []);

  const hideOverlay = useCallback(() => {
    setIsOverlayVisible(false);
  }, []);

  const overlay = useMemo(() => {
    // only show overlay if mintFee
    if (
      price?.amount === undefined ||
      price?.amountUSD === undefined ||
      mintFee?.amount === undefined ||
      mintFee.amountUSD === undefined
    ) {
      return null;
    }

    return (
      <div
        className={cn(
          background.default,
          border.radius,
          border.defaultActive,
          'absolute z-10 w-full border',
        )}
      >
        <div
          className={cn(
            'flex items-center justify-between px-4 py-2',
            text.label2,
          )}
        >
          <div>NFT cost</div>
          <div>
            $
            {formatAmount(
              `${getPricePerQuantity(`${price.amountUSD}`, quantity)}`,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )}
          </div>
        </div>
        <div
          className={cn(
            'flex items-center justify-between px-4 py-2',
            text.label2,
          )}
        >
          <div>Mint fee</div>
          <div>
            $
            {formatAmount(
              `${getPricePerQuantity(`${mintFee?.amountUSD}`, quantity)}`,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )}
          </div>
        </div>
      </div>
    );
  }, [mintFee, price, quantity]);

  if (!price?.amount || !price?.currency || !price?.amountUSD) {
    return null;
  }

  return (
    <div className="relative">
      <div
        className={cn(
          'flex items-center justify-between pt-2 pb-1',
          text.label2,
          className,
        )}
      >
        <div>{label}</div>
        <div className="flex items-center gap-2">
          <div>
            $
            {formatAmount(
              `${getPricePerQuantity(`${price.amountUSD}`, quantity)}`,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )}
          </div>
          {overlay && (
            <button
              type="button"
              data-testid="ockNftTotalCostInfo"
              className="h-2.5 w-2.5 cursor-pointer object-cover"
              onClick={toggleOverlay}
              onMouseEnter={showOverlay}
              onMouseLeave={hideOverlay}
            >
              {infoSvg}
            </button>
          )}
        </div>
      </div>
      {isOverlayVisible && overlay}
    </div>
  );
}
