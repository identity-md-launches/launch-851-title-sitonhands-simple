import { useEffect, useRef, useState } from "react";
import type { Config } from "./chain";
import { errorText, shortAddress, explorer } from "./chain";
import type { Provider, useWallet } from "./wallet";
import { Icon } from "./Icons";

type Props = {
  open: boolean;
  onClose: () => void;
  wallet: ReturnType<typeof useWallet>;
  config: Config;
};
export default function WalletDialog({ open, onClose, wallet, config }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [projectId, setProjectId] = useState("");
  const [uri, setUri] = useState("");
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);
  const attempt = useRef(0);
  const pendingProvider = useRef<
    { disconnect: () => Promise<void> } | undefined
  >(undefined);
  useEffect(() => {
    if (open) {
      setError("");
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
      attempt.current++;
      setBusy(false);
      setUri("");
      setQr("");
      void pendingProvider.current?.disconnect().catch(() => {});
      pendingProvider.current = undefined;
    }
  }, [open]);
  const connectWC = async () => {
    const id = config.walletConnectProjectId || projectId.trim();
    if (!/^[a-f0-9]{32}$/i.test(id)) {
      setError(
        "Enter a 32-character WalletConnect project ID, or use a browser wallet.",
      );
      return;
    }
    setError("");
    setBusy(true);
    const thisAttempt = ++attempt.current;
    try {
      const [{ EthereumProvider }, { default: QRCode }] = await Promise.all([
        import("@walletconnect/ethereum-provider"),
        import("qrcode"),
      ]);
      if (thisAttempt !== attempt.current) return;
      const p = await EthereumProvider.init({
        projectId: id,
        optionalChains: [1],
        showQrModal: false,
        rpcMap: { 1: config.rpcUrls[0] },
        metadata: {
          name: "SitOnHands",
          description: "Voluntary timed IMD locks on Ethereum",
          url: location.origin,
          icons: [new URL("favicon.svg", location.href).href],
        },
      });
      if (thisAttempt !== attempt.current) {
        await p.disconnect().catch(() => {});
        return;
      }
      pendingProvider.current = p;
      p.on("display_uri", async (value: string) => {
        const image = await QRCode.toDataURL(value, {
          width: 260,
          margin: 2,
          errorCorrectionLevel: "M",
        });
        if (thisAttempt === attempt.current) {
          setUri(value);
          setQr(image);
        }
      });
      await p.connect();
      if (thisAttempt !== attempt.current) {
        await p.disconnect();
        return;
      }
      // Both libraries implement EIP-1193, but type their event maps differently.
      await wallet.connect(p as unknown as Provider);
      pendingProvider.current = undefined;
      onClose();
    } catch (e) {
      if (thisAttempt === attempt.current) {
        setError(errorText(e));
        void pendingProvider.current?.disconnect().catch(() => {});
        pendingProvider.current = undefined;
        setUri("");
        setQr("");
      }
    } finally {
      if (thisAttempt === attempt.current) setBusy(false);
    }
  };
  return (
    <dialog
      ref={dialog}
      onCancel={onClose}
      onClose={onClose}
      aria-labelledby="wallet-title"
      className="wallet-dialog"
    >
      <div className="section-heading">
        <h2 id="wallet-title">
          {wallet.address ? "Your wallet" : "Connect a wallet"}
        </h2>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close wallet dialog"
        >
          <Icon name="close" />
        </button>
      </div>
      {wallet.address ? (
        <>
          <p>
            Connected on{" "}
            {wallet.chainId === 1
              ? "Ethereum mainnet"
              : `chain ${wallet.chainId}`}
            .
          </p>
          <a
            className="wallet-address"
            href={explorer("address", wallet.address)}
            target="_blank"
            rel="noreferrer"
          >
            {wallet.address}
            <Icon name="external" size={16} />
          </a>
          <button
            className="secondary full"
            onClick={() => {
              wallet.disconnect();
              onClose();
            }}
          >
            Disconnect {shortAddress(wallet.address)}
          </button>
        </>
      ) : (
        <>
          <p>
            Connect to view your IMD and create a lock.
            <br />
            Ethereum mainnet only.
          </p>
          <div className="wallet-options">
            {wallet.wallets.map((w) => (
              <button
                className="wallet-option"
                key={w.id}
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  setError("");
                  try {
                    await wallet.connect(w.provider);
                    onClose();
                  } catch (e) {
                    setError(errorText(e));
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <Icon name="wallet" />
                <span>{w.name}</span>
                <Icon name="arrow" />
              </button>
            ))}
            {!wallet.wallets.length && (
              <div className="wallet-hint">
                No browser wallet found. Open this site in your wallet’s
                browser, or connect with WalletConnect below.
              </div>
            )}
            <button
              className="wallet-option"
              onClick={connectWC}
              disabled={busy}
            >
              <span className="wc-icon" aria-hidden="true">
                ≈
              </span>
              <span>{busy ? "Waiting for wallet…" : "WalletConnect"}</span>
              <Icon name="arrow" />
            </button>
          </div>
          {!config.walletConnectProjectId && (
            <details className="wc-config">
              <summary>WalletConnect setup</summary>
              <p>
                This site needs a public project ID to use WalletConnect. A
                browser wallet works without one.
              </p>
              <label htmlFor="project-id">WalletConnect project ID</label>
              <input
                id="project-id"
                autoComplete="off"
                spellCheck={false}
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="32-character public project ID"
              />
              <a
                href="https://dashboard.reown.com"
                target="_blank"
                rel="noreferrer"
              >
                Get a project ID from Reown <Icon name="external" size={13} />
              </a>
            </details>
          )}
          {uri && (
            <div className="qr-connect">
              <img
                src={qr}
                width="260"
                height="260"
                alt="Scan this WalletConnect QR code with your wallet"
              />
              <p>Scan with your wallet app.</p>
              <a
                className="secondary"
                href={`https://metamask.app.link/wc?uri=${encodeURIComponent(uri)}`}
              >
                Open MetaMask on this device <Icon name="external" size={14} />
              </a>
              <button
                className="text-button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(uri);
                    setCopied(true);
                  } catch {
                    setError(
                      "Clipboard is unavailable. Scan the QR code with your wallet.",
                    );
                  }
                }}
              >
                {copied ? "Connection link copied" : "Copy connection link"}
              </button>
            </div>
          )}
        </>
      )}
      <p role="status" className="error-text">
        {error}
      </p>
      <p className="dialog-footnote">
        <Icon name="lock" size={14} /> Connecting never moves your funds.
      </p>
    </dialog>
  );
}
