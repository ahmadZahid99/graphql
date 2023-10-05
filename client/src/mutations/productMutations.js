import { gql } from "@apollo/client";

const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $title: String!
    $description: String!
    $quantity: Int!
  ) {
    createProduct(title: $title, description: $description, quantity: $quantity)
  }
`;

const ADD_TO_CART = gql`
  mutation AddToCart($user_id: ID!, $product_id: ID!, $quantity: Int!) {
    addToCart(user_id: $user_id, product_id: $product_id, quantity: $quantity) {
      message
      product {
        id
        quantity
        title
        description
      }
    }
  }
`;

export { CREATE_PRODUCT, ADD_TO_CART };
