import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useEffect, useState } from "react";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
// routes
import { PATH_DASHBOARD, PATH_AUTH } from "../../../routes/paths";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Iconify from "../../../components/iconify";
import EmptyContent from "../../../components/empty-content";

import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
//
import ProductList from "../ProductList";
import ProductTableToolbar from "../ProductTableToolbar";
import {
  getProductRequest,
  clearProductList,
  clearError,
} from "../../../actions/products";

// ----------------------------------------------------------------------

function ProductListView({
  Product: { error, productList },
  Auth: { isAuthenticated, user },
  getProduct,
  clrProductList,
  // clrMessage,
  clrError,
}) {
  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState("");
  const navigate = useNavigate();
  // const msgToast = (msg) =>
  //   toast.success(msg, { autoClose: 5000, onClose: () => clrMessage() });

  const errToast = (err) => toast.error(err, { autoClose: 5000 });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(PATH_AUTH.login, { replace: true });
    }

    if (productList == null) {
      getProduct();
    } else {
      setTableData(productList);
    }

    // eslint-disable-next-line
  }, [isAuthenticated, productList]);

  useEffect(() => {
    // if (message) {
    //   msgToast(message);
    // }
    if (error) {
      errToast(error);
    }

    // eslint-disable-next-line
  }, [error]);

  useEffect(
    () => () => {
      clrProductList();
      clrError();
    },
    // eslint-disable-next-line
    []
  );

  const dataFiltered = applyFilter({
    inputData: tableData,
    filterName,
  });

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  };

  const handleResetFilter = () => {
    setFilterName("");
  };

  const isFiltered = filterName !== "";

  const isNotFound =
    (!dataFiltered.length && !!filterName) || !dataFiltered.length;

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Product List"
        links={[{ name: "Product", href: PATH_DASHBOARD.productList }]}
        action={
          <>
            {user?.is_admin && (
              <Button
                component={RouterLink}
                to={PATH_DASHBOARD.products.create}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                New Product
              </Button>
            )}
          </>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <ToastContainer />
      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <ProductTableToolbar
          isFiltered={isFiltered}
          filterName={filterName}
          onFilterName={handleFilterName}
          onResetFilter={handleResetFilter}
        />
      </Stack>
      {isNotFound && <EmptyContent title="No Data" sx={{ py: 10 }} />}
      <ProductList products={dataFiltered} />
    </Container>
  );
}

ProductListView.propTypes = {
  Product: PropTypes.object.isRequired,
  Auth: PropTypes.object.isRequired,
  getProduct: PropTypes.func.isRequired,
  // clrMessage: PropTypes.func.isRequired,
  clrError: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  Product: state.Product,
  Auth: state.Auth,
});

export default connect(mapStateToProps, {
  getProduct: getProductRequest,
  clrProductList: clearProductList,
  // clrMessage: clearMessage,
  clrError: clearError,
})(ProductListView);

function applyFilter({ inputData, filterName }) {
  if (filterName) {
    inputData = inputData.filter(
      (user) =>
        user.title.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}
