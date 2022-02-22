import React from "react"
import { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"

import "../styles/index.css"
import "../styles/globals.css"
import { ApolloProvider } from "@apollo/client"
import client from "../apollo-client"

function Applicaiton({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </SessionProvider>
  )
}

export default Applicaiton
