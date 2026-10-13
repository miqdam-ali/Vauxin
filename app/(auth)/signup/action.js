'use server'
import { createClient } from '../../utils/supabase/server'

export async function signup(formData) {
  const supabase = await createClient()

  const email = formData.get('email')
  const password = formData.get('password')

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.log('Error', error.message)
    return { success: false, error: error.message }
  }

  // Duplicate email detection workaround 
  if (data?.user && data.user.identities && data.user.identities.length === 0) {
    return { success: false, error: "Account already exists with this email!" };
  }

  console.log('Success')
  return { success: true }; // 🚨 FIXED: Plain object returned instead of redirecting here
}
