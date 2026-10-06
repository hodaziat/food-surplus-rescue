# استخدام بيئة Node.js الرسمية بنسخة خفيفة
FROM node:18-alpine

# تحديد مجلد العمل داخل الحاوية (Container)
WORKDIR /app

# نسخ ملفات الحزم أولاً لتحسين الكاش (Cache)
COPY package*.json ./

# تثبيت الاعتماديات الخاصة بالإنتاج بدقة
RUN npm ci --only=production

# نسخ باقي ملفات السيرفر
COPY . .

# المنفذ الذي يعمل عليه الباك اند
EXPOSE 5000

# أمر تشغيل السيرفر
CMD ["npm", "start"]