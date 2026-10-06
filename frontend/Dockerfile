# Stage 1: Build the React application
FROM node:18-alpine AS builder

WORKDIR /app

# نسخ ملفات الوصف أولاً للاستفادة من الـ Cache الخاص بـ Docker
COPY package*.json ./

# تثبيت الاعتماديات
RUN npm ci --silent

# نسخ باقي ملفات المشروع
COPY . .

# بناء النسخة المجمعة للإنتاج
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# نسخ المخرجات من مرحلة البناء إلى مجلد Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# نسخ إعدادات Nginx المخصصة لمعالجة الـ Routing وتفادي خطأ 404
COPY nginx.conf /etc/nginx/conf.d/default.conf

# فتح المنفذ 80
EXPOSE 80

# تشغيل Nginx في الواجهة
CMD ["nginx", "-g", "daemon off;"]