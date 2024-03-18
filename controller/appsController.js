const apps = require("../models/appsModel");
const multer = require("multer");
const { initializeApp } = require('firebase/app');
const config = require("../data/firebaseConfig");
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");

initializeApp(config.firebaseConfig);

const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });

exports.getAllApps = async (req, resp) => {
    try {
        const projection = { userId: 0, packageName: 0, appFile: 0, description: 0, categories: 0, photos: 0, __v: 0, createdAt: 0, whatsNew: 0 };

        const result = await apps.find({}, projection);

        resp.send(result);
    } catch (error) {
        return resp.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getApp = async (req, resp) => {
    const app = await apps.findOne({ packageName: req.params.packageName });
    if (!app) {
        return resp.status(400).json({
            success: false,
            message: "App not found",
        });
    }
    resp.status(200).json(app);
}

exports.postApp = async (req, resp) => {
    try {
        const existingApp = await apps.findOne({ packageName: req.body.packageName });
        if (existingApp) {
            return resp.status(202).json({
                success: false,
                message: "App already exists",
            });
        }
        const logoDownloadURL = await uploadToFirebase(req.files['logo'][0], `${req.body.packageName}/logos/${req.body.appName}.png`);
        const appDownloadURL = await uploadToFirebase(req.files['appFile'][0], `${req.body.packageName}/apps/${req.body.appName}.apk`);

        const photoDownloadUrls = [];
        const photoFiles = req.files['photos'];
        let i = 0;
        for (const photo in photoFiles) {
            if (i === 4) break;
            const photoDownloadUrl = await uploadToFirebase(photo, `${req.body.packageName}/apps/${req.body.appName}.apk`);
            photoDownloadUrls.push(photoDownloadUrl);
        }
        const newApp = new apps({
            logo: logoDownloadURL,
            appName: req.body.appName,
            userId: req.body.userId,
            packageName: req.body.packageName,
            appFile: appDownloadURL,
            rating: req.body.rating,
            developerName: req.body.developerName,
            type: req.body.type,
            shortDescription: req.body.shortDescription,
            description: req.body.description,
            whatsNew: req.body.whatsNew,
            createdAt: giveCurrentDateTime(),
            categories: req.body.categories,
            photos: photoDownloadUrls,
            totalDownloads: req.body.totalDownloads,
        });

        // Save the new app document to MongoDB
        const savedApp = await newApp.save();

        resp.status(201).json(savedApp);
    } catch (error) {
        return resp.status(400).send(error.message)
    }
};

const giveCurrentDateTime = () => {
    const today = new Date();
    let month = today.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    const date = today.getDate() + '-' + month + '-' + today.getFullYear();
    return date;
};

const uploadToFirebase = async (file, path) => {
    const ref = ref(storage, path);
    const snapshot = await uploadBytesResumable(ref, file.buffer);
    return await getDownloadURL(snapshot.ref);
}