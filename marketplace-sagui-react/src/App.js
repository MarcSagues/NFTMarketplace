import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useAccount from "./hooks/useAccount";
import ExploreContainer from "./pages/explore/ExploreContainer";
import HomeContainer from "./pages/home/HomeContainer";

import CreateContainer from "./pages/create/CreateContainer";
import ItemPage from "./pages/item/ItemPage";

import ProfileContainer from "./pages/profile/ProfileContainer";
import NotFoundContainer from "./pages/notFound/NotFoundContainer";
import FeaturesContainer from "./pages/features/FeaturesContainer";
import { VerificationFormContainer } from "./pages/verficiation/VerificationFormContainer";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";
import EditContainer from "./pages/edit/EditContainer";
import CreateCollectionContainer from "./pages/collection/create/CreateCollectionContainer";
import { CollectionDetailContainer } from "./pages/collection/detail/CollectionDetailContainer";
import MyCollectionsContainer from "./pages/collection/MyCollectionsContainer";
import EditCollectionContainer from "./pages/collection/edit/EditCollectionContainer";
import ConfigContainer from "./pages/config/ConfigContainer";
import ConfigProfileContainer from "./pages/config/ConfigProfileContainer";
import ConfigNotificationsContainer from "./pages/config/ConfigNotifiactionsContainer";
import ConfigAppeareanceContainer from "./pages/config/ConfigAppeareanceContainer";
import CollectionsContainer from "./pages/collection/CollectionsContainer";

function App() {
  const { theme } = useContext(ThemeContext);
  const { wallet, connectToWallet } = useAccount();

  return (
    <div
      className={`App h-fit dark:bg-dark-1 dark:text-white`}
      data-theme={theme}
    >
      <BrowserRouter>
        <>
          <Navbar wallet={wallet} connectToWallet={connectToWallet} />

          <Routes>
            <Route path="*" element={<NotFoundContainer />} />
            <Route
              path="edit/:collection/:tokenId"
              element={<EditContainer />}
            />

            <Route path="/community" element={<FeaturesContainer />} />
            <Route
              path="/verificate/request"
              element={<VerificationFormContainer />}
            />

            <Route path="/explore" element={<ExploreContainer />} />

            <Route
              path="/explore/:collection/:tokenId"
              element={<ItemPage />}
            />

            <Route path="/account/settings" element={<ConfigContainer />}>
              <Route path="profile" element={<ConfigProfileContainer />} />
              <Route
                path="notifications"
                element={<ConfigNotificationsContainer />}
              />
              <Route
                path="appeareance"
                element={<ConfigAppeareanceContainer />}
              />
            </Route>

            <Route path="/account/:address" element={<ProfileContainer />} />

            <Route path="/myCollections" element={<MyCollectionsContainer />} />
            <Route path="/collections" element={<CollectionsContainer />} />

            <Route
              path="/collection/create"
              element={<CreateCollectionContainer />}
            />

            <Route
              path="/collection/:collection"
              element={<CollectionDetailContainer />}
            />
            <Route
              path="/collection/:collection/create"
              element={<CreateContainer />}
            />

            <Route
              path="/collection/:collection/edit"
              element={<EditCollectionContainer />}
            />

            <Route path="" element={<HomeContainer />} />
          </Routes>
        </>
      </BrowserRouter>
    </div>
  );
}

export default App;
