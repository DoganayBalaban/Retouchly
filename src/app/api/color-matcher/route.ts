import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
  const { inputImage } = await req.json();

  try {
    const output = await replicate.run("fofr/color-matcher", {
      input: {
        input_image: inputImage,
        reference_image: "https://replicate.delivery/pbxt/MtNw1Safv0BWXmoNNObPAZdu9vMoaUZBWXlFPtDOpDgcMNFr/0_1.webp",
      },
    });

    return NextResponse.json({ output }); // output = url
  } catch (error) {
    console.error("ColorMatcher hatası:", error);
    return NextResponse.json({ error: "Color Matcher çalışmadı" }, { status: 500 });
  }
}
