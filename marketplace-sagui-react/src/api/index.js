import axios from "axios";

const localURL = "http://localhost:9000/";
const localDevURL = "http://192.168.1.48.sslip.io:9000";
const herokuDevURL = "https://market-api-dev.herokuapp.com/";

const marketplaceApi = axios.create({ baseURL: herokuDevURL });
const isMainnet = false;

export const useApi = () => {
  const explorerUrl = isMainnet
    ? "https://ftmscan.com"
    : "https://testnet.ftmscan.com";

  //#region Profile
  const getProfileInfo = async (address) => {
    const res = await marketplaceApi.get(`users/profile?wallet=${address}`);
    if (res.status === 205) {
      return null;
    } else {
      return res.data;
    }
  };

  const getWalletHistory = async (address) => {
    const res = await marketplaceApi.get(`users/history?address=${address}`);
    return res.data;
  };

  const getFavoritesFromAddress = async (address) => {
    const res = await marketplaceApi.get(`users/favorites?address=${address}`);
    return res.data;
  };

  const getWalletOffers = async (address) => {
    const res = await marketplaceApi.get(`users/offers?address=${address}`);
    return res.data;
  };

  const getWalletBids = async (address) => {
    const res = await marketplaceApi.get(`users/bids?address=${address}`);
    return res.data;
  };

  const createNewProfile = async (address) => {
    const res = await marketplaceApi.post("users/newProfile", {
      wallet: address,
    });
    return res.data;
  };

  const setUsername = async (address, newUsername) => {
    const res = await marketplaceApi.post("users/setUsername", {
      wallet: address,
      username: newUsername,
    });
    return res.data;
  };

  const setImportWFTM = async (address) => {
    const res = await marketplaceApi.post("users/setImportWFTM", {
      wallet: address,
    });
    return res.data;
  };

  const setShowRedirectProfile = async (address) => {
    const res = await marketplaceApi.post("users/setNotShowRedirect", {
      wallet: address,
    });
    return res.data;
  };

  const setProfileBanner = async (address, file) => {
    var formData = new FormData();
    formData.append("image", file);
    formData.append("wallet", address);

    const imgAddedToSanity = await marketplaceApi.post(
      "users/setBanner",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return imgAddedToSanity.data;
  };

  const setProfileData = async (
    username,
    wallet,
    email,
    bio,
    profileImg,
    profileBanner
  ) => {
    await marketplaceApi.post("users/update", {
      username: username,
      wallet: wallet,
      email: email,
      bio: bio,
      profileImg: profileImg,
      profileBanner: profileBanner,
    });

    return "OK";
  };

  const setUserEmail = async (wallet, email) => {
    await marketplaceApi.post("users/updateEmail", {
      wallet: wallet,
      email: email,
    });

    return "OK";
  };

  const setProfileImg = async (address, file) => {
    var formData = new FormData();
    formData.append("image", file);
    formData.append("wallet", address);

    const imgAddedToSanity = await marketplaceApi.post(
      "users/setProfileImg",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return imgAddedToSanity.data;
  };

  //#endregion

  //#region PayTokens
  const getAllPayTokens = async () => {
    const res = await marketplaceApi.get("api/payTokens");
    return res.data;
  };

  const getPayTokenInfo = async (address) => {
    const res = await marketplaceApi.get(`api/payToken?address=${address}`);
    return res.data;
  };

  //#endregion

  //#region Nfts

  const getAllTokens = async (user) => {
    let url = user !== "" ? `nfts/allNfts?user=${user}` : "nfts/allNfts";
    const res = await marketplaceApi.get(url);
    return res.data;
  };

  const getAllCategories = async () => {
    const res = await marketplaceApi.get("nfts/categories");
    return res.data;
  };

  const getNftsForSale = async () => {
    const res = await marketplaceApi.get("nfts/nftsForSale");
    return res.data;
  };

  const getNftInfo = async (collection, tokenId, user) => {
    const res = await marketplaceApi.get(
      `nfts/nftInfo?collection=${collection}&nftId=${tokenId}&user=${user}`
    );
    return res.data;
  };

  const getNftHistory = async (collection, tokenId) => {
    const res = await marketplaceApi.get(
      `nfts/itemHistory?tokenId=${tokenId}&collection=${collection}`
    );
    return res.data;
  };

  const getNftsFromAddress = async (address) => {
    const res = await marketplaceApi.get(
      `nfts/nftsByAddress?address=${address}`
    );
    return res.data;
  };

  const getNftsFromCreator = async (address) => {
    const res = await marketplaceApi.get(
      `nfts/nftsByCreator?address=${address}`
    );
    return res.data;
  };

  const registerSentItem = async (collection, tokenId, from, to) => {
    await marketplaceApi.post("nfts/sentItem", {
      collection: collection,
      tokenId: tokenId,
      from: from,
      to: to,
    });
  };

  const saveMintedItem = async (
    name,
    description,
    creator,
    tokenId,
    royalty,
    sanityFileURL,
    ipfsImage,
    ipfsMetadata,
    collection,
    externalLink,
    additionalContent,
    categories,
    contentType,
    animated = null
  ) => {
    await marketplaceApi.post("nfts/newItem", {
      name: name,
      description: description,
      creator: creator,
      tokenId: tokenId,
      royalty: royalty,
      sanityFileURL: sanityFileURL,
      ipfsImgUrl: ipfsImage,
      ipfsMetadataUrl: ipfsMetadata,
      collection: collection,
      externalLink: externalLink,
      additionalContent: additionalContent,
      categories: categories,
      contentType: contentType,
      sanityAnimatedURL: animated,
    });
  };

  const editNftData = async (
    name,
    description,
    creator,
    tokenId,
    royalty,
    ipfsImage,
    sanityFileURL,
    ipfsMetadata,
    collection,
    externalLink,
    additionalContent,
    categories,
    contentType,
    animated = null
  ) => {
    console.log(collection, tokenId);
    try {
      const res = await marketplaceApi.post("nfts/editItem", {
        name: name,
        description: description,
        creator: creator,
        tokenId: tokenId,
        royalty: royalty,
        sanityFileURL: sanityFileURL,
        ipfsImgUrl: ipfsImage,
        ipfsMetadataUrl: ipfsMetadata,
        collection: collection,
        externalLink: externalLink,
        additionalContent: additionalContent,
        categories: categories,
        contentType: contentType,
        sanityAnimatedURL: animated,
      });
      console.log(res.status);
    } catch (e) {
      console.log(e);
    }
  };

  const registerNftRoyalties = async (collection, tokenId, royalties) => {
    try {
      await marketplaceApi.post("nfts/registerRoyalties", {
        collection: collection,
        tokenId: tokenId,
        royalty: royalties,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const deleteNftItem = async (collection, tokenId) => {
    try {
      await marketplaceApi.post("nfts/delete", {
        collection: collection,
        tokenId: tokenId,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const addFavorite = async (collection, tokenId, user) => {
    try {
      await marketplaceApi.post("nfts/addFavorite", {
        collection: collection,
        tokenId: tokenId,
        from: user,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const deleteFavorite = async (collection, tokenId, user) => {
    try {
      await marketplaceApi.post("nfts/deleteFavorite", {
        collection: collection,
        tokenId: tokenId,
        from: user,
      });
    } catch (e) {
      console.log(e);
    }
  };

  //#endregion

  //#region Offers
  const getItemOffers = async (collection, tokenId) => {
    const offers = await marketplaceApi.get(
      `/offers/get?collection=${collection}&tokenId=${tokenId}`
    );
    const offersResult = offers.data;

    return offersResult;
  };

  const setAcceptedOffer = async (collection, tokenId, creator) => {
    const offers = await marketplaceApi.post(`/offers/accept`, {
      collection: collection,
      tokenId: tokenId,
      creator: creator,
    });
    const offersResult = offers.data;

    return offersResult;
  };

  //#endregion

  //#region Collections

  const getCollectionInfo = async (collection) => {
    const res = await marketplaceApi.get(
      `collections/collectionData?collection=${collection}`
    );
    return res.data;
  };

  const getItemsFromCollection = async (collection, user) => {
    const res = await marketplaceApi.get(
      `collections/items?address=${collection}&user=${user}`
    );
    return res.data;
  };

  const getCollectionDetail = async (collection, user) => {
    const res = await marketplaceApi.get(
      `collections/collectionDetail?collection=${collection}&user=${user}`
    );
    return res.data;
  };

  const getCollectionsAvailable = async () => {
    const res = await marketplaceApi.get(`collections/available`);
    return res.data;
  };

  const getAllCollections = async (user) => {
    const res = await marketplaceApi.get(`collections/all?user=${user}`);
    return res.data;
  };

  const getMyCollections = async (owner) => {
    const res = await marketplaceApi.get(
      `collections/myCollections?owner=${owner}`
    );

    return res.data;
  };

  const checkUrlRepeated = async (customURL) => {
    const res = await marketplaceApi.get(
      `collections/checkUrl?customURL=${customURL}`
    );
    if (res.status !== 200) {
      return true;
    } else {
      return false;
    }
  };

  const checkNameRepeated = async (name) => {
    const res = await marketplaceApi.get(`collections/checkName?name=${name}`);

    if (res.status !== 200) {
      return true;
    } else {
      return false;
    }
  };

  const saveCollectionDetails = async (
    creator,
    name,
    description,
    logoImage,
    featuredImage,
    bannerImage,
    customURL,
    websiteURL,
    discordURL,
    telegramURL,
    instagramURL,
    explicitContent
  ) => {
    const res = await marketplaceApi.post(`collections/new`, {
      creator,
      name,
      description,
      logoImage,
      featuredImage,
      bannerImage,
      customURL,
      websiteURL,
      discordURL,
      telegramURL,
      instagramURL,
      explicitContent,
    });
    return res;
  };

  const editCollectionDetails = async (
    contractAddress,
    creator,
    name,
    description,
    logoImage,
    featuredImage,
    bannerImage,
    customURL,
    websiteURL,
    discordURL,
    telegramURL,
    instagramURL,
    explicitContent
  ) => {
    const res = await marketplaceApi.post(`collections/edit`, {
      contractAddress,
      creator,
      name,
      description,
      logoImage,
      featuredImage,
      bannerImage,
      customURL,
      websiteURL,
      discordURL,
      telegramURL,
      instagramURL,
      explicitContent,
    });
    return res.data;
  };

  const createUserCollectionOptions = async (contractAddress, user) => {
    const res = await marketplaceApi.post(`collections/newOptions`, {
      contractAddress,
      user,
    });
    return res.data;
  };

  const setShowRedirectToLink = async (contractAddress, user) => {
    const res = await marketplaceApi.post(`collections/setShowRedirect`, {
      contractAddress,
      user,
    });
    return res.data;
  };

  const addCollectionToWatchlist = async (contractAddress, user) => {
    const res = await marketplaceApi.post(`collections/addToWatchlist`, {
      collection: contractAddress,
      from: user,
    });
    return res.data;
  };

  const deleteFromWatchList = async (contractAddress, user) => {
    const res = await marketplaceApi.post(`collections/removeFromWatchlist`, {
      collection: contractAddress,
      from: user,
    });
    return res.data;
  };

  const getWatchlistedCollections = async (user) => {
    const res = await marketplaceApi.get(`collections/watchlist?user=${user}`);
    return res.data;
  };

  const getUserCollectionOptions = async (contractAddress, user) => {
    const res = await marketplaceApi.get(
      `collections/collectionUserOptions?contractAddress=${contractAddress}&user=${user}`
    );
    return res.data;
  };

  //#endregion

  //#region General
  const searchItemsAndProfiles = async (queryText) => {
    const searchResult = await marketplaceApi.get(
      `api/search?query=${queryText}`
    );
    const result = searchResult.data;

    return {
      items: result.items,
      profiles: result.profiles,
      collections: result.collections,
    };
  };

  const uploadToCDN = async (
    file,
    contentType,
    uploadToIpfs,
    isExplicit = false
  ) => {
    var formData = new FormData();
    formData.append("file", file);
    formData.append("contentType", contentType);
    formData.append("uploadToIpfs", uploadToIpfs);
    formData.append("isExplicit", isExplicit);

    const imgAddedToSanity = await marketplaceApi.post(
      "api/uploadImg",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (imgAddedToSanity.status !== 200) {
      return { sanity: "", ipfsImgUrl: "", error: true };
    } else {
      return { ...imgAddedToSanity.data, error: false };
    }
  };

  const uploadJSONMetadata = async (
    name,
    desc,
    image,
    externalLink,
    contentType,
    audio = null
  ) => {
    const imgAddedToSanity = await marketplaceApi.post("api/uploadJson", {
      name: name,
      description: desc,
      image: image,
      externalLink: externalLink,
      contentType: contentType,
      audio: audio,
    });
    return imgAddedToSanity.data;
  };
  //#endregion

  //#region Community

  const getActiveSuggestions = async () => {
    const active = await marketplaceApi.get("suggestions/activeSuggestions");
    return active.data;
  };
  const createNewSuggestion = async (wallet, title, desc) => {
    await marketplaceApi.post("suggestions/new", {
      wallet: wallet,
      title: title,
      description: desc,
    });
  };
  const voteIntoSuggestion = async (wallet, title, proposer) => {
    await marketplaceApi.post("suggestions/vote", {
      title: title,
      proposer: proposer,
      voter: wallet,
    });
  };
  //#endregion

  //#region Verification

  const getVerificatedArtists = async () => {
    const verified = await marketplaceApi.get("users/verified");
    return verified.data;
  };

  const newVerifyRequest = async (proposer, name, lastName, descr, email) => {
    const newRequest = await marketplaceApi.post("verify/sendRequest", {
      name: name,
      lastName: lastName,
      proposer: proposer,
      description: descr,
      email: email,
    });

    return newRequest.data;
  };

  //#endregion

  //#region Reports
  const createNewReport = async (type, reporter, descr, reported) => {
    const rep = await marketplaceApi.post("admin/newReport", {
      type,
      reporter,
      descr,
      reported,
    });
    return rep.data;
  };
  //#endregion

  //#region Notifications

  const getUserNotifications = async (wallet) => {
    const res = await marketplaceApi.get(`api/notifications?address=${wallet}`);
    return res.data;
  };

  const deleteNotification = async (notificationId) => {
    const res = await marketplaceApi.post(`api/deleteNotification`, {
      notificationId: notificationId,
    });
    return res.data;
  };

  //#endregion
  return {
    getProfileInfo,
    createNewProfile,
    setProfileBanner,
    setProfileImg,
    setUsername,
    getNftsForSale,
    getAllTokens,
    getNftInfo,
    getItemOffers,
    getCollectionInfo,
    checkUrlRepeated,
    checkNameRepeated,
    getUserCollectionOptions,
    getCollectionDetail,
    createUserCollectionOptions,
    addCollectionToWatchlist,
    deleteFromWatchList,
    setShowRedirectToLink,
    getCollectionsAvailable,
    getAllCollections,
    getNftsFromAddress,
    getNftHistory,
    saveMintedItem,
    registerNftRoyalties,
    deleteNftItem,
    addFavorite,
    deleteFavorite,
    saveCollectionDetails,
    searchItemsAndProfiles,
    uploadToCDN,
    uploadJSONMetadata,
    createNewSuggestion,
    voteIntoSuggestion,
    getVerificatedArtists,
    registerSentItem,
    newVerifyRequest,
    setProfileData,
    setUserEmail,
    getNftsFromCreator,
    getWalletHistory,
    getWalletOffers,
    getWalletBids,
    setAcceptedOffer,
    getFavoritesFromAddress,
    getAllPayTokens,
    getPayTokenInfo,
    setImportWFTM,
    setShowRedirectProfile,
    getActiveSuggestions,
    getMyCollections,
    editNftData,
    editCollectionDetails,
    getUserNotifications,
    getItemsFromCollection,
    getAllCategories,
    getWatchlistedCollections,
    deleteNotification,
    createNewReport,
  };
};
