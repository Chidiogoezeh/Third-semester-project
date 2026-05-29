import QRCode from "qrcode";

export async function generateQRCode(data: string) {
  return QRCode.toDataURL(data);
}