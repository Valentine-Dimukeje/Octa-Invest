import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { authFetch } from "../utils/authFetch";

export const WalletContext = createContext({
  walletBalance: 0,
  profitBalance: 0,
  totalBalance: 0,
  refreshWallet: () => {},
  resetWallet: () => {},
  onAuthSuccess: () => {},
  walletLoading: false,
});

export const WalletProvider = ({ children }) => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [profitBalance, setProfitBalance] = useState(0);
  const [walletLoading, setWalletLoading] = useState(false);

  const resetWallet = useCallback(() => {
    setWalletBalance(0);
    setProfitBalance(0);
  }, []);

  const refreshWallet = useCallback(async () => {
    const access = localStorage.getItem("access");

    if (!access) {
      resetWallet();
      return;
    }

    setWalletLoading(true);

    try {
      const res = await authFetch("/api/dashboard-summary/");
      if (!res.ok) throw new Error("Wallet fetch failed");

      const data = await res.json();
      setWalletBalance(Number(data.wallet) || 0);
      setProfitBalance(Number(data.profit_wallet) || 0);
    } catch (err) {
      console.error("Wallet refresh error:", err);
    } finally {
      setWalletLoading(false);
    }
  }, [resetWallet]);

  const onAuthSuccess = useCallback(() => {
    refreshWallet();
  }, [refreshWallet]);

  // 🔑 Fetch wallet ONLY when provider mounts
  useEffect(() => {
    refreshWallet();
  }, [refreshWallet]);

  const totalBalance = walletBalance + profitBalance;

  return (
    <WalletContext.Provider
      value={{
        walletBalance,
        profitBalance,
        totalBalance,
        walletLoading,
        refreshWallet,
        resetWallet,
        onAuthSuccess,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
