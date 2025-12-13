require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors'); 
const jwt = require('jsonwebtoken');

// CORRECT PATHS
const connectDB = require('./src/config/db');
const typeDefs = require('./src/graphql/typeDefs');
const resolvers = require('./src/graphql/resolvers');

// --- ROBUST TOKEN EXTRACTION FUNCTION ---
const getUser = (token) => {
  // 1. Check if the token exists AND starts with the required "Bearer " prefix
  if (token && token.startsWith('Bearer ')) {
    // 2. Safely remove the "Bearer " prefix to get the raw token string
    const tokenString = token.substring(7); 
    try {
      // 3. Verify the token using your JWT_SECRET
      return jwt.verify(tokenString, process.env.JWT_SECRET);
    } catch (err) {
      // 4. Log failure (e.g., token expired or tampered)
      console.error("JWT Verification failed:", err.message); 
      return null;
    }
  }
  // If token is missing or malformed, return null
  return null;
};

const startServer = async () => {
  const app = express();

  // 1. CORS
  app.use(cors({
    origin: '*', 
    credentials: true
  }));

  await connectDB();

  // 2. APOLLO SERVER CONTEXT
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Get the authorization header value
      const token = req.headers.authorization || '';
      // Decode the user payload
      const user = getUser(token); 
      // Attach the user (containing id and role) to the context
      return { user };
    },
    // 3. ERROR LOGGING 
    formatError: (err) => {
      console.error("GRAPHQL ERROR:", err); 
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