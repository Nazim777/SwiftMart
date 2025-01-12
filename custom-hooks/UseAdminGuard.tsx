'use client'
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { getLoggedInUser } from '@/actions/action.user'; // Adjust the path to your API function
import { User } from '@/components/AvatarDisplay';

export const useAdminGuard = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null); // Tracks logged-in user info
  const { user } = useUser();
  const router = useRouter();

  // Fetch logged-in user data
  const fetchLoggedInUser = async () => {
    try {
      const response = await getLoggedInUser();
      if (response) {
        setLoggedInUser(response);
      }
    } catch (error) {
      console.error('Error fetching logged in user:', error);
    }
  };

  useEffect(() => {
    // Fetch user data when Clerk's `user` is available
    if (user) {
      fetchLoggedInUser();
    }
  }, [user]);

  useEffect(() => {
    // Redirect non-logged-in users or non-admins
    if (!user) {
      router.push('/'); // Redirect to homepage if not logged in
    } else if (user && loggedInUser && loggedInUser.role !== 'ADMIN') {
      router.push('/'); // Redirect to homepage if not an admin
    }
  }, [user, loggedInUser, router]);

  return { loggedInUser, isLoading: loggedInUser === null };
};
