module.exports = {
  Query: {
    uploads: (parent, args) => {},
    posts: (_, __, { dataSources }) => dataSources.postAPI.getAllPosts(),
    post: (_, { id }, { dataSources }) => dataSources.postAPI.getPost(id),
    users: (_, __, { dataSources }) => dataSources.userAPI.getAllUsers(),
    user: (_, { id }, { dataSources }) => dataSources.userAPI.getUser(id),
    me: (_, __, { dataSources }) => dataSources.userAPI.getLoggedUser(),
    login: (_, { email, password }, { dataSources }) => 
      dataSources.authAPI.login({ email, password }),
  },
  Mutation: {
    async singleUpload(parent, { file }) {
      const { filename, mimetype, encoding } = await file;
      console.log(file)
      // 1. Validate file metadata.

      // 2. Stream file contents into cloud storage:
      // https://nodejs.org/api/stream.html

      // 3. Record the file upload in your DB.
      // const id = await recordFile( … )

      return { filename, mimetype, encoding };
    },
    register: (_, { name, email, password }, { dataSources }) => 
      dataSources.authAPI.register({ name, email, password }),
    makePost: (_, { title, description, content }, { dataSources }) =>
      dataSources.postAPI.makePost({ title, description, content }),    
    editPost: (_, { id, title, description, content }, { dataSources }) =>
      dataSources.postAPI.editPost({ id, title, description, content }),        
    deletePost: (_, { id }, { dataSources }) =>
      dataSources.postAPI.deletePost({ id }),
  }
}
