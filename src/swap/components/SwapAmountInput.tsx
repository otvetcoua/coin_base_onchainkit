import { useCallback, CSSProperties, useEffect } from 'react';

import { SwapAmountInputReact } from '../types';
import { isValidAmount } from '../utils';
import { TokenSelector, TokenSelectorDropdown } from '../../token';

export function SwapAmountInput({
  label,
  amount,
  token,
  swappableTokens,
  tokenBalance,
  onMaxButtonClick,
  onAmountChange,
  onTokenSelectorClick,
  onSelectTokenToggle,
  disabled = false,
}: SwapAmountInputReact) {
  const handleAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isValidAmount(event.target.value)) {
        onAmountChange(event.target.value);
      }
    },
    [onAmountChange],
  );

  return (
    <div data-testid="ockSwapAmountInput_Container" className="ock-swapamountinput-container">
      <div className="ock-swapamountinput-row">
        <label className="ock-swapamountinput-label">{label}</label>
        {tokenBalance && (
          <label className="ock-swapamountinput-balance">{`Balance: ${tokenBalance}`}</label>
        )}
      </div>
      <div className="ock-swapamountinput-row">
        <TokenSelector token={token} setToken={onTokenSelectorClick}>
          <TokenSelectorDropdown
            setToken={onTokenSelectorClick}
            onToggle={onSelectTokenToggle}
            options={swappableTokens}
          />
        </TokenSelector>
        <button className="ock-swapamountinput-maxbutton" onClick={onMaxButtonClick}>
          Max
        </button>
      </div>
      <input
        className="ock-swapamountinput-input"
        value={amount}
        onChange={handleAmountChange}
        placeholder="0"
        disabled={disabled}
        data-testid="ockTokenAmountInput_Input"
      />
    </div>
  );
}
