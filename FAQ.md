# Frequently Asked Questions

Common questions about Supernova.

---

## What does Supernova do?

Supernova is an autonomous AI marketing agent that takes a product URL and generates a complete marketing campaign including market intelligence, scripts, product images, voiceovers, and video advertisements—all stored in the cloud.

---

## Which URLs are supported?

Supernova supports most e-commerce product pages including:
- Shopify stores
- Amazon product pages
- Generic HTML pages with product information

---

## Can I use Shopify?

Yes. Supernova extracts product information from Shopify store pages and generates marketing content based on the extracted data.

---

## Can I use Amazon?

Yes. Amazon product pages are supported for product information extraction.

---

## Can I customize branding?

Yes. Supernova includes configurable brand palettes and caption styles. For full customization, you can modify the source code.

---

## How long does generation take?

Generation time varies based on:
- Product URL accessibility
- AI API response times
- Number of assets being generated

Typical campaign generation takes 2-5 minutes.

---

## Where are files stored?

Generated assets are stored in Backblaze B2 cloud storage, organized by campaign ID.

---

## Can I download ZIP?

Yes. Completed campaigns can be downloaded as ZIP archives containing all generated assets.

---

## Which AI models are used?

Supernova uses multiple AI providers:
- **Genblaze** for AI orchestration
- **OpenRouter** for multi-model access (Qwen, Claude, DeepSeek)
- **ElevenLabs** for voice generation
- **Pexels** for stock media

---

## Can I self-host?

Yes. Supernova can be deployed on your own infrastructure:
- Frontend: Any Next.js hosting platform
- Backend: Any Python/ASGI hosting (Railway, Fly.io, Docker)

---

## Does it require Backblaze?

Backblaze B2 is the default storage provider. The backend will start without B2 credentials, but asset storage features require B2 configuration.

---

## What happens if one AI provider fails?

Supernova implements multi-model fallback. If one AI model fails, it automatically tries the next available model in the configured list.
