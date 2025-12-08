# --- Aşama 1: Build (İnşaat) ---
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# React kodunu HTML/CSS/JS haline getirir (dist klasörü oluşur)
RUN npm run build

# --- Aşama 2: Serve (Sunum) ---
# İnşa edilen dosyaları sunmak için "serve" paketini kullanacağız
FROM node:18-alpine

WORKDIR /app

# Basit bir statik dosya sunucusu yükle
RUN npm install -g serve

# İlk aşamadan oluşan 'dist' klasörünü buraya al
COPY --from=builder /app/dist ./dist

# 5173 portunu dışarı aç
EXPOSE 5173

# Sunucuyu başlat (Port 5173 üzerinden)
CMD ["serve", "-s", "dist", "-l", "5173"]