import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function middleware(request) {
    const session = await getKindeServerSession();
    const { isAuthenticated } = session;

    if (!(await isAuthenticated())) {
        return NextResponse.redirect(
            new URL('/api/auth/login?post_login_redirect_url=/dashboard', request.url)
        );
    }

    // Allow access to the requested resource if authenticated
    return NextResponse.next();
}

export const config = {
    matcher: '/dashboard/:path*',
};
