import { SpendingChart } from '@/features/analytics/components/spending-chart'
import { getExpenses } from '@/features/expenses/actions'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export default async function AnalyticsPage() {
    const expensesData = await getExpenses()

    // Define the type for the accumulator items
    type CategoryDataItem = { name: string; value: number; color: string };

    // Reuse logic for now, later can be moved to shared utility
    const categoryData = expensesData
        .filter((e) => e.type === 'expense')
        .reduce((acc: CategoryDataItem[], curr) => {
            // Explicitly type 'item' for clarity and to resolve potential inference issues
            const existing = acc.find((item: CategoryDataItem) => item.name === curr.category)
            if (existing) {
                existing.value += curr.amount
            } else {
                acc.push({ name: curr.category, value: curr.amount, color: '' })
            }
            return acc
        }, [] as CategoryDataItem[]) // Use the defined type for the initial accumulator
        .map((item: CategoryDataItem, index: number) => ({
            ...item,
            color: COLORS[index % COLORS.length]
        }))

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <SpendingChart data={categoryData} />
            </div>
        </div>
    )
}
