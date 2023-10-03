// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = "/";

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: "/login",
  register: "/register",
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,

  products: {
    root: path(ROOTS_DASHBOARD, "products"),
    create: path(ROOTS_DASHBOARD, "products/create"),
    details: (id) => path(ROOTS_DASHBOARD, `products/details/${id}`),
  },
};
