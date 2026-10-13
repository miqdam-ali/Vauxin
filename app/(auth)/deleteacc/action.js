'use server'
import { createClient } from '../../utils/supabase/server'
import { createAdminClient } from '../../utils/supabase/admin'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function deleteacc() {
  const supabase = await createClient()
  const supabaseAdmin = createAdminClient()

  // 1. Get the current user's session
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    console.log('No active user session found')
    return { error: 'Session Expired | Log In Again' }
  }

  // 2. Fetch avatar URL/Path from DB before deleting the account
  const { data: userDetail } = await supabase
    .from('userdetail')
    .select('avatar_url')
    .eq('user_id', user.id)
    .single()

  // 3. Delete Avatar Image from Supabase Storage
  if (userDetail?.avatar_url) {
    // Extract file path/name from stored public URL
    const fileName = `${user.id}/avatar.png`;

    if (fileName) {
      const { error: storageError } = await supabase.storage
        .from('avatars') 
        .remove([fileName])

      if (storageError) {
        console.log('Storage deletion error:', storageError.message)
      }
    }
  }

  // 4. Delete user completely using Admin Client (Removes auth & cascades DB rows)
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

  if (deleteError) {
    console.log('Failed to delete user:', deleteError.message)
    return { error: deleteError.message }
  }

  await supabase.auth.signOut()

  const cookieStore = await cookies()
  cookieStore.getAll().forEach((cookie) => {
    if (cookie.name.startsWith('sb-')) {
      cookieStore.delete(cookie.name)
    }
  })

  redirect('/signup')
}