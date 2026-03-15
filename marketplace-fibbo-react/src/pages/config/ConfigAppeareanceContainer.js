import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/StateProvider";
import useRespnsive from "../../hooks/useResponsive";
import { TextInput } from "../../components/inputs/TextInput";
import { TextArea } from "../../components/inputs/TextArea";
import { ImageInput } from "../../components/inputs/ImageInput";
import ActionButton from "../../components/ActionButton";
import useAccount from "../../hooks/useAccount";
import { ThemeContext } from "../../context/ThemeContext";
import { Icon } from "@iconify/react";
import { actionTypes } from "../../context/stateReducer";
import { espLiterals, engLiterals } from "../../context/lang";

export default function ConfigAppeareanceContainer() {
  const { theme, setTheme } = React.useContext(ThemeContext);
  const [{ userProfile, literals, lang }, dispatch] = useStateContext();
  const setSpanish = () => {
    dispatch({
      type: actionTypes.SET_LANGUAGE,
      lang: "esp",
    });
  };

  const setEnglish = () => {
    dispatch({
      type: actionTypes.SET_LANGUAGE,
      lang: "eng",
    });
  };

  const UserMenuItemToggle = ({ text, disabled, onClick }) => {
    const { theme } = React.useContext(ThemeContext);
    return (
      <div
        onClick={disabled ? null : onClick}
        className={`p-2 ${
          disabled
            ? "cursor-not-allowed text-gray-400"
            : "cursor-pointer hover:bg-gray-300"
        }  flex items-center gap-5`}
      >
        <div className="flex p-2 items-center dark:justify-end w-[64px] h-[32px] bg-gray-400 dark:bg-primary-2 rounded-xl">
          {theme === "dark" ? (
            <Icon width={24} icon="fa-solid:moon" className="text-gray-200" />
          ) : (
            <Icon width={28} icon="fa-solid:sun" className="text-gray-700" />
          )}
        </div>
        {text}
      </div>
    );
  };

  return (
    <div className="p-10 flex flex-col gap-10">
      <div>
        <p className="text-3xl font-black">
          {literals.profileSettings.appearance}
        </p>
      </div>
      <div className="flex w-full gap-10">
        <UserMenuItemToggle
          text={literals.userMenu.darkMode}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
        {/*  <UserMenuItemToggle
          text={literals.userMenu.autoDarkMode}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        /> */}
      </div>

      <div className="flex w-full gap-10 mt-6">
        <a className="text-xl font-bold">
          {literals.profileSettings.selectLenguage}
        </a>
      </div>

      <div className="flex w-full gap-10 ">
        <button
          onClick={setSpanish}
          className={`flex gap-2  items-center text-xl p-3 hover:-translate-y-1 hover:font-bold ${
            lang === "esp" && "font-bold underline"
          }`}
        >
          <Icon icon="twemoji:flag-spain" width={32} />
          {literals.profileSettings.spanish}
        </button>
        <button
          onClick={setEnglish}
          className={`flex gap-2  items-center text-xl p-3 hover:-translate-y-1 hover:font-bold ${
            lang === "eng" && "font-bold underline"
          }`}
        >
          <Icon icon="flagpack:gb-ukm" width={32} />
          {literals.profileSettings.english}
        </button>
      </div>
    </div>
  );
}
