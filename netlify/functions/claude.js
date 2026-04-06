// Netlify serverless function — proxies Claude API calls (bypasses CORS)
export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST,OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } });
  }
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const body = await req.json();
    const { apiKey, model, max_tokens, system, messages, tools } = body;
    if (!apiKey) return new Response(JSON.stringify({ error: "No API key" }), { status: 400 });

    const claudeBody = { model: model || "claude-sonnet-4-20250514", max_tokens: max_tokens || 1000, messages };
    if (system) claudeBody.system = system;
    if (tools) claudeBody.tools = tools;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(claudeBody),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
  }
};

export const config = { path: "/api/claude" };
