const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = process.env.KYC_BACKEND_URL || 'http://13.206.124.146:7000/api/kyc';
if (!BASE_URL) {
  console.error(" KYC_BACKEND_URL is not set in environment variables!");
}

exports.ownerSubmit = async (req, res) => {
  try {
    //console.log("TOKEN:", req.headers.authorization);
    
    const token = req.headers.authorization;

    const formData = new FormData();

    // Add text fields
    Object.keys(req.body).forEach(key => {
      formData.append(key, req.body[key]);
    });

    // Add files
    Object.keys(req.files).forEach(key => {
      const file = req.files[key][0];

       formData.append(key, fs.createReadStream(file.path));
       //console.log(req.files);
    });

    const response = await axios.post(
      `${BASE_URL}/owner/submit`,
      formData,
      {
        headers: {
          Authorization: token,
          ...formData.getHeaders()
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    res.status(500).json({
      message: "KYC failed",
      error: error.response?.data || error.message
    });
  }
};

// Get Owner KYC Status
exports.getOwnerKycStatus = async (req, res) => {

  try {

    const token = req.headers.authorization;

    const response = await axios.get(
      `${BASE_URL}/owner/status`,
      {
        headers: {
          Authorization: token
        }
      }
    );

    return res.json(response.data);

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch KYC status',
      error: error.response?.data || error.message
    });

  }

};

// Step 1 for Freelance Drivers
exports.freelanceStep1 = async (req, res) => {
  try {
    console.log("=== FREELANCE STEP1 CALLED ===");
    console.log("Body Keys:", Object.keys(req.body));
    console.log("Files Received:", Object.keys(req.files || {}));

    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const formData = new FormData();

    // Text fields
    Object.keys(req.body).forEach(key => {
      formData.append(key, req.body[key]);
    });

    // Files
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

    const response = await axios.post(
      `${BASE_URL}/freelance/step1`,
      formData,
      {
        headers: {
          Authorization: token,
          ...formData.getHeaders()
        },
        timeout: 60000   // 60 seconds timeout
      }
    );

    // Optional: Cleanup files after successful upload
    cleanupFiles(req.files);

    res.json(response.data);

  } catch (error) {
    console.error(" Freelance Step1 Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    // Cleanup even if it fails
    if (req.files) cleanupFiles(req.files);

    res.status(500).json({
      message: "Step1 failed",
      error: error.response?.data || error.message
    });
  }
};

// Step 2 for Freelance Drivers
exports.freelanceStep2 = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const formData = new FormData();
    const fs = require('fs');

    Object.keys(req.body).forEach(key => {
      formData.append(key, req.body[key]);
    });

    Object.keys(req.files).forEach(key => {
      const file = req.files[key][0];
      formData.append(key, fs.createReadStream(file.path));
    });

    const response = await axios.post(
      `${BASE_URL}/freelance/step2`,
      formData,
      {
        headers: {
          Authorization: token,
          ...formData.getHeaders()
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    res.status(500).json({
      message: "Step2 failed",
      error: error.response?.data || error.message
    });
  }
};

// Cleanup uploaded files
const cleanupFiles = (files) => {
  if (!files) return;
  
  Object.keys(files).forEach(key => {
    const file = files[key][0];
    if (file && file.path) {
      fs.unlink(file.path, (err) => {
        if (err) console.error(`Failed to delete ${file.path}`);
      });
    }
  });
};