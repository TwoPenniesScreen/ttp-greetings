export const json = (body,status=200,headers={}) => Response.json(body,{status,headers:{"Cache-Control":"no-store",...headers}});
export async function adminGuard(request) {
  const token=request.headers.get("X-TTP-Hub-Token");
  if (!token || !/^[A-Za-z0-9_.-]{40,2048}$/.test(token)) return json({error:"Open this admin from the Two Pennies admin hub."},401);
  try {
    const check=await fetch("https://ttp-brand.netlify.app/api/hub/verify",{method:"POST",headers:{Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(4000)});
    if (check.ok) return null;
  } catch {}
  return json({error:"Your admin session has expired. Return to the hub and sign in again."},401);
}
