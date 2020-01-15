module.exports = {
  Query: {
    posts: (_, __, { dataSources }) => dataSources.postAPI.getAllPosts(),
    post: (_, { id }, { dataSources }) => dataSources.postAPI.getPost(id),
    users: (_, __, { dataSources }) => dataSources.userAPI.getAllUsers(),
    user: (_, { id }, { dataSources }) => dataSources.userAPI.getUser(id),
    login: (_, { email, password }, { dataSources }) => 
      dataSources.authAPI.login({ email, password }),
  },
  Mutation: {
    register: (_, { name, email, password }, { dataSources }) => 
      dataSources.authAPI.register({ name, email, password }),
    makePost: (_, { title, description, content }, { dataSources }) =>
      dataSources.postAPI.makePost({ title, description, content }),    
    editPost: (_, { id, title, description, content }, { dataSources }) =>
      dataSources.postAPI.editPost({ id, title, description, content }),    
  }
}
