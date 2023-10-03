import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
// components
import LoadingScreen from "../components/loading-screen";

// ----------------------------------------------------------------------

function GuestGuard({
  children,
  Auth: { isAuthenticated, user, isInitialized },
}) {
  if (isAuthenticated) {
    return (
      <Navigate to={`/${user.is_admin ? "products/create" : "products"}`} />
    );
  }

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <> {children} </>;
}

GuestGuard.propTypes = {
  Auth: PropTypes.object.isRequired,
  children: PropTypes.node,
};

const mapStateToProps = (state) => ({
  Auth: state.Auth,
});

export default connect(mapStateToProps, {})(GuestGuard);
