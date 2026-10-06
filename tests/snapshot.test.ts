import { test } from "node:test";
import assert from "node:assert/strict";
import { makeClient, defaults, readSnapshot } from "../src/chain";
import type { Address, EIP1193Provider } from "viem";
// Plain JS fixture is shared with the browser suite, never included in the app.
import { fixture, ACCOUNT, OTHER } from "./fixture.mjs";

test("positions are owned, outstanding and eligible at one snapshot block", async () => {
  const { rpc } = fixture();
  const client = makeClient(defaults, {
    request: async (request: unknown) => rpc(request),
  } as EIP1193Provider);
  const snapshot = await readSnapshot(client, ACCOUNT as Address);
  assert.equal(snapshot.locked, 1750n * 10n ** 18n);
  assert.deepEqual(
    snapshot.positions.map((p) => [p.id, p.canWithdraw]),
    [
      [1n, false],
      [0n, true],
    ],
  );
  const empty = await readSnapshot(client, OTHER as Address);
  assert.equal(empty.locked, 0n);
  assert.deepEqual(empty.positions, []);
});
test("position discovery scans multiple batches without losing older owned positions", async () => {
  const { rpc, state } = fixture();
  for (let i = 0; i < 125; i++)
    state.positions.push({
      owner: OTHER,
      amount: 1n,
      unlock: 0n,
      withdrawn: false,
    });
  const snapshot = await readSnapshot(
    makeClient(defaults, {
      request: async (r: unknown) => rpc(r),
    } as EIP1193Provider),
    ACCOUNT as Address,
  );
  assert.deepEqual(
    snapshot.positions.map((p) => p.id),
    [1n, 0n],
  );
});
test("RPC failures and wrong-chain read connections never fabricate empty balances", async () => {
  const { rpc, state } = fixture();
  state.failReads = true;
  await assert.rejects(
    readSnapshot(
      makeClient(defaults, {
        request: async (r: unknown) => rpc(r),
      } as EIP1193Provider),
      ACCOUNT as Address,
    ),
  );
  await assert.rejects(
    readSnapshot(
      makeClient(defaults, {
        request: async () => "0x89",
      } as unknown as EIP1193Provider),
      ACCOUNT as Address,
    ),
    /not on Ethereum mainnet/,
  );
});
