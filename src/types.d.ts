export interface ITransaction {
    id: string,
    category: string,
    amount: number,
    createdAt: string
}

export interface ITransactionForm {
    category: string,
    amount: number
}

export interface ITransactionMutation {
    category: string,
    amount: number,
    createdAt: string
}

export interface ITransactionAPI {
    [key: string]: ITransactionMutation
}

export interface ICategory {
    id: string,
    type: "income" | "expense",
    name: string
}

export interface ICategoryMutation {
    type: "income" | "expense",
    name: string
}

export interface ICategoryAPI {
    [key: string]: ICategoryMutation
}