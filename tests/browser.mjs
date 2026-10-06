import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { startPreview } from "../scripts/preview.mjs";
import { fixture, injectWallet, OTHER } from "./fixture.mjs";

const { server, url } = await startPreview();
const localChrome = "/opt/ms-playwright/chromium-1247/chrome-linux64/chrome";
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.BROWSER_EXECUTABLE ||
    (existsSync(localChrome) ? localChrome : undefined),
  args: ["--no-sandbox"],
});
const results = [];
const check = (name, details = "") => {
  results.push({ name, result: "pass", details });
  console.log("PASS", name, details);
};
await mkdir("test/scratch", { recursive: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  const errors = [];
  const missingResources = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.url().startsWith(url) && r.status() >= 400)
      missingResources.push(r.url());
  });
  const { state, rpc } = fixture();
  const fulfill = async (route) => {
    const payload = route.request().postDataJSON();
    function answer(request) {
      try {
        return { jsonrpc: "2.0", id: request.id, result: rpc(request) };
      } catch (e) {
        return {
          jsonrpc: "2.0",
          id: request.id,
          error: { code: -32000, message: e.message },
        };
      }
    }
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify(
        Array.isArray(payload) ? payload.map(answer) : answer(payload),
      ),
    });
  };
  await page.route("**/fixture-rpc", fulfill);
  await page.route("https://ethereum-rpc.publicnode.com/**", fulfill);
  await page.route("https://eth.drpc.org/**", fulfill);
  await injectWallet(page);
  await page.goto(url);
  await page.getByText("Held by the contract", { exact: true }).waitFor();
  await page.keyboard.press("Tab");
  assert.equal(await page.locator(":focus").textContent(), "Skip to content");
  await page.keyboard.press("Enter");
  check("Keyboard skip link reaches main content");
  const connect = page.locator(".connect-button");
  await connect.click();
  await page.getByRole("dialog").waitFor();
  await page.keyboard.press("Escape");
  assert.equal(
    await connect.evaluate((el) => document.activeElement === el),
    true,
  );
  check("Wallet dialog opens, Escape closes, focus returns");
  await connect.click();
  await page
    .getByRole("button", { name: "WalletConnect", exact: true })
    .click();
  await page
    .getByText("Enter a 32-character WalletConnect project ID", {
      exact: false,
    })
    .waitFor();
  await page.getByRole("button", { name: "Browser wallet" }).click();
  await page.getByText("Position #0", { exact: true }).waitFor();
  await page.getByText("Position #1", { exact: true }).waitFor();
  check("Injected wallet connects; open and matured positions load");
  assert.equal(
    await page
      .getByRole("button", { name: "Withdraw", exact: true })
      .isEnabled(),
    true,
  );
  assert.equal(
    await page
      .locator(".withdraw-button")
      .filter({ hasText: "Locked" })
      .isDisabled(),
    true,
  );
  await page.getByRole("button", { name: "Ready", exact: true }).click();
  assert.equal(await page.locator(".position-row").count(), 1);
  await page.getByRole("button", { name: "All", exact: true }).click();
  check("Filters work; only contract-matured positions can withdraw");
  await page.getByRole("button", { name: "Approve IMD", exact: false }).click();
  assert.equal(
    await page.locator("#amount").getAttribute("aria-invalid"),
    "true",
  );
  assert.equal(
    await page
      .locator("#amount")
      .evaluate((el) => document.activeElement === el),
    true,
  );
  await page.locator("#amount").fill("0.0000000000000000001");
  await page.getByRole("button", { name: "Approve IMD", exact: false }).click();
  await page.getByText("Use no more than 18 decimal places.").waitFor();
  await page.locator("#amount").fill("10001");
  await page.getByRole("button", { name: "Approve IMD", exact: false }).click();
  await page
    .getByText("This amount exceeds your available IMD.", { exact: false })
    .waitFor();
  await page.getByRole("button", { name: "Max", exact: true }).click();
  assert.equal(await page.locator("#amount").inputValue(), "10000");
  await page.locator("#amount").fill("100");
  await page
    .getByRole("button", { name: "Custom duration", exact: false })
    .click();
  await page.locator("#seconds").fill("86399");
  await page.getByRole("button", { name: "Approve IMD", exact: false }).click();
  await page
    .getByText("Choose 86,400–31,536,000 seconds", { exact: false })
    .waitFor();
  await page.locator("#seconds").fill("31536001");
  await page.getByRole("button", { name: "Approve IMD", exact: false }).click();
  assert.equal(
    await page.locator("#seconds").getAttribute("aria-invalid"),
    "true",
  );
  await page.locator("#seconds").fill("86400");
  check("Exact amount, precision, balance, Max and duration-bound validation");
  await page.evaluate(() => {
    window.testWallet.rejectNext = true;
  });
  await page.getByRole("button", { name: "Approve IMD", exact: false }).click();
  await page
    .getByText("Request declined in your wallet.", { exact: false })
    .waitFor();
  assert.equal(state.sent.length, 0);
  check("Wallet rejection is recoverable and sends nothing");
  state.receiptPending = true;
  await page.getByRole("button", { name: "Approve IMD", exact: false }).click();
  await page.getByText("Transaction submitted.", { exact: false }).waitFor();
  assert.equal(
    await page
      .getByRole("button", { name: "Approve IMD", exact: false })
      .isDisabled(),
    true,
  );
  assert.equal(state.sent[0].functionName, "approve");
  assert.equal(
    state.sent[0].args[0].toLowerCase(),
    "0x20bcc5c678b0beea9a042cd03e3abc36d00e734a",
  );
  assert.equal(state.sent[0].args[1], 100n * 10n ** 18n);
  state.receiptPending = false;
  await page
    .getByText("Approval confirmed.", { exact: false })
    .waitFor({ timeout: 20000 });
  check(
    "Approval is exact, separate from locking, with pending and confirmed states",
  );
  await page.getByRole("button", { name: "Lock IMD", exact: false }).click();
  await page
    .getByText("Confirm that your IMD cannot be withdrawn early.")
    .waitFor();
  assert.equal(state.sent.length, 1);
  await page.locator("#consent").check();
  await page.getByRole("button", { name: "Lock IMD", exact: false }).click();
  await page.getByText("Your IMD is locked.", { exact: false }).waitFor();
  await page.getByText("Position #3", { exact: true }).waitFor();
  assert.equal(state.sent[1].functionName, "lock");
  assert.deepEqual(state.sent[1].args, [100n * 10n ** 18n, 86400n]);
  check(
    "Irreversible terms required; lock calldata and refreshed new position are correct",
  );
  await page.getByRole("button", { name: "Withdraw", exact: true }).click();
  await page.getByText("Withdrawal confirmed.", { exact: false }).waitFor();
  await page
    .getByText("Position #0", { exact: true })
    .waitFor({ state: "hidden" });
  assert.equal(state.sent[2].functionName, "withdraw");
  assert.deepEqual(state.sent[2].args, [0n]);
  check("Matured withdrawal returns principal and refreshes positions");
  await page.evaluate(() => {
    window.testWallet.chainId = "0x89";
    window.testWallet.emit("chainChanged", "0x89");
  });
  await page
    .getByText("Your wallet is on another network.", { exact: false })
    .waitFor();
  assert.equal(
    await page
      .getByRole("button", { name: "Approve IMD", exact: false })
      .count(),
    0,
  );
  await page
    .getByRole("button", { name: "Switch to Ethereum", exact: true })
    .first()
    .click();
  await page
    .getByRole("button", { name: "Approve IMD", exact: false })
    .waitFor();
  check("Wrong network refuses writes and switch prompt restores mainnet");
  await page.locator("#amount").fill("5");
  state.revertNext = true;
  await page.getByRole("button", { name: "Approve IMD", exact: false }).click();
  await page.getByText("Transaction reverted.", { exact: false }).waitFor();
  check("Reverted receipt never appears as success");
  for (const width of [1440, 800, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    assert.equal(overflow, false, `overflow at ${width}`);
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    await writeFile(
      `test/scratch/axe-${width}.json`,
      JSON.stringify(scan.violations, null, 2),
    );
    assert.equal(
      scan.violations.length,
      0,
      JSON.stringify(
        scan.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      ),
    );
    await page.locator("h1").click();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `test/scratch/connected-${width}.png`,
      fullPage: true,
    });
    check(
      `Rendered ${width}px: no horizontal overflow; axe AA scan has no violations`,
    );
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page
      .locator(".connect-button")
      .evaluate((el) => getComputedStyle(el).transitionDuration),
    "0s",
  );
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "";
  });
  check("Reduced motion removes transitions; 200% text size at 320px reflows");
  await page.evaluate((account) => {
    window.testWallet.account = account;
    window.testWallet.emit("accountsChanged", [account]);
  }, OTHER);
  await page.getByText("A little patience starts here.").waitFor();
  assert.equal(await page.locator(".position-row").count(), 0);
  check("Account change clears the previous wallet positions");
  state.failReads = true;
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await page
    .getByText("Unable to reach Ethereum.", { exact: false })
    .waitFor({ timeout: 20000 });
  assert.equal(
    await page
      .getByRole("button", { name: "Approve IMD", exact: false })
      .isDisabled(),
    true,
  );
  state.failReads = false;
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await page.locator(".data-notice").waitFor({ state: "hidden" });
  check("RPC failure blocks stale writes; Retry recovers");
  assert.deepEqual(errors, []);
  assert.deepEqual(missingResources, []);
  check(
    "Production subpath has no JavaScript errors or missing local resources",
  );
  await writeFile(
    "test/scratch/browser-results.json",
    JSON.stringify(results, null, 2),
  );
} catch (error) {
  for (const context of browser.contexts())
    for (const page of context.pages()) {
      console.error(await page.locator("body").innerText());
      await page.screenshot({
        path: "test/scratch/failure.png",
        fullPage: true,
      });
    }
  throw error;
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
