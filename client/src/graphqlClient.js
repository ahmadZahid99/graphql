import { ApolloClient, InMemoryCache } from "@apollo/client";

const graphqlClient = new ApolloClient({
  uri: "http://localhost:6062/graphql",
  cache: new InMemoryCache(),
});

export default graphqlClient;
