// lazy image
import "react-lazy-load-image-component/src/effects/blur.css";
import "simplebar/dist/simplebar.css";

// lightbox
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

// slick-carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// ----------------------------------------------------------------------

import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { createStore, applyMiddleware } from "redux";
import { Provider as ReduxProvider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension";


import rootSaga from "./sagas";

// for Redux store
import reducers from "./reducers";
// theme
import ThemeProvider from "./theme";
// routes
import Router from "./routes";

import AuthProvider from "./auth/JwtContext";

// ----------------------------------------------------------------------

import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

loadErrorMessages()
loadDevMessages()
export default function App() {
  return (
   

    <ReduxProvider store={store}>
      <AuthProvider>
        <ThemeProvider>
          <HelmetProvider>
            <BrowserRouter>
              <Router />
            </BrowserRouter>
          </HelmetProvider>
        </ThemeProvider>
      </AuthProvider>
    </ReduxProvider>
  );
}
