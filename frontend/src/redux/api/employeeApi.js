import { createApi } from '@reduxjs/toolkit/query/react';
import { request, gql } from 'graphql-request';
import { config } from '../../config';

const graphqlBaseQuery = ({ baseUrl }) => async ({ body, variables }) => {
  // CORRECTION: Get token directly from 'token' key, not inside a 'user' object
  const token = JSON.parse(localStorage.getItem('token') || 'null');
  
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const result = await request(baseUrl, body, variables, headers);
    return { data: result };
  } catch (error) {
    return { error: { status: 500, data: error } };
  }
};

export const employeeApi = createApi({
  reducerPath: 'employeeApi',
  baseQuery: graphqlBaseQuery({ baseUrl: config.API_URL }),
  tagTypes: ['Employees'],
  endpoints: (builder) => ({
    getHealth: builder.query({
      query: () => ({
        body: gql`query Health { health }`,
      }),
    }),
    
    getEmployees: builder.query({
      query: ({ page, limit, filter }) => ({
        body: gql`
          query GetEmployees($page: Int, $limit: Int, $filter: EmployeeFilter) {
            getEmployees(page: $page, limit: $limit, filter: $filter) {
              employees { id name age class subjects attendance }
              totalCount
              totalPages
            }
          }
        `,
        variables: { page, limit, filter },
      }),
      providesTags: ['Employees'],
    }),
    
    addEmployee: builder.mutation({
      query: (employee) => ({
        body: gql`
          mutation AddEmployee($name: String!, $age: Int!, $class: String!, $subjects: [String]!, $attendance: Float!) {
            addEmployee(name: $name, age: $age, class: $class, subjects: $subjects, attendance: $attendance) {
              id
            }
          }
        `,
        variables: employee,
      }),
      invalidatesTags: ['Employees'],
    }),

    updateEmployee: builder.mutation({
      query: ({ id, ...updates }) => ({
        body: gql`
          mutation UpdateEmployee($id: ID!, $name: String, $age: Int, $class: String, $subjects: [String], $attendance: Float) {
            updateEmployee(id: $id, name: $name, age: $age, class: $class, subjects: $subjects, attendance: $attendance) {
              id
            }
          }
        `,
        variables: { id, ...updates },
      }),
      invalidatesTags: ['Employees'],
    }),

    deleteEmployee: builder.mutation({
      query: (id) => ({
        body: gql`mutation Delete($id: ID!) { deleteEmployee(id: $id) }`,
        variables: { id }
      }),
      invalidatesTags: ['Employees'],
    }),
  }),
});

export const { 
  useGetHealthQuery, 
  useGetEmployeesQuery, 
  useAddEmployeeMutation, 
  useUpdateEmployeeMutation, 
  useDeleteEmployeeMutation 
} = employeeApi;