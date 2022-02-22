import { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "next-auth/jwt"
import { sampleUserData } from "../../../utils/sample-data"

const secret = process.env.SECRET

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // try {
  //   if (!Array.isArray(sampleUserData)) {
  //     throw new Error('Cannot find user data')
  //   }

  //   res.status(200).json(sampleUserData)
  // } catch (err: any) {
  //   res.status(500).json({ statusCode: 500, message: err.message })
  // }

  const token = await getToken({ req, secret })
  if (token) {
    // Signed in
    console.log("JSON Web Token", JSON.stringify(token, null, 2))
  } else {
    // Not Signed in
    res.status(401)
  }
  res.end()
}

export default handler
