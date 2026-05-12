"use client"
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default  function Registration(){
    const router=useRouter();
    

     const [user ,setUser]=React.useState({
            firstname:"",
            lastname:"",
            email:"",
            password:"",
            repassword:""

     });


     const [buttonDisabled, setButtonDisabled]= React.useState(false);
     const [loading,setLoading]=React.useState(false);
     
     
     const onSignUp = async ()=>{

        try{
           setLoading(true);
          const respons=await axios.post("/api/users/signup",user);
          console.log(respons.data);
          router.push("/dashboard/login");

        }catch(error:any){
                console.log("signup fail",error.message);
        }finally{
            setLoading(false);
        }
     
   }


   useEffect(()=>{
      if (user.email.length> 0 && user.firstname.length>0 && user.lastname.length>0 && user.password.length>0 ) {
           setButtonDisabled(false);
      }else{
        setButtonDisabled(true);
      }
   },[user]);


    return(
<div className="container mx-auto px-4 py-10">
  <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
    
    <div className="flex flex-col lg:flex-row min-h-[700px]">

      {/* Left Image Section */}
      <div className="hidden lg:block lg:w-1/2 bg-gray-100">
        <div className="h-full w-full bg-cover bg-center bg-register-image"></div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
                 {loading?"loading....":"Create an Account!"}
            </h1>
          </div>

          <form className="space-y-4">

            {/* Name Fields */}
            <div className="flex flex-col lg:flex-row gap-4">
              <input
                type="text"
                id="FirstName"
                placeholder="First Name"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={user.firstname}
                onChange={(e) =>
                  setUser({ ...user, firstname: e.target.value})
                }
              />

              <input
                type="text"
                id="LastName"
                placeholder="Last Name"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={user.lastname}
                onChange={(e) =>
                  setUser({ ...user, lastname: e.target.value })
                }
              />
            </div>

            {/* Email */}
            <input
              type="email"
              id="InputEmail"
              placeholder="Email Address"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={user.email}
              onChange={(e) =>
                setUser({ ...user, email: e.target.value })
              }
            />

            {/* Password Fields */}
            <div className="flex flex-col lg:flex-row gap-4">
              <input
                type="password"
                id="InputPassword"
                placeholder="Password"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={user.password}
                onChange={(e) =>
                  setUser({ ...user, password: e.target.value })
                }
              />

              <input
                type="password"
                id="RepeatPassword"
                placeholder="Repeat Password"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={user.repassword}
                onChange={(e) =>
                  setUser({ ...user, repassword: e.target.value })
                }
              />
            </div>

            {/* Register Button */}
            <button
              type="button"
              onClick={onSignUp}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-200"
            >
              {buttonDisabled?" No Register Account":"Register Account"} 
            </button>

            <hr className="my-6" />

            {/* Google Button */}
            <button
              type="button"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg flex items-center justify-center transition duration-200"
            >
              Register with Google
            </button>

            {/* Facebook Button */}
            <button
              type="button"
              className="w-full bg-blue-800 hover:bg-blue-900 text-white py-3 rounded-lg flex items-center justify-center transition duration-200"
            >
              Register with Facebook
            </button>
          </form>

          <hr className="my-6" />

          {/* Footer Links */}
          <div className="text-center mb-2">
            <a
              href="/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          <div className="text-center">
            <Link
              href="/dashboard/login"
              className="text-sm text-blue-500 hover:underline"
            >
              Already have an account? Login!
            </Link>
          </div>

        </div>
      </div>
    </div>
  </div>
</div>
    );
}