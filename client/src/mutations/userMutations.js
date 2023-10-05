import { gql } from "@apollo/client";

const REGISTOR_USER = gql`
  mutation Register($full_name: String!, $email: String!, $password: String!) {
    register(full_name: $full_name, email: $email, password: $password)
  }
`;

const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export { REGISTOR_USER, LOGIN_USER };
