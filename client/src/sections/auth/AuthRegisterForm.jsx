import { useEffect, memo, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";
import * as Yup from "yup";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import {
  Stack,
  Alert,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
// components
import Iconify from "../../components/iconify";
import FormProvider, { RHFTextField } from "../../components/hook-form";
import {
  registerUserRequest,
  clearError,
  clearMessage,
} from "../../actions/auth";
// routes
import { PATH_AUTH } from "../../routes/paths";

// ----------------------------------------------------------------------

const AuthRegisterForm = ({
  Auth: { error, message },
  registerUser,
  clrError,
  clrMessage,
}) => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (message) {
      navigate(PATH_AUTH.login, { replace: true });
    }

    // eslint-disable-next-line
  }, [message]);

  useEffect(
    () => () => {
      clrMessage();
      clrError();
    },
    // eslint-disable-next-line
    []
  );

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required("Name required"),
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    password: Yup.string().required("Password is required"),
  });

  const defaultValues = {
    name: "",
    email: "",
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data) => {
    registerUser({
      full_name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5}>
        {!!error && <Alert severity="error">{error}</Alert>}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <RHFTextField name="name" label="Full name" />
        </Stack>

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
        <Button
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          sx={{
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
          Create account
        </Button>
      </Stack>
    </FormProvider>
  );
};

AuthRegisterForm.propTypes = {
  Auth: PropTypes.object.isRequired,
  registerUser: PropTypes.func.isRequired,
  clrError: PropTypes.func.isRequired,
  clrMessage: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  Auth: state.Auth,
});

export default connect(mapStateToProps, {
  registerUser: registerUserRequest,
  clrError: clearError,
  clrMessage: clearMessage,
})(memo(AuthRegisterForm));
