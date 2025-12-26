// configs/cors.config.js
const { FRONTEND_URL, BACKEND_URL, LOCALHOST_URL } = require('./url.config');

const allowedOrigins = [
    FRONTEND_URL,
    BACKEND_URL,
    LOCALHOST_URL,
    // Bạn có thể thêm các domain khác vào đây
    "http://localhost:5173", // Đôi khi cần hardcode để test
];

const corsOptions = {
    origin: function (origin, callback) {
        // !origin cho phép các request từ server-to-server hoặc công cụ như Postman (không có origin)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Cho phép gửi cookies, authorization headers
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Cho phép các header này
    optionsSuccessStatus: 200,
};

module.exports = { corsOptions, allowedOrigins };