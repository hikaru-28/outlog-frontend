interface User {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

interface Input {
    id: string;
    userId: string;
    title: string;
    type: string;
    memo: string | null;
    isOutputDone: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Output {
    id: string;
    inputId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export type { User, Input, Output };