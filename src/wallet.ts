import { useCallback, useEffect, useRef, useState } from "react";
import { isAddress, type Address, type EIP1193Provider } from "viem";

export type Provider = EIP1193Provider & { disconnect?: () => Promise<void> };
export interface InjectedWallet {
  name: string;
  id: string;
  provider: Provider;
}
declare global {
  interface Window {
    ethereum?: Provider;
  }
}
export function useWallet() {
  const [wallets, setWallets] = useState<InjectedWallet[]>([]);
  const [provider, setProvider] = useState<Provider>();
  const [address, setAddress] = useState<Address>();
  const [chainId, setChainId] = useState<number>();
  const generation = useRef(0);
  useEffect(() => {
    const announce = (event: Event) => {
      const { info, provider: p } = (
        event as CustomEvent<{
          info: { name: string; uuid: string };
          provider: Provider;
        }>
      ).detail;
      setWallets((current) =>
        current.some((w) => w.provider === p)
          ? current
          : [
              ...current.filter((w) => w.id !== "legacy"),
              { name: info.name, id: info.uuid, provider: p },
            ],
      );
    };
    window.addEventListener("eip6963:announceProvider", announce);
    window.dispatchEvent(new Event("eip6963:requestProvider"));
    if (window.ethereum)
      setWallets((current) =>
        current.length
          ? current
          : [
              {
                name: "Browser wallet",
                id: "legacy",
                provider: window.ethereum!,
              },
            ],
      );
    return () =>
      window.removeEventListener("eip6963:announceProvider", announce);
  }, []);
  useEffect(() => {
    if (!provider) return;
    const accounts = (list: string[]) => {
      generation.current++;
      setAddress(list[0] && isAddress(list[0]) ? list[0] : undefined);
    };
    const chain = (id: string) => {
      generation.current++;
      setChainId(Number(id));
    };
    const disconnected = () => {
      generation.current++;
      setAddress(undefined);
      setProvider(undefined);
      setChainId(undefined);
    };
    provider.on("accountsChanged", accounts);
    provider.on("chainChanged", chain);
    provider.on("disconnect", disconnected);
    return () => {
      provider.removeListener("accountsChanged", accounts);
      provider.removeListener("chainChanged", chain);
      provider.removeListener("disconnect", disconnected);
    };
  }, [provider]);
  const connect = useCallback(async (p: Provider) => {
    const attempt = ++generation.current;
    const accounts = await p.request({ method: "eth_requestAccounts" });
    const id = await p.request({ method: "eth_chainId" });
    if (attempt !== generation.current) return;
    if (!accounts[0])
      throw new Error(
        "No wallet account was shared. Unlock your wallet and try again.",
      );
    setProvider(p);
    setAddress(accounts[0]);
    setChainId(Number(id));
  }, []);
  const disconnect = useCallback(() => {
    generation.current++;
    void provider?.disconnect?.().catch(() => {});
    setProvider(undefined);
    setAddress(undefined);
    setChainId(undefined);
  }, [provider]);
  const switchChain = useCallback(async () => {
    if (!provider) return;
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x1" }],
    });
    setChainId(Number(await provider.request({ method: "eth_chainId" })));
  }, [provider]);
  return {
    wallets,
    provider,
    address,
    chainId,
    connect,
    disconnect,
    switchChain,
  };
}
