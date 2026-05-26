import { createHash, createHmac } from "node:crypto";
import type { AITextProvider, GenerateAITextResult, ProviderGenerateInput } from "@/lib/ai/providers/types";
import { estimateCostInr } from "@/lib/ai/providers/types";

export const bedrockProvider: AITextProvider = {
  name: "bedrock",
  async generateText(input) {
    return callBedrock(input);
  }
};

async function callBedrock(input: ProviderGenerateInput): Promise<GenerateAITextResult> {
  const region = process.env.AWS_REGION || "us-east-1";
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";
  const sessionToken = process.env.AWS_SESSION_TOKEN || "";

  if (!accessKeyId || !secretAccessKey) {
    return {
      success: false,
      text: "",
      provider: "bedrock",
      model: input.model,
      error: "AWS credentials are missing. Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION.",
      estimatedCost: 0
    };
  }

  try {
    const host = `bedrock-runtime.${region}.amazonaws.com`;
    const encodedModel = encodeURIComponent(input.model);
    const url = `https://${host}/model/${encodedModel}/invoke`;
    const body = JSON.stringify(buildBedrockPayload(input));
    const headers = signAwsRequest({
      method: "POST",
      url,
      region,
      service: "bedrock",
      accessKeyId,
      secretAccessKey,
      sessionToken,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        host
      },
      body
    });

    const response = await fetch(url, {
      method: "POST",
      headers,
      body
    });
    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        text: "",
        provider: "bedrock",
        model: input.model,
        error: readBedrockError(json) || `Bedrock request failed with HTTP ${response.status}.`,
        estimatedCost: 0
      };
    }

    return {
      success: true,
      text: extractBedrockText(json),
      provider: "bedrock",
      model: input.model,
      estimatedCost: estimateCostInr(input, bedrockCostRate(input.model, input.modelRole))
    };
  } catch (error) {
    return {
      success: false,
      text: "",
      provider: "bedrock",
      model: input.model,
      error: error instanceof Error ? error.message : "Bedrock request failed.",
      estimatedCost: 0
    };
  }
}

function buildBedrockPayload(input: ProviderGenerateInput) {
  const model = input.model.toLowerCase();
  const maxTokens = input.maxTokens ?? 1800;
  const temperature = input.temperature ?? 0.2;

  if (model.includes("anthropic") || model.includes("claude")) {
    return {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: maxTokens,
      temperature,
      system: input.systemPrompt,
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: input.userPrompt }]
        }
      ]
    };
  }

  if (model.includes("mistral")) {
    return {
      prompt: `<s>[INST] ${input.systemPrompt}\n\n${input.userPrompt} [/INST]`,
      max_tokens: maxTokens,
      temperature
    };
  }

  if (model.includes("llama")) {
    return {
      prompt: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n${input.systemPrompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n${input.userPrompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n`,
      max_gen_len: maxTokens,
      temperature
    };
  }

  return {
    prompt: `${input.systemPrompt}\n\n${input.userPrompt}`,
    max_tokens: maxTokens,
    temperature
  };
}

function extractBedrockText(json: unknown) {
  const record = json as {
    content?: Array<{ text?: string }>;
    completion?: string;
    generation?: string;
    outputs?: Array<{ text?: string }>;
    outputText?: string;
  };

  return (
    record.content?.map((item) => item.text ?? "").join("\n").trim() ||
    record.outputs?.map((item) => item.text ?? "").join("\n").trim() ||
    record.generation ||
    record.completion ||
    record.outputText ||
    ""
  );
}

function readBedrockError(json: unknown) {
  const record = json as { message?: string; Message?: string; error?: string; __type?: string };
  return record.message || record.Message || record.error || record.__type || "";
}

function bedrockCostRate(model: string, role: string) {
  const normalized = model.toLowerCase();
  if (normalized.includes("mistral")) return 0.0008;
  if (normalized.includes("llama")) return 0.0006;
  if (["command", "research", "verify", "article"].includes(role)) return 0.006;
  return 0.002;
}

function signAwsRequest(input: {
  method: string;
  url: string;
  region: string;
  service: string;
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
  headers: Record<string, string>;
  body: string;
}) {
  const now = new Date();
  const amzDate = toAmzDate(now);
  const dateStamp = amzDate.slice(0, 8);
  const url = new URL(input.url);
  const headers: Record<string, string> = {
    ...lowercaseHeaders(input.headers),
    "x-amz-date": amzDate
  };

  if (input.sessionToken) {
    headers["x-amz-security-token"] = input.sessionToken;
  }

  const signedHeaders = Object.keys(headers).sort().join(";");
  const canonicalHeaders = Object.keys(headers)
    .sort()
    .map((key) => `${key}:${headers[key].trim().replace(/\s+/g, " ")}\n`)
    .join("");
  const payloadHash = sha256Hex(input.body);
  const canonicalRequest = [
    input.method,
    url.pathname,
    url.searchParams.toString(),
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join("\n");
  const credentialScope = `${dateStamp}/${input.region}/${input.service}/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, credentialScope, sha256Hex(canonicalRequest)].join("\n");
  const signingKey = getSignatureKey(input.secretAccessKey, dateStamp, input.region, input.service);
  const signature = hmacHex(signingKey, stringToSign);

  return {
    ...headers,
    authorization: `AWS4-HMAC-SHA256 Credential=${input.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`
  };
}

function lowercaseHeaders(headers: Record<string, string>) {
  return Object.fromEntries(Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]));
}

function toAmzDate(date: Date) {
  return date.toISOString().replace(/[:-]|\.\d{3}/g, "");
}

function sha256Hex(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function hmac(key: Buffer | string, value: string) {
  return createHmac("sha256", key).update(value, "utf8").digest();
}

function hmacHex(key: Buffer, value: string) {
  return createHmac("sha256", key).update(value, "utf8").digest("hex");
}

function getSignatureKey(secretAccessKey: string, dateStamp: string, region: string, service: string) {
  const dateKey = hmac(`AWS4${secretAccessKey}`, dateStamp);
  const regionKey = hmac(dateKey, region);
  const serviceKey = hmac(regionKey, service);
  return hmac(serviceKey, "aws4_request");
}
