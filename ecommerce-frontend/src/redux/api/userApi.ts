import axios from 'axios';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '../../types/types';

import {
  MessageResponse,
  allUsersResponse,
  deleteUserRequest,
  userResponse,
} from '../../types/api-types';

export const userAPI = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/`,
  }),
  tagTypes: ['users'],
  endpoints: (builder) => ({
    login: builder.mutation<MessageResponse, User>({
      query: (user) => ({
        url: 'new',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['users'],
    }),
    deletUser: builder.mutation<MessageResponse, deleteUserRequest>({
      query: ({ userId, adminUserId }) => ({
        url: `${userId}?id=${adminUserId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['users'],
    }),

    allUsers: builder.query<allUsersResponse, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ['users'],
    }),
  }),
});

export const getUser = async (id: string) => {
  try {
    const { data }: { data: userResponse } = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/v1/user/${id}`
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const { useLoginMutation, useAllUsersQuery, useDeletUserMutation } =
  userAPI;
