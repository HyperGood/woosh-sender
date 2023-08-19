import type { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import { env } from "~/env.mjs";

export default function sendOTP(req: NextApiRequest, res: NextApiResponse) {
  const accountSid = env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
  const token = env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;
  const verifySid = "VA0119e70fd4af9ec3b0a8bc4903868f4d";
  const client = twilio(accountSid, token);
  const { phone } = req.body as { phone: string };

  client.verify.v2
    .services(verifySid)
    .verifications.create({ to: phone, channel: "sms" })
    .then((verification) => {
      res.json({ verification });
    })
    .catch((error) => {
      console.log(error);
      res.json({
        success: false,
      });
    });
}
