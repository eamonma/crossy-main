// // import fetch from 'isomorphic-unfetch'
import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client"
import { getMainDefinition } from "@apollo/client/utilities"
// import { setContext } from "@apollo/client/link/context"
// import { onError } from "@apollo/client/link/error"
import { WebSocketLink } from "@apollo/client/link/ws"
import { SubscriptionClient } from "subscriptions-transport-ws"

// const httpLink = new HttpLink({
//   uri: process.env.NEXT_PUBLIC_HTTP_LINK_URI as string,
// })
// // const createHttpLink = () => {
// //     const httpLink = new HttpLink({
// //       uri: 'https://ready-panda-91.hasura.app/v1/graphql',
// //       credentials: 'include',
// //       headers, // auth token is fetched on the server side
// //       fetch,
// //     })
// //     return httpLink;
// //   }

// // const wsLink = new WebSocketLink({
// //   uri: process.env.NEXT_PUBLIC_WS_LINK_URI as string,
// //   options: {
// //     reconnect: true,
// //   },
// //   webSocketImpl: ws,
// // })

// // // https://www.apollographql.com/docs/react/data/subscriptions/#setting-up-the-transport
// // const splitLink = split(
// //   ({ query }) => {
// //     const definition = getMainDefinition(query)
// //     return (
// //       definition.kind === "OperationDefinition" &&
// //       definition.operation === "subscription"
// //     )
// //   },
// //   wsLink,
// //   httpLink
// // )

// const client = new ApolloClient({
//   link: httpLink,
//   cache: new InMemoryCache(),
// })

// export default client

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_HTTP_LINK_URI as string,
})

let wsLink = null

if (typeof window !== "undefined") {
  wsLink = new WebSocketLink({
    uri: process.env.NEXT_PUBLIC_WS_LINK_URI as string,
    // uri: "ws://localhost:4000/subscriptions",
    options: {
      reconnect: true,
    },
  })
}

// const wsLink =
//   typeof window !== "undefined"
//     ? new WebSocketLink({
//         // uri: process.env.NEXT_PUBLIC_WS_LINK_URI as string,
//         uri: "http://localhost:4000/subscriptions",
//         options: {
//           reconnect: true,
//         },
//       })
//     : null

// https://www.apollographql.com/docs/react/data/subscriptions/#setting-up-the-transport
const splitLink =
  typeof window !== "undefined"
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query)
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          )
        },
        wsLink,
        httpLink
      )
    : httpLink

export default new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
    },
  },
})
