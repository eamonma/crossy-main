// https://www.apollographql.com/blog/apollo-client/next-js/next-js-getting-started/

import { useEffect, useState } from "react"

export default function ClientOnly({ children, ...delegated }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <div {...delegated}>{children}</div>
}
