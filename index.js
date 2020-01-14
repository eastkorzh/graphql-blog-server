const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose')
require('dotenv').config();


const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const PostAPI = require('./datasources/post');
const UserAPI = require('./datasources/user');
const AuthAPI = require('./datasources/auth');

const server = new ApolloServer({ 
  context: async ({ req }) => {
    const token = req.headers && req.headers.authorization || null;

    return { token };
  },
  typeDefs,
  resolvers,
  dataSources: () => ({
    postAPI: new PostAPI,
    userAPI: new UserAPI,
    authAPI: new AuthAPI,
  })
});

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true });

server.listen(PORT).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
