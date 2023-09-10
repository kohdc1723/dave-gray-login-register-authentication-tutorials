import apiSlice from "../../app/api/apiSlice";

const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => "/users",
            keepUnusedDataFor: 5
        })
    })
});

export const {
    useGetUsersQuery
} = usersApiSlice;

export default usersApiSlice;