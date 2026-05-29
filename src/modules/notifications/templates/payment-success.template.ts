import { PaymentSuccessTemplateData } from "../notification.types";

export function paymentSuccessTemplate(
  data: PaymentSuccessTemplateData
) {
  return `
    <div>
      <h2>Payment Successful</h2>

      <p>Hello,</p>

      <p>
        Your payment for
        <strong>${data.eventTitle}</strong>
        was successful.
      </p>

      <p>
        Amount Paid:
        ₦${(data.amount / 100).toFixed(2)}
      </p>

      <p>
        Your ticket has been generated successfully.
      </p>

      <p>Thank you for using Eventful.</p>
    </div>
  `;
}