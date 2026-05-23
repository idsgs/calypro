import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

const providers: NextAuthOptions["providers"] = []

// Google OAuth — seulement si configuré
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar",
          access_type: "offline",
          prompt: "consent",
        },
      },
    })
  )
}

// Credentials (email + mot de passe) — toujours disponible
providers.push(
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Mot de passe", type: "password" },
      name: { label: "Nom", type: "text" },
      isRegister: { label: "Inscription", type: "text" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null

      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
      })

      // Inscription : créer le compte
      if (credentials.isRegister === "true") {
        if (user) throw new Error("Cet email est déjà utilisé")
        const hashed = await bcrypt.hash(credentials.password, 10)
        const newUser = await prisma.user.create({
          data: {
            email: credentials.email,
            name: credentials.name || credentials.email.split("@")[0],
            password: hashed,
          },
        })
        return { id: newUser.id, email: newUser.email, name: newUser.name }
      }

      // Connexion
      if (!user || !user.password) throw new Error("Email ou mot de passe incorrect")
      const valid = await bcrypt.compare(credentials.password, user.password)
      if (!valid) throw new Error("Email ou mot de passe incorrect")

      return { id: user.id, email: user.email, name: user.name }
    },
  })
)

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
}
