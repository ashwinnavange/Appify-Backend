const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

const uploadMiddleware = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'appFile', maxCount: 1 },
  { name: 'photos', maxCount: 10 }
]);

module.exports = uploadMiddleware;
