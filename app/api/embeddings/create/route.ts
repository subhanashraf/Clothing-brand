import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

  const { data: products } = await supabase
    .from("products")
    .select("id, name, description");

  for (const product of products) {
    const text = `${product.name}. ${product.description}`;
    
    const result = await embeddingModel.embedContent(text);
    const vector = result.embedding.values;  

    await supabase.from("product_embeddings").upsert({
      product_id: product.id,
      embedding: vector
    });
  }

  return NextResponse.json({ success: true });
}
