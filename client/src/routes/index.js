import { Navigate, useRoutes } from "react-router-dom";
// auth
import AuthGuard from "../auth/AuthGuard";
import GuestGuard from "../auth/GuestGuard";
import RoleGuard from "../auth/RoleGuard";
// layouts
import CompactLayout from "../layouts/compact";
import DashboardLayout from "../layouts/dashboard";
// config
import { PATH_AFTER_LOGIN } from "../config-global";
//
import {
  Page404,
  LoginPage,
  RegisterPage,
  ProductList,
  ProductCreatePage,
  ProductDetails,
} from "./elements";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: "/",
      children: [
        {
          element: <RoleGuard PATH_AFTER_LOGIN={PATH_AFTER_LOGIN}></RoleGuard>,
          index: true,
        },
        {
          path: "login",
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          path: "register",
          element: (
            <GuestGuard>
              <RegisterPage />
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: "/",
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        {
          element: <RoleGuard PATH_AFTER_LOGIN={PATH_AFTER_LOGIN}></RoleGuard>,
          index: true,
        },

        {
          path: "products",
          children: [
            {
              element: <ProductList />,
              index: true,
            },

            {
              path: "create",
              element: (
                <RoleGuard>
                  <ProductCreatePage />
                </RoleGuard>
              ),
            },
            {
              path: "details/:id",
              element: <ProductDetails />,
            },
          ],
        },
      ],
    },
    {
      element: <CompactLayout />,
      children: [{ path: "404", element: <Page404 /> }],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
