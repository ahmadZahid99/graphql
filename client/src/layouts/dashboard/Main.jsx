import PropTypes from "prop-types";
// @mui
import { Box } from "@mui/material";

// ----------------------------------------------------------------------

const SPACING = 8;

Main.propTypes = {
  sx: PropTypes.object,
  children: PropTypes.node,
};

export default function Main({ children, sx, ...other }) {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        px: 2,
        py: `${92 + SPACING}px`,
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}
