import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Testimonials() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12 text-[#E4E4E4]">
          <h2 className="text-4xl font-medium lg:text-5xl ">
            AI Görsel Düzenleme ile Yüzbinlerce Kullanıcı Memnun
          </h2>
          <p>
            AI ile fotoğraflarınızı anında düzenleyin ve profesyonel sonuçlar
            elde edin. İşte kullanıcılarımızdan bazı yorumlar.
          </p>
        </div>

        <div className="grid gap-4 [--color-card:var(--color-muted)] *:border-none *:shadow-none sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2 dark:[--color-muted:var(--color-zinc-900)]">
          <Card className="grid grid-rows-[auto_1fr] gap-8 sm:col-span-2 sm:p-6 lg:row-span-2 bg-[#E4E4E4]">
            <CardContent>
              <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                <p className="text-xl font-medium">
                  "AI ile fotoğrafımı düzenledim ve sonuç gerçekten muazzam! Yüz
                  hatlarım pürüzsüzleşti ve fotoğraf daha canlı hale geldi."
                </p>

                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarImage
                      src="https://via.placeholder.com/150"
                      alt="Cemile Nur"
                      height="400"
                      width="400"
                      loading="lazy"
                    />
                    <AvatarFallback>DB</AvatarFallback>
                  </Avatar>

                  <div>
                    <cite className="text-sm font-medium">Doğanay Balaban</cite>
                    <span className="text-muted-foreground block text-sm">
                      UX Designer
                    </span>
                  </div>
                </div>
              </blockquote>
            </CardContent>
          </Card>
          <Card className="md:col-span-2 bg-[#E4E4E4]">
            <CardContent className="h-full pt-6">
              <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                <p className="text-xl font-medium">
                  "Fotoğraflarımı AI ile düzenlemek çok kolay ve sonuçlar
                  gerçekten profesyonel görünüyor. Kesinlikle tavsiye ederim!"
                </p>

                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarImage
                      src="https://via.placeholder.com/150"
                      alt="Mehmet Demir"
                      height="400"
                      width="400"
                      loading="lazy"
                    />
                    <AvatarFallback>MD</AvatarFallback>
                  </Avatar>
                  <div>
                    <cite className="text-sm font-medium">Mehmet Demir</cite>
                    <span className="text-muted-foreground block text-sm">
                      Freelance Photographer
                    </span>
                  </div>
                </div>
              </blockquote>
            </CardContent>
          </Card>
          <Card className="bg-[#E4E4E4]">
            <CardContent className="h-full pt-6">
              <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                <p>
                  "Görsellerim anında harika hale geldi! Gerçekten etkileyici
                  sonuçlar aldım, mükemmel bir araç."
                </p>

                <div className="grid items-center gap-3 [grid-template-columns:auto_1fr]">
                  <Avatar className="size-12">
                    <AvatarImage
                      src="https://via.placeholder.com/150"
                      alt="Ahmet Yılmaz"
                      height="400"
                      width="400"
                      loading="lazy"
                    />
                    <AvatarFallback>AY</AvatarFallback>
                  </Avatar>
                  <div>
                    <cite className="text-sm font-medium">Ahmet Yılmaz</cite>
                    <span className="text-muted-foreground block text-sm">
                      Digital Marketing Specialist
                    </span>
                  </div>
                </div>
              </blockquote>
            </CardContent>
          </Card>
          <Card className="card variant-mixed bg-[#E4E4E4]">
            <CardContent className="h-full pt-6">
              <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                <p>
                  "Bu uygulama gerçekten harika! Anında düzenlemeler yaparak
                  fotoğraflarımı daha profesyonel hale getirdim."
                </p>

                <div className="grid grid-cols-[auto_1fr] gap-3">
                  <Avatar className="size-12">
                    <AvatarImage
                      src="https://via.placeholder.com/150"
                      alt="Zeynep Kara"
                      height="400"
                      width="400"
                      loading="lazy"
                    />
                    <AvatarFallback>ZK</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Zeynep Kara</p>
                    <span className="text-muted-foreground block text-sm">
                      Content Creator
                    </span>
                  </div>
                </div>
              </blockquote>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
