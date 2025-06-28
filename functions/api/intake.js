// 只负责处理 /api/intake
export async function onRequestPost(context) {
  // 假设你已经绑定了新的 Worker 到 API_INTAKE 变量
  return await context.env.API_INTAKE.fetch(context.request);
}
