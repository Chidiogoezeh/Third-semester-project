import { generateQRCode } from "../../shared/utils/qr";

export class QRService {
  async generateTicketQRCode(ticketToken: string) {
    const appUrl = process.env.APP_URL;

    if (!appUrl) {
      throw new Error("APP_URL environment variable is not configured");
    }

    const verificationUrl = `${appUrl}/verify/${ticketToken}`;

    return generateQRCode(verificationUrl);
  }
}