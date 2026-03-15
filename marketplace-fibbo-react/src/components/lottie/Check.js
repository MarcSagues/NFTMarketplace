import React from "react";
import Lottie from "react-lottie-player";
import lottieJson from "../../assets/checked.json";

export const Check = () => {
  return (
    <Lottie
      loop
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
