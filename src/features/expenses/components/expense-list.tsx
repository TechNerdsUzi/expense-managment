'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Database } from '@/types'
import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { deleteExpense } from '@/features/expenses/actions'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

type Expense = Database['public']['Tables']['expenses']['Row']

interface ExpenseListProps {
    data: Expense[]
}

export function ExpenseList({ data }: ExpenseListProps) {
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return

        try {
            const result = await deleteExpense(id)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(result.success)
            }
        } catch {
            toast.error('Failed to delete')
        }
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="hidden sm:table-cell">Category</TableHead>
                        <TableHead className="hidden sm:table-cell">Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No transactions found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((expense) => (
                            <TableRow key={expense.id}>
                                <TableCell suppressHydrationWarning>{format(new Date(expense.date), 'MMM d, yyyy')}</TableCell>
                                <TableCell>{expense.description}</TableCell>
                                <TableCell className="capitalize hidden sm:table-cell">{expense.category}</TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <Badge variant={expense.type === 'income' ? 'default' : 'secondary'}>
                                        {expense.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className={cn("text-right font-medium",
                                    expense.type === 'income' ? 'text-green-600' : 'text-red-600'
                                )}>
                                    {expense.type === 'income' ? '+' : '-'}${expense.amount.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(expense.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
import { cn } from '@/lib/utils'
