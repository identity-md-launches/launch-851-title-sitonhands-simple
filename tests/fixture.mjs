import {
  decodeFunctionData,
  encodeFunctionResult,
  erc20Abi,
  parseAbi,
  toHex,
} from "viem";

export const ACCOUNT = "0x1111111111111111111111111111111111111111";
export const OTHER = "0x2222222222222222222222222222222222222222";
const TOKEN = "0xd34a99bc0f67ae1bbd63c660e6d0b0dd03e263b7";
const VAULT = "0x20bcc5c678b0beea9a042cd03e3abc36d00e734a";
const MULTICALL = "0xca11bde05977b3631167028862be2a173976ca11";
const vault = parseAbi([
  "function imd() view returns (address)",
  "function totalLocked() view returns (uint256)",
  "function lockedBalance(address) view returns (uint256)",
  "function nextPositionId() view returns (uint256)",
  "function positions(uint256) view returns (address, uint256, uint256, bool)",
  "function canWithdraw(uint256) view returns (bool)",
  "function lock(uint256, uint256) returns (uint256)",
  "function withdraw(uint256)",
]);
const multicall = parseAbi([
  "function aggregate3((address target, bool allowFailure, bytes callData)[] calls) payable returns ((bool success, bytes returnData)[] returnData)",
]);
const UNIT = 10n ** 18n;
export function fixture() {
  const time = BigInt(Math.floor(Date.now() / 1000));
  const state = {
    balance: 10000n * UNIT,
    allowance: 0n,
    block: 0x1a00000,
    sent: [],
    failReads: false,
    revertNext: false,
    receiptPending: false,
    positions: [
      {
        owner: ACCOUNT,
        amount: 250n * UNIT,
        unlock: time - 3600n,
        withdrawn: false,
      },
      {
        owner: ACCOUNT,
        amount: 1500n * UNIT,
        unlock: time + 86400n * 7n,
        withdrawn: false,
      },
      {
        owner: OTHER,
        amount: 10n * UNIT,
        unlock: time - 3600n,
        withdrawn: true,
      },
    ],
    receipts: new Map(),
  };
  const outstanding = (owner) =>
    state.positions
      .filter(
        (p) =>
          !p.withdrawn &&
          (!owner || p.owner.toLowerCase() === owner.toLowerCase()),
      )
      .reduce((sum, p) => sum + p.amount, 0n);
  function call(to, data) {
    if (to.toLowerCase() === MULTICALL) {
      const { args } = decodeFunctionData({ abi: multicall, data });
      return encodeFunctionResult({
        abi: multicall,
        functionName: "aggregate3",
        result: args[0].map((c) => ({
          success: true,
          returnData: call(c.target, c.callData),
        })),
      });
    }
    const abi = to.toLowerCase() === TOKEN ? erc20Abi : vault;
    const { functionName: fn, args } = decodeFunctionData({ abi, data });
    let result;
    if (fn === "decimals") result = 18;
    else if (fn === "imd") result = TOKEN;
    else if (fn === "totalLocked") result = outstanding();
    else if (fn === "lockedBalance") result = outstanding(args[0]);
    else if (fn === "balanceOf")
      result = args[0].toLowerCase() === ACCOUNT ? state.balance : 0n;
    else if (fn === "allowance") result = state.allowance;
    else if (fn === "nextPositionId") result = BigInt(state.positions.length);
    else if (fn === "positions") {
      const p = state.positions[Number(args[0])];
      result = [p.owner, p.amount, p.unlock, p.withdrawn];
    } else if (fn === "canWithdraw") {
      const p = state.positions[Number(args[0])];
      result = !!p && !p.withdrawn && p.unlock <= time;
    } else if (fn === "approve") result = true;
    else if (fn === "lock") result = BigInt(state.positions.length);
    else if (fn === "withdraw") return "0x";
    else throw Error("Unknown contract function: " + fn);
    return encodeFunctionResult({ abi, functionName: fn, result });
  }
  const blockHash = "0x" + "ab".repeat(32);
  function rpc({ method, params = [] }) {
    if (state.failReads && !method.startsWith("eth_send"))
      throw Error("Fixture RPC unavailable");
    if (method === "eth_chainId") return "0x1";
    if (method === "eth_blockNumber") return toHex(++state.block);
    if (method === "eth_getCode") return "0x1234";
    if (method === "eth_getBalance") return "0xde0b6b3a7640000";
    if (method === "eth_gasPrice") return "0x3b9aca00";
    if (method === "eth_estimateGas") return "0x186a0";
    if (method === "eth_getTransactionCount") return "0x0";
    if (method === "eth_getBlockByNumber")
      return {
        number: "0x1a00000",
        hash: blockHash,
        parentHash: blockHash,
        timestamp: toHex(time),
        nonce: "0x0000000000000000",
        difficulty: "0x0",
        totalDifficulty: "0x0",
        size: "0x100",
        gasLimit: "0x1c9c380",
        gasUsed: "0x0",
        miner: ACCOUNT,
        extraData: "0x",
        transactions: [],
        baseFeePerGas: "0x3b9aca00",
        logsBloom: "0x" + "00".repeat(256),
        receiptsRoot: blockHash,
        stateRoot: blockHash,
        transactionsRoot: blockHash,
        sha3Uncles: blockHash,
        uncles: [],
      };
    if (method === "eth_call") return call(params[0].to, params[0].data);
    if (method === "eth_sendTransaction") {
      const tx = params[0];
      const abi = tx.to.toLowerCase() === TOKEN ? erc20Abi : vault;
      const decoded = decodeFunctionData({ abi, data: tx.data });
      state.sent.push({ ...tx, ...decoded });
      const hash = "0x" + state.sent.length.toString(16).padStart(64, "0");
      const reverted = state.revertNext;
      state.revertNext = false;
      if (!reverted) {
        if (decoded.functionName === "approve")
          state.allowance = decoded.args[1];
        if (decoded.functionName === "lock") {
          state.balance -= decoded.args[0];
          state.allowance -= decoded.args[0];
          state.positions.push({
            owner: ACCOUNT,
            amount: decoded.args[0],
            unlock: time + decoded.args[1],
            withdrawn: false,
          });
        }
        if (decoded.functionName === "withdraw") {
          const p = state.positions[Number(decoded.args[0])];
          p.withdrawn = true;
          state.balance += p.amount;
        }
      }
      state.receipts.set(hash, {
        transactionHash: hash,
        transactionIndex: "0x0",
        blockHash,
        blockNumber: "0x1a00000",
        from: ACCOUNT,
        to: tx.to,
        cumulativeGasUsed: "0x186a0",
        gasUsed: "0x186a0",
        effectiveGasPrice: "0x3b9aca00",
        contractAddress: null,
        logs: [],
        logsBloom: "0x" + "00".repeat(256),
        status: reverted ? "0x0" : "0x1",
        type: "0x2",
      });
      return hash;
    }
    if (method === "eth_getTransactionReceipt")
      return state.receiptPending
        ? null
        : (state.receipts.get(params[0]) ?? null);
    if (method === "eth_getTransactionByHash") {
      const tx = state.sent[Number(BigInt(params[0])) - 1];
      return tx
        ? {
            hash: params[0],
            from: ACCOUNT,
            to: tx.to,
            input: tx.data,
            value: "0x0",
            gas: "0x186a0",
            gasPrice: "0x3b9aca00",
            nonce: "0x0",
            chainId: "0x1",
            type: "0x0",
            blockHash: state.receiptPending ? null : blockHash,
            blockNumber: state.receiptPending ? null : "0x1a00000",
            transactionIndex: state.receiptPending ? null : "0x0",
            r: "0x1",
            s: "0x1",
            v: "0x25",
          }
        : null;
    }
    throw Error("Unhandled RPC: " + method);
  }
  return { state, rpc };
}

export async function injectWallet(page) {
  await page.addInitScript(
    ({ account }) => {
      const handlers = {};
      window.testWallet = {
        account,
        chainId: "0x1",
        rejectNext: false,
        emit(event, value) {
          for (const handler of handlers[event] ?? []) handler(value);
        },
      };
      window.ethereum = {
        on(event, handler) {
          (handlers[event] ??= []).push(handler);
        },
        removeListener(event, handler) {
          handlers[event] = (handlers[event] ?? []).filter(
            (h) => h !== handler,
          );
        },
        async request({ method, params }) {
          if (method === "eth_chainId") return window.testWallet.chainId;
          if (method === "eth_accounts" || method === "eth_requestAccounts")
            return window.testWallet.account ? [window.testWallet.account] : [];
          if (method === "wallet_switchEthereumChain") {
            window.testWallet.chainId = "0x1";
            window.testWallet.emit("chainChanged", "0x1");
            return null;
          }
          if (
            method === "eth_sendTransaction" &&
            window.testWallet.rejectNext
          ) {
            window.testWallet.rejectNext = false;
            throw { code: 4001, message: "User rejected request" };
          }
          const response = await fetch("./fixture-rpc", {
            method: "POST",
            body: JSON.stringify({ method, params }),
          });
          const body = await response.json();
          if (body.error) throw new Error(body.error.message);
          return body.result;
        },
      };
    },
    { account: ACCOUNT },
  );
}
