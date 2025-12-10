'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { login, signup } from '@/features/auth/actions'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'

interface AuthFormProps {
    view: 'login' | 'signup'
}

export function AuthForm({ view }: AuthFormProps) {
    const [loading, setLoading] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)

        try {
            if (view === 'login') {
                const result = await login(formData)
                if (result?.error) {
                    toast.error(result.error)
                }
            } else {
                const result = await signup(formData)
                if (result?.error) {
                    toast.error(result.error)
                } else if (result?.success) {
                    toast.success(result.success)
                }
            }
        } catch {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (!mounted) return null

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>{view === 'login' ? 'Login' : 'Sign Up'}</CardTitle>
                <CardDescription>
                    {view === 'login'
                        ? 'Enter your credentials to access your account'
                        : 'Create an account to start tracking expenses'}
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required placeholder="m@example.com" suppressHydrationWarning />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required minLength={6} suppressHydrationWarning />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 pt-4">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Processing...' : (view === 'login' ? 'Login' : 'Sign Up')}
                    </Button>
                    <div className="text-sm text-center text-muted-foreground">
                        {view === 'login' ? (
                            <>
                                Don&apos;t have an account?{' '}
                                <Link href="/signup" className="text-primary hover:underline">
                                    Sign up
                                </Link>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <Link href="/login" className="text-primary hover:underline">
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                </CardFooter>
            </form>
        </Card>
    )
}
