import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/StateProvider";
import useRespnsive from "../../hooks/useResponsive";
import { TextInput } from "../../components/inputs/TextInput";
import { TextArea } from "../../components/inputs/TextArea";
import { ImageInput } from "../../components/inputs/ImageInput";
import ActionButton from "../../components/ActionButton";
import { Check } from "../../components/lottie/Check";
import useAccount from "../../hooks/useAccount";
import { useApi } from "../../api";
import { actionTypes } from "../../context/stateReducer";

export default function ConfigProfileContainer({ children }) {
  const [{ verifiedAddress, userProfile, literals }, dispatch] =
    useStateContext();
  const { wallet, connectToWallet } = useAccount();
  const navigate = useNavigate();
  const { _width } = useRespnsive();
  const { setProfileData, uploadToCDN } = useApi();
  const [username, setUsername] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");

  const [completedAction, setCompletedAction] = useState(false);

  const updateProfile = async () => {
    //Upload to sanity

    const profileResponse = await uploadToCDN(
      profileImg.file,
      "IMG",
      false,
      false
    );

    const profileSanity = profileResponse.sanity;

    const bannerResponse = await uploadToCDN(
      bannerImage.file,
      "IMG",
      false,
      false
    );

    const bannerSanity = bannerResponse.sanity;

    await setProfileData(
      username,
      wallet,
      email,
      bio,
      profileSanity,
      bannerSanity
    );

    //Dispatch actualizar username, banner y profileIMG
    dispatch({
      type: actionTypes.UPDATE_PROFILE,
      profileImg: profileSanity,
      profileBanner: bannerSanity,
      username: username,
    });
    setCompletedAction(true);
  };

  const onSelectProfileImage = async (e) => {
    const file = e.target.files[0];
    if (file.type.includes("image")) {
      setProfileImg({ file: file, preview: URL.createObjectURL(file) });
    }
  };
  const onSelectBannerImage = async (e) => {
    const file = e.target.files[0];
    if (file.type.includes("image")) {
      setBannerImage({ file: file, preview: URL.createObjectURL(file) });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      connectToWallet();
      //Get Profile info
      setUsername(userProfile.username);
      let response = await fetch(userProfile.profileImg);
      let data = await response.blob();
      let metadata = {
        type: "image/png",
      };
      let profileFile = new File([data], userProfile.username, metadata);
      setProfileImg({
        file: profileFile,
        preview: URL.createObjectURL(profileFile),
      });
      response = await fetch(userProfile.profileBanner);
      data = await response.blob();
      metadata = {
        type: "image/png",
      };
      let bannerFile = new File(
        [data],
        userProfile.username + "banner",
        metadata
      );
      setBannerImage({
        file: bannerFile,
        preview: URL.createObjectURL(bannerFile),
      });
      setBio(userProfile.bio);
      setEmail(userProfile.email);
    };
    fetchData();
  }, [wallet]);
  return (
    <div className="p-10 flex flex-col gap-10">
      <div>
        <p className="text-3xl font-black">
          {literals.profileSettings.profileSettings}
        </p>
      </div>
      <div className="flex  flex-col lg:flex-row w-full gap-10">
        <div className="flex flex-col gap-5 w-2/3">
          <TextInput
            label={literals.profileSettings.userName}
            placeholder={literals.profileSettings.introduceUserName}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextArea
            label={literals.profileSettings.biography}
            placeholder={literals.profileSettings.tellMore}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <TextInput
            label={literals.profileSettings.email}
            placeholder={literals.profileSettings.emailExample}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextInput
            label={literals.profileSettings.wallet}
            value={wallet}
            disabled
          />
        </div>
        <div className="flex flex-col gap-5 w-1/3">
          <ImageInput
            label={literals.profileSettings.profileImg}
            fileSelected={profileImg}
            setImageURL={setProfileImg}
            className=" rounded-full w-[200px] h-[200px]"
            inputId="profileImageInput"
            icon={true}
            onFileSelected={onSelectProfileImage}
          />
          <ImageInput
            label={literals.profileSettings.backgroundImg}
            fileSelected={bannerImage}
            setImageURL={setBannerImage}
            className=" w-[300px] h-[200px]"
            inputId="bannerImageInput"
            onFileSelected={onSelectBannerImage}
            icon={true}
          />
        </div>
      </div>
      <div className="flex gap-5 items-center">
        <ActionButton
          text={literals.actions.saveChanges}
          buttonAction={updateProfile}
          size="large"
        />
        {completedAction && (
          <div className="flex gap-1  items-center text-green-500">
            {literals.profileSettings.completed}
            <Check />
          </div>
        )}
      </div>
    </div>
  );
}
