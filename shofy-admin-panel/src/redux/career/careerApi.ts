import { apiSlice } from "../api/apiSlice";

export const careerApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getCareerApplications: builder.query<any, void>({
            query: () => `/api/career`,
            providesTags: ["CareerApplications"],
            keepUnusedDataFor: 600,
        }),
        getCareerApplication: builder.query({
            query: (id) => `/api/career/${id}`,
            providesTags: (result, error, arg) => [{ type: "CareerApplication", id: arg }],
        }),
        replyToApplication: builder.mutation({
            query: ({ id, reply }) => ({
                url: `/api/career/reply/${id}`,
                method: "POST",
                body: { reply },
            }),
            invalidatesTags: ["CareerApplications", "CareerApplication"],
        }),
    }),
});

export const {
    useGetCareerApplicationsQuery,
    useGetCareerApplicationQuery,
    useReplyToApplicationMutation,
} = careerApi;
