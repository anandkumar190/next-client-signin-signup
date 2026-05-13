"use client"
import Link from "next/link"
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";






export default function Login(){

        const router=useRouter();
        
    
         const [user ,setUser]=React.useState({

                email:"",
                password:"",
          
    
         });
    
    
         const [buttonDisabled, setButtonDisabled]= React.useState(false);
         const [loading,setLoading]=React.useState(false);
         
         const onLogin = async ()=>{
            try {


                setLoading(true);

            //  const response=  await axios.post("/api/users/login",user);
                const response = await axios.post(
                        "/api/users/login",
                        user
                    );

                    console.log(
                        "Login Successful",
                        response.data
                    );
                 router.push("/dashboard/profile");

                console.log("Login Successful  ",response.data);


            } catch (error:any) {
                console.log("login failed ",error.message);
              
            } finally{
            setLoading(false);
         }
        }

         useEffect(()=>{
            if (user.email.length> 0  && user.password.length>0 ) {
                  setButtonDisabled(false);
            }else{
                setButtonDisabled(true);
            }
         },[user]);

    return(
<div className="container mx-auto px-4">
  <div className="flex justify-center items-center min-h-screen">
    <div className="w-full max-w-4xl">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          
          {/* Left Image Section */}
          <div className="hidden lg:block lg:w-1/2 bg-gray-200">
            <div className="h-full w-full bg-cover bg-center">
              {/* Add background image here */}
            </div>
          </div>

          {/* Right Form Section */}
          <div className="w-full lg:w-1/2">
            <div className="p-8">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    {loading?"Loading...":"Welcome back"}
                </h1>
              </div>

              <form>
                {/* Email */}
                <div className="mb-4">
                  <input
                    type="email"
                    id="InputEmail"
                    placeholder="Enter Email Address..."
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={user.email}
                    onChange={(e)=>setUser({...user , email:e.target.value})}
                  />
                </div>

                {/* Password */}
                <div className="mb-4">
                  <input
                    type="password"
                    id="InputPassword"
                    placeholder="Password"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={user.password}
                    onChange={(e)=>setUser({...user,password:e.target.value})}
                  />
                </div>

                {/* Remember Me */}
                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    id="customCheck"
                    className="mr-2"
                  />
                  <label htmlFor="customCheck" className="text-sm text-gray-700">
                    Remember Me
                  </label>
                </div>

                {/* Login Button */}
                <button
                  type="button"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
                  onClick={onLogin}
                >
                 {buttonDisabled?"Not Login ":"login Now"}
                </button>

                <hr className="my-6" />

                {/* Google Login */}
                <button
                  type="button"
                  className="w-full  bg-red-600 hover:bg-red-700  text-white border py-3 rounded-lg mb-3 hover:bg-gray-100 transition"
                >
                  Login with Google
                </button>

                {/* Facebook Login */}
                <button
                  type="button"
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white py-3 rounded-lg transition"
                >
                  Login with Facebook
                </button>
              </form>

              <hr className="my-6" />

              <div className="text-center mb-2">
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              <div className="text-center">
                <Link
                  href="/dashboard/registration"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Create an Account!
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</div>
    )
}