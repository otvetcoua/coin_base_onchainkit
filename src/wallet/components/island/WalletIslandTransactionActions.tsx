import { addSvgForeground } from '../../../internal/svg/addForegroundSvg';
import { arrowUpRightSvg } from '../../../internal/svg/arrowUpRightSvg';
import { toggleSvg } from '../../../internal/svg/toggleSvg';
import { cn, color, pressable, text } from '../../../styles/theme';
import { useWalletIslandContext } from './WalletIslandProvider';

type TransactionActionProps = {
  icon: React.ReactNode;
  label: string;
  action: () => void;
};

function WalletIslandTransactionAction({
  icon,
  label,
  action,
}: TransactionActionProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex flex-col items-center justify-center gap-2',
        'h-16 w-28',
        'rounded-lg',
        pressable.alternate,
      )}
      onClick={action}
    >
      <span>{icon}</span>
      <span className={cn(text.label1, color.foreground)}>{label}</span>
    </button>
  );
}

export default function WalletIslandTransactionActions() {
  const { setShowSwap } = useWalletIslandContext();
  return (
    <div className="mx-4 my-2 flex flex-row gap-2">
      <WalletIslandTransactionAction
        icon={addSvgForeground}
        label="Buy"
        action={() => {
          window.open('https://pay.coinbase.com', '_blank');
        }}
      />
      <WalletIslandTransactionAction
        icon={arrowUpRightSvg}
        label="Send"
        action={() => {
          window.open('https://wallet.coinbase.com', '_blank');
        }}
      />
      <WalletIslandTransactionAction
        icon={toggleSvg}
        label="Swap"
        action={() => {
          setShowSwap(true);
        }}
      />
    </div>
  );
}
