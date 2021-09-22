const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (_, args, context) => {
      console.log(await User.findById(context.user._id).populate("books"));
      return await User.findById(context.user._id).populate("books");
    },
  },
  Mutation: {
    removeBook: async (_, args, context) => {
      console.log("removeBook: ---", args.bookId);

      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId: args.bookId } } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    },
    //this is signup
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, args, context) => {
      console.log("resolver: ", context.user);
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: args } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      console.log("in resolver.js login user: ", user);

      if (!user) {
        throw new AuthenticationError("No user with this email found!");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect password!");
      }

      const token = signToken(user);
      return { token, user };
    },
  },
};

module.exports = resolvers;
