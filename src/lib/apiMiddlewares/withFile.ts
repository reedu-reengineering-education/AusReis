// import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
// import { getServerSession } from "next-auth/next";
// import prisma from "@/app/lib/db";
// import { authOptions } from "@/pages/api/auth/[...nextauth]";

// export function withFile(handler: NextApiHandler) {
//   return async function (req: NextApiRequest, res: NextApiResponse) {
//     try {
//       const session = await getServerSession(req, res, authOptions);

//       const file = await prisma.file.findUnique({
//         where: {
//           id: req.query.surveyId as string,
//           userId: session?.user.id,
//         },
//       });

//       if (!file) {
//         return res.status(403).end();
//       }

//       return handler(req, res);
//     } catch (error) {
//       console.error(error);

//       return res.status(500).end();
//     }
//   };
// }
