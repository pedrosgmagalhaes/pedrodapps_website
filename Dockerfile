# NGINX container serving prebuilt Vite static files (no Node build here)

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
# Copy prebuilt assets from local 'dist' (run `npm run build` before submit)
COPY dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Cloud Run expects listening on $PORT; we configure NGINX to listen on 8080
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]