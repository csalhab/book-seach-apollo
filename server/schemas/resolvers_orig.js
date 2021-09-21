const { Book, User } = require("../models");

const resolvers = {
  Query: {
    me: async () => {
      return await User.findById(args.id).populate("books");
    },
  },
  Mutation: {
    removeBook: async () => {
      return await User.remove(args.bookId);
    },
  },
};

module.exports = resolvers;
