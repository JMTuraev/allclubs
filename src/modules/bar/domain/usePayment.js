import { useState, useMemo } from "react";

export function usePayment(totalAmount) {
  const [methods, setMethods] = useState({
    cash: 0,
    terminal: 0,
    click: 0,
    debt: 0,
  });

  const [activeMethod, setActiveMethod] = useState(null);

  const paidAmount = useMemo(() => {
    return Object.values(methods).reduce(
      (sum, val) => sum + Number(val || 0),
      0
    );
  }, [methods]);

  const remaining = useMemo(() => {
    return totalAmount - paidAmount;
  }, [totalAmount, paidAmount]);

  const isComplete = remaining === 0 && totalAmount > 0;

  const activateMethod = (method) => {
    setActiveMethod(method);

    setMethods((prev) => ({
      ...prev,
      [method]: remaining > 0 ? remaining : 0,
    }));
  };

  const updateAmount = (method, value) => {
    setMethods((prev) => ({
      ...prev,
      [method]: Number(value) || 0,
    }));
  };

  const reset = () => {
    setMethods({
      cash: 0,
      terminal: 0,
      click: 0,
      debt: 0,
    });
    setActiveMethod(null);
  };

  return {
    methods,
    activeMethod,
    paidAmount,
    remaining,
    isComplete,
    activateMethod,
    updateAmount,
    reset,
  };
}