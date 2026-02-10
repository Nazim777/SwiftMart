import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                <LoginForm />
            </div>
        </div>
    );
}
