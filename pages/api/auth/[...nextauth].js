import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const { MongoClient, ServerApiVersion } = require('mongodb')
      const uri = "mongodb+srv://ianfboldea:asdfjkl;11@hypertension-cluster.vkdattq.mongodb.net/?retryWrites=true&w=majority"
      const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
      await client.connect(async err => {
        const collection = client.db("auth").collection("users")
        const searchedForUser = await collection.findOne({ id: user.id })
        if (searchedForUser) {
          console.log(`Found a user in the collection with the id '${user.id}'`)
        } else {
          await collection.insertOne(user)
          console.log('Inserted user object with id', user.id)
        }
        client.close()
      })
      return true
    }
  },
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
}

export default NextAuth(authOptions)