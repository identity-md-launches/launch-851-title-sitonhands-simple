import { test } from "node:test";
import assert from "node:assert/strict";
import {
  amountValue,
  amountText,
  durationValue,
  MAX_DURATION,
  MIN_DURATION,
  vaultAbi,
  VAULT,
  TOKEN,
} from "../src/chain";
import { encodeFunctionData } from "viem";

test("amount parsing is exact and rejects rounding, exponent notation and zero", () => {
  assert.equal(
    amountValue("123456789.123456789123456789", 18),
    123456789123456789123456789n,
  );
  assert.equal(amountValue(".5", 6), 500000n);
  for (const input of ["0", "-1", "1e18", "1,000", "Infinity", "", "0.1234567"])
    assert.throws(() => amountValue(input, 6));
  assert.throws(() => amountValue((2n ** 256n).toString(), 0));
});
test("duration bounds are inclusive; seconds must be whole", () => {
  assert.equal(durationValue(MIN_DURATION), MIN_DURATION);
  assert.equal(durationValue(String(MAX_DURATION)), MAX_DURATION);
  for (const input of ["86399", "31536001", "86400.1", "1e6", "", "-86400"])
    assert.throws(() => durationValue(input));
});
test("small and large IMD values retain an exact accessible representation", () => {
  assert.equal(amountText(1n, 18), "<0.0001");
  assert.equal(amountText(1n, 18, true), "0.000000000000000001");
  assert.equal(
    amountText(123456789123456789123456789n, 18, true),
    "123456789.123456789123456789",
  );
  assert.equal(amountText(1234000000000000000000n, 18), "1,234");
});
test("production calls use the supplied vault and source-derived signatures", () => {
  assert.equal(VAULT, "0x20bcc5c678b0beea9a042cd03e3abc36d00e734a");
  assert.equal(TOKEN, "0xd34a99bc0f67ae1bbd63c660e6d0b0dd03e263b7");
  assert.equal(
    encodeFunctionData({
      abi: vaultAbi,
      functionName: "withdraw",
      args: [0n],
    }).slice(0, 10),
    "0x2e1a7d4d",
  );
});
