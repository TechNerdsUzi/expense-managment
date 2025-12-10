import { StatsCards } from '@/features/analytics/components/stats-cards'
import { SpendingChart } from '@/features/analytics/components/spending-chart'
import { ExpenseList } from '@/features/expenses/components/expense-list'
import { getExpenses } from '@/features/expenses/actions'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export default async function DashboardPage() {
    const expensesData = await getExpenses()

    const income = expensesData
        .filter((e) => e.type === 'income')
        .reduce((acc, curr) => acc + curr.amount, 0)

    const expenses = expensesData
        .filter((e) => e.type === 'expense')
        .reduce((acc, curr) => acc + curr.amount, 0)

    const balance = income - expenses

    // Calculate category spending for Pie Chart
    const categoryData = expensesData
        .filter((e) => e.type === 'expense')
        .reduce((acc, curr) => {
            const existing = acc.find((item: { name: string; value: number; color: string }) => item.name === curr.category)
            if (existing) {
                existing.value += curr.amount
            } else {
                acc.push({ name: curr.category, value: curr.amount, color: '' })
            }
            return acc
        }, [] as { name: string; value: number; color: string }[])
        .map((item: { name: string; value: number; color: string }, index: number) => ({
            ...item,
            color: COLORS[index % COLORS.length]
        }))

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </div>

            <StatsCards income={income} expenses={expenses} balance={balance} />

            <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
                <SpendingChart data={categoryData} />

                <div className="col-span-3">
                    <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
                    <ExpenseList data={expensesData.slice(0, 5)} />
                </div>
            </div>
        </div>
    )
}
