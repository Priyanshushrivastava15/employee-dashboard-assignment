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
      return { error: result.errors[0] || { message: 'An unknown GraphQL error occurred.' } };
    }

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

    // Health query
    getHealth: builder.query({
      query: () => ({
        document: gql`
          query Health {
            health
          }
        `,
      }),
    }),
    
    // QUERY EMPLOYEE DATA (Fixed Input Type: EmployeeFilter)
    getEmployees: builder.query({
      query: ({ page, limit, sortBy, filter }) => ({
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

    // --- MUTATIONS (FINAL FIX: Dynamic Token Retrieval AND Parsing) ---
    addEmployee: builder.mutation({
      query: (employeeData) => {
        let token = localStorage.getItem('token');
        if (token) {
            try {
                // CRITICAL FIX: Parse the token string from localStorage JSON
                token = JSON.parse(token); 
            } catch (e) {
                token = null; 
            }
        }
        
        return ({
          document: gql`
            mutation AddEmployee($name: String!, $age: Int!, $class: String!, $subjects: [String]!, $attendance: Float!) {
              addEmployee(name: $name, age: $age, class: $class, subjects: $subjects, attendance: $attendance) {
                id
                name
              }
            }
          `,
          variables: employeeData,
          customHeaders: token ? { Authorization: `Bearer ${token}` } : {},
        });
      },
      invalidatesTags: ['Employee', 'Class'],
    }),

    updateEmployee: builder.mutation({
      query: ({ id, ...employeeData }) => {
        let token = localStorage.getItem('token');
        if (token) {
            try {
                // CRITICAL FIX: Parse the token string from localStorage JSON
                token = JSON.parse(token); 
            } catch (e) {
                token = null; 
            }
        }
        return ({
          document: gql`
            mutation UpdateEmployee($id: ID!, $name: String, $age: Int, $class: String, $subjects: [String], $attendance: Float) {
              updateEmployee(id: $id, name: $name, age: $age, class: $class, subjects: $subjects, attendance: $attendance) {
                id
                name
              }
            }
          `,
          variables: { id, ...employeeData },
          customHeaders: token ? { Authorization: `Bearer ${token}` } : {},
        });
      },
      invalidatesTags: (result, error, { id }) => ['Employee', { type: 'Employee', id }, 'Class'],
    }),

    deleteEmployee: builder.mutation({
      query: (id) => {
        let token = localStorage.getItem('token');
        if (token) {
            try {
                // CRITICAL FIX: Parse the token string from localStorage JSON
                token = JSON.parse(token); 
            } catch (e) {
                token = null; 
            }
        }
        return ({
          document: gql`
            mutation DeleteEmployee($id: ID!) {
              deleteEmployee(id: $id)
            }
          `,
          variables: { id },
          customHeaders: token ? { Authorization: `Bearer ${token}` } : {},
        });
      },
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