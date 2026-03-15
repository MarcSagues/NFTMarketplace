import React from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/ActionButton";
import Lottie from "react-lottie-player";
import lottieJson from "../../assets/notFound.json";
import { useStateContext } from "../../context/StateProvider";

export default function NotFoundContainer() {
  const navigate = useNavigate();
  const [{ literals }] = useStateContext();
  return (
    <div className="mt-[79px]  w-screen  ">
      <div className="flex flex-col gap-10 md:flex-row justify-center items-center mx-auto h-full w-full">
        <div className="flex flex-col justify-center items-center w-full my-10">
          <Lottie
            loop
            animationData={lottieJson}
            play
            style={{
              background: "transparent",
              width: "450px",
              height: "auto",
            }}
          />
        </div>
        <div className="flex flex-col items-center  gap-4">
          <div className="text-6xl">404</div>
          <div className="text-lg w-3/4">{literals.modals.URLNotFound}</div>
          <ActionButton
            buttonAction={() => navigate("/")}
            text={literals.actions.goToHome}
            size="large"
          />
        </div>
      </div>
    </div>
  );
}
