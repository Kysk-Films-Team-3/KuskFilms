FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

# ======================================================

ARG REACT_APP_KEYCLOAK_URL
ARG REACT_APP_BACKEND_URL

ENV REACT_APP_KEYCLOAK_URL=$REACT_APP_KEYCLOAK_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

# ======================================================

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html index.htm;\n\
    \n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    \n\
    location /health {\n\
        access_log off;\n\
        return 200 "OK";\n\
        add_header Content-Type text/plain;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf
# ===========================================================

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]