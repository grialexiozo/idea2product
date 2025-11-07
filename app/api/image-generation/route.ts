import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt, size } = await req.json();

  try {
    // Step 1: Submit the task
    const submitResponse = await fetch("https://api.wavespeed.ai/api/v3/bytedance/seedream-v4", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.WAVESPEED_API_KEY}`,
      },
      body: JSON.stringify({
        enable_base64_output: false,
        enable_sync_mode: false,
        prompt,
        size,
      }),
    });

    const submitData = await submitResponse.json();
    const requestId = submitData.request_id;

    // Step 2: Query the result
    let queryData;
    let attempts = 0;
    const maxAttempts = 10;
    const delay = 5000; // 5 seconds

    do {
      await new Promise((resolve) => setTimeout(resolve, delay));
      const queryResponse = await fetch(`https://api.wavespeed.ai/api/v3/predictions/${requestId}/result`, {
        headers: {
          "Authorization": `Bearer ${process.env.WAVESPEED_API_KEY}`,
        },
      });
      queryData = await queryResponse.json();
      attempts++;
    } while (queryData.status !== "succeeded" && queryData.status !== "failed" && attempts < maxAttempts);

    return NextResponse.json(queryData);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}