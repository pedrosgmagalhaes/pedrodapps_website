import React from "react";
import { useLoading } from "../contexts/LoadingContext";
import LoadingScreen from "./LoadingScreen";

const LoadingWrapper = ({ children }) => {
  const { isLoading } = useLoading();

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <div className={`content-fade ${isLoading ? "is-loading" : "is-ready"}`}>{children}</div>
    </>
  );
};

export default LoadingWrapper;
