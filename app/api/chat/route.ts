import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const supabase = await createClient();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const chatModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Step 1: Create embedding for user query
    const embedRes = await embedModel.embedContent(message);
    const vector = embedRes.embedding.values;

    // Step 2: Vector search
    const { data: matches, error: rpcError } = await supabase.rpc(
      "match_products",
      {
        query_embedding: vector,
        match_count: 5,
      }
    );

    if (rpcError) {
      console.error("SUPABASE RPC ERROR:", rpcError);
      return NextResponse.json({ error: "RPC failed", details: rpcError }, { status: 500 });
    }

    if (!matches || matches.length === 0) {
      return NextResponse.json({
        answer: "No relevant products found.",
        products: [],
      });
    }

    const ids = matches.map((m) => m.product_id);

    const { data: products } = await supabase
      .from("products")
      .select("*")
      .in("id", ids);

    // Step 3: AI answer
    const prompt = `
User question: ${message}

Relevant products:
${JSON.stringify(products)}

Answer user question using only these products. Keep answer simple.
`;

    const result = await chatModel.generateContent(prompt);

    return NextResponse.json({
      answer: result.response.text(),
      products,
    });
  } catch (e) {
    console.error("SERVER ERROR:", e);
    return NextResponse.json({ error: "Server crashed", details: e }, { status: 500 });
  }
}
