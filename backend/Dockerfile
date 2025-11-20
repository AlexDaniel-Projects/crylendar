FROM node:24.11.1-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate


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
