import "next-auth"
import { DefaultSession } from "next-auth";
declare module 'next-auth'{
    interface User{
        id?: string;
        isVerified?: boolean;
        name?: string
    }
    interface Session{
        user:{
            id?: string;
            isVerified?: boolean;
            name?: string
        } & DefaultSession['user']
    }
    interface JWT{
        user:{
            id?: string;
            isVerified?: boolean;
            name?: string
        }
    }
}