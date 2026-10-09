FROM node:24-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY public ./public
COPY src ./src
COPY content ./content
COPY scripts ./scripts
ENV CI=true
RUN npm run build

FROM nginx:stable-alpine AS runtime

# Railway supplies PORT; 8080 is the default for local execution.
ENV PORT=8080
COPY docker/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
