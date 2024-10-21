// path: /api/email/send-email
import type { NextApiRequest, NextApiResponse } from "next";

import { render } from "@react-email/render";
import { handleEmailFire } from "@/helpers/email-helper";
import MailExpenseCreated from "@/components/email/MailExpenseCreated";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await handleEmailFire({
    from: " ",
    to: "u.tas@reedu.de",
    subject: "Hello",
    html: await render(MailExpenseCreated()),
    component: MailExpenseCreated,
    props: {},
  });

  return res.status(200).json({ message: "Success" });
}
