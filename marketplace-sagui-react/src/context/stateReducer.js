import { engLiterals, espLiterals } from "./lang";

export const getLiterals = (lang) => {
  switch (lang) {
    case "eng":
      return engLiterals;
    case "esp":
      return espLiterals;
    default:
      return engLiterals;
  }
};

export const initialState = {
  userProfile: {},
  lang: "esp",
  literals: engLiterals,
  wallet: "",
  verifiedAddress: false,
  balance: 0,
  correctChain: true,
  updatedWFTM: false,
};

export const actionTypes = {
  SET_LANGUAGE: "SET_LANGUAGE",
  SET_USER_PROFILE: "SET_USER_PROFILE",
  UPDATE_PROFILE: "UPDATE_PROFILE",

  SET_PROFILE_BANNER: "SET_PROFILE_BANNER",
  SET_PROFILE_IMAGE: "SET_PROFILE_IMAGE",
  SET_USERNAME: "SET_USERNAME",
  UPDATED_WFTM: "UPDATED_WFTM",
  UPDATED_NOT_SHOW: "UPDATED_NOT_SHOW",
};

const stateReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LANGUAGE:
      window.localStorage.setItem("lang", action.lang);
      return {
        ...state,
        lang: action.lang,
        literals: getLiterals(action.lang),
      };
    case actionTypes.SET_USER_PROFILE:
      return {
        ...state,
        userProfile: action.userProfile,
        wallet: action.wallet,
        verifiedAddress: action.verifiedAddress,
      };
    case actionTypes.SET_PROFILE_IMAGE:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          profileImg: action.image,
        },
      };
    case actionTypes.SET_PROFILE_BANNER:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          profileBanner: action.banner,
        },
      };
    case actionTypes.SET_USERNAME:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          username: action.username,
        },
      };
    case actionTypes.UPDATE_PROFILE:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          profileBanner: action.banner,
          profileImg: action.profileImg,
          username: action.username,
        },
      };
    case actionTypes.UPDATED_WFTM:
      return {
        ...state,
        updatedWFTM: !state.updatedWFTM,
      };
    case actionTypes.UPDATED_NOT_SHOW:
      return {
        ...state,
        userProfile: { ...state.userProfile, notShowRedirect: true },
      };

    default:
      return state;
  }
};

export default stateReducer;
