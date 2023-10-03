import PropTypes from "prop-types";
// @mui
import Box from "@mui/material/Box";

import Pagination, { paginationClasses } from "@mui/material/Pagination";
import ProductItem from "./ProductItem";

// ----------------------------------------------------------------------

export default function ProductList({ products }) {
  return (
    <>
      {products.length && (
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          }}
        >
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </Box>
      )}

      {products.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: "center",
            },
          }}
        />
      )}
    </>
  );
}

ProductList.propTypes = {
  products: PropTypes.array,
};
