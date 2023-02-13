
export const CreatePostDto = {
    type: 'object',
    properties: {
        title: { type: "string" },

        content: { type: "string" },

        authorId: { type: "number" },

        file: {
            type: 'string',
            format: 'binary',
        },
    },
}
