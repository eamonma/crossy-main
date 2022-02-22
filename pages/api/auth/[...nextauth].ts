import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

import axios from "axios"

export default NextAuth({
  callbacks: {
    async jwt({ token, account, user }) {
      // Persist the OAuth access_token to the token right after signin

      if (account) {
        token.accessToken = account.access_token

        const response = await axios.get(
          `https://discordapp.com/api/users/@me`,
          {
            headers: { Authorization: `Bearer ${token.accessToken}` },
          }
        )

        if (response.data.id) user.id = response.data.id
      }
      return token
    },

    session: async ({ session, token, user }) => {
      //   console.log(session, token, user)

      //   const response = await axios.get(`https://discordapp.com/api/users/@me`, {
      //     headers: { Authorization: `Bearer ${token.accessToken}` },
      //   })

      //   console.log(user)

      // if (user.id) session.id = user.id

      //   session.id = user.id
      return Promise.resolve(session)
    },
  },
  //   callbacks: {
  //     async session({ session, token, user }) {
  //       // Send properties to the client, like an access_token from a provider.
  //       session.accessToken = token.accessToken
  //       session.user = user
  //       session.id = user.id
  //       return session
  //     },
  //   },
  // Configure one or more authentication providers
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      // client:
    }),
    // EmailProvider({

    // })
    // ...add more providers here
  ],
})
