const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect, sellerOnly } = require('../middleware/auth');

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

router.post(
    '/food-image',
    protect,
    sellerOnly,
    upload.single('image'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Please select an image.'
                });
            }

            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'wastenot/food' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );

                stream.end(req.file.buffer);
            });

            res.status(200).json({
                success: true,
                imageUrl: result.secure_url,
                publicId: result.public_id
            });

        } catch (error) {
            console.error('Image upload error:', error);

            res.status(500).json({
                success: false,
                message: error.message || 'Image upload failed.'
            });
        }
    }
);

module.exports = router;