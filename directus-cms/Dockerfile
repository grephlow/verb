# Directus CMS — built from the project's own package.json/extensions so the
# custom emoji-picker / icon-picker interfaces work the same as in local dev.
FROM node:20-bookworm-slim

WORKDIR /directus

RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY extensions ./extensions

ENV HOST=0.0.0.0
ENV PORT=8055
EXPOSE 8055

CMD ["npx", "directus", "start"]
