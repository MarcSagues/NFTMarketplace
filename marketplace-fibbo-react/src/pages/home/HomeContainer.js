import React from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/ActionButton";
import { useStateContext } from "../../context/StateProvider";
import { PageWithLoading } from "../../components/basic/PageWithLoading";
import fibbo_vid from "../../assets/fibbo_logo.mp4";
import laConquista from "../../assets/laConquista.jpeg";

import FiboIMG from "../../assets/logoHome.png";

export default function HomeContainer() {
  const [{ literals }] = useStateContext();
  const navigate = useNavigate();

  const goToExplore = () => {
    navigate("/explore");
  };

  return (
    <PageWithLoading loading={false}>
      <div className="w-screen h-full m-0 p-0 b-0  bg-gradient-to-r from-neutral-900 to-violet-900 dark:bg-dark-1">
        <section className="flex flex-col items-center justify-center w-full h-full gap-10 ">
          <div className="flex items-center w-9/12 justify-center mt-10 ">
            <video controls loop autoPlay className="border-4 rounded-lg border-black shadow-lg shadow-indigo-500/50">
              <source src="https://cdn.sanity.io/files/lmw8etck/dev-cdn/9fab060b03ba8580e7c50b097c34ba0c14174607.mp4"></source>
            </video>
          </div>
          
          <div className="flex items-center justify-center w-9/12 h-auto mt-10 ">
            <h1 className="flex text-3xl leading-normal text-white sm:text-4xl xl:text-6xl  ">
              <b className="text-justify">{literals.home2.title1}</b>
            </h1>
          </div>
          <div className="flex items-center justify-center  w-8/12 sm:w-6/12 h-auto  ">
            <p className="text-sm text-white sm:text-lg md:text-xl p-0  xl:p-10 text-justify">
              {literals.home2.text1}
            </p>
          </div>
        </section>

        <section className="flex flex-col items-center justify-center w-full h-full gap-10 mt-20 sm:mt-40 ">
          <div className="flex items-center w-11/12 justify-center ">
            <div className="flex items-center justify-center lg:w-1/2  ">
              <img
                className="border-1 rounded-lg border-black shadow-lg shadow-indigo-500/50 flex w-3/5 hover:-translate-y-2 hover:opacity-75 cursor-pointer "
                src={laConquista}
              ></img>
            </div>
          </div>

          <div className="flex items-center justify-center w-9/12 h-auto mt-10 ">
            <h1 className="flex text-3xl leading-normal text-white sm:text-4xl xl:text-6xl  ">
              <b>{literals.home2.title2}</b>
            </h1>
          </div>
          <div className="flex items-center justify-center w-8/12 sm:w-6/12 h-auto ">
            <p className="text-sm text-white sm:text-lg md:text-xl p-0  xl:p-10 text-justify">
              {literals.home2.text2}
            </p>
          </div>
          <div className="flex gap-10 items-center justify-center pb-10">
            <ActionButton
              gradient
              size="large"
              variant="contained"
              text={literals.actions.viewNFT}
            />
          </div>
        </section>

        <section className="flex flex-col-reverse lg:flex-row items-center justify-center w-full h-full gap-10 py-20 sm:py-40 px-10">
          <div className="flex flex-col items-center justify-center w-full h-auto ">
            <h1 className="flex text-white text-2xl leading-normal sm:text-4xl pb-4 md:pb-7 xl:text-6xl xl:p-10 ">
              <b>{literals.home.slogan}</b>
            </h1>
            <p className="text-sm text-white sm:text-lg md:text-xl p-0 dark:text-white  xl:p-10 text-justify">
              {literals.home.sentence1}
            </p>
            <div className="flex flex-wrap gap-10 p-10 items-center justify-center">
              <ActionButton
                gradient
                size="small"
                variant="contained"
                text={literals.home.buttonExplore}
                buttonAction={() => goToExplore()}
              />
            </div>
          </div>
          <div className="flex items-center w-full justify-center  ">
            <img src={FiboIMG}></img>
          </div>
        </section>

        <section className="flex flex-col-reverse lg:flex-row-reverse items-center justify-center w-full h-full gap-10 sm:py-20 px-10">
          <div className="flex flex-col items-center justify-center w-full h-auto ">
            <h1 className="flex text-white text-2xl leading-normal sm:text-4xl pb-4 md:pb-7 xl:text-6xl xl:p-10 text-justify">
              <b>{literals.home2.title3}</b>
            </h1>
            <div className="flex flex-wrap gap-10 p-10 items-center justify-center">
              <ActionButton
                gradient
                size="large"
                variant="contained"
                text={literals.actions.createCollection}
              />
            </div>
          </div>
          <div className="sm:flex items-center w-full justify-center ">
            <video
              loop
              autoPlay
              muted
              className="border-4 rounded-lg border-black shadow-lg shadow-indigo-500/50 "
            >
              <source src={fibbo_vid}></source>
            </video>
          </div>
        </section>
      </div>
    </PageWithLoading>
  );
}
