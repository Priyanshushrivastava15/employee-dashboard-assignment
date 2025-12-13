const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Employee {
    id: ID!
    employeeId: Int  # <--- NEW FIELD
    name: String!
    age: Int!
    class: String!
    subjects: [String]!
    attendance: Float!
  }

  type AuthData {
    token: String!
    role: String!
  }

  type EmployeeResponse {
    employees: [Employee]!
    totalCount: Int!
    totalPages: Int!
    currentPage: Int!
  }

  input EmployeeFilter {
    class: String
    minAttendance: Float
    searchName: String
  }

  type Query {
    health: String
    getEmployees(page: Int, limit: Int, sortBy: String, filter: EmployeeFilter): EmployeeResponse!
    getEmployee(id: ID!): Employee
    getUniqueClasses: [String]! # <--- NEW QUERY
  }

  type Mutation {
    register(username: String!, password: String!, role: String): AuthData!
    login(username: String!, password: String!): AuthData!
    
    addEmployee(name: String!, age: Int!, class: String!, subjects: [String]!, attendance: Float!): Employee!
    updateEmployee(id: ID!, name: String, age: Int, class: String, subjects: [String], attendance: Float): Employee!
    deleteEmployee(id: ID!): String
  }
`;

module.exports = typeDefs;