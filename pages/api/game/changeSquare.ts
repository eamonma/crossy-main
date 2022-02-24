import { gql } from "graphql-request"
import { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "next-auth/jwt"
import { getSession } from "next-auth/react"
import { sampleUserData } from "../../../utils/sample-data"
import { graphQLClient } from "../graphqlClient"

const secret = process.env.SECRET

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req, secret })
  const session = await getSession({ req })
  if (!session || !token) return res.redirect("/api/auth/signin")
  // if (req.method !== "POST") return res.status(400).end()

  // console.log(token.sub)
  const { gameId, square, answer, direction } = req.body

  if (!gameId || (!square && square !== 0) || !direction)
    return res.status(400).end()

  const discordId = token.sub

  console.log(req.body)

  try {
    const response = await graphQLClient.request(
      gql`
        mutation fill(
          $gameId: String!
          $answer: String!
          $direction: String!
          $playerId: String!
          $nthAnswer: Float!
        ) {
          fillById(
            gameId: $gameId
            answer: $answer
            direction: $direction
            playerId: $playerId
            nthAnswer: $nthAnswer
          ) {
            active
            answers
          }
        }
      `,
      {
        gameId,
        answer,
        direction,
        playerId: discordId,
        nthAnswer: square,
      }
    )
    console.log(response)
    res.status(200).end()
  } catch (e) {
    console.log(e)
  }

  res.end()

  //   if (token) {
  //     // Signed in
  //     console.log("JSON Web Token", JSON.stringify(token, null, 2))
  //   } else {
  //     // Not Signed in
  //     res.status(401)
  //   }

  // console.log(req.body)

  // res.json(response)
  // if (!session) res.status(401)
}

export default handler
