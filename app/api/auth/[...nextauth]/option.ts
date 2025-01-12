import {NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
// import db from "@/backend/db"
import { drizzle } from 'drizzle-orm/node-postgres';
import { or, eq } from 'drizzle-orm'; // Add this import

import {users} from "@/backend/db/schema"
const db = drizzle(process.env.DATABASE_URL!);

export const authOptions:NextAuthOptions = {
    
    providers:[
        CredentialsProvider({
            id:"credentials",
            name: "Credentials",
            credentials: {
                email: {label:"Email", type:"text"},
                password: {label: "Password", type:"password"},
              },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              async authorize (credentials: any): Promise<any> {
                try {
                    
                    
                    
                    const user = await db
                        .select()
                        .from(users)
                        .where(
                            or(
                                eq(users.email, credentials.email),
                                eq(users.name, credentials.name)
                            )
                        )
                        .execute();
                    
                    const foundUser = user[0]
                    
                    if(!foundUser){
                        throw new Error('No user found with this email')
                    }

                    if(!foundUser.isVerified){
                        throw new Error('please verify your account first')

                    }
                    

                    const isPasswordCorrect = await bcrypt.compare(credentials.password,user[0].passwordHash)
                    
                    if (isPasswordCorrect){
                        
                        return user[0]
                    }else{
                        throw new Error("please check password")
                    }
                }
                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
                 catch (error:any) { 
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    throw new Error(error)
                    
                }

                
              }
        })
    ],
    callbacks:{
        
        async session({session, token}) {
            
            if(token){
                session.user.id = token.id as string 
                session.user.isVerified = token.is_Verified as boolean 
                session.user.name = token.name as string
                

            }
            
            
            
            return session
        },
        async jwt({token, user}){
            if (user){
                token.id = user.id?.toString()
                token.isVerified = user.isVerified;
                token.name = user.name
            }
            
            
            return token
        },
    },
    pages: {
        signIn: '/login'

    },
    session:{
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,

}