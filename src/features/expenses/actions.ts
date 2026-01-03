'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addExpense(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const description = formData.get('description') as string
    const amount = parseFloat(formData.get('amount') as string)
    const category = formData.get('category') as string
    const date = formData.get('date') as string
    const type = formData.get('type') as 'income' | 'expense'

    const { error } = await supabase.from('expenses').insert({
        description,
        amount,
        category,
        date,
        type,
        user_id: user.id
    })

    if (error) {
        console.error(error)
        return { error: 'Failed to add expense' }
    }

    revalidatePath('/expenses')
    revalidatePath('/') // Update dashboard stats as well
    return { success: 'Expense added successfully' }
}

export async function getExpenses(startDate?: string, endDate?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    let query = supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

    if (startDate) {
        query = query.gte('date', startDate)
    }

    if (endDate) {
        query = query.lte('date', endDate)
    }

    const { data } = await query

    return data || []
}

export async function updateExpense(id: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const description = formData.get('description') as string
    const amount = parseFloat(formData.get('amount') as string)
    const category = formData.get('category') as string
    const date = formData.get('date') as string
    const type = formData.get('type') as 'income' | 'expense'

    const { error } = await supabase
        .from('expenses')
        .update({
            description,
            amount,
            category,
            date,
            type
        })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error(error)
        return { error: 'Failed to update expense' }
    }

    revalidatePath('/expenses')
    revalidatePath('/')
    return { success: 'Expense updated successfully' }
}

export async function deleteExpense(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: 'Failed to delete expense' }
    }

    revalidatePath('/expenses')
    revalidatePath('/')
    return { success: 'Expense deleted successfully' }
}
