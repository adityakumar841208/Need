import { NextResponse } from "next/server";

export async function  POST(req: Request) {

    const { credentials, type } = await req.json();

    if(type === 'login'){
        // login logic
    }else{
        // register logic
    }
    
}