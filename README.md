# PixelChameleons — Collection Site

One-page animated showcase for **999 pure-code 8-bit chameleon 1/1s**.

Not a mint pad — story, forge pipeline, rarity-from-code, and a live GIF gallery.

## Live

**https://pixelchameleons.vercel.app**

Vercel project: `pixelchameleons` (uncmasons-projects)

## Assets (Filebase CDN)

| What | URL |
|------|-----|
| GIFs | `https://pixelchameleons.s3.filebase.io/images/{000–998}.gif` |
| Metadata | `https://pixelchameleons.s3.filebase.io/metadata/{000–998}.json` |
| CSS | `https://pixelchameleons.s3.filebase.io/site/styles.css` |
| JS | `https://pixelchameleons.s3.filebase.io/site/app.js` |

`index.html` loads CSS/JS from Filebase so production stays thin and assets update independently.

## Local

```bash
# from this folder
npx serve .
# or open index.html (CDN assets still load)
```

To edit styles/scripts and republish CDN:

```powershell
aws --endpoint-url https://s3.filebase.io --profile filebase s3 cp styles.css s3://pixelchameleons/site/styles.css --content-type "text/css" --acl public-read
aws --endpoint-url https://s3.filebase.io --profile filebase s3 cp app.js s3://pixelchameleons/site/app.js --content-type "application/javascript" --acl public-read
```

## Sections

1. **Hero** — rotating 1/1 stage + thumbs  
2. **Gallery** — featured animated GIFs with tier filters  
3. **Origin** — why the collection exists  
4. **Forge** — seed → weighted roll → paint → animate  
5. **Rarity** — inverse trait weights baked into pixels  
6. **Traits** — eight habitat-first slots  

## Stack

Static HTML · CSS · JS · Filebase GIFs · Vercel production
