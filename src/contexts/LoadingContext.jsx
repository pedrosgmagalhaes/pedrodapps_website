import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const LoadingContext = createContext({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
});

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    const minLoadingTime = 2000; // 2 segundos mínimo
    let isPageLoaded = false;

    const handleLoad = () => {
      isPageLoaded = true;
      checkAndStopLoading();
    };

    const checkAndStopLoading = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    };

    // Quando todos os recursos são carregados
    window.addEventListener("load", handleLoad);
    
    // Fallback: garantir que o loading pare após o tempo mínimo, mesmo se a página não carregar completamente
    const fallbackTimeout = setTimeout(() => {
      if (!isPageLoaded) {
        isPageLoaded = true;
        checkAndStopLoading();
      }
    }, minLoadingTime + 1000); // 3 segundos total como fallback

    // Se a página já estiver carregada quando o componente monta
    if (document.readyState === 'complete') {
      handleLoad();
    }

    return () => {
      window.removeEventListener("load", handleLoad);
      clearTimeout(fallbackTimeout);
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
