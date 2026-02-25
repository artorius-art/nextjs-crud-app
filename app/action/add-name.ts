'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { redirect } from 'next/navigation'

export async function createProfile(formData: FormData) {
    try{
        const supabase = await createClient()
        
        const displayName = formData.get('display_name') as string

        // 2. Validation
        if (!displayName || displayName.trim().length < 2) {
            throw new Error("Display name must be at least 2 characters.")
        }

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
            throw new Error("You must be logged in to create a profile.")
        }

        const { error } = await supabase
            .from('profiles')
            .insert({ 
            id: user.id, 
            display_name: displayName 
            })

        if (error) {
            if (error.code === '23505') throw new Error("Nama tidak bisa diubah")
            throw error
        }
        // revalidatePath('/') 
        // redirect('/dashboard') 

    }
catch (error) {
    // If it's a redirect, let Next.js handle it
    if (isRedirectError(error)) throw error
    
    // Otherwise, handle your actual DB errors
    throw error
  }
}