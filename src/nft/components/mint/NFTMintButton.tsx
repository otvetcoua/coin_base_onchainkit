import { useCallback, useMemo } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { cn } from '../../../styles/theme';
import {
  Transaction,
  TransactionButton,
  type LifecycleStatus as TransactionLifecycleStatus,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '../../../transaction';
import { ConnectWallet } from '../../../wallet';
import { useNFTLifecycleContext } from '../NFTLifecycleProvider';
import { useNFTContext } from '../NFTProvider';

type NFTMintButtonProps = {
  className?: string;
  label?: string;
};

export function NFTMintButton({
  className,
  label = 'Mint',
}: NFTMintButtonProps) {
  const chainId = useChainId();
  const { address } = useAccount();
  const {
    contractAddress,
    tokenId,
    isEligibleToMint,
    buildMintTransaction,
    quantity,
  } = useNFTContext();
  const { updateLifecycleStatus } = useNFTLifecycleContext();

  const handleOnStatus = useCallback(
    (transactionStatus: TransactionLifecycleStatus) => {
      if (transactionStatus.statusName === 'transactionPending') {
        updateLifecycleStatus({ statusName: 'transactionPending' });
      }

      if (
        transactionStatus.statusName === 'transactionLegacyExecuted' ||
        transactionStatus.statusName === 'success' ||
        transactionStatus.statusName === 'error'
      ) {
        updateLifecycleStatus(transactionStatus);
      }
    },
    [updateLifecycleStatus],
  );

  const transactionButtonLabel = useMemo(() => {
    if (isEligibleToMint === false) {
      return 'Mint ended';
    }

    return label;
  }, [isEligibleToMint, label]);

  if (!buildMintTransaction) {
    return null;
  }

  if (!address) {
    return (
      <div className={cn('py-2', className)}>
        <ConnectWallet className="w-full" />
      </div>
    );
  }

  return (
    <div className={cn('py-2', className)}>
      <Transaction
        chainId={chainId}
        calls={() =>
          buildMintTransaction({
            contractAddress,
            tokenId,
            takerAddress: address,
            quantity,
          })
        }
        onStatus={handleOnStatus}
      >
        <TransactionButton
          text={transactionButtonLabel}
          disabled={transactionButtonLabel !== label}
        />
        <TransactionSponsor />
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>
    </div>
  );
}
