import { authOptions } from '../api/auth/[...nextauth]/authOptions';
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import React from "react";

export default async function ServerSideAuthCheck({ children }: { children: React.ReactNode }) {

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <>{children}</>
  );
}