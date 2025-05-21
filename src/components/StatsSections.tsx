export default function StatsSection() {
  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center text-white">
          <h2 className="text-4xl font-medium lg:text-5xl">
            Retouchly ile Üretimin Gücü
          </h2>
          <p>
            Retouchly, yapay zeka destekli içerik üretimiyle kullanıcılarına
            hızlı, yaratıcı ve özgün görseller oluşturma deneyimi sunar.
            Yüzlerce kullanıcı, her gün binlerce içerik üretmek için
            Retouchly'yi tercih ediyor.
          </p>
        </div>

        <div className="grid text-white gap-12 divide-y *:text-center md:grid-cols-3 md:gap-2 md:divide-x md:divide-y-0">
          <div className="space-y-4">
            <div className="text-5xl font-bold">+1200</div>
            <p>Üretilen Görseller</p>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-bold">22.000+</div>
            <p>Aktif Kullanıcı</p>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-bold">%98</div>
            <p>Memnuniyet Oranı</p>
          </div>
        </div>
      </div>
    </section>
  );
}
