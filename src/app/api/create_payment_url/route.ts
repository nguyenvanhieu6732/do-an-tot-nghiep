import { NextRequest, NextResponse } from "next/server";
import moment from "moment";
import qs from "qs";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const {
    amount,
    bankCode,
    orderDescription,
    orderType,
    language,
  }: {
    amount: number;
    bankCode?: string;
    orderDescription: string;
    orderType: string;
    language?: string;
  } = await req.json();

  const ipAddr =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const tmnCode = process.env.VNP_TMNCODE!;
  const secretKey = process.env.VNP_HASHSECRET!;
  const vnpUrl = process.env.VNP_URL!;
  const returnUrl = process.env.VNP_RETURNURL!;

  const date = new Date();
  const createDate = moment(date).format("YYYYMMDDHHmmss");
  const orderId = "DH" + moment(date).format("YYYYMMDDHHmmss");

  const locale = language || "vn";
  const currCode = "VND";

  let vnp_Params: Record<string, string> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderDescription,
    vnp_OrderType: orderType,
    vnp_Amount: (amount * 100).toString(),
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  const sortObject = (obj: Record<string, string>) => {
    const sorted: Record<string, string> = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
      sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
    });
    return sorted;
  };

  vnp_Params = sortObject(vnp_Params);

  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;

  const paymentUrl = vnpUrl + "?" + qs.stringify(vnp_Params, { encode: false });

  return NextResponse.json({ paymentUrl });
}