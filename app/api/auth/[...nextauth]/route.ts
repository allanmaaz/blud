import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async signIn({ user, account, profile }: { user: any, account: any, profile?: any }) {
            if (user) {
                try {
                    console.log("Syncing user with backend:", user.email);
                    // Sync user with backend
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/sync`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: user.email,
                            name: user.name,
                            image: user.image
                        }),
                    });

                    if (!response.ok) {
                        console.error("Backend sync failed:", await response.text());
                    } else {
                        console.log("Backend sync successful");
                    }
                    return true;
                } catch (error) {
                    console.error("Error syncing user:", error);
                    return true; // Allow login even if sync fails
                }
            }
            return true;
        },
        async session({ session, token }: { session: any, token: any }) {
            if (session.user) {
                session.user.id = token.sub!
            }
            return session
        },
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
