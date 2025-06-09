
# Retouchly

Retouchly, görsel üretme, arka plan silme ve fotoğraf iyileştirme gibi yapay zeka destekli araçlar sunan modern bir web uygulamasıdır. Kullanıcılar, sezgisel arayüz üzerinden profesyonel kalitede görseller oluşturabilir ve düzenleyebilir. Retouchly, esnek abonelik modeliyle hem bireysel kullanıcılar hem de yaratıcı profesyoneller için ideal bir SaaS çözümüdür.


## API Kullanımı

#### Arkaplan sil

```http
  background-actions
```

| Parametre | Tip     | Açıklama                |
| :-------- | :------- | :------------------------- |
| `image` | `string` | Arkaplan silme modeli için Replicate AI'a istek atar |

#### Öğeyi getir

```http
  image-actions
```

| Parametre | Tip     | Açıklama                       |
| :-------- | :------- | :-------------------------------- |
| `image`      | `string` | Görsel üretmek için istek yapar. |

#### Öğeyi getir

```http
  restore-actions
```

| Parametre | Tip     | Açıklama                       |
| :-------- | :------- | :-------------------------------- |
| `image`      | `string` | Bulanık görseli netleştirir. |

#### Öğeyi getir

```http
  savedImages
```

| Parametre | Tip     | Açıklama                       |
| :-------- | :------- | :-------------------------------- |
| `image`      | `string` | Üretilen görüntüleri kaydeder. |

#### Öğeyi getir

```http
  getUserGeneratedImages
```

| Parametre | Tip     | Açıklama                       |
| :-------- | :------- | :-------------------------------- |
| `image`      | `string` | Belirli kullanıcının oluşturduğu görüntüleri getirir. |


## Demo

https://retouchly-omega.vercel.app/

  
## Ortam Değişkenleri

Bu projeyi çalıştırmak için aşağıdaki ortam değişkenlerini .env dosyanıza eklemeniz gerekecek

`NEXT_PUBLIC_SUPABASE_URL`

`NEXT_PUBLIC_SUPABASE_ANON_KEY`

`REPLICATE_API_TOKEN`

  
## Özellikler

- Açık/koyu mod geçişi
- Canlı ön izleme
- Tam ekran modu
- Tüm platformlara destek
- Yapay Zeka Destekli Araçlar 
- Bulut Tabanlı Depolama 
- Kredi Sistemi ile Kullanım
- Güvenli Oturum Açma

  
## Kullanılan Teknolojiler

**İstemci:** Next, Zustand, TailwindCSS, Shadcn/ui

**Sunucu:** Supabase, Replicate AI

  
## Yol haritası

- Ek tarayıcı desteği

- Daha fazla entegrasyon ekleme

- Daha fazla AI aracı

- Akıllı asistan

- Cloudinary saklama sistemine geçiş

- İzleme ve analiz

- Mobil sürüm
## Destek

Destek için balabandoganay@gmail.com adresine e-posta gönderiniz.

  
![Logo](https://i.ibb.co/ZpqJJCcN/logo2.png)

    