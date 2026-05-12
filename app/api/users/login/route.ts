import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest ,NextResponse} from "next/server";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

connect();

export async function POST(request: NextRequest) {
    
    try {
        const reqBody= await request.json();
        let {email,password}=reqBody ;
        console.log(reqBody);

        const user= await User.findOne({email});

        if(!user){
         return NextResponse.json({ error:" User dose not exists"},{ status:400});
        }
        const validPassword= await bcrypt.compare(password,user.password);

  

        if(!validPassword){
            return NextResponse.json({error:"Invalid password"},{status:400})
        }

        const tokenData = {
            id: user._id,
            email: user.email,
            fullname: user.firstname + " " + user.lastname,
            };

            const token = jwt.sign(
            tokenData,
            process.env.TOKEN_SECRET!,
            {
                expiresIn: "1d",
            }
            );
        const response = NextResponse.json({
            messages:"login successful",
            success:true
        },{status:200});

        response.cookies.set("token",token,{ httpOnly:true,});

        return response;
    
    
    } catch (error:any) {

        console.log(
            error.response?.data || error.message
        );


        return NextResponse.json({
            error:error.message
        },{ status:500});
    }
}

