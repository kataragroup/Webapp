const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const MAIN_SERVER_URL = 'http://13.206.124.146:7000/api/kyc';

// Helper Function: Data aage bhejne ke liye
const forwardRequest = async (endpoint, req, res) => {
    try {
        const formData = new FormData();

        // 1. Saara Text Data add karein
        Object.keys(req.body).forEach(key => {
            formData.append(key, req.body[key]);
        });

        // 2. Saari Files add karein
        if (req.files) {
            Object.keys(req.files).forEach(key => {
                const file = req.files[key][0];
                if (file) {
                    formData.append(key, fs.createReadStream(file.path), {
                        filename: file.originalname,
                        contentType: file.mimetype
                    });
                }
            });
        }

        // 3. Main Server ko hit karein
        const response = await axios.post(`${MAIN_SERVER_URL}${endpoint}`, formData, {
            headers: {
                'Authorization': req.headers.authorization, // User ka token pass karna zaruri hai
                ...formData.getHeaders()
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        // 4. Uploaded files ko delete kar dein (cleanup)
        if (req.files) {
        Object.keys(req.files).forEach(key => {
        const file = req.files[key][0];

        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        });
    }
        // 4. Main server ka response wapas client ko bhej dein
        res.status(response.status).json(response.data);

    } catch (error) {
        console.error(` Proxy Error (${endpoint}):`, error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            success: false,
            message: "Main Server Error",
            error: error.response?.data || error.message
        });
    }
};

// Exports for Routes
exports.freelanceStep1 = (req, res) => forwardRequest('/freelance/step1', req, res);
exports.freelanceStep2 = (req, res) => forwardRequest('/freelance/step2', req, res);
exports.ownerSubmit = (req, res) => forwardRequest('/owner/submit', req, res);

exports.getOwnerKycStatus = async (req, res) => {
    try {
        const response = await axios.get(`${MAIN_SERVER_URL}/owner/status`, {
            headers: { 'Authorization': req.headers.authorization }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || error.message);
    }
};