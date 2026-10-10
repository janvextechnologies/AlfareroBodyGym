import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/server/auth/token";

const LOGIN_PATH = "/admin";
const DASHBOARD_PATH = "/admin/dashboard";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? await verifyAdminSessionToken(token) : null;

  const expectedUsername = process.env.ADMIN_USERNAME;
  const validSession =
    session && (!expectedUsername || session.username === expectedUsername)
      ? session
      : null;

  const isLoginPage = pathname === LOGIN_PATH;

  if (!validSession && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (validSession && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = DASHBOARD_PATH;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
