import QRCode from "qrcode";

export async function generateQRCode(
  token: string
) {
  return QRCode.toDataURL(
    `${process.env.APP_URL}/verify/${token}`
  );
}