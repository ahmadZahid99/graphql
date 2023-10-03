import PropTypes from "prop-types";
// @mui
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
// ----------------------------------------------------------------------

function LoadingScreen({ sx, ...other }) {
  return (
    <Box
      sx={{
        right: 0,
        bottom: 0,
        zIndex: 9998,
        width: "100%",
        height: "100%",
        position: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...sx,
      }}
      {...other}
    >
      <LinearProgress color="inherit" sx={{ width: 1, maxWidth: 360 }} />
    </Box>
  );
}
LoadingScreen.propTypes = {
  sx: PropTypes.object,
};

export default LoadingScreen;
