import PropTypes from "prop-types";

import { connect } from "react-redux";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
// @mui
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { ToggleButton, ToggleButtonGroup, Paper } from "@mui/material";

import Iconify from "../../components/iconify";

import FormProvider, { RHFRadioGroup } from "../../components/hook-form";
//
import IncrementerButton from "./common/incrementer-button";

import { addToCartRequest } from "../../actions/products";

// ----------------------------------------------------------------------

function ProductDetailsSummary({ product, addToCart, user }) {
  const { id, title, description, quantity
    // , color 
  } = product;

  const defaultValues = {
    colorsPicker: 0,
    tonePicker: 0,
    selectedImage: 0,
    available: quantity < 1 ? 0 : 1,
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch, setValue, handleSubmit, getValues } = methods;

  const values = watch();

  useEffect(() => {
    if (product) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const handleAddCart = handleSubmit(async (data) => {
    const cartData = {
      product_id: id,
      quantity: data.available,
      user_id: user.id
      // color_id: color[data.colorsPicker].id,
      // tone_id: color[data.colorsPicker].tone[data.tonePicker].id,
    };

    addToCart(cartData);
  });

  // const handleImageChange = (_, newImageIndex) => {
  //   setValue("selectedImage", newImageIndex);
  // };

  // const renderColorOptions = (
  //   <Stack direction="row">
  //     <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
  //       Color
  //     </Typography>
  //     <RHFRadioGroup
  //       row
  //       name="colorsPicker"
  //       options={[
  //         ...color.map((data, index) => ({ label: data.name, value: index })),
  //       ]}
  //     />
  //   </Stack>
  // );
  // const renderTonerOptions = (
  //   <Stack direction="row">
  //     <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
  //       Tone
  //     </Typography>
  //     {!!color[0].tone.length && (
  //       <RHFRadioGroup
  //         row
  //         name="tonePicker"
  //         options={[
  //           ...color[0].tone.map((data, index) => ({
  //             label: data.name,
  //             value: index,
  //           })),
  //         ]}
  //       />
  //     )}
  //   </Stack>
  // );
  // const renderImageOptions = (
  //   <Paper elevation={3}>
  //     <ToggleButtonGroup
  //       value={values.selectedImage}
  //       exclusive
  //       onChange={handleImageChange}
  //       aria-label="image-selector"
  //       style={{ overflowX: "auto", whiteSpace: "nowrap" }}
  //     >
  //       {(getValues("colorsPicker") || getValues("colorsPicker") === 0) &&
  //         color[`${getValues("colorsPicker")}`].tone.map((data, index) => (
  //           <ToggleButton key={index} value={index}>
  //             <img
  //               src={data.image}
  //               alt={`pic ${index + 1}`}
  //               style={{
  //                 width: "100px", // Adjust the width as needed
  //                 border:
  //                   values.selectedImage === index
  //                     ? "2px solid #007BFF"
  //                     : "2px solid transparent",
  //               }}
  //             />
  //           </ToggleButton>
  //         ))}
  //     </ToggleButtonGroup>
  //   </Paper>
  // );

  const renderQuantity = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Quantity
      </Typography>

      <Stack spacing={1}>
        <IncrementerButton
          name="available"
          quantity={values.available}
          disabledDecrease={values.available <= 1}
          disabledIncrease={values.available >= quantity}
          onIncrease={() => setValue("available", values.available + 1)}
          onDecrease={() => setValue("available", values.available - 1)}
        />

        <Typography
          variant="caption"
          component="div"
          sx={{ textAlign: "right" }}
        >
          Available: {parseInt(quantity, 10)}
        </Typography>
      </Stack>
    </Stack>
  );

  const renderActions = (
    <Stack direction="row" spacing={2}>
      <Button
        fullWidth
        size="large"
        type="submit"
        color="warning"
        variant="contained"
        startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
        // onClick={handleAddCart}
        sx={{ whiteSpace: "nowrap" }}
      >
        Add to Cart
      </Button>
    </Stack>
  );

  const renderSubDescription = (
    <Typography variant="body2" sx={{ color: "text.secondary" }}>
      {description}
    </Typography>
  );

  return (
    <FormProvider methods={methods} onSubmit={handleAddCart}>
      <Stack spacing={3} sx={{ pt: 3 }}>
        <Stack spacing={2} alignItems="flex-start">
          <Typography variant="h5">{title}</Typography>

          {renderSubDescription}
        </Stack>
        <Divider sx={{ borderStyle: "dashed" }} />
        {/* {renderColorOptions}

        {renderTonerOptions}
        {renderImageOptions} */}
        {renderQuantity}
        <Divider sx={{ borderStyle: "dashed" }} />
        {renderActions}
      </Stack>
    </FormProvider>
  );
}

ProductDetailsSummary.propTypes = {
  product: PropTypes.object,
  user: PropTypes.object,
  addToCart: PropTypes.func,
};

export default connect(null, {
  addToCart: addToCartRequest,
})(ProductDetailsSummary);
