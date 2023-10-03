import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as Yup from "yup";
import { useCallback, useEffect, useMemo } from "react";
// form
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { LoadingButton } from "@mui/lab";
//
import {
  Card,
  Grid,
  Stack,
  Typography,
  Button,
  TextField,
  Divider,
  FormHelperText,
  Box,
} from "@mui/material";

import { fData } from "../../utils/formatNumber";
// components

import Scrollbar from "../../components/scrollbar";
import Iconify from "../../components/iconify";

import FormProvider, { RHFTextField } from "../../components/hook-form";

import { Upload } from "../../components/upload";

// ----------------------------------------------------------------------

const ProductSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  quantity: Yup.string().required("Quantity is required"),
  availableColors: Yup.string().required("availableColors is required"),
  colors: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Colors is required"),
    })
  ),
  tones: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Tones is required"),
    })
  ),
  shades: Yup.array().of(
    Yup.object().shape({
      name: Yup.array().of(Yup.string().required("Shade Name is required")),
    })
  ),
});

function ProductNewEditForm({ isEdit = false, currentUser, handleSubmited }) {
  const defaultValues = useMemo(
    () => ({
      title: currentUser?.availableColors || "",
      description: currentUser?.availableColors || "",
      quantity: currentUser?.quantity || 0,
      availableColors: currentUser?.availableColors || "",
      colors: currentUser?.colors || [],
      tones: currentUser?.tones || [],
      shades: currentUser?.shades || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(ProductSchema),
    defaultValues,
  });
  const {
    reset,
    control,
    setValue,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const {
    fields: colorsFields,
    append: appendColors,
    remove: removeColors,
  } = useFieldArray({
    control,
    name: "colors",
  });

  const {
    fields: tonesFields,
    append: appendTones,
    remove: removeTones,
  } = useFieldArray({
    control,
    name: "tones",
  });

  const {
    fields: shadesFields,
    append: appendShades,
    remove: removeShades,
  } = useFieldArray({
    control,
    name: "shades",
  });

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const DynamicColorField = (colorNumber) => {
    const numberOfColors = parseInt(colorNumber, 10);
    let removeQuantity = 0;
    let addQuantity = 0;

    if (numberOfColors > colorsFields.length) {
      addQuantity = numberOfColors - colorsFields.length;
    } else {
      removeQuantity = colorsFields.length - numberOfColors;
    }

    // Remove all existing color fields
    if (removeQuantity > 0)
      for (let i = colorsFields.length - 1; i >= numberOfColors; i--) {
        shadesFields.map((item) => item.name.pop());
        removeColors(i);
      }

    for (let i = 0; i < addQuantity; i++) {
      shadesFields.map((item) => item.name.push(""));
      appendColors({ name: "" });
    }
  };
  const handleAddition = () => {
    appendTones({
      name: "",
    });
    const numberOfColors = colorsFields.length;

    appendShades({
      name: [...Array(numberOfColors)].map(() => ""),
    });
  };

  const handleDrop = useCallback(
    (acceptedFiles, name) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      console.log(newFile);
      if (file) {
        setValue(name, newFile);
        // setValue('avatarUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const onSubmit = async (inputData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = [];

      // Iterate over each color
      inputData.colors.forEach((color, colorIndex) => {
        // Initialize the color object for the result
        const colorObj = {
          name: color.name,
          tones: [],
        };

        // Iterate over tones and add corresponding shade
        inputData.tones.forEach((tone, toneIndex) => {
          const shade = getValues(`shades[${toneIndex}].name[${colorIndex}]`);
          colorObj.tones.push({
            name: tone.name,
            shade,
          });
        });

        // Add the color object to the result array
        result.push(colorObj);
      });

      const productData = {
        title: inputData.title,
        description: inputData.description,
        quantity: inputData.quantity,
        colors: result,
      };
      console.log(productData);

      handleSubmited(productData);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <RHFTextField name="title" label="Title *" />
                </Grid>
                <Grid item xs={4}>
                  <RHFTextField name="description" label="Description *" />
                </Grid>
                <Grid item xs={4}>
                  <RHFTextField
                    type="number"
                    name="quantity"
                    label="Quantity *"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="availableColors"
                    control={control}
                    defaultValue={null}
                    render={({
                      field: { onChange, value },
                      fieldState: { error, invalid },
                    }) => (
                      <TextField
                        type="number"
                        label="Available Colors *"
                        variant="outlined"
                        value={value}
                        onChange={(e) => {
                          DynamicColorField(e.target.value);
                          onChange(e.target.value);
                        }}
                        error={invalid}
                        helperText={invalid ? error.message : null}
                        id="available_colors"
                        margin="none"
                        fullWidth
                        color="primary"
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Divider variant="middle" sx={{ mt: 2, mb: 2 }} />

              <Scrollbar>
                <Stack direction="column" spacing={1} gap={3} sx={{ mb: 2 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    marginTop={1}
                    spacing={2}
                  >
                    {colorsFields.map((field, index) => (
                      <Controller
                        key={field.id}
                        name={`colors[${index}].name`}
                        control={control}
                        defaultValue=""
                        render={({ field, fieldState: { error, invalid } }) => (
                          <TextField
                            {...field}
                            label="Color Name *"
                            variant="outlined"
                            error={invalid}
                            helperText={invalid ? error.message : null}
                            margin="none"
                            fullWidth
                            color="primary"
                          />
                        )}
                      />
                    ))}
                  </Stack>
                  {tonesFields.map((field, index) => (
                    <Box key={field.id}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Controller
                          name={`tones[${index}].name`}
                          control={control}
                          defaultValue=""
                          render={({
                            field,
                            fieldState: { error, invalid },
                          }) => (
                            <TextField
                              {...field}
                              label="Tone *"
                              variant="outlined"
                              error={invalid}
                              helperText={invalid ? error.message : null}
                              margin="none"
                              fullWidth
                              color="primary"
                            />
                          )}
                        />
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        {shadesFields[index].name.map(
                          (shadefield, shadeindex) => (
                            <Controller
                              key={`${index}${shadeindex}`}
                              name={`shades[${index}].name[${shadeindex}]`}
                              control={control}
                              render={({
                                field,
                                fieldState: { error, invalid },
                              }) => (
                                <Upload
                                  maxSize={3145728}
                                  onDrop={(acceptedFiles) =>
                                    handleDrop(
                                      acceptedFiles,
                                      `shades[${index}].name[${shadeindex}]`
                                    )
                                  }
                                  accept={{ "image/*": [] }}
                                  file={field.value}
                                  error={!!error}
                                  helperText={
                                    !!error && (
                                      <FormHelperText
                                        error={!!error}
                                        sx={{ px: 2 }}
                                      >
                                        {error ? (
                                          error?.message
                                        ) : (
                                          <Typography
                                            variant="caption"
                                            sx={{
                                              display: "block",
                                              textAlign: "center",
                                              color: "text.secondary",
                                            }}
                                          >
                                            Allowed *.jpeg, *.jpg, *.png, *.gif
                                            <br /> max size of {fData(3145728)}
                                          </Typography>
                                        )}
                                      </FormHelperText>
                                    )
                                  }
                                />
                              )}
                            />
                          )
                        )}

                        <Button
                          color="error"
                          sx={{ width: "55px", height: "55px" }}
                          onClick={() => {
                            removeTones(index);
                            removeShades(index);
                          }}
                        >
                          <Iconify
                            sx={{ width: "22px", height: "22px" }}
                            icon="eva:trash-2-outline"
                          />
                        </Button>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Scrollbar>
              <Button
                variant="soft"
                color="warning"
                sx={{ mt: 2 }}
                onClick={() => handleAddition()}
              >
                Additional
              </Button>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="submit"
                  variant="soft"
                  loading={isSubmitting}
                >
                  {!isEdit ? "Submit" : "Save Changes"}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}

ProductNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
  handleSubmited: PropTypes.func,
  handleData: PropTypes.func,
};

export default connect(null, {})(ProductNewEditForm);
