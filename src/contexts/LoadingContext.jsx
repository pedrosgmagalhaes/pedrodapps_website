import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const LoadingContext = createContext({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
});

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setIsLoading(false);
    // Quando todos os recursos são carregados
    window.addEventListener("load", handleLoad);
    // Fallback para desenvolvimento para evitar overlay preso
    const fallback = setTimeout(() => setIsLoading(false), 400);

    return () => {
      window.removeEventListener("load", handleLoad);
      clearTimeout(fallback);
    };
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      startLoading: () => setIsLoading(true),
      stopLoading: () => setIsLoading(false),
    }),
    [isLoading]
  );

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};

export const useLoading = () => useContext(LoadingContext);
