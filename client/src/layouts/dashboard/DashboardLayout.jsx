import { Outlet } from "react-router-dom";
// @mui
import { Box } from "@mui/material";

//
import Main from "./Main";
import Header from "./header";

// ----------------------------------------------------------------------

function DashboardLayout() {
  return (
    <>
      <Header />

      <Box
        sx={{
          display: { lg: "flex" },
          minHeight: { lg: 1 },
        }}
      >
        <Main>
          <Outlet />
        </Main>
      </Box>
    </>
  );
}

export default DashboardLayout;
