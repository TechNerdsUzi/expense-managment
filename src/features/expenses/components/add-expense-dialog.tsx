'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { addExpense, updateExpense } from '@/features/expenses/actions'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { CalendarIcon, Plus, Pencil } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Database } from '@/types'

type Expense = Database['public']['Tables']['expenses']['Row']

interface ExpenseDialogProps {
    expense?: Expense
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function ExpenseDialog({ expense, trigger, open: controlledOpen, onOpenChange }: ExpenseDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>()
    const [loading, setLoading] = useState(false)

    const isInternalManaged = controlledOpen === undefined
    const open = isInternalManaged ? internalOpen : controlledOpen
    const setOpen = isInternalManaged ? setInternalOpen : onOpenChange!

    const isEdit = !!expense

    useEffect(() => {
        if (open) {
            if (expense) {
                setDate(new Date(expense.date))
            } else {
                setDate(new Date())
            }
        }
    }, [open, expense])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        if (date) {
            formData.set('date', format(date, 'yyyy-MM-dd'))
        }

        try {
            let result
            if (isEdit) {
                result = await updateExpense(expense.id, formData)
            } else {
                result = await addExpense(formData)
            }

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(result.success)
                setOpen(false)
                if (!isEdit) {
                    setDate(new Date())
                }
            }
        } catch {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant={'outline'} size={'icon'}>
                        <Plus className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'Edit your transaction details below.' : 'Add a new income or expense record.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                        <Label htmlFor="description" className="text-left sm:text-right">
                            Description
                        </Label>
                        <Input
                            id="description"
                            name="description"
                            defaultValue={expense?.description}
                            placeholder="Groceries"
                            className="col-span-1 sm:col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                        <Label htmlFor="amount" className="text-left sm:text-right">
                            Amount
                        </Label>
                        <Input
                            id="amount"
                            name="amount"
                            type="number"
                            step="0.01"
                            defaultValue={expense?.amount}
                            placeholder="0.00"
                            className="col-span-1 sm:col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                        <Label htmlFor="type" className="text-left sm:text-right">
                            Type
                        </Label>
                        <Select name="type" required defaultValue={expense?.type || "expense"}>
                            <SelectTrigger className="col-span-1 sm:col-span-3">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="expense">Expense</SelectItem>
                                <SelectItem value="income">Income</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                        <Label htmlFor="category" className="text-left sm:text-right">
                            Category
                        </Label>
                        <Select name="category" required defaultValue={expense?.category}>
                            <SelectTrigger className="col-span-1 sm:col-span-3">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="food">Food</SelectItem>
                                <SelectItem value="transport">Transport</SelectItem>
                                <SelectItem value="utilities">Utilities</SelectItem>
                                <SelectItem value="entertainment">Entertainment</SelectItem>
                                <SelectItem value="health">Health</SelectItem>
                                <SelectItem value="education">Education</SelectItem>
                                <SelectItem value="salary">Salary</SelectItem>
                                <SelectItem value="sadqa">Sadqa</SelectItem>
                                <SelectItem value="withdrawl">Withdrawl</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                        <Label className="text-left sm:text-right">Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "col-span-1 sm:col-span-3 justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
// Export alias for backward compatibility or clarity if needed, 
// but since I replaced the whole file content, I can just export as named 'ExpenseDialog'
// and add a re-export if I want to avoid breaking imports immediately, 
// OR I assume I'll fix the update sites.
// The task plan said "Rename to ExpenseDialog (or keep name...)"
// I'll keep the file named `add-expense-dialog.tsx` but export `ExpenseDialog`. 
// I should export `AddExpenseDialog` as an alias to avoid breaking existing imports until I fix them.
export const AddExpenseDialog = ExpenseDialog
