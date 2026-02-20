'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/auth/login')
}

export async function getUserName() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: result, error } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user?.id);
  const name = result?.[0]?.display_name;
  return name;
}