import React from "react";
import fibboLogo from "../../assets/logoNavbarSmall.png";

export const PageWithLoading = ({ loading, children, className }) => {
  return (
    <div className={`mt-[79px] w-screen dark:bg-dark-1 ${className}`}>
      {loading ? (
        <div className="w-screen h-screen animate-pulse flex items-center justify-center">
          <img
            src={fibboLogo}
            className="w-[128px] animate-spin"
            alt="fibbo-loading"
          />
        </div>
      ) : (
        <>{children}</>
      )}
    </div>
  );
};
