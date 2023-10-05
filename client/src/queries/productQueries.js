import { gql } from "@apollo/client";

const GET_ALL_PRODUCT = gql`
  query {
    products {
      id
      title
      description
      quantity
    }
  }
`;

const GET_PRODUCT_BY_ID = gql`
  query getProduct($id: ID!) {
    product(id: $id) {
      id
      title
      description
      quantity
    }
  }
`;

export { GET_ALL_PRODUCT, GET_PRODUCT_BY_ID };
