import type { NextAuthConfig } from 'next-auth';
import { JWT } from 'next-auth/jwt';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [],
  callbacks: {
   
  
   
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/');
      const isOnLoginPage = nextUrl.pathname === '/login';
      const isOnRegisterPage = nextUrl.pathname === '/register';

      const isOnForgotPasswordPage = nextUrl.pathname === '/forgot-password';
      const isOnResetPasswordPage = nextUrl.pathname.startsWith('/reset-password');
      const isOnPasswordResetApi = nextUrl.pathname.startsWith('/api/reset-password');

      // Allow access to the login page for all users
      if (isOnLoginPage || isOnRegisterPage || isOnForgotPasswordPage || isOnResetPasswordPage || isOnPasswordResetApi) {
        return true;
      }


      // Allow access to the MainNav and other public pages for logged-in users
      if (!isOnDashboard && !isOnLoginPage) {
        return true;
      }

      // Redirect logged-in users to the dashboard if trying to access non-allowed pages
      if (isLoggedIn && isOnDashboard) {
        return true;
      }

      // For non-logged-in users, redirect to login page if accessing restricted pages
      if (!isLoggedIn && isOnDashboard) {
        return Response.redirect(new URL('/login', nextUrl));
      }

      // Default case: allow access
      return true;
    },
   
  },

  
};