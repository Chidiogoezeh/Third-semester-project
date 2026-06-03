import QRCode from "qrcode";
import { env } from "../../config/env";

export async function generateQRCode(
  token: string
) {
  return QRCode.toDataURL(
    `${env.CLIENT_URL}/verify/${token}`
  );
}