import { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as Yup from "yup";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// @mui
import { Stack, Alert, IconButton, InputAdornment } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

// components
import Iconify from "../../components/iconify";
import FormProvider, { RHFTextField } from "../../components/hook-form";
import { loginUserAction } from "../../actions/auth";
// ----------------------------------------------------------------------

function AuthLoginForm({ Auth: { error }, loginUser }) {
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    password: Yup.string().required("Password is required"),
  });

  const defaultValues = {
    email: "",
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data) => {
    loginUser({ email: data.email, password: data.password });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!error && <Alert severity="error">{error}</Alert>}

        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={(isSubmitSuccessful || isSubmitting) && !error}
        sx={{
          mt: 2,
          bgcolor: "text.primary",
          color: (theme) =>
            theme.palette.mode === "light" ? "common.white" : "grey.800",
          "&:hover": {
            bgcolor: "text.primary",
            color: (theme) =>
              theme.palette.mode === "light" ? "common.white" : "grey.800",
          },
        }}
      >
        Login
      </LoadingButton>
    </FormProvider>
  );
}

AuthLoginForm.propTypes = {
  Auth: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  Auth: state.Auth,
});

export default connect(mapStateToProps, { loginUser: loginUserAction })(
  AuthLoginForm
);
