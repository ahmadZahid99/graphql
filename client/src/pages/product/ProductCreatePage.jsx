import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
// @mui
import { Container } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
// routes
import { PATH_AUTH, PATH_DASHBOARD } from "../../routes/paths";
// components
import CustomBreadcrumbs from "../../components/custom-breadcrumbs";
// sections
import ProductNewEditForm from "../../sections/product/ProductNewEditForm";

// actions
import {
  createProductRequest,
  clearMessage,
  clearError,
} from "../../actions/products";

// ----------------------------------------------------------------------

function ProductCreatePage({
  Product: { message, error },
  Auth: { isAuthenticated },
  createProduct,
  clrMessage,
  clrError,
}) {
  const navigate = useNavigate();

  const msgToast = (msg) =>
    toast.success(msg, { autoClose: 5000, onClose: () => clrMessage() });

  const errToast = (err) =>
    toast.error(err, { autoClose: 5000, onClose: () => clrError() });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(PATH_AUTH.login, { replace: true });
    }

    // eslint-disable-next-line
  }, [isAuthenticated]);

  useEffect(() => {
    if (message) {
      msgToast(message);
    }
    if (error) {
      errToast(error);
    }

    // eslint-disable-next-line
  }, [message, error]);

  const handleSubmit = (productData) => {
    createProduct(productData);
  };

  return (
    <>
      <Helmet>
        <title> Products: Create a new product</title>
      </Helmet>
      <ToastContainer />
      <Container maxWidth="lg">
        <CustomBreadcrumbs
          heading="Create a product"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
          links={[
            { name: "Products", href: PATH_DASHBOARD.products.root },
            { name: "New Product" },
          ]}
        />

        <ProductNewEditForm handleSubmited={handleSubmit} />
      </Container>
    </>
  );
}

ProductCreatePage.propTypes = {
  Product: PropTypes.object.isRequired,
  Auth: PropTypes.object.isRequired,
  createProduct: PropTypes.func.isRequired,
  clrMessage: PropTypes.func.isRequired,
  clrError: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  Product: state.Product,
  Auth: state.Auth,
});

export default connect(mapStateToProps, {
  createProduct: createProductRequest,
  clrMessage: clearMessage,
  clrError: clearError,
})(ProductCreatePage);
