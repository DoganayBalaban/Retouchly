<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/doganaybalaban/Retouchly">
    <img src="https://i.ibb.co/ZpqJJCcN/logo2.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Retouchly</h3>

  <p align="center">
    Retouchly, görsel üretme, arka plan silme ve fotoğraf iyileştirme gibi yapay zeka destekli araçlar sunan modern bir web uygulamasıdır. Kullanıcılar, sezgisel arayüz üzerinden profesyonel kalitede görseller oluşturabilir ve düzenleyebilir. Retouchly, esnek abonelik modeliyle hem bireysel kullanıcılar hem de yaratıcı profesyoneller için ideal bir SaaS çözümüdür.
    <br />
    <a href="https://github.com/doganaybalaban/Retouchly"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://retouchly-omega.vercel.app/">View Demo</a>
    ·
    <a href="https://github.com/doganaybalaban/Retouchly/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/doganaybalaban/Retouchly/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://retouchly-omega.vercel.app/)

_(Gelecekte buraya uygulamanın genel bir GIF'i veya daha fazla ekran görüntüsü eklenecektir.)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![Next][Next.js]][Next-url]
- [![React][React.js]][React-url]
- [![TailwindCSS][TailwindCSS.com]][TailwindCSS-url]
- [![Zustand][Zustand.com]][Zustand-url]
- [![Supabase][Supabase.com]][Supabase-url]
<!-- TODO: Add badges for Replicate, Shadcn UI etc if desired -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Bu projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz.

### Prerequisites

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Repoyu klonlayın
   ```sh
   git clone https://github.com/doganaybalaban/Retouchly.git
   ```
2. NPM paketlerini yükleyin
   ```sh
   npm install
   ```
3. `.env` dosyanızı oluşturun ve aşağıdaki ortam değişkenlerini ekleyin:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   REPLICATE_API_TOKEN=your_replicate_api_token
   ```
4. Geliştirme sunucusunu başlatın
   ```sh
   npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

### API Kullanımı

Aşağıda proje içerisindeki temel Server Actions ve API uç noktaları listelenmektedir:

#### Arkaplan sil

```http
  background-actions
```

| Parametre | Tip      | Açıklama                                             |
| :-------- | :------- | :--------------------------------------------------- |
| `image`   | `string` | Arkaplan silme modeli için Replicate AI'a istek atar |

#### Görsel üret

```http
  image-actions
```

| Parametre | Tip      | Açıklama                         |
| :-------- | :------- | :------------------------------- |
| `image`   | `string` | Görsel üretmek için istek yapar. |

#### Görsel iyileştir

```http
  restore-actions
```

| Parametre | Tip      | Açıklama                     |
| :-------- | :------- | :--------------------------- |
| `image`   | `string` | Bulanık görseli netleştirir. |

#### Kaydedilen görüntüleri getir

```http
  savedImages
```

| Parametre | Tip      | Açıklama                       |
| :-------- | :------- | :----------------------------- |
| `image`   | `string` | Üretilen görüntüleri kaydeder. |

#### Kullanıcının oluşturduğu görüntüleri getir

```http
  getUserGeneratedImages
```

| Parametre | Tip      | Açıklama                                              |
| :-------- | :------- | :---------------------------------------------------- |
| `image`   | `string` | Belirli kullanıcının oluşturduğu görüntüleri getirir. |

_(Buraya gelecekte API ve Araç kullanımları ile ilgili GIF'ler / Ekran görüntüleri gelebilir: [PLACEHOLDER-FOR-GIF])_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FEATURES -->

## Features

- [x] Açık/koyu mod geçişi
- [x] Canlı ön izleme
- [x] Tam ekran modu
- [x] Tüm platformlara destek
- [x] Yapay Zeka Destekli Araçlar (Görsel Üretme, Arkaplan Silme, Yüz İyileştirme vb.)
- [x] Bulut Tabanlı Depolama
- [x] Kredi Sistemi ile Kullanım
- [x] Güvenli Oturum Açma

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [ ] Ek tarayıcı desteği
- [ ] Daha fazla entegrasyon ekleme
- [ ] Daha fazla AI aracı
- [ ] Akıllı asistan
- [ ] Cloudinary saklama sistemine geçiş
- [ ] İzleme ve analiz
- [ ] Mobil sürüm

See the [open issues](https://github.com/doganaybalaban/Retouchly/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Doğanay Balaban - balabandoganay@gmail.com

Project Link: [https://github.com/doganaybalaban/Retouchly](https://github.com/doganaybalaban/Retouchly)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
- [Replicate AI](https://replicate.com/)
- [Supabase](https://supabase.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/doganaybalaban/Retouchly.svg?style=for-the-badge
[contributors-url]: https://github.com/doganaybalaban/Retouchly/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/doganaybalaban/Retouchly.svg?style=for-the-badge
[forks-url]: https://github.com/doganaybalaban/Retouchly/network/members
[stars-shield]: https://img.shields.io/github/stars/doganaybalaban/Retouchly.svg?style=for-the-badge
[stars-url]: https://github.com/doganaybalaban/Retouchly/stargazers
[issues-shield]: https://img.shields.io/github/issues/doganaybalaban/Retouchly.svg?style=for-the-badge
[issues-url]: https://github.com/doganaybalaban/Retouchly/issues
[license-shield]: https://img.shields.io/github/license/doganaybalaban/Retouchly.svg?style=for-the-badge
[license-url]: https://github.com/doganaybalaban/Retouchly/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/doganaybalaban
[product-screenshot]: images/screenshot.png

<!-- Tech Stack Badges -->

[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TailwindCSS.com]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[TailwindCSS-url]: https://tailwindcss.com/
[Zustand.com]: https://img.shields.io/badge/Zustand-4A4A55?style=for-the-badge&logo=react&logoColor=white
[Zustand-url]: https://zustand-demo.pmnd.rs/
[Supabase.com]: https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white
[Supabase-url]: https://supabase.com/
