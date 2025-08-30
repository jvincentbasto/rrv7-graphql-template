const Project = require("../../../models/Project");
const Client = require("../../../models/Client");

const { ClientType } = require("./clientSchema");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require("graphql");

const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve(parent, args) {
        return Client.findById(parent.clientId);
      },
    },
  }),
});

const queries = {
  projects: {
    type: new GraphQLList(ProjectType),
    resolve(parent, args) {
      return Project.find();
    },
  },
  project: {
    type: ProjectType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {
      return Project.findById(args.id);
    },
  },
};
const mutations = {
  addProject: {
    type: ProjectType,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: new GraphQLNonNull(GraphQLString) },
      status: {
        type: new GraphQLEnumType({
          name: "ProjectStatus",
          values: {
            new: { value: "Not Started" },
            progress: { value: "In Progress" },
            completed: { value: "Completed" },
          },
        }),
        defaultValue: "Not Started",
      },
      clientId: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve(parent, args) {
      const project = new Project({
        name: args.name,
        description: args.description,
        status: args.status,
        clientId: args.clientId,
      });

      return project.save();
    },
  },
  updateProject: {
    type: ProjectType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLString },
      description: { type: GraphQLString },
      status: {
        type: new GraphQLEnumType({
          name: "ProjectStatusUpdate",
          values: {
            new: { value: "Not Started" },
            progress: { value: "In Progress" },
            completed: { value: "Completed" },
          },
        }),
      },
    },
    resolve(parent, args) {
      return Project.findByIdAndUpdate(
        args.id,
        {
          $set: {
            name: args.name,
            description: args.description,
            status: args.status,
          },
        },
        { new: true }
      );
    },
  },
  deleteProject: {
    type: ProjectType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args) => {
      return await Project.findByIdAndDelete(args.id);
    },
  },
};
const projectSchema = {
  queries,
  mutations,
};

module.exports = {
  projectSchema,
  ProjectType,
};
