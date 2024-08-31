FROM node:22.7.0-slim as build_stage
WORKDIR /srv

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

RUN pnpm build


FROM node:22.7.0-slim
WORKDIR /srv

EXPOSE 3000
CMD pnpm start
