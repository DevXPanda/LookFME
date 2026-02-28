import { apiSlice } from "../api/apiSlice";

export const careerApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        submitApplication: builder.mutation({
            query: (data) => ({
                url: "/api/career/submit",
                method: "POST",
                body: data,
            }),
        }),
        uploadResume: builder.mutation({
            query: (data) => ({
                url: "/api/cloudinary/add-file",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const { useSubmitApplicationMutation, useUploadResumeMutation } = careerApi;
