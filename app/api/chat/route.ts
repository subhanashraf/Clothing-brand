// import { NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { createClient } from "@/lib/supabase/server";


// export async function POST(req: Request) {
//   try {
//     const { message } = await req.json();
//     console.log(message,"result1");
    
//     const supabase = await createClient();
//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

//     const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
//     const chatModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//     // Step 1: Create embedding for user query
//     const embedRes = await embedModel.embedContent(message);
//     const vector = embedRes.embedding.values;

//     // Step 2: Vector search
//     const { data: matches, error: rpcError } = await supabase.rpc(
//       "match_products",
//       {
//         query_embedding: vector,
//         match_count: 5,
//       }
//     );

//     console.log(matches,"result2");
    
//     if (rpcError) {
//       console.error("SUPABASE RPC ERROR:", rpcError);
//       return NextResponse.json({ error: "RPC failed", details: rpcError }, { status: 500 });
//     }

  

//     const ids = matches.map((m) => m.product_id);

//     const { data: products } = await supabase
//       .from("products")
//       .select("*")
//       .in("id", ids);

//       console.log(products,"result3");
      
//     // Step 3: AI answer
//     const prompt = `
// User question: ${message}

// Relevant products:
// // ${JSON.stringify(products)}

// Answer user question using only these products. Keep answer simple.
// `;
//     console.log(prompt,"result4");
    
//     const result = await chatModel.generateContent(prompt);
//     console.log(result,"result5");
//     console.log(result.response.text(),"result10");
   
    
//     return NextResponse.json({

//       answer: result.response.text(),
//       products,
//     });
//   } catch (e) {
//     console.error("SERVER ERROR:", e);
//     return NextResponse.json({ error: "Server crashed", details: e }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";
import { encode,encodeLines } from '@toon-format/toon'

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    console.log(message,"result1");
    
    const supabase = await createClient();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const chatModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

 const { data: products, error } = await supabase
  .from("products")
  .select(`
    title,
    description,
    price,
    compare_price,
    sku,
    stock,
    moq,
    wholesale_price,
    carton_qty,
    carton_weight,
    carton_dimensions,
    origin_country,
    seo_title,
    seo_description,
    seo_keywords
  `);
    if (error) {
      console.error("SUPABASE FETCH ERROR:", error);
      return NextResponse.json({ error: "Failed to fetch products", details: error }, { status: 500 });
    }
   
 function calculateDiscount({price, comparePrice}: {price: number, comparePrice: number}): number {
  if (!comparePrice || comparePrice <= price) return 0;

  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

const finalProducts = products.map(product => {
  const discount = calculateDiscount(
    product.price,
    product.compare_price ? product.compare_price : 0
  );
  return { ...product, discount };
});
    console.log(finalProducts,"result2");
      console.log(products,"result3");
      
    // Step 3: AI answer
    const prompt = `
User question: ${message}

Relevant products:
// ${JSON.stringify(products)}

Answer user question using only these products. Keep answer simple.
`;
    console.log(prompt,"result4");
    let encodedPrompt = encode(prompt);
    const result = await chatModel.generateContent(encodedPrompt);
    console.log(result,"result5");
    console.log(result.response.text(),"result10");
   
    
    return NextResponse.json({

      answer: result.response.text(),
      products,
    });
  } catch (e) {
    console.error("SERVER ERROR:", e);
    return NextResponse.json({ error: "Server crashed", details: e }, { status: 500 });
  }
}
