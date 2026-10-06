# SitOnHands

A static Ethereum mainnet dapp for voluntary IMD locks. Connect a wallet, approve the exact amount of IMD, lock it for 1–365 days, and withdraw each position after the contract says it is ready. There is no yield, early exit, admin interface, token deployment, or backend.

## Contracts

| Contract | Ethereum mainnet address |
| --- | --- |
| SitOnHands vault | [`0x20bcc5c678b0beea9a042cd03e3abc36d00e734a`](https://etherscan.io/address/0x20bcc5c678b0beea9a042cd03e3abc36d00e734a) |
| IMD token | [`0xD34a99Bc0f67aE1bbd63C660e6d0b0dd03E263B7`](https://etherscan.io/address/0xD34a99Bc0f67aE1bbd63C660e6d0b0dd03E263B7) |

Chain ID is fixed to **1**. The application verifies the read connection and vault token, reads token decimals, and rechecks the wallet account and chain before sending transactions. A wallet on another network gets a switch prompt.

The vault ABI in `src/chain.ts` is transcribed from [`src/SitOnHands.sol` at commit `65fc59caa5a969fc1e3cf38fe3ee95b7a5cb6ca0`](https://github.com/identity-md-launches/launch-849-title-sitonhands-voluntary/blob/65fc59caa5a969fc1e3cf38fe3ee95b7a5cb6ca0/src/SitOnHands.sol). An unchanged source snapshot is included in `contracts/SitOnHands.sol`. No contracts are redeployed.

## Install and run

Requires Node.js **22.12 or newer** and npm. From the project directory:

```sh
npm ci
npm run dev
```

Vite prints the development URL. For phone testing on the same network, use the printed network URL; production wallet access should use HTTPS. Keep generated dependency directories out of the submission. The delivered repository contains no `node_modules`, package cache, registry mirror, or submodule.

## WalletConnect and RPC configuration

Edit `public/config.json` before publishing:

```json
{
  "walletConnectProjectId": "YOUR_PUBLIC_REOWN_PROJECT_ID",
  "rpcUrls": ["https://ethereum-rpc.publicnode.com", "https://eth.drpc.org"]
}
```

Obtain your own public project ID from the [Reown dashboard](https://dashboard.reown.com/) and allowlist the site's actual origin. This is a public identifier, not a private key. Never include private credentials in this static application.

**No project ID was supplied with this assignment.** The default value is empty. Injected wallets work without it. The wallet dialog also accepts a public project ID under “WalletConnect setup”; with a configured ID, it offers a QR code, a MetaMask mobile link, and a copyable pairing URI. The SDK and QR generator load only when WalletConnect is selected with a valid ID. See the [provider documentation](https://docs.reown.com/advanced/providers/ethereum).

The public RPCs provide disconnected reads; a connected mainnet wallet provides reads and transaction requests through its EIP-1193 provider. You may configure other browser-accessible HTTPS mainnet RPCs. HTTP status, rate limits, CORS policy, and provider availability can affect reads. Errors display a Retry action and disable transactions that would depend on stale data.

## Build, preview, and publish

```sh
npm run typecheck
npm run build
npm run preview
```

The finished production export is included in **`dist/` alongside source and `package-lock.json`**. Publish the **contents of `dist/`** to an HTTPS static host, or set the host's document root to `dist`. The publisher does not need to install dependencies or rebuild. Keep `index.html`, `config.json`, `favicon.svg`, and the entire `assets/` directory together.

Vite uses `base: './'`. Scripts, styles, font, icon, lazy WalletConnect chunks, and runtime configuration use relative URLs. All navigation stays on one page with hash anchors; no server route rewriting is needed. The export was checked at `/preview/`, including its lazy asset graph. Rebuild whenever source or `public/config.json` changes and replace the previous export as a whole. Deployment configuration may also be changed in `dist/config.json`; mirror it into `public/config.json` to preserve it on rebuild.

## Behavior

- Amounts use integer token units, with no floating-point conversion before transactions. Invalid, zero, excessive, or over-precision amounts get inline errors. Max uses the exact wallet balance.
- Presets are 1, 7, 30, 90, and 365 days. Custom duration accepts whole seconds from **86,400 to 31,536,000**, inclusive. The displayed local-time deadline is an estimate; the mined transaction determines the actual unlock time.
- Approval grants the vault only the entered amount. If allowance is already sufficient, the approval step is marked complete. Lock is a separate wallet transaction and requires acknowledging the irreversible lock terms. ETH is needed for gas.
- Reads use one block snapshot. The app scans position IDs newest-first in batches of 60 and stops only when all of the account's outstanding locked balance is accounted for. Withdrawn positions are omitted. This avoids an event indexer or a guessed deployment block, but may be slow for wallets whose locks are old in a very large vault.
- Matured positions are enabled by the contract's `canWithdraw` view, rechecked before withdrawal. The wall-clock countdown never grants withdrawal permission. Successful receipts refresh the balances and positions. Background reads run every 20 seconds after the previous poll completes, while the tab is visible.
- Transactions show wallet confirmation, pending, confirmed, reverted/rejected, and unconfirmed receipt states, with Etherscan links. Unknown receipt outcomes block another write until rechecked. Speed-ups are tracked; cancellations and unrelated replacements are not reported as successful locks. Transaction history and wallet selection are not persisted across a page reload; inspect your wallet or Etherscan if you reload during a pending transaction.

## Validation

```sh
npm test
npx playwright install chromium
npm run test:browser
```

For an existing Chromium installation, set `BROWSER_EXECUTABLE` to its path. The browser suite starts and closes its own local server, serves the **production `dist/`** at `/preview/`, and uses deterministic injected-wallet/RPC fixtures. It does not send transactions to Ethereum. Test output goes to disposable `test/scratch/`.

Actual results and remaining limits are recorded in [artifacts/validation.md](artifacts/validation.md). The final build and explicit typecheck passed, as did seven unit/integration checks and the production browser interaction suite. Browser checks include 1440, 800, 390, and 320 pixel widths, accessibility scans, wallet/transaction flows, reduced motion, and enlarged-text reflow. Live browser reads reached Ethereum successfully; no real funds were approved, locked, or withdrawn. Real WalletConnect pairing and physical phone wallets remain unverified without a deployment project ID and a participating wallet.

The contributor build ran in `/tmp/sitonhands-build`, with its npm cache outside the repository, to honor the assignment's restriction on touching repository dependency directories. Only manifests, source, complete export, tests, and documentation are delivered. No ignore files were changed.

## Design and attribution

See [DESIGN.md](DESIGN.md) for the implemented tokens, components, typography, and responsive rules, and [artifacts/validation.md](artifacts/validation.md) for the six-domain Better Interface review. Icons and the hourglass illustration are local SVG; Inter is bundled locally under the SIL Open Font License. There are no runtime font or image CDNs.

Design guidance is adapted from Jakub Krehel's **Better Interface**, MIT, commit `267330e1adfc66a718fb65fa6918c1f06d0a689e`. Documentation guidance is adapted from Paul Bakaus's **Impeccable**, Apache-2.0, commit `9d715cc4f5564a990ca8345abfdd5df6dc9b41c8`. Attribution and licenses are retained under `artifacts/licenses/`.
