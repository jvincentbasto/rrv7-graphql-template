const Client = require("../../../models/Client");
const Project = require("../../../models/Project");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");

const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

const queries = {
  clients: {
    type: new GraphQLList(ClientType),
    resolve(parent, args) {
      return Client.find();
    },
  },
  client: {
    type: ClientType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {
      return Client.findById(args.id);
    },
  },
};
const mutations = {
  // client
  addClient: {
    type: ClientType,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },
      phone: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve(parent, args) {
      const client = new Client({
        name: args.name,
        email: args.email,
        phone: args.phone,
      });

      return client.save();
    },
  },
  deleteClient: {
    type: ClientType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    async resolve(parent, args) {
      await Project.deleteMany({ clientId: args.id });

      return Client.findByIdAndDelete(args.id);
    },
  },
};
const clientSchema = {
  queries,
  mutations,
};

module.exports = {
  clientSchema,
  ClientType,
};
