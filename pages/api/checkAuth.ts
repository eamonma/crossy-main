import { gql } from "graphql-request"
import { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "next-auth/jwt"
import { getSession } from "next-auth/react"

import { graphQLClient } from "./graphqlClient"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })

  if (!session) return res.redirect("/api/auth/signin")

  const response = await graphQLClient.request(gql`
    query {
      secret
    }
  `)

  res.status(200).json(response)

  //   res.status(200).json(session)
}
