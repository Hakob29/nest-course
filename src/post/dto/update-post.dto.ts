
export const UpdatePostDto = {
    type: 'object',
    properties: {
        title: { type: "string" },

        newtitle: { type: "string" },

        content: { type: "string" },

        file: {
            type: 'string',
            format: 'binary',
        },
    },
}
