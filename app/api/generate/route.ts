import { NextResponse } from "next/server";
import { AiReadyQuestionGenerator } from "@/lib/questionGenerator";
import type { GenerateQuestionInput } from "@/lib/types";

const generator = new AiReadyQuestionGenerator();

export async function POST(request: Request) {
  const body = (await request.json()) as GenerateQuestionInput;
  const questions = await generator.generate(body);

  return NextResponse.json({
    provider: "local-fallback",
    questions,
  });
}
