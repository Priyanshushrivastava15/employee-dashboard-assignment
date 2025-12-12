const Employee = require('../models/Employee');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper for Auth Check
const checkAuth = (context) => {
  if (!context.user || context.user.role !== 'admin') {
    throw new Error('Not Authorized');
  }
};

const resolvers = {
  Query: {
    health: () => "Server is Awake!",
    
    getEmployees: async (_, { page = 1, limit = 10, sortBy = 'name', filter }) => {
      const query = {};
      
      // Filtering Logic
      if (filter) {
        if (filter.class) query.class = filter.class;
        if (filter.minAttendance) query.attendance = { $gte: filter.minAttendance };
        if (filter.searchName) query.name = { $regex: filter.searchName, $options: 'i' };
      }

      // Pagination & Sorting Logic
      const totalCount = await Employee.countDocuments(query);
      const employees = await Employee.find(query)
        .sort(sortBy) 
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        employees,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page
      };
    },
    getEmployee: async (_, { id }) => await Employee.findById(id),
  },

  Mutation: {
    // --- Auth Mutations ---
    register: async (_, { username, password, role }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, password: hashedPassword, role });
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return { token, role: user.role };
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error('User not found');
      
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid password');
      
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return { token, role: user.role };
    },

    // --- Employee Mutations ---
    addEmployee: async (_, args, context) => {
      checkAuth(context); 
      return await Employee.create(args);
    },
    updateEmployee: async (_, { id, ...updates }, context) => {
      checkAuth(context);
      return await Employee.findByIdAndUpdate(id, updates, { new: true });
    },
    deleteEmployee: async (_, { id }, context) => {
      checkAuth(context);
      await Employee.findByIdAndDelete(id);
      return "Employee Deleted Successfully";
    }
  }
};

module.exports = resolvers;