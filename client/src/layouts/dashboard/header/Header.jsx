import PropTypes from "prop-types";
// @mui
import { useTheme } from "@mui/material/styles";
import { Stack, AppBar, Toolbar } from "@mui/material";
// utils
import { bgBlur } from "../../../utils/cssStyles";
// components

import AccountPopover from "./AccountPopover";

// ----------------------------------------------------------------------

const Header = () => {
  const theme = useTheme();
  const renderContent = (
    <>
      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1.5 }}
      >
        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        boxShadow: "none",
        height: 64,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(["height"], {
          duration: theme.transitions.duration.shorter,
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default Header;
