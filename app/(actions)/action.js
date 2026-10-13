"use server";
import { error } from "node:console";
import { createClient } from "../utils/supabase/server";
import { revalidatePath } from "next/cache";
import { SupabaseClient } from "@supabase/supabase-js";

export async function Insert(formData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: "Login First!" };
  }

  const formTitle = formData.get("title");
  const formDescription = formData.get("description");

  const { data, error } = await supabase
    .from("profiles")
    .insert([
      {
        task: formTitle,
        description: formDescription,
        user_id: user.id, // 2. FIXED: Ab task database mein user ki unique ID ke sath save hoga
      },
    ])
    .select();

  if (error) {
    console.log("Error:", error.message);
    return { error: error.message };
  }

  return { success: true, data: data };
}

export async function getProfile() {
  const supabase = await createClient();

  // 1. Pehle check karein kaun sa user logged in hai
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { data: [] }; // Agar user login nahi hai toh empty array bhej dein
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, task, description") // 'id' add kiya taaki edit/delete kaam kar sake
    .eq("user_id", user.id); // 2. FIXED: Ab database se sirf isi logged-in user ke tasks filter hokar aayenge!

  if (error) {
    console.log("Error:", error.message);
    return { error: error.message };
  }

  return { data };
}
export async function Delete(id) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No Logged In" };
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) {
    return { error: error.message };
  }
  return { success: true };
}

//Updating Tasks and Desc on Home Page
export async function update(id, newTitle, NewDesc) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No Logged In" };

  const { error } = await supabase
    .from("profiles")
    .update({
      task: newTitle,
      description: NewDesc,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }
  return { success: true };
}

//Adding UserName From setting Page
export async function AddUserName(formData) {
  const supabase = await createClient();
  const username = formData.get("username");

  const {
    data: { user },
    error: Errordata,
  } = await supabase.auth.getUser();
  if (Errordata || !user) {
    console.log("Log in First");
    return { Errordata: Errordata?.message || "Session Expired | Log In Again" };
  }
  const { data, error } = await supabase
    .from("userdetail")
    .insert([
      {
        username: username,
        user_id: user.id,
      },
    ])
    .select();
  if (error) {
    console.log("Error:", error.message);
    return { error: error.message };
  }
  if (data) {
    console.log("Succes");
    return { succes : true , data}
  }
}
//Deleteing Username
export async function DeleteUserName() {
  const supabase = await createClient();

  const { data: { user }, error: UserError } = await supabase.auth.getUser();
  if (UserError || !user) {
    return { success: false, data: null, error: "Session Expired | Log In Again" };
  }

  const { data, error } = await supabase
    .from("userdetail")
    .update({ username: '' })
    .eq("user_id", user.id)
    .select();

  if (error) {
    console.error("Error:", error.message);
    return { success: false, data: null, error: error.message };
  }

  // 🔄 Clear server-side cache so the updated username reflects immediately on page reload
  revalidatePath("/Home/Profile"); // Replace with your exact profile page route

  return { success: true, data, error: null };
}


//Update Username
export async function UpdateUserName(formData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: UserError,
  } = await supabase.auth.getUser();
  if (UserError || !user) {
    return { data: null, error: "Session Expired | Log In Again" };
  }
  const newUserName = formData.get("username");
  const { data, error } = await supabase
    .from("userdetail")
    .update({
      username: newUserName,
    })
    .eq("user_id", user.id)
    .select();

  if (error) {
    console.log("Error:", error.message);
    return { data: null, success: false, error: error.message };
  }
  revalidatePath('/Home/Profile')
  return { success: true, data };
}
//Rendering UserName On Profile Page
export async function getUserName() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: "Session Expired | Log In Again" };
  }

  const { error, data } = await supabase
    .from("userdetail")
    .select("username")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.log("Error:", error.message);
    return { data: null, error: error.message };
  }
  return { data: data?.username || null, error: null };
}

//Upload / Saving Profile Pic in Database
export async function UplaodAvatar(formData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { data: null, error: "Session Expired | Log In Again" };
  }
  const file = formData.get("avatar");
  if (!file || typeof file === "string") {
    return { data: null, error: "No valid file received" };
  }

  const fileExt = file.name.split(".").pop();
  const filePath = `${user.id}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    return { data: null, error: uploadError.message };
  }

  return { data: filePath, error: null };
}
// Update Avater
export async function UpdateAvatar(){
  const supabase = await createClient()
  const { data : { user } , error : UserError} = await supabase.auth.getUser()
  if(UserError || !user){
    return{ data : null , error : 'Athentication Not Found'}
  }
  const file = formData.get('avatar');
  if (!file) return { data: null, error: 'No file selected' };

  const filePath = `${user.id}/avatar.png`;

  // upsert: true se purani image auto-replace ho jati hai
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) return { data: null, error: uploadError.message };

  return { data: 'Updated successfully', error: null };
}
//Deleting Avater
export async function DeleteAvatar() {
  const supabase = await createClient();
  const { data: { user }, error: UserError } = await supabase.auth.getUser();

  if (UserError || !user) {
    return { data: null, error: 'Session Expired | Log In Again' };
  }

  const filePath = `${user.id}/avatar.png`;
  
  const { error } = await supabase.storage
    .from('avatars')
    .remove([filePath]);

  if (error) {
    console.log('Error:', error.message);
    return { data: null, error: error.message };
  }

  return { data: "Deleted successfully", error: null };
}
//Rendering Profile Pic Function
export async function getAvatrUrl(fileName) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return { data: null, error: "Session Expired | Log In Again" };
  }

  const filePath = `${user.id}/${fileName}`;

  const { data: urlData, error: urlError } = await supabase.storage
    .from("avatars")
    .createSignedUrl(filePath, 3600);

  if (urlError) {
    return { data: null, error: urlError.message };
  }

  return { data: urlData.signedUrl, error: null };
}

//Saving / Update Bio Function
export async function AddBio(formData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: UserError,
  } = await supabase.auth.getUser();
  if (UserError || !user) {
    return { error: "Session Expired | Log In Again" };
  }

  const formbio = formData.get("bio");

  const { data, error } = await supabase
    .from("userdetail")
    .update({ bio: formbio })
    .eq("user_id", user.id)
    .select();

  if (error) {
    console.error("Supabase Error:", error.message);
    return { error: error.message };
  }

  return { success: true, data };
}

//Saving /Update Edu in Database
export async function AddEdu(formData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: UserError,
  } = await supabase.auth.getUser();
  if (UserError || !user) {
    return { data: null, error: "Session Expired | Log In Again" };
  }
  const formedu = formData.get("education");
  const { data, error } = await supabase
    .from("userdetail")
    .update({ education: formedu })
    .eq("user_id", user.id)
    .select();
  if (error) {
    console.log("Error", error.message);
    return { data: null, error: error.message };
  }
  return { success: true, data };
}

//Saving and Update DOB in database
export async function DOB(formData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { data: null, error: "Session Expired | Log In Again" };
  }

  const date = formData.get("date");
  const month = formData.get("month");
  const year = formData.get("year");

  if (!date || !month || !year) {
    return { error: "Session Expired | Log In Again" };
  }

  const formattedDate = date.padStart(2, "0");
  const formattedMonth = month.padStart(2, "0");

  // FIXED: Save as YYYY-MM-DD so DB and Frontend match perfectly
  const dobString = `${year}-${formattedMonth}-${formattedDate}`;

  const { data, error } = await supabase
    .from("userdetail")
    .update({ dob: dobString })
    .eq("user_id", user.id)
    .select();

  if (error) {
    console.log("Error: ", error.message);
    return { data: null, error: error.message }; // FIXED: date -> data
  }

  revalidatePath("/Home/Profile");
  return { success: true, data };
}

//Rendering DOB In Profie
export async function getDOB() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { data: null, error: "Session Expired | Log In Again" };
  }
  const { data, error } = await supabase
    .from("userdetail")
    .select("dob")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.log("Error :", error.message);
    return { data: null, error: error.message };
  }

  return { success: true, data };
}

//getting Bio
export async function getBio() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { data: null, error: "Session Expired | Log In Again" };
  }
  const { data, error } = await supabase
    .from("userdetail")
    .select("bio")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.log("Error:", error.message);
    return { data: null, error: error.message };
  }
  return { success: true, data };
}

//Getting Edu
export async function getEdu() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { data: null, error: "Session Expired | Log In Again" };
  }
  const { data, error } = await supabase
    .from("userdetail")
    .select("education")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.log("Error:", error.message);
    return { data: null, error: error.message };
  }
  return { success: true, data };
}
export async function getEmail() {
  const supabase = await createClient();

  const {
    data: { user },
    error: UserError,
  } = await supabase.auth.getUser();
  if (UserError || !user) {
    return { data: null, error: "Session Expired | Log In Again" };
  }
  return { success: true, data: user.email };
}
//Edit Profile Delete Functions

//Bio

// Delete Bio Action
export async function DeleteBio() {
  const supabase = await createClient();

  const {
    data: { user },
    error: UserError,
  } = await supabase.auth.getUser();
  if (UserError || !user) {
    return { success: false, error: "Session Expired | Log In Again" };
  }

  const { error } = await supabase
    .from("userdetail")
    .update({ bio: null })
    .eq("user_id", user.id);

  if (error) {
    console.log("Error:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/Home/Profile");
  return { success: true };
}
export async function DeleteEdu() {
  const supabase = await createClient();

  const {
    data: { user },
    error: UserError,
  } = await supabase.auth.getUser();
  if (UserError || !user) {
    return { success: false, error: "Session Expired | Log In Again" };
  }

  const { error } = await supabase
    .from("userdetail")
    .update({ education: null })
    .eq("user_id", user.id);

  if (error) {
    console.log("Error:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/Home/Profile");
  return { success: true }; // FIXED: Return success state
}
export async function DeleteDob() {
  const supabase = await createClient();

  const {
    data: { user },
    error: UserError,
  } = await supabase.auth.getUser();
  if (UserError || !user) {
    return { success: false, error: "Session Expired | Log In Again" };
  }

  const { error } = await supabase
    .from("userdetail")
    .update({ dob: null })
    .eq("user_id", user.id);

  if (error) {
    console.log("Error : ", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/Home/Profile");
  return { success: true };
}
// Feed Back
export async function Addfedback(){
  const supabase = await createClient()
  const { data : user , error : UserError} = await supabase.auth.getUser()
  if(!user || UserError){
    return {
      succes : false , error: 'Login Again | Session Expired'
    }
  }
  const { data , error} = await supabase
  .from('profiles')
  .insert({

  })
}