# 1. Node.js'in hafif bir sürümünü temel al
FROM node:18-alpine

# 2. Çalışma klasörünü ayarla
WORKDIR /app

# 3. Paket listesini kopyala ve yükle
# (Sadece package.json'u kopyalıyoruz ki kod değişse bile npm install tekrar çalışmasın - Cache mantığı)
COPY package*.json ./
RUN npm install

# 4. Geri kalan tüm kodları kopyala
COPY . .

# 5. Uygulamanın çalışacağı portu belirt (Bilgi amaçlı)
EXPOSE 3000

# 6. Uygulamayı başlat
CMD ["npm", "start"]