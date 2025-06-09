import Iyzipay from "iyzipay";
import { NextResponse } from "next/server";

const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY!,
    secretKey: process.env.IYZICO_API_SECRET!,
    uri: process.env.IYZICO_BASE_URL!,
});

export async function POST(req: Request) {
    const { price, paidPrice, currency, basketId, paymentCard, buyer, shippingAddress, billingAddress, basketItems } = await req.json();
    
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
    
    iyzipay.payment.create(paymentRequest,(err,res)=>{
        if(err){
            return NextResponse.json({ error: err.message });
        }
        return NextResponse.json({ data: res });
    });

   
}