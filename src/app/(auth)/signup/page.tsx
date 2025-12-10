import { AuthForm } from '@/features/auth/components/auth-form'

export default function SignupPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 px-4">
            <AuthForm view="signup" />
        </div>
    )
}
