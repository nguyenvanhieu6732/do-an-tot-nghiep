import { NextRequest, NextResponse } from "next/server";
import qs from "qs";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let vnp_Params = Object.fromEntries(searchParams.entries());

  const secureHash = vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  const sortObject = (obj: Record<string, string>) => {
    const sorted: Record<string, string> = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
      sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
    });
    return sorted;
  };

  vnp_Params = sortObject(vnp_Params);

  const secretKey = process.env.VNP_HASHSECRET!;
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  // Chuẩn bị các tham số cần gửi về trang /checkout
  const redirectParams = {
    success: secureHash === signed ? "true" : "false",
    responseCode: vnp_Params["vnp_ResponseCode"],
    orderCode: vnp_Params["vnp_TxnRef"],
  };

  // Chuyển hướng về trang /checkout với các tham số
  const redirectUrl = `/checkout?${qs.stringify(redirectParams)}`;
  return NextResponse.redirect(new URL(redirectUrl, req.url));
}