# استخدام بيئة Node.js الرسمية بنسخة خفيفة
FROM node:18-alpine

# تحديد مجلد العمل داخل الحاوية (Container)
WORKDIR /app

# نسخ ملفات الحزم أولاً لتحسين الكاش (Cache)
COPY package*.json ./

# تثبيت الاعتماديات للإنتاج
RUN npm install --production

# نسخ باقي ملفات السيرفر
COPY . .

# المنفذ الذي يعمل عليه الباك اند (تأكد هل هو 5000 أو 3000 حسب مشروعك)
EXPOSE 5000

# أمر تشغيل السيرفر (تأكد هل هو npm start أو node server.js أو index.js)
CMD ["npm", "start"]