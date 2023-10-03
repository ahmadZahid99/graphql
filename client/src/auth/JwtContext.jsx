import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useEffect, useCallback } from "react";
// utils
import localStorageAvailable from "../utils/localStorageAvailable";
import { isValidToken } from "./utils";
// action
import { getUserRequest, initial, initializeSession } from "../actions/auth";

function AuthProvider({ children, getUser, init, initSession }) {
  const storageAvailable = localStorageAvailable();

  const initialize = useCallback(async () => {
    const accessToken = storageAvailable
      ? localStorage.getItem("x-auth-token")
      : "";
    if (accessToken && isValidToken(accessToken)) {
      initSession(accessToken);

      getUser(accessToken);
    } else {
      init();
    }

    // eslint-disable-next-line
  }, [storageAvailable]);

  useEffect(() => {
    initialize();

    // eslint-disable-next-line
  }, [initialize]);

  return children;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
  getUser: PropTypes.func.isRequired,
  init: PropTypes.func.isRequired,
};

const mapStateToProps = null;

export default connect(mapStateToProps, {
  init: initial,
  getUser: getUserRequest,
  initSession: initializeSession,
})(AuthProvider);
