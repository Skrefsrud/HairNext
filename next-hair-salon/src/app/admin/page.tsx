import { AdminNav } from "@/components/adminComponents/admin-nav";
import ProtectedRoute from "@/components/ProtectedRoute";
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export default async function AdminPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className="w-full h-full">
      <AdminNav />
      <h1>Hello {data.user.email}!</h1>
    </div>
  );
}

