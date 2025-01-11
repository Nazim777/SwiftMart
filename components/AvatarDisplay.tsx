"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export type User = {
    id: string; 
    clerkId: string; 
    role: "USER"|"ADMIN"; 
    createdAt: Date; 
    updatedAt: Date; 
    name: string;
    email: string;

}
interface AvatarDisplayProps {
  user: User | null |undefined;
}

export default function AvatarDisplay({ user }: AvatarDisplayProps) {
  return (
    <div className="text-center space-y-4">
      <Avatar className="w-32 h-32 mx-auto">
        <AvatarImage src={""} alt="Avatar" />
        <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <p className="text-lg font-medium">{user?.name || "User"}</p>
      <p className="text-sm text-gray-500">{user?.email}</p>
      <p className="text-sm text-gray-400">Role: {user?.role}</p>
    </div>
  );
}
