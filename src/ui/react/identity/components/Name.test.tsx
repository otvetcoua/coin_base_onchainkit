import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { base, baseSepolia, optimism } from 'viem/chains';

import { useAttestations } from '../../../../core-react/identity/hooks/useAttestations';
import { useName } from '../../../../core-react/identity/hooks/useName';
import { useIdentityContext } from '../../../../core-react/identity/providers/IdentityProvider';
import { getSlicedAddress } from '../../../../core/identity/utils/getSlicedAddress';
import { Badge } from './Badge';
import { Name } from './Name';

vi.mock('../../../../core-react/identity/hooks/useAttestations', () => ({
  useAttestations: vi.fn(),
}));

vi.mock('../../../../core-react/identity/hooks/useName', () => ({
  useName: vi.fn(),
}));

vi.mock('../../../../core/identity/utils/getSlicedAddress', () => ({
  getSlicedAddress: vi.fn(),
}));

vi.mock('../../../../core-react/identity/providers/IdentityProvider', () => ({
  useIdentityContext: vi.fn(),
}));

describe('Name', () => {
  const testName = 'testname.eth';
  const testIdentityProviderAddress = '0xIdentityAddress';
  const testNameComponentAddress = '0xNameComponentAddress';

  const mockUseName = useName as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(vi.fn());
  });

  it('should console.error and return null when no address is provided', () => {
    vi.mocked(useIdentityContext).mockReturnValue({
      // @ts-expect-error
      address: undefined,
      chain: undefined,
    });
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const { container } = render(<Name />);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Name: an Ethereum address must be provided to the Identity or Name component.',
    );
    expect(container.firstChild).toBeNull();
  });

  it('displays ENS name when available', () => {
    (useIdentityContext as Mock).mockReturnValue({
      schemaId: '0x123',
    });
    mockUseName.mockReturnValue({
      data: testName,
      isLoading: false,
    });
    render(<Name address={testNameComponentAddress} />);
    expect(screen.getByText(testName)).toBeInTheDocument();
  });

  it('use identity context address if provided', () => {
    (useIdentityContext as Mock).mockReturnValue({
      schemaId: '0x123',
      address: testIdentityProviderAddress,
    });

    mockUseName.mockReturnValue({
      data: testName,
      isLoading: false,
    });

    render(<Name />);

    expect(mockUseName).toHaveBeenCalledWith({
      address: testIdentityProviderAddress,
      chain: undefined,
    });
  });

  it('use identity context chain if provided', () => {
    (useIdentityContext as Mock).mockReturnValue({
      schemaId: '0x123',
      chain: optimism,
    });

    mockUseName.mockReturnValue({
      data: testName,
      isLoading: false,
    });

    render(<Name address={testNameComponentAddress} />);

    expect(mockUseName).toHaveBeenCalledWith({
      address: testNameComponentAddress,
      chain: optimism,
    });
  });

  it('use component address over identity context if both are provided', () => {
    (useIdentityContext as Mock).mockReturnValue({
      schemaId: '0x123',
      chain: optimism,
      address: testIdentityProviderAddress,
    });

    mockUseName.mockReturnValue({
      data: testName,
      isLoading: false,
    });

    render(<Name address={testNameComponentAddress} />);

    expect(mockUseName).toHaveBeenCalledWith({
      address: testNameComponentAddress,
      chain: optimism,
    });
  });

  it('use component chain over identity context if both are provided', () => {
    (useIdentityContext as Mock).mockReturnValue({
      schemaId: '0x123',
      chain: optimism,
      address: testIdentityProviderAddress,
    });

    mockUseName.mockReturnValue({
      data: testName,
      isLoading: false,
    });

    render(<Name address={testNameComponentAddress} chain={base} />);

    expect(mockUseName).toHaveBeenCalledWith({
      address: testNameComponentAddress,
      chain: base,
    });
  });

  it('displays custom chain ENS name when available', () => {
    (useIdentityContext as Mock).mockReturnValue({
      schemaId: '0x123',
    });
    mockUseName.mockReturnValue({
      data: testName,
      isLoading: false,
    });
    render(<Name address={testNameComponentAddress} chain={baseSepolia} />);
    expect(screen.getByText(testName)).toBeInTheDocument();
  });

  it('displays sliced address when ENS name is not available', () => {
    (useIdentityContext as Mock).mockReturnValue({
      schemaId: '0x123',
    });
    mockUseName.mockReturnValue({
      data: null,
      isLoading: false,
    });
    (getSlicedAddress as Mock).mockReturnValue('0xName...ess');
    render(<Name address={testNameComponentAddress} />);
    expect(screen.getByText('0xName...ess')).toBeInTheDocument();
  });

  it('displays empty when ens still fetching', () => {
    mockUseName.mockReturnValue({ data: null, isLoading: true });
    render(<Name address={testNameComponentAddress} />);
    expect(screen.queryByText(testName)).not.toBeInTheDocument();
    expect(getSlicedAddress).toHaveBeenCalledTimes(0);
  });

  it('renders badge when Badge is passed, user is attested and address set in Identity', async () => {
    (useIdentityContext as Mock).mockReturnValue({
      address: testNameComponentAddress,
      schemaId: '0x123',
    });
    (useAttestations as Mock).mockReturnValue(['attestation']);
    mockUseName.mockReturnValue({
      data: 'ens_name',
      isLoading: false,
    });

    render(
      <Name address={testNameComponentAddress}>
        <Badge />
      </Name>,
    );

    await waitFor(() => {
      const badge = screen.getByTestId('ockBadge');
      expect(badge).toBeInTheDocument();
    });
  });

  it('renders badge when Badge is passed, user is attested and address set in Name', async () => {
    (useIdentityContext as Mock).mockReturnValue({
      schemaId: '0x123',
    });
    (useAttestations as Mock).mockReturnValue(['attestation']);
    mockUseName.mockReturnValue({
      address: testNameComponentAddress,
      data: 'ens_name',
      isLoading: false,
    });

    render(
      <Name address={testNameComponentAddress}>
        <Badge />
      </Name>,
    );

    await waitFor(() => {
      const badge = screen.getByTestId('ockBadge');
      expect(badge).toBeInTheDocument();
    });
  });
});
