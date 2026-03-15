import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import ActionButton from "../../../components/ActionButton";
import { ImageInput } from "../../../components/inputs/ImageInput";
import { TextInput } from "../../../components/inputs/TextInput";
import { TextArea } from "../../../components/inputs/TextArea";
import { useApi } from "../../../api";
import useAccount from "../../../hooks/useAccount";
import { useNavigate, useParams } from "react-router-dom";
import { PageWithLoading } from "../../../components/basic/PageWithLoading";
import { NotOwner } from "../../../components/basic/NotOwner";
import { HelpTooltip } from "../../../components/tooltips/HelpTooltip";
import { useStateContext } from "../../../context/StateProvider";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function EditCollectionContainer() {
  const {
    uploadImgToCDN,
    checkNameRepeated,
    checkUrlRepeated,
    getCollectionDetail,
    editCollectionDetails,
    uploadToCDN,
  } = useApi();
  const navigate = useNavigate();
  const { collection } = useParams();
  const { wallet, connectToWallet } = useAccount();
  const [{ literals }] = useStateContext();
  const [loading, setLoading] = useState(true);
  const [collectionInfo, setCollectionInfo] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const [logoImage, setLogoImage] = useState("");
  const [logoImageError, setLogoImageError] = useState(false);
  const [logoImageMessageError, setLogoImageMessageError] = useState("");

  const [mainImage, setMainImage] = useState("");
  const [mainImageError, setMainImageError] = useState(false);
  const [mainImageMessageError, setMainImageMessageError] = useState("");

  const [bannerImage, setBannerImage] = useState("");
  const [bannerImageError, setBannerImageError] = useState(false);
  const [bannerImageMessageError, setBannerImageMessageError] = useState("");

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");

  const [url, setUrl] = useState("https://fibbo-market.web.app/collection/");
  const [urlError, setUrlError] = useState(false);
  const [urlErrorMessage, setUrlErrorMessage] = useState("");

  const [desc, setDesc] = useState("");
  const [descError, setDescError] = useState(false);

  const [website, setWebsite] = useState("https://");
  const [websiteError, setWebsiteError] = useState(false);

  const [discord, setDiscord] = useState("https://discord.gg/");
  const [discordError, setDiscordError] = useState(false);

  const [telegram, setTelegram] = useState("https://t.me/");
  const [telegramError, setTelegramError] = useState(false);

  const [instagram, setInstagram] = useState("https://www.instagram.com/");
  const [instagramError, setInstagramError] = useState(false);

  const [explicitContent, setExplicitContent] = useState(false);

  const checkURLFormat = (base, state) => {
    const stateValue = state.split(base);
    if (stateValue[1] !== "") {
      const conditions = [
        ".",
        "~",
        ":",
        "/",
        "?",
        "#",
        "[",
        "]",
        "@",
        "!",
        "$",
        "&",
        "(",
        ")",
        "%",
        "*",
        "+",
        ",",
        ";",
        "=",
      ];
      if (conditions.some((el) => stateValue[1].includes(el))) {
        return false;
      } else {
        return true;
      }
    }
    return true;
  };
  const onSelectLogoImage = async (e) => {
    const file = e.target.files[0];
    if (file.type.includes("image")) {
      setLogoImageError(false);
      setLogoImage({ file: file, preview: URL.createObjectURL(file) });
    } else {
      setLogoImageError(true);
      setLogoImageMessageError(literals.createItem.selectImageError);
    }
  };

  const onSelectMainImage = async (e) => {
    const file = e.target.files[0];
    if (file.type.includes("image")) {
      setMainImage({ file: file, preview: URL.createObjectURL(file) });
    } else {
      setMainImageError(true);
      setMainImageMessageError(literals.createItem.selectImageError);
    }
  };

  const onSelectBannerImage = async (e) => {
    const file = e.target.files[0];
    if (file.type.includes("image")) {
      setBannerImage({ file: file, preview: URL.createObjectURL(file) });
    } else {
      setBannerImage(true);
      setBannerImageMessageError(literals.createItem.selectImageError);
    }
  };

  const handleChangeName = (value) => {
    setNameError(false);
    setName(value);
  };

  const handleChangeURL = (value) => {
    setUrlError(false);
    let finalValue = value.split("https://fibbo-market.web.app/collection/");

    if (finalValue[1]) {
      setUrl(`https://fibbo-market.web.app/collection/${finalValue[1]}`);
    } else {
      setUrl("https://fibbo-market.web.app/collection/");
    }
  };

  const handleChangeDesc = (value) => {
    setDescError(false);
    setDesc(value);
  };

  const handleChangeWebiste = (value) => {
    let finalValue = value.split("https://");
    if (finalValue[1]) {
      setWebsite(`https://${finalValue[1]}`);
    } else {
      if (finalValue[2]) {
        setWebsite(`https://${finalValue[2]}`);
      } else {
        setWebsite(`https://`);
      }
    }
  };

  const handleChangeDiscord = (value) => {
    setDiscordError(false);
    let finalValue = value.split("https://discord.gg/");

    if (finalValue[1]) {
      setDiscord(`https://discord.gg/${finalValue[1]}`);
    } else {
      setDiscord("https://discord.gg/");
    }
  };

  const handleChangeTelegram = (value) => {
    setTelegramError(false);
    let finalValue = value.split("https://t.me/");

    if (finalValue[1]) {
      setTelegram(`https://t.me/${finalValue[1]}`);
    } else {
      setTelegram("https://t.me/");
    }
  };

  const handleChangeInstagram = (value) => {
    setTelegramError(false);
    let finalValue = value.split("https://www.instagram.com/");

    if (finalValue[1]) {
      setInstagram(`https://www.instagram.com/${finalValue[1]}`);
    } else {
      setInstagram("https://www.instagram.com/");
    }
  };

  const handleCreateCollection = async () => {
    //Comprobar el formato de la url y colecciones
    let error = false;

    if (logoImage === "") {
      error = true;
      setLogoImageError(true);
      setLogoImageMessageError(literals.createCollection.selectImage);
    }

    if (name === "" || name.length < 5 || name.length > 30) {
      error = true;
      setNameError(true);
      setNameErrorMessage(literals.createCollection.nameCharacters);
    }

    if (collectionInfo.name !== name) {
      const isNameRepeated = await checkNameRepeated(name);

      if (isNameRepeated) {
        error = true;
        setNameError(true);
        setNameErrorMessage("El nombre seleccionado ya esta en uso");
      }
    }

    if (desc === "" || desc.length < 50 || desc.length > 1000) {
      error = true;
      setDescError(true);
    }

    if (!checkURLFormat("https://fibbo-market.web.app/collection/", url)) {
      error = true;
      setUrlError(true);
      setUrlErrorMessage("El formato de URL es incorrecto");
    }

    let customURL = url.split("https://fibbo-market.web.app/collection/")[1];

    if (collectionInfo.customURL !== customURL) {
      if (customURL) {
        const isUrlRepeated = await checkUrlRepeated(customURL);
        if (isUrlRepeated) {
          error = true;
          setUrlError(true);
          setUrlErrorMessage("El URL seleccionado ya esta en uso");
        }
      }
    }

    if (!checkURLFormat("https://discord.gg/", discord)) {
      error = true;
      setDiscordError(true);
    }
    if (!checkURLFormat("https://t.me/", telegram)) {
      error = true;
      setTelegramError(true);
    }
    if (!checkURLFormat("https://www.instagram.com/", instagram)) {
      error = true;
      setInstagramError(true);
    }
    if (!error) {
      //Llamar al endpoint para editarla
      let customURL = url.split("https://fibbo-market.web.app/collection/")[1];

      const logoResponse = await uploadToCDN(
        logoImage.file,
        "IMG",
        false,
        false
      );
      const logoSanity = logoResponse.sanity;

      const mainResponse = await uploadToCDN(
        mainImage.file,
        "IMG",
        false,
        false
      );

      const mainSanity = mainResponse.sanity;

      let bannerSanity = "";
      if (bannerImage) {
        const bannerResponse = await uploadToCDN(
          bannerImage.file,
          "IMG",
          false,
          false
        );
        bannerSanity = bannerResponse.sanity;
      }

      await editCollectionDetails(
        collectionInfo.contractAddress,
        wallet,
        name,
        desc,
        logoSanity,
        mainSanity,
        bannerSanity,
        customURL,
        website,
        discord,
        telegram,
        instagram,
        explicitContent
      );
      //Navegar a la info de la colección

      navigate(`/collection/${collection}`);
    } else {
    }
  };

  const getCollectionDetails = async () => {
    const collectionDetail = await getCollectionDetail(collection);
    setIsOwner(collectionDetail.creator === wallet);

    setCollectionInfo(collectionDetail);
    console.log(collectionDetail);
    setName(collectionDetail.name);
    let response = await fetch(collectionDetail.logoImage);
    let data = await response.blob();
    let metadata = {
      type: "image/png",
    };
    let logoFile = new File([data], collection.name + "logo", metadata);
    setLogoImage({
      file: logoFile,
      preview: URL.createObjectURL(logoFile),
    });
    response = await fetch(collectionDetail.featuredImage);
    data = await response.blob();
    metadata = {
      type: "image/png",
    };
    let mainFile = new File([data], collection.name + "main", metadata);
    setMainImage({
      file: mainFile,
      preview: URL.createObjectURL(mainFile),
    });
    console.log(mainFile);
    if (bannerImage !== "") {
      response = await fetch(collectionDetail.bannerImage);
      data = await response.blob();
      metadata = {
        type: "image/png",
      };
      let bannerFile = new File([data], collection.name + "banner", metadata);
      setBannerImage({
        file: bannerFile,
        preview: URL.createObjectURL(bannerFile),
      });
    } else {
      setBannerImage(null);
    }

    setDesc(collectionDetail.description);
    setExplicitContent(collectionDetail.explicitContent);

    setUrl(
      `https://fibbo-market.web.app/collection/${collectionDetail.customURL}`
    );
    setWebsite(collectionDetail.websiteURL);
    setDiscord(collectionDetail.discordURL);
    setInstagram(collectionDetail.instagramURL);
    setTelegram(collectionDetail.telegramURL);
  };

  useEffect(() => {
    const fetchData = async () => {
      await connectToWallet();
      await getCollectionDetails().then(async () => {
        await sleep(2000);
        setLoading(false);
      });
    };
    fetchData();
    // TO DO -> Recuperar todos los datos de la colección
  }, [wallet]);

  return (
    <PageWithLoading
      loading={loading}
      className="flex content-center  justify-center mb-10 "
    >
      {isOwner ? (
        <div className="flex w-11/12 md:w-9/12 w-7/11 flex-col  ">
          <div className="flex w-full p-[40px]  justify-center">
            <div id="top" className="text-2xl">
              <b>{literals.editCollection.title}</b>
            </div>
          </div>

          <div className="flex flex-col w-full content-center justify-left">
            <div className="flex flex-col pt-[30px]">
              <ImageInput
                required
                info={literals.createCollection.logoDesc}
                label={literals.createCollection.logo}
                fileSelected={logoImage}
                setImageURL={setLogoImage}
                onFileSelected={onSelectLogoImage}
                inputId="logoImageInput"
                className="rounded-full w-[200px] h-[200px]"
                imageError={logoImageError}
                imageMessageError={logoImageMessageError}
                icon={true}
              />
            </div>
          </div>

          <div className="flex flex-col w-full  content-center justify-left">
            <div className="flex pt-[30px]">
              <ImageInput
                fileSelected={mainImage}
                info={literals.createCollection.imgPrincipalDesc}
                label={literals.createCollection.imgPrincipal}
                inputId="mainImageInput"
                setImageURL={setMainImage}
                backgroundImage={true}
                className="rounded-xl w-[300px] h-[200px]"
                onFileSelected={onSelectMainImage}
                imageError={mainImageError}
                imageMessageError={mainImageMessageError}
                icon={true}
              />
            </div>
          </div>

          <div className="flex flex-col w-full  content-center justify-left">
            <div className="flex pt-[30px]">
              <ImageInput
                fileSelected={bannerImage}
                setImageURL={setBannerImage}
                info={literals.createCollection.bannerDesc}
                label={literals.createCollection.banner}
                backgroundImage={true}
                inputId="bannerImageInput"
                className="rounded-xl w-11/12 h-[130px] sm:w-[600px] sm:h-[200px]"
                onFileSelected={onSelectBannerImage}
                imageError={bannerImageError}
                imageMessageError={bannerImageMessageError}
                icon={true}
              />
            </div>
          </div>

          <div className="mt-10">
            <TextInput
              label={literals.createCollection.collectionName}
              required
              value={name}
              onChange={(e) => handleChangeName(e.target.value)}
              error={nameError}
              errorMessage={nameErrorMessage}
            />
          </div>

          <div className="mt-10">
            <TextInput
              label={"URL"}
              value={url}
              onChange={(e) => handleChangeURL(e.target.value)}
              error={urlError}
              info={literals.createCollection.urlDesc}
              errorMessage={urlErrorMessage}
            />
          </div>
          <div className="mt-10">
            <TextArea
              label={literals.createCollection.description}
              required
              info={literals.createCollection.descriptionDesc}
              error={descError}
              value={desc}
              rows={"6"}
              errorMessage={literals.createCollection.descriptionCharacters}
              onChange={(e) => handleChangeDesc(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full pt-[20px] ">
            <div className="text-lg">
              <b>Links</b>
            </div>
            <div className="flex flex-col w-full items-center">
              <div className="flex flex-row w-full items-center ">
                <Icon
                  className="flex  mr-[20px]"
                  icon="dashicons:admin-site-alt3"
                />
                <div className="w-full">
                  <TextInput
                    value={website}
                    onChange={(e) => handleChangeWebiste(e.target.value)}
                    placeholder="yourPage.com"
                  />
                </div>
              </div>
              <div className="flex flex-row w-full  items-center">
                <Icon className="flex  mr-[20px]" icon="bi:discord" />
                <div className="w-full">
                  <TextInput
                    value={discord}
                    error={discordError}
                    errorMessage={literals.createCollection.incorrectFormat}
                    onChange={(e) => handleChangeDiscord(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-row w-full  items-center">
                <Icon className="flex mr-[20px]" icon="bxl:telegram" />
                <div className="w-full">
                  <TextInput
                    value={telegram}
                    error={telegramError}
                    errorMessage={literals.createCollection.incorrectFormat}
                    onChange={(e) => handleChangeTelegram(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-row w-full  items-center">
                <Icon className="flex mr-[20px] " icon="cib:instagram" />
                <div className="w-full">
                  <TextInput
                    value={instagram}
                    error={instagramError}
                    errorMessage={literals.createCollection.incorrectFormat}
                    onChange={(e) => handleChangeInstagram(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full pt-[40px] content-center justify-left">
            <div className="flex flex-row gap-2">
              <label className="">
                <input
                  type="checkbox"
                  className=""
                  onChange={() => setExplicitContent(!explicitContent)}
                  checked={explicitContent}
                />

                <span className="font-bold text-lg text-gray-700 dark:text-gray-400 border-gray-300 p-3 flex-row ">
                  {literals.createCollection.explicitContent}
                </span>
              </label>
              <HelpTooltip
                tooltip="explicit-info"
                tooltipPlacement="right"
                tooltipText="Si el contenido és explícito o sensible, como pornografía <br/> o contenido 'not safe for work' (NSFW),  protegerá a los usuarios <br/> de FIBBO que realicen búsquedas seguras y no les mostrará el contenido."
              />
            </div>
          </div>

          <div className="flex flex-col w-full pt-[40px] content-center justify-center ">
            <ActionButton
              text={literals.editCollection.title}
              size="large"
              buttonAction={handleCreateCollection}
            />
          </div>
        </div>
      ) : (
        <>
          {!loading && <NotOwner text={literals.editCollection.notAllowed} />}
        </>
      )}
    </PageWithLoading>
  );
}
