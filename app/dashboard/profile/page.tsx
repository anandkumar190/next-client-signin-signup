"use client"
import Link from "next/link";
import {useRouter} from "next/navigation";
import axios from "axios";

export default function profile(){

        const router= useRouter();
        

    const onLogout = async ()=>{

        try {
             await axios.get("/api/users/logout");
             console.log("Logout user ");

             router.push("/dashboard/login");


        } catch (error:any) {
            console.log("error",error.message);
        }
    }
    
   


    

    return(
        <>
            <h1>Profile</h1>

            <button
            type="button"
            onClick={onLogout}
            >
            Logout
            </button>

        </>

);



}