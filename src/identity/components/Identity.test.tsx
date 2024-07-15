import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Avatar } from './Avatar';
import { Name } from './Name';
import { Identity } from './Identity';
import { useName } from '../hooks/useName';
import { useAvatar } from '../hooks/useAvatar';
import { useGetETHBalance } from '../../wallet/core/useGetETHBalance';
import { Address } from './Address';
import { EthBalance } from './EthBalance';

function mock<T>(func: T) {
  return func as vi.Mock;
}

vi.mock('../hooks/useAvatar', () => ({
  useAvatar: vi.fn(),
}));
vi.mock('../hooks/useName', () => ({
  useName: vi.fn(),
}));

vi.mock('../../wallet/core/useGetETHBalance', () => ({
  useGetETHBalance: vi.fn(),
}));

const useAvatarMock = mock(useAvatar);
const useNameMock = mock(useName);
const useGetEthBalanceMock = mock(useGetETHBalance);

describe('Identity Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the Identity component with Avatar', async () => {
    useAvatarMock.mockReturnValue({
      data: 'avatar_url',
      isLoading: false,
    });
    useNameMock.mockReturnValue({ data: 'name', isLoading: false });
    render(
      <Identity address="0x123456789">
        <Avatar />
      </Identity>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('ockAvatar_Image')).toBeInTheDocument();
    });
  });

  it('should render the Identity component with Name', async () => {
    useNameMock.mockReturnValue({ data: 'name', isLoading: false });
    render(
      <Identity address="0x123456789">
        <Name />
      </Identity>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('ockIdentity_Text')).toBeInTheDocument();
    });
  });

  it('should render the Identity component with Avatar and Name', async () => {
    useAvatarMock.mockReturnValue({
      data: 'avatar_url',
      isLoading: false,
    });
    useNameMock.mockReturnValue({ data: 'name', isLoading: false });
    render(
      <Identity address="0x123456789">
        <Avatar />
        <Name />
      </Identity>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('ockAvatar_Image')).toBeInTheDocument();
      expect(screen.getByTestId('ockIdentity_Text')).toBeInTheDocument();
    });
  });

  it('should render the Identity component with Avatar, Name and Address', async () => {
    useAvatarMock.mockReturnValue({
      data: 'avatar_url',
      isLoading: false,
    });
    useNameMock.mockReturnValue({ data: 'name', isLoading: false });

    render(
      <Identity address="0x123456789">
        <Avatar />
        <Name />
        <Address />
      </Identity>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('ockAvatar_Image')).toBeInTheDocument();
      expect(screen.getByTestId('ockIdentity_Text')).toBeInTheDocument();
      expect(screen.getByTestId('ockAddress')).toBeInTheDocument();
    });
  });

  it('should render the Identity component with Avatar, Name, and EthBalance', async () => {
    useAvatarMock.mockReturnValue({
      data: 'avatar_url',
      isLoading: false,
    });
    useNameMock.mockReturnValue({ data: 'name', isLoading: false });
    useGetEthBalanceMock.mockReturnValue({ convertedBalance: '0.002' });

    render(
      <Identity address="0x123456789">
        <Avatar />
        <Name />
        <EthBalance />
      </Identity>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('ockAvatar_Image')).toBeInTheDocument();
      expect(screen.getByTestId('ockIdentity_Text')).toBeInTheDocument();
      expect(screen.getByTestId('ockEthBalance')).toBeInTheDocument();
    });
  });

  it('should render the Identity component with Avatar, Name, Address and EthBalance', async () => {
    useAvatarMock.mockReturnValue({
      data: 'avatar_url',
      isLoading: false,
    });
    useNameMock.mockReturnValue({ data: 'name', isLoading: false });
    useGetEthBalanceMock.mockReturnValue({ convertedBalance: '0.002' });

    render(
      <Identity address="0x123456789">
        <Avatar />
        <Name />
        <Address />
        <EthBalance />
      </Identity>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('ockAvatar_Image')).toBeInTheDocument();
      expect(screen.getByTestId('ockIdentity_Text')).toBeInTheDocument();
      expect(screen.getByTestId('ockAddress')).toBeInTheDocument();
      expect(screen.getByTestId('ockEthBalance')).toBeInTheDocument();
    });
  });

  it('should call handleCopy and return true when address is copied successfully', async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(true),
      },
    });

    render(
      <Identity address="0x123456789" hasCopyAddressOnClick={true}>
        <div>Child Component</div>
      </Identity>
    );

    const identityLayout = screen.getByTestId('ockIdentity_container');
    fireEvent.click(identityLayout);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("0x123456789");
  });

  it('should not call handleCopy when address is not provided', async () => {
    render(
      <Identity address={null} hasCopyAddressOnClick={true}>
        <div>Child Component</div>
      </Identity>
    );

    const identityLayout = screen.getByTestId('ockIdentity_container');
    fireEvent.click(identityLayout);

    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });

  it('should log an error and return false when clipboard write fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error('Failed to copy')),
      },
    });

    render(
      <Identity address="0x123456789" hasCopyAddressOnClick={true}>
        <div>Child Component</div>
      </Identity>
    );

    const identityLayout = screen.getByTestId('ockIdentity_container');
    fireEvent.click(identityLayout);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("0x123456789");
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to copy: ', expect.any(Error));
    });
  });
});
