# Despliegue con nginx y PM2

## Backend con PM2

Desde la carpeta `backend`:

```powershell
npm install
npm run pm2:start
```

Comandos utiles:

```powershell
npm run pm2:restart
npm run pm2:stop
pm2 list
pm2 logs des-web-tfi-backend
```

El backend queda ejecutandose en `http://localhost:3000`.

## Frontend con nginx

1. Instalar nginx en `C:\nginx-1.31.1`.
2. Copiar `deploy/nginx/des-web-tfi.conf` dentro de la carpeta de configuracion de nginx, o copiar su contenido al `nginx.conf`.
3. Compilar y copiar el frontend:

```powershell
cd frontend
npm install
npm run deploy
```

4. Iniciar o recargar nginx:

```powershell
cd C:\nginx-1.31.1
start nginx
nginx -s reload
```

La aplicacion queda disponible en `http://localhost`.

## Flujo productivo

```text
Navegador -> nginx -> Angular
Navegador -> nginx /api -> NestJS con PM2 -> PostgreSQL
```
