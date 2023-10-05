import PropTypes from "prop-types";
import { connect } from "react-redux";
import { memo, useEffect } from "react";
import { Helmet } from "react-helmet-async";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// @mui
import { Container, Grid } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
// routes
import { PATH_AUTH, PATH_DASHBOARD } from "../../routes/paths";
// components

import CustomBreadcrumbs from "../../components/custom-breadcrumbs";
// import ProductDetailsCarousel from "../../sections/product/ProductDetailsCarousel";
import ProductDetailsSummary from "../../sections/product/ProductDetailsSummary";
// action
import {
  getProductByIdRequest,
  clearProduct,
  clearMessage,
  clearError,
} from "../../actions/products";

// ----------------------------------------------------------------------

const OrderDetails = memo(
  ({
    Product: { product, message, error },
    Auth: { isAuthenticated,user },
    getProductById,
    clrProduct,
    clrMessage,
    clrError,
  }) => {
    const navigate = useNavigate();

    const location = useLocation();

    const msgToast = (msg) =>
      toast.success(msg, { autoClose: 5000, onClose: () => clrMessage() });

    const errToast = (err) =>
      toast.error(err, { autoClose: 5000, onClose: () => clrError() });

    useEffect(() => {
      getProductById(location.pathname.split("/").slice(-1)[0]);

      // eslint-disable-next-line
    }, []);

    useEffect(() => {
      if (!isAuthenticated) {
        navigate(PATH_AUTH.login, { replace: true });
      }
      if (message) {
        msgToast(message);
      }
      if (error) {
        errToast(error, { variant: "error" });
      }

      // eslint-disable-next-line
    }, [isAuthenticated, message, error]);

    // Clear Every List
    useEffect(
      () => () => {
        clrProduct();
      },
      // eslint-disable-next-line
      []
    );

    return (
      <>
        <Helmet>
          <title> Product Details | Buggaz Ltd</title>
        </Helmet>
        <ToastContainer />
        <Container maxWidth="lg">
          <CustomBreadcrumbs
            heading="Product Details"
            links={[
              { name: "Product", href: PATH_DASHBOARD.products.root },
              { name: "Product Details" },
            ]}
          />
          {product && (
            <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
              {/* <Grid item xs={12} md={6} lg={7}>
                <ProductDetailsCarousel product={product} />
              </Grid> */}

              <Grid item xs={12} md={6} lg={5}>
                <ProductDetailsSummary product={product} user={user} />
              </Grid>
            </Grid>
          )}
        </Container>
      </>
    );
  }
);

OrderDetails.propTypes = {
  Product: PropTypes.object.isRequired,
  Auth: PropTypes.object.isRequired,
  getProductById: PropTypes.func.isRequired,
  clrProduct: PropTypes.func.isRequired,
  clrMessage: PropTypes.func.isRequired,
  clrError: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  Product: state.Product,
  Auth: state.Auth,
});

export default connect(mapStateToProps, {
  getProductById: getProductByIdRequest,
  clrProduct: clearProduct,
  clrMessage: clearMessage,
  clrError: clearError,
})(OrderDetails);
