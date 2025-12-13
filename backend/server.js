require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors'); 
const jwt = require('jsonwebtoken');

// CORRECT PATHS for root-level server.js
const connectDB = require('./src/config/db');
const typeDefs = require('./src/graphql/typeDefs');
const resolvers = require('./src/graphql/resolvers');

const startServer = async () => {
  const app = express();

  // 1. ENABLE ROBUST CORS
  // This allows your frontend (localhost:5173) to connect without "Network Errors"
  app.use(cors({
    origin: '*', 
    credentials: true
  }));

  await connectDB();

  // 2. CONTEXT MIDDLEWARE (User Auth)
  const getUser = (token) => {
    if (token) {
      try {
        return jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
      } catch (err) {
        return null;
      }
    }
    return null;
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      const user = getUser(token);
      return { user };
    },
    // 3. ERROR LOGGING (Crucial for debugging)
    formatError: (err) => {
      console.error("GRAPHQL ERROR:", err); // Prints actual error to your terminal
      return err;
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
};

startServer();