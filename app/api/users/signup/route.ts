import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest ,NextResponse} from "next/server";
import bcrypt from "bcryptjs";


connect();

export async function POST(request:NextRequest) {
    try{
      const reqBody=await request.json();
      let {firstname,lastname,email,password}=reqBody;

        // Trim values
    firstname = firstname?.trim();
    lastname = lastname?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // First name validation
    if (firstname.length < 2) {
      return NextResponse.json(
        { error: "First name must be at least 2 characters" },
        { status: 400 }
      );
    }

    // Last name validation
    if (lastname.length < 2) {
      return NextResponse.json(
        { error: "Last name must be at least 2 characters" },
        { status: 400 }
      );
    }
        // Email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 6 characters",
        },
        { status: 400 }
      );
    }
        // Strong password check
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error:
            "Password must contain uppercase, lowercase, and number",
        },
        { status: 400 }
      );
    }

      console.log(reqBody);
      //check user already in db
      const user  = await User.findOne({email})
      if(user){
        return NextResponse.json({error:"User alredy exists"},{status:400});
      }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(password,salt);

    const newUser=new User({
        firstname,
        lastname,
        email,
        password:hashedPassword
    });

    const saveUser = await newUser.save();

    console.log(saveUser);

    return NextResponse.json({
        message:"New user created successfully",
        success:true,
        saveUser
    });





    }catch (error: any) {
        return NextResponse.json({ error:error.message},{status:500});
    
    }
    
}

