import { useState, useMemo } from "react";
import { v4 as uuid } from "uuid";

export function useSessions() {
  const [sessions, setSessions] = useState([]);

  /* ================= CREATE SESSION ================= */

  const createSession = ({ type, client, staff }) => {
    const newSession = {
      id: uuid(),
      type, // "client" | "guest"
      client: type === "guest" ? "Guest" : client,
      image: null,
      staff,
      status: "active",
      transactions: [], // 🔥 universal ledger
      createdAt: new Date(),
    };

    setSessions(prev => [newSession, ...prev]);

    return newSession;
  };

  /* ================= END SESSION ================= */

  const endSession = (sessionId) => {
    setSessions(prev =>
      prev.map(s =>
        s.id === sessionId
          ? { ...s, status: "ended", endedAt: new Date() }
          : s
      )
    );
  };

  /* ================= ADD TRANSACTION ================= */

  const addTransaction = (sessionId, transaction) => {
    const newTx = {
      id: uuid(),
      ...transaction,
      createdAt: new Date(),
    };

    setSessions(prev =>
      prev.map(s =>
        s.id === sessionId
          ? {
              ...s,
              transactions: [...s.transactions, newTx],
            }
          : s
      )
    );
  };

  /* ================= SESSION TOTAL ================= */

  const calculateSessionTotal = (session) => {
    return session.transactions.reduce(
      (sum, tx) => sum + (tx.amount || 0),
      0
    );
  };

  /* ================= GLOBAL METRICS ================= */

  const totalRevenue = useMemo(() => {
    return sessions.reduce((sum, s) => {
      return sum + calculateSessionTotal(s);
    }, 0);
  }, [sessions]);

  const activeCount = useMemo(
    () => sessions.filter(s => s.status === "active").length,
    [sessions]
  );

  const endedCount = useMemo(
    () => sessions.filter(s => s.status === "ended").length,
    [sessions]
  );

  return {
    sessions,

    createSession,
    endSession,
    addTransaction,
    calculateSessionTotal,

    totalRevenue,
    activeCount,
    endedCount,
  };
}