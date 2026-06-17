interface User {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

type InputType = '本' | 'Youtube' | '記事' | '講義' | string

interface Input {
    id: string;
    userId: string;
    title: string;
    type: InputType;
    memo: string | null;
    isOutputDone: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Output {
    id: string;
    inputId: string;
    outputType: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export type { User, Input, Output, InputType };