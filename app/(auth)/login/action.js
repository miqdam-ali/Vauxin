'use server'
import { createClient } from '../../utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function login(formData) {
  const supabase = await createClient()

  const email = formData.get('email')
  const password = formData.get('password')

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.log('Error', error.message)
    return { error: error.message }
  }

  console.log('Success')
  redirect('/Home')
}
