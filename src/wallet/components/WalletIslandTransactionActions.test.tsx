import { useOnchainKit } from '@/core-react/useOnchainKit';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWalletIslandContext } from './WalletIslandProvider';
import { WalletIslandTransactionActions } from './WalletIslandTransactionActions';
import { useWalletContext } from './WalletProvider';

vi.mock('@/core-react/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('./WalletIslandProvider', () => ({
  useWalletIslandContext: vi.fn(),
  WalletIslandProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
}));

describe('WalletIslandTransactionActons', () => {
  const mockUseWalletIslandContext = useWalletIslandContext as ReturnType<
    typeof vi.fn
  >;

  const mockUseOnchainKit = useOnchainKit as ReturnType<typeof vi.fn>;

  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;

  const defaultMockUseWalletIslandContext = {
    setShowSwap: vi.fn(),
    animations: {
      content: '',
    },
  };

  const mockProjectId = '123-ABC';
  const mockAddress = '0x123';
  const mockChain = { name: 'Base' };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'open').mockImplementation(() => null);
    mockUseWalletIslandContext.mockReturnValue(
      defaultMockUseWalletIslandContext,
    );
    mockUseOnchainKit.mockReturnValue({
      projectId: mockProjectId,
    });

    mockUseWalletContext.mockReturnValue({
      address: mockAddress,
      chain: mockChain,
    });
  });

  it('renders the WalletIslandTransactionActions component', () => {
    render(<WalletIslandTransactionActions />);

    const buyButton = screen.getByRole('button', { name: 'Buy' });
    const sendButton = screen.getByRole('button', { name: 'Send' });
    const swapButton = screen.getByRole('button', { name: 'Swap' });

    expect(buyButton).toBeDefined();
    expect(sendButton).toBeDefined();
    expect(swapButton).toBeDefined();
  });

  it('opens the buy page when the buy button is clicked and projectId, address and chain.name are defined', () => {
    render(<WalletIslandTransactionActions />);

    const buyButton = screen.getByRole('button', { name: 'Buy' });
    fireEvent.click(buyButton);

    const urlString = vi.mocked(window.open).mock.calls[0][0] as string;
    const url = new URL(urlString);
    const params = Object.fromEntries(url.searchParams);

    expect(url.origin + url.pathname).toBe('https://pay.coinbase.com/buy/select-asset');
    expect(params).toEqual({
      appId: mockProjectId,
      destinationWallets: JSON.stringify([{
        address: mockAddress,
        blockchains: [mockChain.name.toLowerCase()]
      }]),
      defaultAsset: 'USDC',
      defaultPaymentMethod: 'CRYPTO_ACCOUNT',
      presetFiatAmount: '25'
    });
    expect(vi.mocked(window.open).mock.calls[0][1]).toBe('popup');
    expect(vi.mocked(window.open).mock.calls[0][2]).toBe('width=400,height=600,scrollbars=yes');
  });

  it('opens the buy page when the buy button is clicked and projectId, address or chain.name are not defined', () => {
    // projectId is not defined
    mockUseOnchainKit.mockReturnValue({
      projectId: null,
    });
    const { rerender } = render(<WalletIslandTransactionActions />);
    const buyButton = screen.getByRole('button', { name: 'Buy' });
    fireEvent.click(buyButton);
    expect(window.open).not.toHaveBeenCalled();

    // address is not defined
    mockUseOnchainKit.mockReturnValue({
      projectId: mockProjectId,
    });
    mockUseWalletContext.mockReturnValue({
      address: null,
      chain: mockChain,
    });
    rerender(<WalletIslandTransactionActions />);
    fireEvent.click(buyButton);
    expect(window.open).not.toHaveBeenCalled();

    // chain.name is not defined
    mockUseWalletContext.mockReturnValue({
      address: mockAddress,
      chain: null,
    });
    rerender(<WalletIslandTransactionActions />);
    fireEvent.click(buyButton);
    expect(window.open).not.toHaveBeenCalled();
  });

  it('opens the send page when the send button is clicked', () => {
    render(<WalletIslandTransactionActions />);

    const sendButton = screen.getByRole('button', { name: 'Send' });
    fireEvent.click(sendButton);

    expect(window.open).toHaveBeenCalledWith(
      'https://wallet.coinbase.com',
      '_blank',
    );
  });

  it('sets showSwap to true when the swap button is clicked', () => {
    const setShowSwapMock = vi.fn();

    mockUseWalletIslandContext.mockReturnValue({
      ...defaultMockUseWalletIslandContext,
      setShowSwap: setShowSwapMock,
    });

    render(<WalletIslandTransactionActions />);

    const swapButton = screen.getByRole('button', { name: 'Swap' });
    fireEvent.click(swapButton);

    expect(setShowSwapMock).toHaveBeenCalledWith(true);
  });

  it('renders a placeholder when fetcher is loading', () => {
    mockUseWalletIslandContext.mockReturnValue({
      ...defaultMockUseWalletIslandContext,
      isFetchingPortfolioData: true,
    });

    render(<WalletIslandTransactionActions />);

    const placeholder = screen.getByTestId(
      'ockWalletIsland_LoadingPlaceholder',
    );
    expect(placeholder).toHaveClass('my-3 h-16 w-80');
  });
});
