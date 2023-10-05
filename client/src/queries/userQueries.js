import { gql } from "@apollo/client";

const GET_USER = gql`
  query getUser($token: String!) {
    user(token: $token) {
      id
      full_name
      email
      is_admin
    }
  }
`;

export { GET_USER };
