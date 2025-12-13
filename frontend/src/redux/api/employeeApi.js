import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import { config } from '../../config';

// Custom base query function for GraphQL
const graphqlBaseQuery = ({ baseUrl }) => async ({ document, variables, customHeaders }) => {
  const endpoint = `${baseUrl}/graphql`;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...customHeaders,
      },
      body: JSON.stringify({
        query: document,
        variables,
      }),
    });

    const result = await response.json();

    if (result.errors) {
      // RTK Query expects the error to be in the error object, not the data
      return { error: result.errors[0] || { message: 'An unknown GraphQL error occurred.' } };
    }

    // RTK Query expects the data to be in the data object
    return { data: result.data };

  } catch (error) {
    return { error: { status: 'FETCH_ERROR', message: error.message || 'Network request failed' } };
  }
};

export const employeeApi = createApi({
  reducerPath: 'employeeApi',
  baseQuery: graphqlBaseQuery({ baseUrl: config.API_URL }),
  tagTypes: ['Employee', 'Class'],
  endpoints: (builder) => ({

    // --- 1. HEALTH CHECK QUERY (Required for StatusCheck.jsx) ---
    getHealth: builder.query({
      query: () => ({
        document: gql`
          query Health {
            health
          }
        `,
      }),
    }),
    
    // --- 2. QUERY EMPLOYEE DATA (Fixed and Cleaned) ---
    getEmployees: builder.query({
      query: ({ page, limit, sortBy, filter }) => ({
        // FIXED: Using "EmployeeFilter" (as defined in typeDefs.js)
        document: gql`
          query GetEmployees($page: Int, $limit: Int, $sortBy: String, $filter: EmployeeFilter) {
            getEmployees(page: $page, limit: $limit, sortBy: $sortBy, filter: $filter) {
              employees {
                id
                employeeId
                name
                age
                class
                subjects
                attendance
                # Removed status and performance fields to match the schema
              }
              totalPages
              currentPage
              totalCount
            }
          }
        `,
        variables: { page, limit, sortBy, filter },
      }),
      providesTags: ['Employee'],
    }),

    getEmployee: builder.query({
      query: (id) => ({
        document: gql`
          query GetEmployee($id: ID!) {
            getEmployee(id: $id) {
              id
              employeeId
              name
              age
              class
              subjects
              attendance
            }
          }
        `,
        variables: { id },
      }),
      providesTags: (result, error, id) => [{ type: 'Employee', id }],
    }),
    
    // Dynamic Filter Query
    getUniqueClasses: builder.query({
      query: () => ({
        document: gql`
          query GetUniqueClasses {
            getUniqueClasses
          }
        `,
      }),
      providesTags: ['Class'],
    }),

    // Mutations
    addEmployee: builder.mutation({
      query: (employeeData) => ({
        document: gql`
          mutation AddEmployee($input: EmployeeInput!) {
            addEmployee(input: $input) {
              id
              name
            }
          }
        `,
        variables: { input: employeeData },
        customHeaders: { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      }),
      invalidatesTags: ['Employee', 'Class'],
    }),

    updateEmployee: builder.mutation({
      query: ({ id, ...employeeData }) => ({
        document: gql`
          mutation UpdateEmployee($id: ID!, $input: EmployeeUpdateInput!) {
            updateEmployee(id: $id, input: $input) {
              id
              name
            }
          }
        `,
        variables: { id, input: employeeData },
        customHeaders: { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      }),
      invalidatesTags: (result, error, { id }) => ['Employee', { type: 'Employee', id }, 'Class'],
    }),

    deleteEmployee: builder.mutation({
      query: (id) => ({
        document: gql`
          mutation DeleteEmployee($id: ID!) {
            deleteEmployee(id: $id)
          }
        `,
        variables: { id },
        customHeaders: { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      }),
      invalidatesTags: ['Employee', 'Class'],
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
  useDeleteEmployeeMutation,
} = employeeApi;