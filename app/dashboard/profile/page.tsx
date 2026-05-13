"use client"
import Link from "next/link";
import {useRouter} from "next/navigation";
import axios from "axios";
import constants from "constants";
import React,{ useState } from "react";

export default function profile(){
       
        const router= useRouter();
        const [data ,setData]=useState("nothing");

    const onLogout = async ()=>{

        try {
             await axios.get("/api/users/logout");
             console.log("Logout user ");

             router.push("/dashboard/login");


        } catch (error:any) {
            console.log("error",error.message);
        }
    };

    const getUserDetails=async ()=>{
        debugger;
       
       try {
          const res = await axios.get("/api/users/profile");
        console.log(res.data);
        setData(res.data.data._id);
       } catch (error:any) {

        console.log(error.message);
         console.log(error.response?.data)
         console.log(error.response?.status)
        
       }
      

    };
    
   


    

    return(
        <>
            <h1>Profile</h1>
            <h1>user</h1>
            <h2>{data==="nothing"?"Nothing":<Link href={`/dashboard/profile/{$data}`}>{data}</Link>}</h2>

            <button
            type="button"
            onClick={onLogout}
            >
            Logout
            </button>
            <hr/>
                     <button
            type="button"
            onClick={getUserDetails}
            >
            Get user data 
            </button>

        </>

);



}