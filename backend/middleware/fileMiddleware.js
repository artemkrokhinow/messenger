import Multer from 'multer';

export default  function fileMiddleware() {
    const storage = Multer.memoryStorage();
    destination: function (req, file, cb) {
        cb(null, '');
}
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
}