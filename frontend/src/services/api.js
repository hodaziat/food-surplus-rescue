import axios from 'axios';

// تحديد عنوان الـ API ديناميكياً بناءً على عنوان الجهاز الذي فتح الموقع
const hostname = window.location.hostname;
const API_BASE_URL = `http://${hostname}:5000/api`;

const API = axios.create({
    baseURL: API_BASE_URL,
});

// إرفاق التوكين مع كل طلب بشكل آلي
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// التقاط أخطاء الرد (مثل انتهاء الصلاحية أو عدم المصادقة)
API.interceptors.response.use(
    (response) => response, // إذا كان الرد سليماً، مرره طبيعي
    (error) => {
        // إذا كان الخطأ 401 (غير مسموح / انتهت صلاحية التوكن)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('username');

            // التوجيه إلى صفحة تسجيل الدخول فقط إذا لم نكن فيها بالفعل
            if (window.location.pathname !== '/login') {
                window.location.href = '/login'; 
            }
        }
        return Promise.reject(error);
    }
);

export default API;