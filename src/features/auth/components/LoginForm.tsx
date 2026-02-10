"use client";

export default function LoginForm() {
    return (
        <form className="space-y-4">
            <div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" className="border p-2 w-full" />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" className="border p-2 w-full" />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 w-full">Login</button>
        </form>
    );
}
