import { generateQRCode } from "../../shared/utils/qr";

export class QRService {
  async generateTicketQRCode(
    ticketToken: string
  ) {
    const verificationUrl = `${process.env.CLIENT_URL}/verify/${ticketToken}`;

    return generateQRCode(verificationUrl);
  }
}