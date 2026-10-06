import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { createWalletClient, custom, type Hash } from "viem";
import { mainnet } from "viem/chains";
import {
  amountText,
  amountValue,
  defaults,
  durationValue,
  erc20Abi,
  errorText,
  explorer,
  makeClient,
  MAX_DURATION,
  MIN_DURATION,
  readSnapshot,
  shortAddress,
  TOKEN,
  VAULT,
  vaultAbi,
  type Config,
  type Position,
  type Snapshot,
} from "./chain";
import { useWallet } from "./wallet";
import WalletDialog from "./WalletDialog";
import { Hourglass, Icon } from "./Icons";

type Tx = {
  action: string;
  status: "wallet" | "pending" | "success" | "error" | "unconfirmed";
  message: string;
  hash?: Hash;
};
const presets = [1, 7, 30, 90, 365];
const dateText = (seconds: number) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(seconds * 1000));
function External({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
      <Icon name="external" size={13} />
    </a>
  );
}
function countdown(unlock: bigint, now: number) {
  const remaining = Math.max(0, Number(unlock) - now);
  if (!remaining) return "Checking on Ethereum…";
  const days = Math.floor(remaining / 86400),
    hours = Math.floor((remaining % 86400) / 3600),
    minutes = Math.floor((remaining % 3600) / 60);
  return days
    ? `${days}d ${hours}h ${minutes}m remaining`
    : `${hours}h ${minutes}m ${remaining % 60}s remaining`;
}

export default function App() {
  const wallet = useWallet();
  const [config, setConfig] = useState<Config>(defaults);
  const [walletOpen, setWalletOpen] = useState(false);
  const [rawData, setData] = useState<Snapshot>();
  const [loading, setLoading] = useState(true);
  const [readError, setReadError] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState(30 * 86400);
  const [isCustom, setIsCustom] = useState(false);
  const [seconds, setSeconds] = useState("2592000");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tx, setTx] = useState<Tx>();
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [filter, setFilter] = useState<"all" | "locked" | "ready">("all");
  const readVersion = useRef(0);
  const txMutex = useRef(false);
  const wrongChain = !!wallet.address && wallet.chainId !== 1;
  const busy = !!tx && ["wallet", "pending", "unconfirmed"].includes(tx.status);
  const client = useMemo(
    () =>
      makeClient(config, wallet.chainId === 1 ? wallet.provider : undefined),
    [config, wallet.provider, wallet.chainId],
  );
  const data =
    rawData?.account?.toLowerCase() === wallet.address?.toLowerCase()
      ? rawData
      : undefined;
  const activeRead = useRef({ client, address: wallet.address });
  activeRead.current = { client, address: wallet.address };
  const refresh = useCallback(async () => {
    // A receipt from a previous wallet session must not overwrite the current one.
    if (
      activeRead.current.client !== client ||
      activeRead.current.address !== wallet.address
    ) return;
    const request = ++readVersion.current;
    setLoading(true);
    try {
      const result = await readSnapshot(client, wallet.address);
      if (request === readVersion.current) {
        setData(result);
        setReadError("");
      }
    } catch (e) {
      if (request === readVersion.current) setReadError(errorText(e));
    } finally {
      if (request === readVersion.current) setLoading(false);
    }
  }, [client, wallet.address]);
  useEffect(() => {
    let active = true;
    fetch("./config.json")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((c: Config) => {
        if (active)
          setConfig({
            walletConnectProjectId:
              typeof c.walletConnectProjectId === "string"
                ? c.walletConnectProjectId
                : "",
            rpcUrls:
              Array.isArray(c.rpcUrls) &&
              c.rpcUrls.length &&
              c.rpcUrls.every(
                (u) => typeof u === "string" && /^https:\/\//.test(u),
              )
                ? c.rpcUrls
                : defaults.rpcUrls,
          });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    setData(undefined);
    setReadError("");
    setConsent(false);
    setErrors({});
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      if (document.visibilityState === "visible") await refresh();
      if (!stopped) timer = setTimeout(poll, 20_000);
    };
    void poll();
    return () => {
      stopped = true;
      readVersion.current++;
      clearTimeout(timer);
    };
  }, [refresh]);
  useEffect(() => {
    const timer = setInterval(
      () => setNow(Math.floor(Date.now() / 1000)),
      1000,
    );
    return () => clearInterval(timer);
  }, []);
  let parsedAmount = 0n;
  try {
    if (data) parsedAmount = amountValue(amount, data.decimals);
  } catch {
    /* submit explains invalid values */
  }
  const approved =
    !!data && parsedAmount > 0n && data.allowance >= parsedAmount;
  let selectedDuration = duration;
  try {
    selectedDuration = isCustom ? durationValue(seconds) : duration;
  } catch {
    selectedDuration = 0;
  }

  const validate = (requireConsent = false) => {
    const next: Record<string, string> = {};
    let value = 0n;
    try {
      value = amountValue(amount, data?.decimals ?? 18);
      if (data && value > data.balance)
        next.amount =
          "This amount exceeds your available IMD. Enter less or use Max.";
    } catch (e) {
      next.amount = errorText(e);
    }
    try {
      durationValue(isCustom ? seconds : duration);
    } catch (e) {
      next.duration = errorText(e);
    }
    if (requireConsent && !consent)
      next.consent = "Confirm that your IMD cannot be withdrawn early.";
    setErrors(next);
    if (Object.keys(next).length) {
      document
        .getElementById(
          Object.keys(next)[0] === "duration"
            ? "seconds"
            : Object.keys(next)[0],
        )
        ?.focus();
      return undefined;
    }
    return value;
  };
  const assertWallet = async () => {
    if (!wallet.provider || !wallet.address)
      throw new Error("Connect your wallet to continue.");
    const [chain, accounts] = await Promise.all([
      wallet.provider.request({ method: "eth_chainId" }),
      wallet.provider.request({ method: "eth_accounts" }),
    ]);
    if (Number(chain) !== 1)
      throw new Error("Switch your wallet to Ethereum mainnet to continue.");
    if (accounts[0]?.toLowerCase() !== wallet.address.toLowerCase())
      throw new Error("Your wallet account changed. Refresh and try again.");
  };
  const waitForTx = async (hash: Hash, action: string) => {
    let currentHash = hash;
    let cancelled = false;
    try {
      const receipt = await client.waitForTransactionReceipt({
        hash,
        confirmations: 1,
        timeout: 120_000,
        onReplaced: (replacement) => {
          currentHash = replacement.transaction.hash;
          cancelled =
            replacement.reason === "cancelled" ||
            replacement.reason === "replaced";
          setTx({
            action,
            status: "pending",
            hash: currentHash,
            message: cancelled
              ? "Transaction replaced in your wallet. Checking the result…"
              : "Transaction sped up. Waiting for confirmation…",
          });
        },
      });
      if (receipt.status !== "success")
        throw new Error(
          "Transaction reverted. Your lock or approval did not complete. Refresh and try again.",
        );
      if (cancelled)
        throw new Error(
          "Transaction cancelled or replaced in your wallet. Refresh and review before trying again.",
        );
      setTx({
        action,
        status: "success",
        hash: currentHash,
        message:
          action === "Approve IMD"
            ? "Approval confirmed. Review the terms, then lock your IMD."
            : action === "Lock IMD"
              ? "Your IMD is locked. Your new position appears below."
              : "Withdrawal confirmed. Your IMD is back in your wallet.",
      });
      if (action === "Lock IMD") {
        setAmount("");
        setConsent(false);
      }
      await refresh();
    } catch (e) {
      const definite = /reverted|cancelled or replaced/i.test(
        e instanceof Error ? e.message : "",
      );
      setTx({
        action,
        hash: currentHash,
        status: definite ? "error" : "unconfirmed",
        message: definite
          ? errorText(e)
          : "Confirmation is taking longer than expected. Check Etherscan or check the receipt again before submitting another transaction.",
      });
      if (definite) await refresh();
    }
  };
  const transact = async (
    action: "Approve IMD" | "Lock IMD" | "Withdraw",
    position?: Position,
  ) => {
    if (txMutex.current || busy) return;
    if (!wallet.address) {
      setWalletOpen(true);
      return;
    }
    const value = action === "Withdraw" ? 0n : validate(action === "Lock IMD");
    if (value === undefined) return;
    if (!data || readError) {
      setReadError("Refresh your balances before submitting a transaction.");
      return;
    }
    txMutex.current = true;
    setTx({
      action,
      status: "wallet",
      message: "Checking the transaction. Confirm the request in your wallet.",
    });
    try {
      await assertWallet();
      const signer = createWalletClient({
        chain: mainnet,
        account: wallet.address,
        transport: custom(wallet.provider!),
      });
      let hash: Hash;
      if (action === "Approve IMD") {
        const { request } = await client.simulateContract({
          address: TOKEN,
          abi: erc20Abi,
          functionName: "approve",
          args: [VAULT, value],
          account: wallet.address,
        });
        await assertWallet();
        hash = await signer.writeContract(request);
      } else if (action === "Lock IMD") {
        const allowance = await client.readContract({
          address: TOKEN,
          abi: erc20Abi,
          functionName: "allowance",
          args: [wallet.address, VAULT],
        });
        if (allowance < value)
          throw new Error(
            "Approve this amount of IMD first, then try locking again.",
          );
        const { request } = await client.simulateContract({
          address: VAULT,
          abi: vaultAbi,
          functionName: "lock",
          args: [value, BigInt(selectedDuration)],
          account: wallet.address,
        });
        await assertWallet();
        hash = await signer.writeContract(request);
      } else {
        if (
          !position ||
          !(await client.readContract({
            address: VAULT,
            abi: vaultAbi,
            functionName: "canWithdraw",
            args: [position.id],
          }))
        )
          throw new Error(
            "This position is not ready. Refresh after its unlock time.",
          );
        const { request } = await client.simulateContract({
          address: VAULT,
          abi: vaultAbi,
          functionName: "withdraw",
          args: [position.id],
          account: wallet.address,
        });
        await assertWallet();
        hash = await signer.writeContract(request);
      }
      setTx({
        action,
        status: "pending",
        hash,
        message: "Transaction submitted. Waiting for Ethereum confirmation…",
      });
      await waitForTx(hash, action);
    } catch (e) {
      setTx({ action, status: "error", message: errorText(e) });
    } finally {
      txMutex.current = false;
    }
  };
  const switchNetwork = async () => {
    try {
      await wallet.switchChain();
    } catch (e) {
      setTx({
        action: "Switch network",
        status: "error",
        message: errorText(e),
      });
    }
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!wallet.address) setWalletOpen(true);
    else if (wrongChain) void switchNetwork();
    else void transact(approved ? "Lock IMD" : "Approve IMD");
  };
  const positions =
    data?.positions.filter(
      (p) =>
        filter === "all" ||
        (filter === "ready" ? p.canWithdraw : !p.canWithdraw),
    ) ?? [];
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#" aria-label="SitOnHands home">
            <span className="brand-mark">
              <Icon name="hand" size={23} />
            </span>
            SitOnHands<span className="brand-period">.</span>
          </a>
          <nav aria-label="Main navigation">
            <a className="nav-active" href="#lock">
              Lock IMD
            </a>
            <a href="#positions">My positions</a>
            <a href="#how-it-works">How it works</a>
          </nav>
          <div className="header-actions">
            <span className="network">
              <span className="network-dot" />
              Ethereum<span className="network-mainnet"> mainnet</span>
            </span>
            <button
              className="secondary connect-button"
              onClick={() => setWalletOpen(true)}
            >
              <Icon name="wallet" size={16} />
              {wallet.address ? shortAddress(wallet.address) : "Connect wallet"}
            </button>
          </div>
        </div>
      </header>
      <main id="main" className="page">
        <section className="hero" aria-labelledby="page-title">
          <div className="hero-copy">
            <div className="eyebrow">
              <span />A little less impulse. A little more intention.
            </div>
            <h1 id="page-title">
              Give it <em>time.</em>
            </h1>
            <p>
              Put your IMD out of reach, on your terms.
              <br /> Choose a lock. Take a breath. Let the clock do its thing.
            </p>
            <div className="hero-tags">
              <span>
                <Icon name="lock" size={14} />
                No early exit
              </span>
              <span>No yield</span>
              <span>Just time</span>
            </div>
          </div>
          <div className="hero-art">
            <Hourglass />
            <span className="art-caption">PATIENCE, BY DESIGN</span>
          </div>
        </section>
        <section className="stats-strip" aria-label="Vault statistics">
          <div className="stat">
            <span className="stat-label">
              Total locked in the vault <Icon name="lock" size={14} />
            </span>
            <div
              className="stat-value"
              title={
                data
                  ? amountText(data.total, data.decimals, true) + " IMD"
                  : undefined
              }
            >
              {data ? amountText(data.total, data.decimals) : "—"}
              <span>IMD</span>
            </div>
            <span className="stat-note">
              {data
                ? "Held by the contract"
                : loading
                  ? "Reading Ethereum…"
                  : "Live data unavailable"}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">
              Your locked balance <Icon name="wallet" size={14} />
            </span>
            <div
              className="stat-value"
              title={
                wallet.address && data
                  ? amountText(data.locked, data.decimals, true) + " IMD"
                  : undefined
              }
            >
              {wallet.address && data
                ? amountText(data.locked, data.decimals)
                : "—"}
              <span>IMD</span>
            </div>
            <span className="stat-note">
              {!wallet.address
                ? "Connect to see your balance"
                : data
                  ? `${data.positions.length} open ${data.positions.length === 1 ? "position" : "positions"}`
                  : "Waiting for wallet data"}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">
              Your time, your choice <Icon name="clock" size={14} />
            </span>
            <div className="stat-value">
              1–365<span>days</span>
            </div>
            <span className="stat-note">One commitment at a time</span>
          </div>
        </section>
        {readError && (
          <div className="notice data-notice">
            <Icon name="info" size={18} />
            <p>
              {readError} {data && "Displayed balances may be out of date."}
            </p>
            <button
              className="text-button"
              disabled={loading}
              onClick={() => void refresh()}
            >
              {loading ? "Retrying…" : "Retry"}
            </button>
          </div>
        )}
        {wrongChain && (
          <div className="notice warning" role="alert">
            <Icon name="info" />
            <p>
              Your wallet is on another network. Switch to Ethereum mainnet to
              approve, lock, or withdraw.
            </p>
            <button className="secondary" onClick={() => void switchNetwork()}>
              Switch to Ethereum
            </button>
          </div>
        )}
        <div className="workspace-grid">
          <section
            id="lock"
            className="lock-card panel"
            aria-labelledby="lock-title"
          >
            <div className="section-heading">
              <h2 id="lock-title">
                <Icon name="lock" />
                Create a lock
              </h2>
              <span className="small-badge">IMD vault</span>
            </div>
            <p className="section-description">
              A promise to your future self, written on Ethereum.
            </p>
            <form onSubmit={submit} noValidate>
              <fieldset disabled={busy} className="form-fields">
                <div className="amount-label">
                  <label htmlFor="amount">Amount to lock</label>
                  <span>
                    Available:{" "}
                    <span
                      title={
                        data
                          ? amountText(data.balance, data.decimals, true)
                          : undefined
                      }
                    >
                      {wallet.address && data
                        ? amountText(data.balance, data.decimals)
                        : "—"}{" "}
                      IMD
                    </span>
                  </span>
                </div>
                <div
                  className={`amount-control ${errors.amount ? "invalid" : ""}`}
                >
                  <input
                    id="amount"
                    name="amount"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0.00"
                    value={amount}
                    aria-invalid={!!errors.amount}
                    aria-describedby="amount-error"
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setErrors({});
                    }}
                  />
                  <button
                    type="button"
                    className="max-button"
                    disabled={!data || !wallet.address || !!readError}
                    onClick={() => {
                      if (data) {
                        setAmount(
                          amountText(data.balance, data.decimals, true),
                        );
                        setErrors({});
                      }
                    }}
                  >
                    Max
                  </button>
                  <span className="token-label">
                    <span className="token-symbol">i</span>IMD
                  </span>
                </div>
                <p id="amount-error" className="field-error">
                  {errors.amount}
                </p>
                <div className="duration-label">
                  <span id="duration-label">Lock duration</span>
                  <button
                    type="button"
                    className="text-button custom-toggle"
                    onClick={() => {
                      setIsCustom(!isCustom);
                      setErrors({});
                    }}
                    aria-expanded={isCustom}
                    aria-controls="custom-duration"
                  >
                    {isCustom ? "Use presets" : "Custom duration"}
                    <span aria-hidden="true">{isCustom ? "−" : "+"}</span>
                  </button>
                </div>
                <div
                  className="duration-presets"
                  role="group"
                  aria-labelledby="duration-label"
                >
                  {presets.map((day) => (
                    <button
                      type="button"
                      key={day}
                      className={
                        !isCustom && duration === day * 86400
                          ? "duration selected"
                          : "duration"
                      }
                      aria-pressed={!isCustom && duration === day * 86400}
                      onClick={() => {
                        setIsCustom(false);
                        setDuration(day * 86400);
                        setErrors({});
                      }}
                    >
                      {day}
                      <span>{day === 1 ? "day" : "days"}</span>
                    </button>
                  ))}
                </div>
                {isCustom && (
                  <div id="custom-duration" className="custom-duration">
                    <label htmlFor="seconds">Duration in seconds</label>
                    <input
                      id="seconds"
                      name="seconds"
                      inputMode="numeric"
                      autoComplete="off"
                      value={seconds}
                      aria-invalid={!!errors.duration}
                      aria-describedby="duration-hint duration-error"
                      onChange={(e) => {
                        setSeconds(e.target.value);
                        setErrors({});
                      }}
                    />
                    <p id="duration-hint">
                      {MIN_DURATION.toLocaleString()}–
                      {MAX_DURATION.toLocaleString()} seconds · 1–365 days
                    </p>
                  </div>
                )}
                <p id="duration-error" className="field-error">
                  {errors.duration}
                </p>
                <div className="unlock-estimate">
                  <span>
                    <Icon name="clock" size={16} />
                    Estimated unlock
                  </span>
                  <strong>
                    {selectedDuration
                      ? dateText(now + selectedDuration)
                      : "Choose a valid duration"}
                  </strong>
                </div>
                <p className="time-note">
                  Your local time. The lock starts when the transaction
                  confirms.
                </p>
                <div className="commitment">
                  <Icon name="info" size={18} />
                  <p>
                    <strong>Once locked, it stays locked.</strong> Your funds
                    are forcibly held until unlock. No early exit, no yield, and
                    no way to shorten the timer.
                  </p>
                </div>
                <label className="consent">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      setErrors({});
                    }}
                    aria-invalid={!!errors.consent}
                    aria-describedby="consent-error"
                  />
                  <span>I understand I can’t withdraw my IMD early.</span>
                </label>
                <p id="consent-error" className="field-error">
                  {errors.consent}
                </p>
              </fieldset>
              {wallet.address && !wrongChain && (
                <div className="approval-summary">
                  <span>Vault allowance</span>
                  <span
                    title={
                      data
                        ? amountText(data.allowance, data.decimals, true) +
                          " IMD"
                        : undefined
                    }
                  >
                    {data
                      ? `${amountText(data.allowance, data.decimals)} IMD`
                      : "Loading…"}
                  </span>
                </div>
              )}
              {!wallet.address || wrongChain ? (
                <button type="submit" className="primary full">
                  {wrongChain ? "Switch to Ethereum" : "Connect wallet to lock"}
                  <Icon name="arrow" size={18} />
                </button>
              ) : (
                <div className="transaction-steps">
                  <button
                    type="button"
                    className={approved ? "secondary" : "primary"}
                    disabled={busy || approved || !data || !!readError}
                    onClick={() => void transact("Approve IMD")}
                  >
                    <span className="step-number">
                      {approved ? <Icon name="check" size={13} /> : "1"}
                    </span>
                    {approved ? "Approved" : "Approve IMD"}
                  </button>
                  <button
                    type="submit"
                    className={approved ? "primary" : "secondary"}
                    disabled={busy || !approved || !data || !!readError}
                  >
                    <span className="step-number">2</span>Lock IMD
                    <Icon name="lock" size={15} />
                  </button>
                </div>
              )}
              <p className="form-footnote">
                {wallet.address
                  ? "Approve only this amount, then confirm your lock. ETH is needed for gas."
                  : "Your wallet. Your IMD. Your decision."}
              </p>
            </form>
          </section>
          <aside
            id="how-it-works"
            className="how-panel"
            aria-labelledby="how-title"
          >
            <div className="eyebrow">A SIMPLE IDEA</div>
            <h2 id="how-title">
              Less temptation.
              <br /> More commitment.
            </h2>
            <p>You choose how long. The contract takes care of the rest.</p>
            <ol className="how-steps">
              <li>
                <span>01</span>
                <div>
                  <h3>Set your intention</h3>
                  <p>
                    Choose an amount of IMD and a duration from 1 to 365 days.
                  </p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <h3>Make it a commitment</h3>
                  <p>
                    Approve your IMD, then lock it. Your tokens stay in the
                    vault until time is up.
                  </p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <h3>Come back when it’s time</h3>
                  <p>
                    Withdraw your original IMD after unlock. No rewards to
                    claim. No extra steps.
                  </p>
                </div>
              </li>
            </ol>
            <div className="contract-note">
              <span className="outline-icon">
                <Icon name="lock" size={18} />
              </span>
              <div>
                <strong>Rules written in code.</strong>
                <p>No admin. No early exit. No yield.</p>
                <External href={explorer("address", VAULT)}>
                  View the vault on Etherscan
                </External>
              </div>
            </div>
          </aside>
        </div>
        <div
          className={`transaction-notice ${tx ? "visible" : ""} ${tx?.status === "error" ? "is-error" : ""}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {tx && (
            <>
              <Icon
                name={
                  tx.status === "success"
                    ? "check"
                    : tx.status === "error"
                      ? "info"
                      : "clock"
                }
              />
              <div>
                <strong>
                  {tx.action} ·{" "}
                  {tx.status === "wallet"
                    ? "Wallet confirmation"
                    : tx.status === "pending"
                      ? "Pending"
                      : tx.status === "unconfirmed"
                        ? "Receipt not confirmed"
                        : tx.status === "success"
                          ? "Confirmed"
                          : "Not completed"}
                </strong>
                <p>{tx.message}</p>
                {tx.hash && (
                  <External href={explorer("tx", tx.hash)}>
                    View transaction on Etherscan
                  </External>
                )}
                {tx.status === "unconfirmed" && tx.hash && (
                  <button
                    className="secondary"
                    onClick={() => {
                      setTx({
                        ...tx,
                        status: "pending",
                        message: "Checking transaction receipt…",
                      });
                      void waitForTx(tx.hash!, tx.action);
                    }}
                  >
                    Check receipt again
                  </button>
                )}
              </div>
              {!busy && (
                <button
                  className="icon-button"
                  aria-label="Dismiss transaction status"
                  onClick={() => setTx(undefined)}
                >
                  <Icon name="close" size={18} />
                </button>
              )}
            </>
          )}
        </div>
        <section
          id="positions"
          className="positions panel"
          aria-labelledby="positions-title"
        >
          <div className="section-heading">
            <h2 id="positions-title">
              My positions{" "}
              <span className="count-badge">{data?.positions.length ?? 0}</span>
            </h2>
            <button
              className="text-button"
              disabled={loading}
              onClick={() => void refresh()}
            >
              <Icon name="refresh" size={15} />
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>
          <div className="positions-subhead">
            <p>Your commitments, one lock at a time.</p>
            {wallet.address && !!data?.positions.length && (
              <div
                className="position-filters"
                role="group"
                aria-label="Filter positions"
              >
                {(["all", "locked", "ready"] as const).map((f) => (
                  <button
                    key={f}
                    aria-pressed={filter === f}
                    className={filter === f ? "filter active" : "filter"}
                    onClick={() => setFilter(f)}
                  >
                    {f === "all" ? "All" : f === "locked" ? "Locked" : "Ready"}
                  </button>
                ))}
              </div>
            )}
          </div>
          {!wallet.address ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Icon name="wallet" size={24} />
              </div>
              <h3>Your future self will see you here.</h3>
              <p>
                Connect your wallet to view your locks
                <br />
                and see when your IMD is ready to withdraw.
              </p>
              <button className="secondary" onClick={() => setWalletOpen(true)}>
                Connect wallet
                <Icon name="arrow" size={16} />
              </button>
            </div>
          ) : !data ? (
            <div className="empty-state">
              <Icon name={loading ? "clock" : "info"} size={26} />
              <h3>
                {loading
                  ? "Reading your positions…"
                  : "Your positions couldn’t be loaded."}
              </h3>
              <p>
                {loading
                  ? "Checking the vault on Ethereum."
                  : "Check your connection and use Refresh to try again."}
              </p>
            </div>
          ) : !positions.length ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Icon name="clock" size={24} />
              </div>
              <h3>
                {data.positions.length
                  ? "No positions in this view."
                  : "A little patience starts here."}
              </h3>
              <p>
                {data.positions.length
                  ? "Choose All to see your other locks."
                  : "Create your first lock above. It will appear here once confirmed."}
              </p>
              {data.positions.length ? (
                <button className="secondary" onClick={() => setFilter("all")}>
                  Show all positions
                </button>
              ) : (
                <a className="secondary" href="#lock">
                  Create a lock
                  <Icon name="arrow" size={16} />
                </a>
              )}
            </div>
          ) : (
            <div className="position-list">
              {positions.map((p) => (
                <article className="position-row" key={p.id.toString()}>
                  <div>
                    <span className="position-label">
                      Position #{p.id.toString()}
                    </span>
                    <strong
                      className="position-amount"
                      title={amountText(p.amount, data.decimals, true) + " IMD"}
                    >
                      {amountText(p.amount, data.decimals)} <small>IMD</small>
                    </strong>
                    <details className="exact-amount">
                      <summary>Exact amount</summary>
                      <span>
                        {amountText(p.amount, data.decimals, true)} IMD
                      </span>
                    </details>
                  </div>
                  <div className="position-time">
                    <span className="position-label">
                      Unlocks · your local time
                    </span>
                    <time
                      dateTime={new Date(
                        Number(p.unlockTime) * 1000,
                      ).toISOString()}
                    >
                      {dateText(Number(p.unlockTime))}
                    </time>
                    <span
                      className={p.canWithdraw ? "ready-label" : "countdown"}
                    >
                      {p.canWithdraw ? (
                        <>
                          <Icon name="check" size={13} />
                          Ready to withdraw
                        </>
                      ) : (
                        countdown(p.unlockTime, now)
                      )}
                    </span>
                  </div>
                  <button
                    className="secondary withdraw-button"
                    disabled={
                      !p.canWithdraw || wrongChain || busy || !!readError
                    }
                    onClick={() => void transact("Withdraw", p)}
                  >
                    {p.canWithdraw ? (
                      "Withdraw"
                    ) : (
                      <>
                        <Icon name="lock" size={14} />
                        Locked
                      </>
                    )}
                  </button>
                </article>
              ))}
            </div>
          )}
          <div className="positions-footer">
            <Icon name="info" size={14} />
            <span>
              Locks can’t be transferred or cancelled. Matured IMD stays in the
              vault until you withdraw.
            </span>
          </div>
        </section>
        <div className="closing-note">
          <span />A little distance from the sell button.
          <span />
        </div>
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <span className="footer-brand">
            <Icon name="hand" size={18} />
            SitOnHands
            <span className="footer-by">An IdentityMD experiment</span>
          </span>
          <div>
            <External href={explorer("address", VAULT)}>
              Vault contract
            </External>
            <External href={explorer("address", TOKEN)}>IMD token</External>
            <External href="https://github.com/identity-md-launches/launch-849-title-sitonhands-voluntary/blob/65fc59caa5a969fc1e3cf38fe3ee95b7a5cb6ca0/src/SitOnHands.sol">
              Source code
            </External>
          </div>
        </div>
      </footer>
      <WalletDialog
        open={walletOpen}
        onClose={() => setWalletOpen(false)}
        wallet={wallet}
        config={config}
      />
    </>
  );
}
