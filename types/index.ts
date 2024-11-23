export interface User {
    _id: string,
    username: string,
    email: string,
    authentication: {
        password: string,
        salt: string,
        sessionToken: string
    },
    save: () => void
}