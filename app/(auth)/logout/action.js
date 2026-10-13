'use server'
import { redirect } from "next/navigation"
import { createClient } from "../../utils/supabase/server"
export async function logout(){
    const supabase = await createClient()
    
    const {error} = await supabase.auth.signOut({scope:'local'})
    if(error){
        console.log('Error:', error.message)
        return {error : 'Session Expired | Log In Again'}
    }
    redirect('/login')
}
