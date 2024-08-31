FROM node:22.7.0-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


FROM base AS build_stage
WORKDIR /srv

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

RUN pnpm build


FROM caddy:2.8.4-alpine
WORKDIR /srv

COPY --from=build_stage /srv/dist/spa .
CMD caddy file-server
