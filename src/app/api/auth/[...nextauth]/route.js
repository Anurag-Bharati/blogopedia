import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { firebaseApp, firestore } from "@/config/firebase/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const auth = getAuth(firebaseApp);
        try {
          const res = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
          return res.user;
        } catch (error) {
          throw new Error("Email or Password is incorrect");
        }
        // Any object returned will be saved in `user` property of the JWT
        // If you return null then an error will be displayed advising the user to check their details.
        // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
      },
    }),
  ],
  secret: process.env.SECRET,
  adapter: FirestoreAdapter(firestore),
  pages: { signIn: "/auth" },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
