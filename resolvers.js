module.exports = {
  Query: {
    posts: (_, __, { dataSources }) => dataSources.postAPI.getAllPosts(),
    post: (_, { _id }, { dataSources }) => dataSources.postAPI.getPost(_id),

    drafts: (_, __, { dataSources }) => dataSources.postAPI.getAllDrafts(),
    draft: (_, { _id }, { dataSources }) => dataSources.postAPI.getDraft({ _id }),

    users: (_, __, { dataSources }) => dataSources.userAPI.getAllUsers(),
    user: (_, { id }, { dataSources }) => dataSources.userAPI.getUser(id),
    me: (_, __, { dataSources }) => dataSources.userAPI.getLoggedUser(),
    login: (_, { email, password }, { dataSources }) => 
      dataSources.authAPI.login({ email, password }),
  },
  Mutation: {    
    // Draft
    createDraft: (_, { title, content, _id }, { dataSources }) =>
      dataSources.postAPI.createDraft({ title, content, _id }),

    updateDraft: (_, { title, content, cover, _id }, { dataSources }) =>
      dataSources.postAPI.updateDraft({ title, content, cover, _id }),

    deleteDraft: (_, { _id }, { dataSources }) =>
      dataSources.postAPI.deleteDraft({ _id }),

    publishDraft: (_, { _id }, { dataSources }) => 
      dataSources.postAPI.publishDraft({ _id }),

    // Post
    editPost: (_, { postId, draftId }, { dataSources }) =>
      dataSources.postAPI.editPost({ postId, draftId }),

    deletePost: (_, { _id }, { dataSources }) =>
      dataSources.postAPI.deletePost({ _id }),

    // User
    register: (_, { name, email, password }, { dataSources }) => 
      dataSources.authAPI.register({ name, email, password }),

    updateUserName: (_, { newName }, { dataSources }) =>
      dataSources.userAPI.updateUserName({ newName }),

    updateUserEmail: (_, { newEmail }, { dataSources }) =>
      dataSources.userAPI.updateUserEmail({ newEmail }),

    updateUserPassword: (_, { oldPassword, newPassword }, { dataSources }) =>
      dataSources.userAPI.updateUserPassword({ oldPassword, newPassword }),

    updateUserAvatar: (_, { file }, { dataSources }) =>
      dataSources.userAPI.updateUserAvatar({ file }),

    // File uploading
    addPhoto: (_, { file, id }, { dataSources }) =>
      dataSources.postAPI.addPhoto({ file, id }),
  }
}
