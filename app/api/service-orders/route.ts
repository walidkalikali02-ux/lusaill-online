import { createHmac } from "node:crypto";
import { getService, getQuestions, validAnswer, type AnswerMap } from "@/lib/service-orders";
import { supabaseRequest } from "@/lib/order-storage";

const badRequest = () => Response.json({ error: "يرجى إكمال إجابات الطلب ومراجعتها." }, { status: 400 });
const unavailable = () => Response.json({ error: "تعذّر حفظ الطلب الآن. جرّب مرة أخرى." }, { status: 503 });

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) return badRequest();
  if (request.headers.get("origin") !== new URL(request.url).origin) return badRequest();
  if (Number(request.headers.get("content-length")) > 65536) return badRequest();
  let payload;
  try {
    const body = await request.text();
    if (Buffer.byteLength(body) > 65536) return badRequest();
    payload = JSON.parse(body);
  } catch {
    return badRequest();
  }

  if (!payload || typeof payload.service !== "string" || payload.website !== "" || payload.consent !== true ||
      typeof payload.id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payload.id) ||
      !payload.answers || typeof payload.answers !== "object" || Array.isArray(payload.answers)) return badRequest();

  const service = getService(payload.service);
  if (!service) return badRequest();
  const answers: AnswerMap = Object.create(null);
  for (const [id, value] of Object.entries(payload.answers)) {
    if (typeof value !== "string") return badRequest();
    answers[id] = value.trim();
  }

  const questions = getQuestions(service, answers);
  if (Object.keys(answers).length !== questions.length ||
      questions.some(question => !(question.id in answers) || !validAnswer(question, answers[question.id]))) return badRequest();

  const key = process.env.LUSAIL_ORDER_INTAKE_KEY;
  if (!key) return unavailable();
  const source = request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const clientHash = createHmac("sha256", key).update(source.trim()).digest("hex");

  try {
    const res = await supabaseRequest("/rest/v1/rpc/submit_service_order", {
      method: "POST",
      body: JSON.stringify({
        intake_key: key, order_id: payload.id, service_slug: service.slug,
        customer_name: answers.name, customer_email: answers.email,
        order_answers: questions.map(question => ({ id: question.id, question: question.label, answer: answers[question.id] })),
        client_hash: clientHash,
      }),
    });
    if (res.status === 429) return Response.json({ error: "وصلت إلى الحد المؤقت للطلبات. حاول بعد ساعة." }, { status: 429 });
    if (!res.ok) return unavailable();
    return Response.json({ id: await res.json() }, { status: 201 });
  } catch {
    return unavailable();
  }
}
