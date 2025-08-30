const { GraphQLObjectType, GraphQLSchema } = require("graphql");

const { clientSchema } = require("./clientSchema");
const { projectSchema } = require("./projectSchema");

// queries
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ...clientSchema.queries,
    ...projectSchema.queries,
  },
});

// mutations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    ...clientSchema.mutations,
    ...projectSchema.mutations,
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
module.exports = schema;
