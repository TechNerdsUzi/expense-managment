import { AddExpenseDialog } from '@/features/expenses/components/add-expense-dialog'
import { ExpenseList } from '@/features/expenses/components/expense-list'
import { getExpenses } from '@/features/expenses/actions'
import { MonthFilter } from '@/features/analytics/components/month-filter'
import { startOfMonth, endOfMonth, format } from 'date-fns'

export default async function ExpensesPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const searchParams = await props.searchParams
    const currentYear = new Date().getFullYear().toString()
    const currentMonth = (new Date().getMonth() + 1).toString()

    const year = (searchParams?.year as string) || currentYear
    const month = (searchParams?.month as string) || currentMonth

    // Construct dates
    const date = new Date(parseInt(year), parseInt(month) - 1)
    const startDate = format(startOfMonth(date), 'yyyy-MM-dd')
    const endDate = format(endOfMonth(date), 'yyyy-MM-dd')

    const expenses = await getExpenses(startDate, endDate)

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-lg font-semibold md:text-2xl">Expenses</h1>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <MonthFilter />
                    <AddExpenseDialog />
                </div>
            </div>

            <ExpenseList data={expenses} />
        </div>
    )
}
