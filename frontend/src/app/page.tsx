// 'use client';
//
// import { useState, useEffect, useMemo } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { useRouter } from 'next/navigation';
//
// import { Button, buttonVariants } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from '@/components/ui/label';
//
// interface Task {
//   id: number;
//   title: string;
//   description: string;
//   completed: boolean;
//   priority: number;
//   priority_display: string;
//   created_at: string;
//   due_date: string | null;
// }
//
// // تابع کمکی جدید برای برگرداندن کلاس رنگ برای Badge
// const getPriorityBadgeClasses = (priority: number): string => {
//   switch (priority) {
//     case 4: return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'; // Urgent
//     case 3: return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200'; // High
//     case 2: return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'; // Medium
//     case 1: return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'; // Low
//     default: return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
//   }
// };
//
// type FilterType = 'all' | 'active' | 'completed';
// type PriorityFilterType = 'all' | 1 | 2 | 3 | 4;
//
// export default function HomePage() {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [newTask, setNewTask] = useState({ title: '', description: '', priority: 2, due_date: '' });
//   const [isLoading, setIsLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState<FilterType>('all');
//   const [priorityFilter, setPriorityFilter] = useState<PriorityFilterType>('all');
//
//   const { token, logout, isLoading: isAuthLoading } = useAuth();
//   const router = useRouter();
//   const API_BASE_URL = 'http://127.0.0.1:8000/api';
//
//   const fetchTasks = async () => {
//     if (!token) return;
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/tasks/`, {
//         headers: { 'Authorization': `Token ${token}` },
//       });
//       if (response.status === 401) { logout(); return; }
//       if (!response.ok) throw new Error('Failed to fetch tasks');
//       const data = await response.json();
//       setTasks(data);
//     } catch (error) { console.error(error); }
//     finally { setIsLoading(false); }
//   };
//
//   const handleCreateTask = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newTask.title.trim() || !token) return;
//     const payload = {
//         ...newTask,
//         due_date: newTask.due_date || null,
//     };
//     try {
//       await fetch(`${API_BASE_URL}/tasks/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}`},
//         body: JSON.stringify(payload),
//       });
//       setNewTask({ title: '', description: '', priority: 2, due_date: '' });
//       fetchTasks();
//     } catch (error) { console.error(error); }
//   };
//
//   const handleToggleComplete = async (task: Task) => {
//     if (!token) return;
//     const updatedTasks = tasks.map(t =>
//       t.id === task.id ? { ...t, completed: !t.completed } : t
//     );
//     setTasks(updatedTasks);
//     try {
//       await fetch(`${API_BASE_URL}/tasks/${task.id}/`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}`},
//         body: JSON.stringify({ completed: !task.completed }),
//       });
//     } catch (error) {
//       console.error(error);
//       setTasks(tasks);
//     }
//   };
//
//   const handleDeleteTask = async (taskId: number) => {
//     if (!token) return;
//     try {
//         await fetch(`${API_BASE_URL}/tasks/${taskId}/`, {
//             method: 'DELETE',
//             headers: { 'Authorization': `Token ${token}` },
//         });
//         fetchTasks();
//     } catch (error) { console.error(error); }
//   };
//
//   useEffect(() => {
//     if (!isAuthLoading) {
//       if (token) {
//         fetchTasks();
//       } else {
//         router.push('/login');
//       }
//     }
//   }, [token, isAuthLoading, router]);
//
//   const filteredAndSortedTasks = useMemo(() => {
//     return tasks
//       .filter(task => {
//         if (statusFilter === 'active') return !task.completed;
//         if (statusFilter === 'completed') return task.completed;
//         return true;
//       })
//       .filter(task => {
//         if (priorityFilter === 'all') return true;
//         return task.priority === priorityFilter;
//       })
//       .sort((a, b) => {
//         if (a.completed !== b.completed) {
//           return a.completed ? 1 : -1;
//         }
//         return b.priority - a.priority;
//       });
//   }, [tasks, statusFilter, priorityFilter]);
//
//   if (isAuthLoading) {
//     return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
//   }
//
//   return (
//     <div className="container mx-auto p-4 max-w-4xl">
//       <Card className="mb-8 shadow-lg">
//         <CardHeader>
//             <CardTitle>Add New Task</CardTitle>
//             <CardDescription>What do you need to get done?</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleCreateTask} className="space-y-4">
//             <Input type="text" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Task Title" required />
//             <Textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder="Description (optional)" rows={3} />
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Select value={String(newTask.priority)} onValueChange={(value) => setNewTask({ ...newTask, priority: parseInt(value) })}>
//                   <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="2">Medium</SelectItem>
//                     <SelectItem value="1">Low</SelectItem>
//                     <SelectItem value="3">High</SelectItem>
//                     <SelectItem value="4">Urgent</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <div className="grid gap-2 text-left">
//                   <Label htmlFor="due-date" className="text-sm font-medium">Due Date (Optional)</Label>
//                   <Input id="due-date" type="date" value={newTask.due_date} onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })} />
//                 </div>
//             </div>
//             <Button type="submit" className="w-full">Add Task</Button>
//           </form>
//         </CardContent>
//       </Card>
//
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold tracking-tight">Your Tasks</h2>
//         {/* ... بخش فیلترها بدون تغییر ... */}
//       </div>
//
//       <div className="space-y-4">
//         {isLoading ? <p>Loading tasks...</p> : filteredAndSortedTasks.map((task) => {
//           const isPastDue = task.due_date && new Date(task.due_date) < new Date();
//           return (
//             <Card key={task.id} className={`transition-opacity ${task.completed ? 'opacity-50' : ''}`}>
//               <CardContent className="p-4 flex items-center gap-4">
//                 <Checkbox checked={task.completed} onCheckedChange={() => handleToggleComplete(task)} className="h-5 w-5" id={`task-${task.id}`} disabled={isPastDue && !task.completed} />
//                 <div className="flex-grow grid gap-1">
//                    <label htmlFor={`task-${task.id}`} className={`font-semibold text-base cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.title}</label>
//                   <p className="text-sm text-muted-foreground">{task.description}</p>
//                 </div>
//                 <div className="flex flex-col items-end gap-2 text-xs">
//                   <Badge className={getPriorityBadgeClasses(task.priority)}>{task.priority_display}</Badge>
//                   {task.due_date && (
//                     <span className={`font-semibold p-1 px-2 rounded-md ${isPastDue && !task.completed ? 'text-red-700 bg-red-100' : 'text-gray-600'}`}>
//                       Due: {new Date(task.due_date).toLocaleDateString('en-CA')}
//                     </span>
//                   )}
//                 </div>
//                 <AlertDialog>
//                   <AlertDialogTrigger asChild>
//                     <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">✕</Button>
//                   </AlertDialogTrigger>
//                   <AlertDialogContent>
//                     <AlertDialogHeader>
//                       <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                       <AlertDialogDescription>
//                         This will permanently delete the task "{task.title}".
//                       </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                       <AlertDialogCancel>Cancel</AlertDialogCancel>
//                       <AlertDialogAction
//                         className={buttonVariants({ variant: "destructive" })}
//                         onClick={() => handleDeleteTask(task.id)}
//                       >
//                         Delete Task
//                       </AlertDialogAction>
//                     </AlertDialogFooter>
//                   </AlertDialogContent>
//                 </AlertDialog>
//               </CardContent>
//             </Card>
//           )
//         })}
//       </div>
//     </div>
//   );
// }




'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: number;
  priority_display: string;
  created_at: string;
  due_date: string | null;
}

const getPriorityBadgeVariant = (priority: number): "destructive" | "default" | "secondary" | "outline" => {
  switch (priority) {
    case 4: return 'destructive';
    case 3: return 'default';
    case 2: return 'secondary';
    case 1: return 'outline';
    default: return 'secondary';
  }
};

type FilterType = 'all' | 'active' | 'completed';
type PriorityFilterType = 'all' | 1 | 2 | 3 | 4;

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 2, due_date: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilterType>('all');

  const { token, logout, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const API_BASE_URL = 'http://127.0.0.1:8000/api';

  const fetchTasks = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/`, {
        headers: { 'Authorization': `Token ${token}` },
      });
      if (response.status === 401) { logout(); return; }
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) { console.error(error); }
    finally { setIsLoading(false); }
  }, [token, logout]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim() || !token) return;
    const payload = { ...newTask, due_date: newTask.due_date || null };
    try {
      await fetch(`${API_BASE_URL}/tasks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}`},
        body: JSON.stringify(payload),
      });
      setNewTask({ title: '', description: '', priority: 2, due_date: '' });
      fetchTasks();
    } catch (error) { console.error(error); }
  };

  const handleToggleComplete = async (task: Task) => {
    if (!token) return;
    const updatedTasks = tasks.map(t =>
      t.id === task.id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
    try {
      await fetch(`${API_BASE_URL}/tasks/${task.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}`},
        body: JSON.stringify({ completed: !task.completed }),
      });
    } catch (error) {
      console.error(error);
      setTasks(tasks);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!token) return;
    try {
        await fetch(`${API_BASE_URL}/tasks/${taskId}/`, {
            method: 'DELETE',
            headers: { 'Authorization': `Token ${token}` },
        });
        fetchTasks();
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    if (!isAuthLoading) {
      if (token) {
        fetchTasks();
      } else {
        router.push('/login');
      }
    }
  }, [token, isAuthLoading, router, fetchTasks]);

  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter(task => {
        if (statusFilter === 'active') return !task.completed;
        if (statusFilter === 'completed') return task.completed;
        return true;
      })
      .filter(task => {
        if (priorityFilter === 'all') return true;
        return task.priority === priorityFilter;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        return b.priority - a.priority;
      });
  }, [tasks, statusFilter, priorityFilter]);

  if (isAuthLoading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-8 shadow-lg">
        <CardHeader>
            <CardTitle>Add New Task</CardTitle>
            <CardDescription>What do you need to get done?</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <Input type="text" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Task Title" required />
            <Textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder="Description (optional)" rows={3} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={String(newTask.priority)} onValueChange={(value) => setNewTask({ ...newTask, priority: parseInt(value) })}>
                  <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">Medium</SelectItem>
                    <SelectItem value="1">Low</SelectItem>
                    <SelectItem value="3">High</SelectItem>
                    <SelectItem value="4">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <div className="grid gap-2 text-left">
                  <Label htmlFor="due-date" className="text-sm font-medium">Due Date (Optional)</Label>
                  <Input id="due-date" type="date" value={newTask.due_date} onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })} />
                </div>
            </div>
            <Button type="submit" className="w-full">Add Task</Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Your Tasks</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Filters & Sort</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
            <div className="grid gap-6 py-6">
              <div className="grid gap-3">
                <Label className="font-semibold">Status</Label>
                <RadioGroup value={statusFilter} onValueChange={(value) => setStatusFilter(value as FilterType)} className="space-y-2">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="all" id="r1" /><Label htmlFor="r1">All</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="active" id="r2" /><Label htmlFor="r2">Active</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="completed" id="r3" /><Label htmlFor="r3">Completed</Label></div>
                </RadioGroup>
              </div>
              <Separator />
              <div className="grid gap-3">
                <Label className="font-semibold">Priority</Label>
                <Select value={String(priorityFilter)} onValueChange={(value) => setPriorityFilter(value === 'all' ? 'all' : parseInt(value) as PriorityFilterType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="4">Urgent</SelectItem>
                      <SelectItem value="3">High</SelectItem>
                      <SelectItem value="2">Medium</SelectItem>
                      <SelectItem value="1">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="space-y-4">
        {isLoading ? <p>Loading tasks...</p> : filteredAndSortedTasks.map((task) => {
          const isPastDue = task.due_date && new Date(task.due_date) < new Date();

            return (
            <Card key={task.id} className={`transition-opacity ${task.completed ? 'opacity-50' : ''}`}>
              <CardContent className="p-4 flex items-start gap-4">
                <Checkbox checked={task.completed} onCheckedChange={() => handleToggleComplete(task)} className="mt-1 h-5 w-5" id={`task-${task.id}`} disabled={isPastDue && !task.completed ? true : undefined} />
                <div className="flex-grow grid gap-1">
                   <label htmlFor={`task-${task.id}`} className={`font-semibold text-lg cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.title}</label>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2 text-xs">
                  <Badge variant={getPriorityBadgeVariant(task.priority)}>{task.priority_display}</Badge>
                  {task.due_date && (
                    <span className={`font-semibold p-1 px-2 rounded-md ${isPastDue && !task.completed ? 'text-red-700 bg-red-100' : 'text-gray-600'}`}>
                      Due: {new Date(task.due_date).toLocaleDateString('en-CA')}
                    </span>
                  )}
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">✕</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the task &quot;{task.title}&quot;.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className={buttonVariants({ variant: "destructive" })}
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete Task
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  );
}