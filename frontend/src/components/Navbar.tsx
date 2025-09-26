'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button'; // ایمپورت کامپوننت دکمه

export default function Navbar() {
  const { user, logout, isLoading } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-gray-800">
          TodoApp
        </Link>
        <div className="flex items-center space-x-4">
          {!isLoading && (
            <>
              {user ? (
                <>
                  <span className="text-gray-700">Hello, {user.username}!</span>
                  <Button variant="destructive" size="sm" onClick={logout}>Logout</Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Register</Link>
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}