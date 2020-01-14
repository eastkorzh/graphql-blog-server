const jwt = require('jsonwebtoken');
const { ApolloError } = require('apollo-server');

module.exports = (token) => {
  if (!token) throw new ApolloError('Authorization header expected')

  const verifyed = jwt.verify(token, process.env.SECRET_TOKEN);

  return verifyed;
}