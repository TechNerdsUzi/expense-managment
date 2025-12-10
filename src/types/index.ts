export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            expenses: {
                Row: {
                    id: string
                    created_at: string
                    description: string
                    amount: number
                    category: string
                    date: string
                    type: 'income' | 'expense'
                    user_id: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    description: string
                    amount: number
                    category: string
                    date: string
                    type: 'income' | 'expense'
                    user_id?: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    description?: string
                    amount?: number
                    category?: string
                    date?: string
                    type?: 'income' | 'expense'
                    user_id?: string
                }
            }
        }
    }
}
