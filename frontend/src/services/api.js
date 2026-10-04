import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
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
            // حذف بيانات المستخدم والتوكن من المتصفح
            localStorage.removeItem('token');
            localStorage.removeItem('user'); // إذا كنتِ تخزنين بيانات المستخدم أيضاً

            // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول تلقائياً
            window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default API;