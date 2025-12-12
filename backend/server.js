require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./src/config/db');
const typeDefs = require('./src/graphql/typeDefs');
const resolvers = require('./src/graphql/resolvers');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const startServer = async () => {
  const app = express();
  app.use(cors()); // Enable CORS for Frontend

  await connectDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      try {
        if (token) {
          const user = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
          return { user };
        }
      } catch (e) {
        // Invalid token
      }
      return {};
    }
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer();