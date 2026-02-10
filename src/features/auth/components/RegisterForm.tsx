"use client";

export default function RegisterForm() {
    return (
        <form className="space-y-4">
            <div>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" className="border p-2 w-full" />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" className="border p-2 w-full" />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" className="border p-2 w-full" />
            </div>
            <button type="submit" className="bg-green-500 text-white p-2 w-full">Register</button>
        </form>
    );
}
