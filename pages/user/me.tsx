import { useSession, getSession } from "next-auth/react"
import { getToken } from "next-auth/jwt"
import { GetServerSidePropsContext } from "next"
import React from "react"
import { gql, useSubscription } from "@apollo/client"
import client from "../../apollo-client"
import { useRouter } from "next/router"

// const secret = process.env.SECRET

const Me = ({ data }: { data: string }) => {
  const router = useRouter()
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>
  }

  //   const { data: subData, loading } = useSubscription(gameUpdateSubscription, {
  //     variables: { topic: gameId },
  //   })

  return (
    <div>
      <p>{JSON.stringify(session)}</p>
      {/* <p>{session.id}</p> */}
      <img src={session.user.image} alt="" />
      <p>Welcome, {session.user.name}</p>
    </div>
  )
}

// This gets called on every request
export async function getServerSideProps(context: GetServerSidePropsContext) {
  //   const gameQuery = gql`
  //     query gameById($gameId: String!) {
  //       gameById(gameId: $gameId) {
  //         channelId
  //         createdAt
  //         updatedAt
  //         active
  //         answers
  //         puzzle
  //       }
  //     }
  //   `

  //   const { gameId } = context.query

  //   const { data } = await client.query({
  //     query: gameQuery,
  //     variables: { gameId },
  //   })

  // Fetch data from external API
  //   const res = await fetch(`https://.../data`)
  //   const data = await res.json()
  const data = ""

  // Pass data to the page via props
  return { props: { data } }
}

export default Me
