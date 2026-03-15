import React from "react";
import Lottie from "react-lottie-player";
import lottieJson from "../../assets/verified.json";

export const Verified = () => {
  return (
    <Lottie
      animationData={lottieJson}
      play
      style={{
        background: "transparent",
        width: "64px",
        height: "auto",
      }}
    />
  );
};
