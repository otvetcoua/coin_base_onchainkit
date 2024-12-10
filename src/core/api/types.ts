import type { Address } from 'viem';
import type { ContractType, NFTPrice } from '../../ui/react/nft/types';
import type {
  Fee,
  QuoteWarning,
  SwapQuote,
  Transaction,
} from '../../swap/types';
import type { Token } from '../../token/types';

export type AddressOrETH = Address | 'ETH';

/**
 * Note: exported as public Type
 */
export type APIError = {
  code: string; // The Error code
  error: string; // The Error long message
  message: string; // The Error short message
};

/**
 * Note: exported as public Type
 */
export type BuildPayTransactionParams = {
  address: Address; // The address of the wallet paying
  chargeId?: string; // The ID of the Commerce Charge to be paid
  productId?: string; // The ID of the product being paid for
};

/**
 * Note: exported as public Type
 */
export type BuildPayTransactionResponse = PayTransaction | APIError;

/**
 * Note: exported as public Type
 */
export type BuildSwapTransaction = {
  approveTransaction?: Transaction; // ERC20 approve transaction which allows token holders to authorize spending
  fee: Fee; // The fee for the swap
  quote: SwapQuote; // The quote for the swap
  transaction: Transaction; // The object developers should pass into Wagmi's signTransaction
  warning?: QuoteWarning; // The warning associated with the swap
};

/**
 * Note: exported as public Type
 */
export type BuildSwapTransactionParams = GetSwapQuoteParams & {
  fromAddress: Address; // The address of the user
};

/**
 * Note: exported as public Type
 */
export type BuildSwapTransactionResponse = BuildSwapTransaction | APIError;

export type CreateProductChargeParams = {
  sender: Address; // The address of the wallet paying
  productId: string; // The ID of the product being paid for
};

export type GetAPIParamsForToken =
  | GetSwapQuoteParams
  | BuildSwapTransactionParams;

export type GetQuoteAPIParams = {
  amount: string; // The amount to be swapped
  amountReference?: string; // The reference amount for the swap
  from: AddressOrETH | ''; // The source address or 'ETH' for Ethereum
  to: AddressOrETH | ''; // The destination address or 'ETH' for Ethereum
  v2Enabled?: boolean; // Whether to use V2 of the API (default: false)
  slippagePercentage?: string; // The slippage percentage for the swap
};

export type GetSwapAPIParams = GetQuoteAPIParams & {
  fromAddress: Address; // The address of the user
};

/**
 * Note: exported as public Type
 */
export type GetSwapQuoteParams = {
  amount: string; // The amount to be swapped
  amountReference?: string; // The reference amount for the swap
  from: Token; // The source token for the swap
  isAmountInDecimals?: boolean; // Whether the amount is in decimals
  maxSlippage?: string; // The slippage of the swap
  to: Token; // The destination token for the swap
  useAggregator: boolean; // Whether to use a DEX aggregator
};

/**
 * Note: exported as public Type
 */
export type GetSwapQuoteResponse = SwapQuote | APIError;

/**
 * Note: exported as public Type
 */
export type GetTokensOptions = {
  limit?: string; // The maximum number of tokens to return (default: 50)
  page?: string; // The page number to return (default: 1)
  search?: string; // A string to search for in the token name, symbol or address
};

/**
 * Note: exported as public Type
 */
export type GetTokensResponse = Token[] | APIError;

export type HydrateChargeAPIParams = {
  sender: Address; // The address of the wallet paying
  chargeId: string; // The ID of the Commerce Charge to be paid
};

export type PayTransaction = {
  id: string; // The id of the Commerce Charge to be paid
  callData: {
    // Collection of fields used to make the contract call to the Payment contract
    deadline: string; // Timestamp of when the payment will expire and be unpayable
    feeAmount: string; // The amount of the processing fee in the recipient currency
    id: string; // The id of the prepared transaction
    operator: Address; // The address of the operator of the Payment contract
    prefix: Address; // The prefix of the signature generated by Commerce
    recipient: Address; // The address funds will settle in
    recipientAmount: string; // The amount the recipient will get in the recipient currency
    recipientCurrency: Address; // The address of the currency being paid (always USDC)
    refundDestination: Address; // The wallet address of the payer
    signature: Address; // The signature generated by the Payment contract operator, encoding the payment details
  };
  metaData: {
    // Collection of metadata needed to make the contract call to the Payment Contract
    chainId: number; // The chain this prepared transaction can be paid on
    contractAddress: Address; // The address of the Payment contract
    sender: Address; // The wallet address of the payer
    settlementCurrencyAddress: Address; // The address of the currency being paid (always USDC)
  };
};

export type RawTransactionData = {
  data: string; // The transaction data
  from: string; // The sender address
  gas: string; // The gas limit
  gasPrice: string; // The gas price
  to: string; // The recipient address
  value: string; // The value of the transaction
};

export type SwapAPIParams = GetQuoteAPIParams | GetSwapAPIParams;

/**
 * Note: exported as public Type
 */
export type GetTokenDetailsParams = {
  contractAddress: Address; // The address of the token contract
  tokenId?: string; // The ID of the token
};

export type TokenDetails = {
  name: string; // The name of the token
  description: string; // The description of the token
  imageUrl: string; // The image URL of the token
  animationUrl: string; // The animation URL of the token
  mimeType: string; // The MIME type of the token
  ownerAddress: Address; // The address of the owner of the token
  lastSoldPrice: NFTPrice; // The last sold price of the token
  contractType: ContractType; // ERC721, ERC1155
};

/**
 * Note: exported as public Type
 */
export type GetTokenDetailsResponse = TokenDetails | APIError;

/**
 * Note: exported as public Type
 */
export type GetMintDetailsParams = {
  contractAddress: Address; // The address of the token contract
  takerAddress?: Address; // The address of the user
  tokenId?: string; // The ID of the token (required for ERC1155)
};

export type MintDetails = {
  name: string; // The name of the NFT
  description: string; // The description of the NFT
  imageUrl: string; // The image URL of the NFT
  animationUrl: string; // The animation URL of the NFT
  mimeType: string; // The MIME type of the NFT
  contractType: ContractType; // ERC721, ERC1155
  price: NFTPrice; // The price of the NFT
  mintFee: NFTPrice; // The mint fee of the NFT
  maxMintsPerWallet: number; // The maximum number of mints per wallet
  isEligibleToMint: boolean; // Whether the user is eligible to mint
  creatorAddress: Address; // The address of the creator of the NFT
  totalTokens: string; // The total number of tokens
  totalOwners: string; // The total number of owners of the NFT
  network: string; // The network the NFT is on
};

/**
 * Note: exported as public Type
 */
export type GetMintDetailsResponse = MintDetails | APIError;

/**
 * Note: exported as public Type
 */
export type BuildMintTransactionParams = {
  mintAddress: Address; // The address of the token contract to mint
  takerAddress: Address; // The address of the user
  tokenId?: string; // The ID of the token
  quantity: number; // The number of tokens to mint
  network?: string; // The network the mint contract is on
};

type MintTransaction = {
  call_data: {
    data: Address; // The transaction data
    to: Address; // The recipient address
    from: Address; // The sender address
    value: string; // The value of the transaction
  };
};

/**
 * Note: exported as public Type
 */
export type BuildMintTransactionResponse = MintTransaction | APIError;
