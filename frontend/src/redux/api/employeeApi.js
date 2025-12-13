import { createApi } from '@reduxjs/toolkit/query/react';
import { request, gql } from 'graphql-request';
import { config } from '../../config';

const graphqlBaseQuery = ({ baseUrl }) => async ({ body, variables }) => {
  const token = JSON.parse(localStorage.getItem('token') || 'null');
  
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const result = await request(baseUrl, body, variables, headers);
    return { data: result };
  } catch (error) {
    // FIX: Simplified error object to ensure Redux never crashes
    return { 
      error: { 
        status: 500, 
        message: error.message || 'Unknown Error',
        // Only include safe properties
        errors: error.response?.errors || [] 
      } 
    };
  }
};

export const employeeApi = createApi({
  reducerPath: 'employeeApi',
  baseQuery: graphqlBaseQuery({ baseUrl: config.API_URL }),
  tagTypes: ['Employees', 'Employee', 'Classes'], 
  endpoints: (builder) => ({
    getHealth: builder.query({ query: () => ({ body: gql`query Health { health }` }) }),
    
    // FETCH UNIQUE CLASSES
    getUniqueClasses: builder.query({
      query: () => ({
        body: gql`query GetClasses { getUniqueClasses }`
      }),
      providesTags: ['Classes'], 
    }),

    // FETCH EMPLOYEES (With employeeId)
    getEmployees: builder.query({
      query: ({ page, limit, filter, sortBy }) => ({
        body: gql`
          query GetEmployees($page: Int, $limit: Int, $filter: EmployeeFilter, $sortBy: String) {
            getEmployees(page: $page, limit: $limit, filter: $filter, sortBy: $sortBy) {
              employees { 
                id 
                employeeId  
                name 
                age 
                class 
                subjects 
                attendance 
              }
              totalCount
              totalPages
              currentPage
            }
          }
        `,
        variables: { page, limit, filter, sortBy },
      }),
      providesTags: ['Employees'],
    }),

    getEmployee: builder.query({
      query: (id) => ({
        body: gql`
          query GetEmployee($id: ID!) {
            getEmployee(id: $id) { id employeeId name age class subjects attendance }
          }
        `,
        variables: { id },
      }),
      providesTags: (result, error, id) => [{ type: 'Employee', id }],
    }),
    
    addEmployee: builder.mutation({
      query: (employee) => ({
        body: gql`
          mutation AddEmployee($name: String!, $age: Int!, $class: String!, $subjects: [String]!, $attendance: Float!) {
            addEmployee(name: $name, age: $age, class: $class, subjects: $subjects, attendance: $attendance) { id }
          }
        `,
        variables: employee,
      }),
      invalidatesTags: ['Employees', 'Classes'], 
    }),

    updateEmployee: builder.mutation({
      query: ({ id, ...updates }) => ({
        body: gql`
          mutation UpdateEmployee($id: ID!, $name: String, $age: Int, $class: String, $subjects: [String], $attendance: Float) {
            updateEmployee(id: $id, name: $name, age: $age, class: $class, subjects: $subjects, attendance: $attendance) { id }
          }
        `,
        variables: { id, ...updates },
      }),
      invalidatesTags: (result, error, { id }) => ['Employees', { type: 'Employee', id }, 'Classes'],
    }),

    deleteEmployee: builder.mutation({
      query: (id) => ({
        body: gql`mutation Delete($id: ID!) { deleteEmployee(id: $id) }`,
        variables: { id }
      }),
      invalidatesTags: ['Employees', 'Classes'],
    }),
  }),
});

export const { 
  useGetHealthQuery, 
  useGetEmployeesQuery, 
  useGetEmployeeQuery, 
  useGetUniqueClassesQuery, 
  useAddEmployeeMutation, 
  useUpdateEmployeeMutation, 
  useDeleteEmployeeMutation 
} = employeeApi;