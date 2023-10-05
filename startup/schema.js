// const Project = require("../models/Project");
// const Client = require("../models/Client");
const {
  loginUser,
  createUser,
  getUser,
} = require("../src/controllers/user/userController");

const {
  createProduct,
  getAllProducts,
  getProductDetail,
  addToCart,
} = require("../src/controllers/product/productController");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLBoolean,
  GraphQLInt,
} = require("graphql");
const { Users } = require("../src/models/users");

// // Project Type
// const ProjectType = new GraphQLObjectType({
//   name: "Project",
//   fields: () => ({
//     id: { type: GraphQLID },
//     name: { type: GraphQLString },
//     description: { type: GraphQLString },
//     status: { type: GraphQLString },
//     client: {
//       type: ClientType,
//       resolve(parent, args) {
//         return Client.findById(parent.clientId);
//       },
//     },
//   }),
// });

// // Client Type
// const ClientType = new GraphQLObjectType({
//   name: "Client",
//   fields: () => ({
//     id: { type: GraphQLID },
//     name: { type: GraphQLString },
//     email: { type: GraphQLString },
//     phone: { type: GraphQLString },
//   }),
// });

// const RootQuery = new GraphQLObjectType({
//   name: "RootQueryType",
//   fields: {
//     projects: {
//       type: new GraphQLList(ProjectType),
//       resolve(parent, args) {
//         return Project.find();
//       },
//     },
//     project: {
//       type: ProjectType,
//       args: { id: { type: GraphQLID } },
//       resolve(parent, args) {
//         return Project.findById(args.id);
//       },
//     },
//     clients: {
//       type: new GraphQLList(ClientType),
//       resolve(parent, args) {
//         return Client.find();
//       },
//     },
//     client: {
//       type: ClientType,
//       args: { id: { type: GraphQLID } },
//       resolve(parent, args) {
//         return Client.findById(args.id);
//       },
//     },
//   },
// });

// // Mutations
// const mutation = new GraphQLObjectType({
//   name: "Mutation",
//   fields: {
//     // Add a client
//     addClient: {
//       type: ClientType,
//       args: {
//         name: { type: GraphQLNonNull(GraphQLString) },
//         email: { type: GraphQLNonNull(GraphQLString) },
//         phone: { type: GraphQLNonNull(GraphQLString) },
//       },
//       resolve(parent, args) {
//         const client = new Client({
//           name: args.name,
//           email: args.email,
//           phone: args.phone,
//         });

//         return client.save();
//       },
//     },
//     // Delete a Client
//     deleteClient: {
//       type: ClientType,
//       args: {
//         id: { type: GraphQLNonNull(GraphQLID) },
//       },
//       resolve(parent, args) {
//         return Client.findByIdAndRemove(args.id);
//       },
//     },

//     // Add a Project
//     addProject: {
//       type: ProjectType,
//       args: {
//         name: { type: GraphQLNonNull(GraphQLString) },
//         description: { type: GraphQLNonNull(GraphQLString) },
//         status: {
//           type: new GraphQLEnumType({
//             name: "ProjectStatus",
//             values: {
//               new: { value: "Not Started" },
//               progress: { value: "In Progress" },
//               completed: { value: "Completed" },
//             },
//           }),
//           defaultValue: "Not Started",
//         },
//         clientId: { type: GraphQLNonNull(GraphQLID) },
//       },
//       resolve(parent, args) {
//         const project = new Project({
//           name: args.name,
//           description: args.description,
//           status: args.status,
//           clientId: args.clientId,
//         });

//         return project.save();
//       },
//     },
//     // Delete a Project
//     deleteProject: {
//       type: ProjectType,
//       args: {
//         id: { type: GraphQLNonNull(GraphQLID) },
//       },
//       resolve(parent, args) {
//         return Project.findByIdAndRemove(args.id);
//       },
//     },

//     updateProject: {
//       type: ProjectType,
//       args: {
//         id: { type: GraphQLNonNull(GraphQLID) },
//         name: { type: GraphQLString },
//         description: { type: GraphQLString },
//         status: {
//           type: new GraphQLEnumType({
//             name: "ProjectStatusUpdate",
//             values: {
//               new: { value: "Not Started" },
//               progress: { value: "In Progress" },
//               completed: { value: "Completed" },
//             },
//           }),
//         },
//       },
//       resolve(parent, args) {
//         return Project.findByIdAndUpdate(
//           args.id,
//           {
//             $set: {
//               name: args.name,
//               description: args.description,
//               status: args.status,
//             },
//           },
//           { new: true }
//         );
//       },
//     },
//   },
// });

// User Type
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    full_name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    is_admin: { type: GraphQLBoolean },
  }),
});

// Product Type
const ProductType = new GraphQLObjectType({
  name: "Product",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    quantity: { type: GraphQLInt },
  }),
});

const AddToCartType = new GraphQLObjectType({
  name: "AddToCart",
  fields: () => ({
    product: {
      type: ProductType,
    },
    message: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { token: { type: GraphQLString } },
      resolve(parent, args) {
        return getUser(args);
      },
    },
    products: {
      type: new GraphQLList(ProductType),
      resolve(parent, args) {
        return getAllProducts();
      },
    },
    product: {
      type: ProductType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return getProductDetail(args);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    login: {
      type: GraphQLString,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return loginUser(args);
      },
    },
    register: {
      type: GraphQLString,
      args: {
        full_name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        is_admin: { type: GraphQLBoolean, defaultValue: false },
      },
      resolve(parent, args) {
        return createUser(args);
      },
    },
    createProduct: {
      type: GraphQLString,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        quantity: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        return createProduct(args);
      },
    },
    addToCart: {
      type: AddToCartType,
      args: {
        product_id: { type: new GraphQLNonNull(GraphQLID) },
        user_id: { type: new GraphQLNonNull(GraphQLID) },
        quantity: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        return addToCart(args);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
