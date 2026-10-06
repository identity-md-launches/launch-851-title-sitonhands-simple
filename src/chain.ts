import {
  createPublicClient,
  custom,
  erc20Abi,
  fallback,
  formatUnits,
  http,
  parseAbi,
  parseUnits,
  type Address,
  type EIP1193Provider,
} from "viem";
import { mainnet } from "viem/chains";

export const VAULT = "0x20bcc5c678b0beea9a042cd03e3abc36d00e734a" as const;
export const TOKEN = "0xd34a99bc0f67ae1bbd63c660e6d0b0dd03e263b7" as const;
export const MIN_DURATION = 86_400;
export const MAX_DURATION = 31_536_000;
// Read from contracts/SitOnHands.sol at upstream commit 65fc59caa5a969fc1e3cf38fe3ee95b7a5cb6ca0.
export const vaultAbi = parseAbi([
  "function lock(uint256 amount, uint256 durationSeconds) returns (uint256 positionId)",
  "function withdraw(uint256 positionId)",
  "function positions(uint256) view returns (address depositor, uint256 amount, uint256 unlockTime, bool withdrawn)",
  "function canWithdraw(uint256 positionId) view returns (bool)",
  "function nextPositionId() view returns (uint256)",
  "function lockedBalance(address depositor) view returns (uint256)",
  "function totalLocked() view returns (uint256)",
  "function imd() view returns (address)",
  "function MIN_DURATION() view returns (uint256)",
  "function MAX_DURATION() view returns (uint256)",
  "error InvalidToken()",
  "error ZeroAmount()",
  "error InvalidDuration()",
  "error UnknownPosition()",
  "error NotDepositor()",
  "error AlreadyWithdrawn()",
  "error StillLocked(uint256 unlockTime)",
  "error UnexpectedTokenBalance()",
  "event Locked(address indexed depositor, uint256 amount, uint256 unlockTime, uint256 indexed positionId)",
  "event Withdrawn(address indexed depositor, uint256 amount, uint256 unlockTime, uint256 indexed positionId)",
]);
export { erc20Abi };
export interface Config {
  walletConnectProjectId: string;
  rpcUrls: string[];
}
export const defaults: Config = {
  walletConnectProjectId: "",
  rpcUrls: ["https://ethereum-rpc.publicnode.com", "https://eth.drpc.org"],
};
export function makeClient(config: Config, provider?: EIP1193Provider) {
  return createPublicClient({
    chain: mainnet,
    transport: provider
      ? custom(provider, { retryCount: 1 })
      : fallback(
          config.rpcUrls.map((url) =>
            http(url, { timeout: 10_000, retryCount: 0 }),
          ),
        ),
  });
}
export type Client = ReturnType<typeof makeClient>;
export interface Position {
  id: bigint;
  amount: bigint;
  unlockTime: bigint;
  canWithdraw: boolean;
}
export interface Snapshot {
  account?: Address;
  total: bigint;
  locked: bigint;
  balance: bigint;
  allowance: bigint;
  decimals: number;
  positions: Position[];
  timestamp: bigint;
  blockNumber: bigint;
}
export async function readSnapshot(
  client: Client,
  account?: Address,
): Promise<Snapshot> {
  const chainId = await client.getChainId();
  if (chainId !== 1)
    throw new Error(
      "The read connection is not on Ethereum mainnet. Switch to Ethereum and retry.",
    );
  const block = await client.getBlock();
  const blockNumber = block.number;
  const readVault = { address: VAULT, abi: vaultAbi, blockNumber } as const;
  const [total, decimals, token] = await Promise.all([
    client.readContract({ ...readVault, functionName: "totalLocked" }),
    client.readContract({
      address: TOKEN,
      abi: erc20Abi,
      functionName: "decimals",
      blockNumber,
    }),
    client.readContract({ ...readVault, functionName: "imd" }),
  ]);
  if (token.toLowerCase() !== TOKEN)
    throw new Error(
      "The vault token does not match IMD. Transactions are unavailable.",
    );
  const result: Snapshot = {
    account,
    total,
    decimals,
    locked: 0n,
    balance: 0n,
    allowance: 0n,
    positions: [],
    timestamp: block.timestamp,
    blockNumber,
  };
  if (!account) return result;
  const [locked, balance, allowance, nextId] = await Promise.all([
    client.readContract({
      ...readVault,
      functionName: "lockedBalance",
      args: [account],
    }),
    client.readContract({
      address: TOKEN,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [account],
      blockNumber,
    }),
    client.readContract({
      address: TOKEN,
      abi: erc20Abi,
      functionName: "allowance",
      args: [account, VAULT],
      blockNumber,
    }),
    client.readContract({ ...readVault, functionName: "nextPositionId" }),
  ]);
  Object.assign(result, { locked, balance, allowance });
  // Newest first, bounded batches. Stop only when every outstanding unit is accounted for.
  let found = 0n;
  for (let end = nextId; end > 0n && found < locked;) {
    const start = end > 60n ? end - 60n : 0n;
    const ids = Array.from(
      { length: Number(end - start) },
      (_, i) => end - 1n - BigInt(i),
    );
    const rows = await client.multicall({
      blockNumber,
      allowFailure: false,
      contracts: ids.map((id) => ({
        address: VAULT,
        abi: vaultAbi,
        functionName: "positions" as const,
        args: [id] as const,
      })),
    });
    for (let i = 0; i < rows.length; i++) {
      const [owner, amount, unlockTime, withdrawn] = rows[i];
      if (owner.toLowerCase() === account.toLowerCase() && !withdrawn) {
        result.positions.push({
          id: ids[i],
          amount,
          unlockTime,
          canWithdraw: false,
        });
        found += amount;
      }
    }
    end = start;
  }
  if (found !== locked)
    throw new Error(
      "Position data is incomplete. Retry to reload your positions.",
    );
  if (result.positions.length) {
    const eligible = await client.multicall({
      blockNumber,
      allowFailure: false,
      contracts: result.positions.map((p) => ({
        address: VAULT,
        abi: vaultAbi,
        functionName: "canWithdraw" as const,
        args: [p.id] as const,
      })),
    });
    result.positions.forEach((p, i) => {
      p.canWithdraw = eligible[i];
    });
  }
  return result;
}
export function amountValue(input: string, decimals: number) {
  const text = input.trim();
  if (!/^(?:\d+\.?\d*|\.\d+)$/.test(text))
    throw new Error(
      "Enter an IMD amount greater than 0, using a decimal point.",
    );
  if ((text.split(".")[1]?.length ?? 0) > decimals)
    throw new Error(`Use no more than ${decimals} decimal places.`);
  const value = parseUnits(text, decimals);
  if (value <= 0n) throw new Error("Enter an IMD amount greater than 0.");
  if (value > 2n ** 256n - 1n)
    throw new Error("This amount is too large. Enter a smaller amount.");
  return value;
}
export function durationValue(input: string | number) {
  if (!/^\d+$/.test(String(input)))
    throw new Error("Enter a whole number of seconds.");
  const seconds = Number(input);
  if (
    !Number.isSafeInteger(seconds) ||
    seconds < MIN_DURATION ||
    seconds > MAX_DURATION
  )
    throw new Error("Choose 86,400–31,536,000 seconds (1–365 days).");
  return seconds;
}
export function amountText(value: bigint, decimals: number, exact = false) {
  const text = formatUnits(value, decimals);
  if (exact) return text;
  const [integer, fraction] = text.split(".");
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (value > 0n && Number(text) < 0.0001) return "<0.0001";
  return (
    grouped +
    (fraction ? "." + fraction.slice(0, 4).replace(/0+$/, "") : "").replace(
      /\.$/,
      "",
    )
  );
}
export const shortAddress = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
export const explorer = (kind: "address" | "tx", value: string) =>
  `https://etherscan.io/${kind}/${value}`;
export function errorText(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (/rejected|denied|4001/i.test(message))
    return "Request declined in your wallet. You can try again when you’re ready.";
  if (/insufficient funds/i.test(message))
    return "Not enough ETH for the network fee. Add ETH to your wallet and try again.";
  if (/StillLocked/i.test(message))
    return "This position is still locked on Ethereum. Refresh after its unlock time.";
  if (/timeout|timed out|fetch|HTTP|network|RPC|socket/i.test(message))
    return "Unable to reach Ethereum. Check your connection, connect a wallet, or retry.";
  return (
    message.split("\n")[0].slice(0, 240) ||
    "The request failed. Refresh and try again."
  );
}
