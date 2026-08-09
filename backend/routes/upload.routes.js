const router = require('express').Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect } = require('../middleware/auth.middleware');
const { success, error } = require('../utils/response');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  },
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/', protect, upload.single('file'), async (req, res) => {
  if (!req.file) return error(res, 'No file provided', 400);

  const uploadToCloudinary = () =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'ms_store', resource_type: 'image' },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

  const result = await uploadToCloudinary();
  return success(res, { secure_url: result.secure_url, public_id: result.public_id });
});

router.delete('/:publicId', protect, async (req, res) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId);
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === 'not found') return error(res, 'Image not found on Cloudinary', 404);
    return success(res, null, 'Image deleted from Cloudinary');
  } catch (err) {
    return error(res, 'Failed to delete image from Cloudinary');
  }
});

module.exports = router;
