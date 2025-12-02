"use client";

export const dynamic = "force-dynamic";
import { getLoggedInUser } from "@/actions/action.user";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileForm from "@/components/ProfileForm";
import AvatarDisplay from "@/components/AvatarDisplay";
import { loggedInUserType } from "@/types/user";
import DashboardLoader from "@/components/ui/DashboardLoader";
import CustomError from "../_components/CustomError";
const page = () => {
  const [user, setUser] = useState<loggedInUserType>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const loggedInUser = await getLoggedInUser();
      setUser(loggedInUser);
    } catch (error) {
      console.log("error", error);
      setError("Failed to load user. Please try again later!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (error) return <CustomError error={error} />;

  if (loading) return <DashboardLoader loading="Loading User..." />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900  mt-20">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center">
            <AvatarDisplay user={user} />
          </div>
          <ProfileForm user={user} />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
