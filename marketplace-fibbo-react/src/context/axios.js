import axios from "axios";

const herokuURL = "https://fibbo-market-api.herokuapp.com/";
const localURL = "http://localhost:9000/";

const marketplaceApi = axios.create({ baseURL: localURL });

export default marketplaceApi;
