FROM node:22.7.0-slim as build_stage
WORKDIR /srv

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

RUN pnpm build


FROM caddy:2.8.4-alpine
WORKDIR /srv

COPY --from=build_stage /srv/dist/spa .
CMD caddy file-server
