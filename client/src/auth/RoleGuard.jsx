import PropTypes from "prop-types";
import { connect } from "react-redux";
import PermissionDeniedPage from "../pages/PermissionDeniedPage";
import { Navigate } from "react-router-dom";
// ----------------------------------------------------------------------

function RoleGuard({ Auth: { user }, children, PATH_AFTER_LOGIN }) {
  if (!PATH_AFTER_LOGIN) {
    return user?.is_admin ? <> {children} </> : <PermissionDeniedPage />;
  } else {
    return (
      <Navigate
        to={user?.is_admin ? PATH_AFTER_LOGIN.create : PATH_AFTER_LOGIN.root}
        replace
      />
    );
  }
}

RoleGuard.propTypes = {
  children: PropTypes.node,
  Auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  Auth: state.Auth,
});

export default connect(mapStateToProps, {})(RoleGuard);
