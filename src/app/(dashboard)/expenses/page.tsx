import { AddExpenseDialog } from '@/features/expenses/components/add-expense-dialog'
import { ExpenseList } from '@/features/expenses/components/expense-list'
import { getExpenses } from '@/features/expenses/actions'

export default async function ExpensesPage() {
    const expenses = await getExpenses()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Expenses</h1>
                <AddExpenseDialog />
            </div>

            <ExpenseList data={expenses} />
        </div>
    )
}
