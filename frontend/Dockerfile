FROM node:22.12.0-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


FROM base AS build_stage
WORKDIR /srv

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

RUN pnpm build


FROM base
WORKDIR /srv

COPY --from=build_stage /srv .

EXPOSE 80
ENV PORT 80
CMD ["node", "dist/index.js"]
