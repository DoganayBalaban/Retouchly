import { auth, currentUser } from "@clerk/nextjs/server";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import ImageShowcase from "../components/ImageShowcase";
import Testimonials from "@/components/testimonials";
export default async function Home() {
  const testimonials = [
    {
      author: {
        name: "Emma Thompson",
        handle: "@emmaai",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      },
      text: "Fotoğraflarım inanılmaz! AI sayesinde anında mükemmel hale geldi.",
    },
    {
      author: {
        name: "David Park",
        handle: "@davidtech",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
      text: "Harika bir deneyim! Kolayca fotoğrafımı düzenledim ve sonuç beklediğimden çok daha iyi oldu.",
    },
    {
      author: {
        name: "Sofia Rodriguez",
        handle: "@sofiaml",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      },
      text: "Görsellerimi hemen paylaştım, arkadaşlarım şok oldu! Kesinlikle öneriyorum.",
    },
  ];
  // Get the userId from auth() -- if null, the user is not signed in
  const { userId } = await auth();

  // Protect the route by checking if the user is signed in
  if (!userId) {
    return (
      <div className="bg-[#030304]">
        <div className="w-full ">
          <HeroGeometric
            title1="Fotoğrafına Sihirli Dokunuş Yap!"
            title2="Ücretsiz Dene"
          />
        </div>
        <div>
          <ImageShowcase />
        </div>
        <div className="bg-[#030304]">
          <Testimonials />
        </div>
      </div>
    );
  }

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser();

  // Use `user` to render user details or create UI elements
  return <div>Welcome, {user?.firstName}!</div>;
}
