import PropTypes from "prop-types";
// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { FormHelperText } from "@mui/material";
//
import { Upload } from "../upload";

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

RHFUpload.propTypes = {
  name: PropTypes.string,
  multiple: PropTypes.bool,
  helperText: PropTypes.node,
};

export function RHFUpload({ name, multiple, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Upload
          accept={{ "image/*": [] }}
          file={field.value}
          error={!!error}
          helperText={
            (!!error || helperText) && (
              <FormHelperText error={!!error} sx={{ px: 2 }}>
                {error ? error?.message : helperText}
              </FormHelperText>
            )
          }
          {...other}
        />
      )}
    />
  );
}
