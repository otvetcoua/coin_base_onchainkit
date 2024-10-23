import { type ReactNode, useMemo } from 'react';
import { cn, text } from '../../../styles/theme';
import { useNFTContext } from '../NFTProvider';

const DATE_OPTIONS = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
} as Intl.DateTimeFormatOptions;

type NFTMintDateProps = {
  className?: string;
  label?: ReactNode;
};

export function NFTMintDate({
  className,
  label = 'Mint date',
}: NFTMintDateProps) {
  const { mintDate } = useNFTContext();

  const formattedDate = useMemo(() => {
    if (!mintDate) {
      return null;
    }
    const formatter = new Intl.DateTimeFormat(undefined, DATE_OPTIONS);
    return formatter.format(mintDate);
  }, [mintDate]);

  if (!formattedDate) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between py-2',
        text.label2,
        className,
      )}
    >
      <div>{label}</div>
      <div>{formattedDate}</div>
    </div>
  );
}
