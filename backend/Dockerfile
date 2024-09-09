FROM node:22.8.0-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


FROM base AS build_stage
WORKDIR /srv

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

# RUN pnpm build # There is no build step yet


FROM base
WORKDIR /srv

COPY --from=build_stage /srv .

EXPOSE 3000
CMD ["node", "--import", "tsx", "src/index.ts"]
