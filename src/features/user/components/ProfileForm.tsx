"use client";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import type { User } from "./AvatarDisplay";
import { updateUser } from "@/features/user/actions/action.user";
import { toast } from "react-toastify";
import Spinner from "@/components/ui/Spinner";

interface ProfileFormProps {
  user: User | null | undefined;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [form, setForm] = useState({
    name: user?.name,
    email: user?.email,
  });

  const [loading,setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated Profile:", form);
    setLoading(true)
    try {
      if(form.name && form.email){
      const response = await updateUser({name:form.name,email:form.email})
      console.log('response',response)
      if(response?.updatedAt){
        toast.success('User updated!',{theme:'colored'})
      }
    }
    } catch (error) {
      toast.error('Error updating user!',{theme:'colored'})
    }finally{
      setLoading(false)
    }
   
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
        disabled
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
       {loading?'Updating...':'Save Changes'}
      </Button>
    </form>
  );
}
