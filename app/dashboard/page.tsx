import ServerSideAuthCheck from "@/app/components/ServerSideAuthCheck";
import { getServerSession } from "next-auth";
import { authOptions } from '../api/auth/[...nextauth]/authOptions';
import { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import ConversationList from "@/app/components/ConversationList";
import styles from "./page.module.css";

export default async function Dashboard() {

  function renderDashboard(user: User) {

    const content = (user.name)
      ? `Hello, ${user.name}!`
      : 'Hello!';

    return (
      <div className={styles.dashboard}>
        <p className={styles.name}>{content} 👋👋</p>
        <ConversationList user={user} />
      </div>
    )
  }

  const session = await getServerSession(authOptions);

  // Only check for a user if the session is not null, if it is null then let ServerSideAuthCheck redirect us
  let user: User | null = null;
  if (session && session.user) {

    user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });
  } else {
    throw new Error("Failed to load session");
  }

  // TODO need to check if name is null, also clean up
  return (
    <ServerSideAuthCheck>
      {user ? (
        renderDashboard(user)
      ) : (
        <></>
      )}
    </ServerSideAuthCheck>
  );
}