import { auth, currentUser } from "@clerk/nextjs/server";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

export default async function Home() {
  // Get the userId from auth() -- if null, the user is not signed in
  const { userId } = await auth();

  // Protect the route by checking if the user is signed in
  if (!userId) {
    return (
      <div className="flex items-center justify-center ">
        <HeroGeometric
          title1="Fotoğrafına Sihirli Dokunuş Yap!"
          title2="Ücretsiz Dene"
        />
      </div>
    );
  }

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser();

  // Use `user` to render user details or create UI elements
  return <div>Welcome, {user?.firstName}!</div>;
}
