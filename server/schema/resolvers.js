const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');

const resolvers = {
    Query: {
        user: async (parent, { user = null, params }) => {
            return User.findOne({
                $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
            });
        }
    },
    Mutation: {
        addUser: async (parent, { body }) => {
            return User.create(body)
        },
        addBook: async (parent, { user, body }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: body } },
                    { new: true, runValidators: true }
                );
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        removeBook: async (parent, { user, params }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: params.bookId } } },
                    { new: true }
                );
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    },
};


module.exports = resolvers;
