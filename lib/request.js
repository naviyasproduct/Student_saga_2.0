export function getClientIp(request) {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "local";
}
