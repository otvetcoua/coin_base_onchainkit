// 🌲☀🌲
import type { ReactNode } from 'react';
import type {
  Address,
  ContractFunctionParameters,
  TransactionReceipt,
} from 'viem';

/**
 * List of transaction lifecycle statuses.
 * The order of the statuses loosely follows the transaction lifecycle.
 *
 * Note: exported as public Type
 */
export type LifeCycleStatus =
  | {
      statusName: 'init';
      statusData: null;
    }
  | {
      statusName: 'error';
      statusData: TransactionError;
    }
  | {
      statusName: 'transactionIdle'; // initial status prior to the mutation function executing
      statusData: null;
    }
  | {
      statusName: 'transactionPending'; // if the mutation is currently executing
      statusData: null;
    }
  | {
      statusName: 'transactionLegacyExecuted';
      statusData: {
        transactionHashList: Address[];
      };
    }
  | {
      statusName: 'success'; // if the last mutation attempt was successful
      statusData: {
        transactionReceipts: TransactionReceipt[];
      };
    };

export type IsSpinnerDisplayedProps = {
  errorMessage?: string;
  hasReceipt?: boolean;
  isLoading?: boolean;
  lifeCycleStatus: LifeCycleStatus;
  transactionHash?: string;
  transactionId?: string;
};

/**
 * Note: exported as public Type
 */
export type TransactionButtonReact = {
  className?: string; // An optional CSS class name for styling the button component.
  disabled?: boolean; // A optional prop to disable the submit button
  text?: string; // An optional text to be displayed in the button component.
};

export type TransactionContextType = {
  chainId?: number; // The chainId for the transaction.
  contracts: ContractFunctionParameters[]; // An array of contracts for the transaction.
  errorCode?: string; // An error code used to localize errors and provide more context with unit-tests.
  errorMessage?: string; // An error message string if the transaction encounters an issue.
  isLoading: boolean; // A boolean indicating if the transaction is currently loading.
  isToastVisible: boolean; // A boolean indicating if the transaction toast notification is visible.
  onSubmit: () => void; // A function called when the transaction is submitted.
  paymasterUrl: string | null; // The paymaster URL for the transaction.
  receipt?: TransactionReceipt; // The receipt of the transaction
  lifeCycleStatus: LifeCycleStatus; // The lifecycle status of the transaction.
  setIsToastVisible: (isVisible: boolean) => void; // A function to set the visibility of the transaction toast.
  setLifeCycleStatus: (state: LifeCycleStatus) => void; // A function to set the lifecycle status of the component
  setTransactionId: (id: string) => void; // A function to set the transaction ID.
  transactionId?: string; // An optional string representing the ID of the transaction.
  transactionHash?: string; // An optional string representing the hash of the transaction.
};

/**
 * Paymaster service configuration
 */
type PaymasterService = {
  url: string;
};

/**
 * Note: exported as public Type
 */
export type TransactionError = {
  code: string; // The error code representing the type of transaction error.
  error: string; // The error message providing details about the transaction error.
  message: string; // The error message providing details about the transaction error.
};

export type TransactionProviderReact = {
  capabilities?: WalletCapabilities; // Capabilities that a wallet supports (e.g. paymasters, session keys, etc).
  chainId?: number; // The chainId for the transaction.
  children: ReactNode; // The child components to be rendered within the provider component.
  contracts: ContractFunctionParameters[]; // An array of contract function parameters provided to the child components.
  onError?: (e: TransactionError) => void; // An optional callback function that handles errors within the provider.
  onStatus?: (lifeCycleStatus: LifeCycleStatus) => void; // An optional callback function that exposes the component lifecycle state
  onSuccess?: (response: TransactionResponse) => void; // An optional callback function that exposes the transaction receipts
};

/**
 * Note: exported as public Type
 */
export type TransactionReact = {
  capabilities?: WalletCapabilities; // Capabilities that a wallet supports (e.g. paymasters, session keys, etc).
  chainId?: number; // The chainId for the transaction.
  children: ReactNode; // The child components to be rendered within the transaction component.
  className?: string; // An optional CSS class name for styling the component.
  contracts: ContractFunctionParameters[]; // An array of contract function parameters for the transaction.
  onError?: (e: TransactionError) => void; // An optional callback function that handles transaction errors.
  onStatus?: (lifeCycleStatus: LifeCycleStatus) => void; // An optional callback function that exposes the component lifecycle state
  onSuccess?: (response: TransactionResponse) => void; // An optional callback function that exposes the transaction receipts
};

/**
 * Note: exported as public Type
 */
export type TransactionResponse = {
  transactionReceipts: TransactionReceipt[];
};

/**
 * Note: exported as public Type
 */
export type TransactionSponsorReact = {
  className?: string; // An optional CSS class name for styling the sponsor component.
};

/**
 * Note: exported as public Type
 */
export type TransactionStatusReact = {
  children: ReactNode; // The child components to be rendered within the status component.
  className?: string; // An optional CSS class name for styling the status component.
};

/**
 * Note: exported as public Type
 */
export type TransactionStatusActionReact = {
  className?: string; // An optional CSS class name for styling.
};

/**
 * Note: exported as public Type
 */
export type TransactionStatusLabelReact = {
  className?: string; // An optional CSS class name for styling.
};

/**
 * Note: exported as public Type
 */
export type TransactionToastReact = {
  children: ReactNode; // The child components to be rendered within the toast component.
  className?: string; // An optional CSS class name for styling the toast component.
  durationMs?: number; // An optional value to customize time until toast disappears
  position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right'; // An optional position property to specify the toast's position on the screen.
};

/**
 * Note: exported as public Type
 */
export type TransactionToastActionReact = {
  className?: string; // An optional CSS class name for styling.
};

/**
 * Note: exported as public Type
 */
export type TransactionToastIconReact = {
  className?: string; // An optional CSS class name for styling.
};

/**
 * Note: exported as public Type
 */
export type TransactionToastLabelReact = {
  className?: string; // An optional CSS class name for styling.
};

export type UseCallsStatusParams = {
  setLifeCycleStatus: (state: LifeCycleStatus) => void;
  transactionId: string;
};

export type UseWriteContractParams = {
  setLifeCycleStatus: (state: LifeCycleStatus) => void;
  transactionHashList: Address[];
};

export type UseWriteContractsParams = {
  setLifeCycleStatus: (state: LifeCycleStatus) => void;
  setTransactionId: (id: string) => void;
};

export type UseSendCallParams = {
  setLifeCycleStatus: (state: LifeCycleStatus) => void;
  transactionHashList: Address[];
};

export type UseSendCallsParams = {
  setLifeCycleStatus: (state: LifeCycleStatus) => void;
  setTransactionId: (id: string) => void;
};

/**
 * Note: exported as public Type
 *
 * Wallet capabilities configuration
 */
export type WalletCapabilities = {
  paymasterService?: PaymasterService;
};
