// import { NextRequest, NextResponse } from "next/server";

// const protectedRoutes = ["/"];
// export default function middleware(req: NextRequest) {
//   if (typeof window !== "undefined") {
//     const accessToken = window.localStorage.getItem("access-token");
//     // const accessToken = cookies.get("access-token")
//     if (!accessToken && protectedRoutes.includes(req.nextUrl.pathname)) {
//       const absoluteUrl = new URL("/login", req.nextUrl.origin);
//       return NextResponse.redirect(absoluteUrl.toString());
//     }
//   }
//   return NextResponse.next();
// }

import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/"];

export default function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access-token");

  if (!accessToken && protectedRoutes.includes(req.nextUrl.pathname)) {
    const absoluteUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(absoluteUrl.toString());
  }

  return NextResponse.next();
}
