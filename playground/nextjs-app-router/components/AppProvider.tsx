// AppContext.js
import type React from 'react';
import { createContext, useEffect, useState } from 'react';
import { useConnect, useConnectors } from 'wagmi';

import { WalletPreference } from './form/wallet-type';

export enum OnchainKitComponent {
  Identity = 'identity',
  Swap = 'swap',
  Transaction = 'transaction',
  Wallet = 'wallet',
}

export enum TransactionTypes {
  Calls = 'calls',
  Contracts = 'contracts',
}

export type Paymaster = {
  url: string;
  enabled: boolean;
};
type State = {
  activeComponent?: OnchainKitComponent;
  setActiveComponent?: (component: OnchainKitComponent) => void;
  walletType?: WalletPreference;
  setWalletType?: (walletType: WalletPreference) => void;
  clearWalletType?: () => void;
  chainId?: number;
  setChainId?: (chainId: number) => void;
  transactionType?: TransactionTypes;
  setTransactionType?: (transactionType: TransactionTypes) => void;
  paymasters?: Record<number, Paymaster>; // paymasters is per network
  setPaymaster?: (chainId: number, url: string, enabled: boolean) => void;
};

const defaultState: State = {
  activeComponent: OnchainKitComponent.Transaction,
  chainId: 85432,
};

export const AppContext = createContext(defaultState);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { connect } = useConnect();
  const connectors = useConnectors();

  const [activeComponent, setActiveComponentState] =
    useState<OnchainKitComponent>();
  const [walletType, setWalletTypeState] = useState<WalletPreference>();
  const [chainId, setChainIdState] = useState<number>();
  const [transactionType, setTransactionTypeState] =
    useState<TransactionTypes>();
  const [paymasters, setPaymastersState] =
    useState<Record<number, Paymaster>>();

  // Load initial values from localStorage
  useEffect(() => {
    const storedActiveComponent = localStorage.getItem('activeComponent');
    const storedWalletType = localStorage.getItem('walletType');
    const storedChainId = localStorage.getItem('chainId');
    const storedPaymasters = localStorage.getItem('paymasters');
    const storedTransactionType = localStorage.getItem('transactionType');

    if (storedActiveComponent) {
      setActiveComponent(storedActiveComponent as OnchainKitComponent);
    }
    if (storedWalletType) {
      setWalletType(storedWalletType as WalletPreference);
    }
    if (storedChainId) {
      setChainIdState(Number.parseInt(storedChainId));
    }
    if (storedPaymasters) {
      setPaymastersState(JSON.parse(storedPaymasters));
    }
    if (storedTransactionType) {
      setTransactionTypeState(storedTransactionType as TransactionTypes);
    }
  }, []);

  // Connect to wallet if walletType changes
  useEffect(() => {
    if (walletType === WalletPreference.SMART_WALLET) {
      connect({ connector: connectors[0] });
    } else if (walletType === WalletPreference.EOA) {
      connect({ connector: connectors[1] });
    }
  }, [connect, connectors, walletType]);

  // Update localStorage whenever the state changes

  function setActiveComponent(component: OnchainKitComponent) {
    localStorage.setItem('activeComponent', component.toString());
    setActiveComponentState(component);
  }

  function setWalletType(newWalletType: WalletPreference) {
    localStorage.setItem('walletType', newWalletType.toString());
    setWalletTypeState(newWalletType);
  }

  function clearWalletType() {
    localStorage.setItem('walletType', '');
    setWalletTypeState(undefined);
  }

  const setChainId = (newChainId: number) => {
    localStorage.setItem('chainId', newChainId.toString());
    setChainIdState(newChainId);
  };

  const setPaymaster = (chainId: number, url: string, enabled: boolean) => {
    const newObj = {
      ...paymasters,
      [chainId]: { url, enabled },
    };
    localStorage.setItem('paymasters', JSON.stringify(newObj));
    setPaymastersState(newObj);
  };

  const setTransactionType = (transactionType: TransactionTypes) => {
    localStorage.setItem('transactionType', transactionType.toString());
    setTransactionTypeState(transactionType);
  };

  return (
    <AppContext.Provider
      value={{
        activeComponent,
        setActiveComponent,
        walletType,
        setWalletType,
        clearWalletType,
        chainId,
        setChainId,
        paymasters,
        setPaymaster,
        transactionType,
        setTransactionType,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
