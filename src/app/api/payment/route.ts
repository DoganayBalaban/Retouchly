import Iyzipay from "iyzipay";
import { NextResponse } from "next/server";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";

function createIyzipayInstance() {
  return new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY || "dummy-key",
    secretKey: process.env.IYZICO_API_SECRET || "dummy-secret",
    uri: process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com",
  });
}

export async function POST(req: Request): Promise<Response> {
  try {
    const iyzipay = createIyzipayInstance();
    const {
      price,
      paidPrice,
      currency,
      basketId,
      paymentCard,
      buyer,
      shippingAddress,
      billingAddress,
      basketItems,
    } = await req.json();

    const paymentRequest = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: "123456789",
      price: price.toString(),
      paidPrice: paidPrice.toString(),
      currency: currency,
      installments: 1,
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      basketId: basketId,
      paymentCard: paymentCard,
      buyer: buyer,
      shippingAddress: shippingAddress,
      billingAddress: billingAddress,
      basketItems: basketItems,
    };

    return new Promise<Response>((resolve) => {
      iyzipay.payment.create(paymentRequest, (err, res) => {
        if (err) {
          resolve(NextResponse.json({ error: err.message }, { status: 400 }));
        } else {
          resolve(NextResponse.json({ data: res }));
        }
      });
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 }
    );
  }
}
