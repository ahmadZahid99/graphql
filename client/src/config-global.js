// routes
import { PATH_DASHBOARD } from "./routes/paths";

// API
// ----------------------------------------------------------------------

export const HOST_API_KEY = process.env.REACT_APP_HOST_API_KEY || "";

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = PATH_DASHBOARD.products;
