// 'use client';
//
// import { useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
//
// export default function RegisterPage() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [honeypot, setHoneypot] = useState(''); // استیت برای تله عسل
//   const [error, setError] = useState('');
//   const router = useRouter();
//
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//
//     if (password !== confirmPassword) {
//       setError('Passwords do not match.');
//       return;
//     }
//
//     try {
//       const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password, honeypot }), // ارسال فیلد تله عسل
//       });
//
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(Object.values(errorData).flat().join('\n'));
//       }
//
//       router.push('/login');
//
//     } catch (err: any) {
//       setError(err.message || 'An unknown error occurred.');
//     }
//   };
//
//   const honeypotStyle: React.CSSProperties = {
//     position: 'absolute',
//     left: '-9999px',
//     opacity: 0,
//   };
//
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
//       <Card className="w-full max-w-sm">
//         <CardHeader>
//           <CardTitle className="text-2xl">Register</CardTitle>
//           <CardDescription>Create a new account to start managing your tasks.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="grid gap-4">
//             <div className="grid gap-2">
//               <Label htmlFor="username">Username</Label>
//               <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="password">Password</Label>
//               <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="confirm-password">Confirm Password</Label>
//               <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
//             </div>
//
//             {/* --- فیلد مخفی تله عسل --- */}
//             <div style={honeypotStyle}>
//                 <Label htmlFor="nickname">Nickname</Label>
//                 <Input id="nickname" type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
//             </div>
//
//             {error && <p className="text-sm text-red-500 whitespace-pre-line">{error}</p>}
//             <Button type="submit" className="w-full">Create account</Button>
//           </form>
//         </CardContent>
//         <CardFooter>
//           <div className="mt-4 text-center text-sm">
//             Already have an account?{" "}
//             <Link href="/login" className="underline">Sign in</Link>
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }



'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, honeypot }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(Object.values(errorData).flat().join('\n'));
      }

      router.push('/login');

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  const honeypotStyle: React.CSSProperties = {
    position: 'absolute',
    left: '-9999px',
    opacity: 0,
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Create a new account to start managing your tasks.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            <div style={honeypotStyle}>
                <Label htmlFor="nickname">Nickname</Label>
                <Input id="nickname" type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
            </div>

            {error && <p className="text-sm text-red-500 whitespace-pre-line">{error}</p>}
            <Button type="submit" className="w-full">Create account</Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}