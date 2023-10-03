import { Helmet } from "react-helmet-async";

// @mui
import { Container, Typography } from "@mui/material";

import { m } from "framer-motion";
// components
import { MotionContainer, varBounce } from "../components/animate";
// assets
import { ForbiddenIllustration } from "../assets/illustrations";

// routes
import { PATH_DASHBOARD } from "../routes/paths";
// components
import CustomBreadcrumbs from "../components/custom-breadcrumbs";

// ----------------------------------------------------------------------

export default function PermissionDeniedPage() {
  return (
    <>
      <Helmet>
        <title> Other Cases: Permission Denied</title>
      </Helmet>

      <Container maxWidth="lg">
        <CustomBreadcrumbs
          heading="Permission Denied"
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Permission Denied",
            },
          ]}
        />
        <Container component={MotionContainer} sx={{ textAlign: "center" }}>
          <m.div variants={varBounce().in}>
            <Typography variant="h3" paragraph>
              Permission Denied
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <Typography sx={{ color: "text.secondary" }}>
              You do not have permission to access this page
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <ForbiddenIllustration
              sx={{ height: 260, my: { xs: 5, sm: 10 } }}
            />
          </m.div>
        </Container>
      </Container>
    </>
  );
}
