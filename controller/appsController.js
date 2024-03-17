const apps = require("../models/appsModel");
const multer = require("multer");
const { initializeApp } = require('firebase/app');
const config = require("../data/firebaseConfig");
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");

initializeApp(config.firebaseConfig);

const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });

exports.getAllApps = async (req, resp) => {
    const result = await apps.find();
    resp.send(result);
};

exports.postApp = async (req, resp) => {
    try {
        const existingApp = await apps.findOne({packageName: req.body.packageName });
        if (existingApp) {
            return resp.status(202).json({
                success: false,
                message: "App already exists",
            });
        }
        const logoFile = req.files['logo'][0];
        const logoRef = ref(storage, `${req.body.packageName}/logos/${req.body.appName}`);
        const logoSnapshot = await uploadBytesResumable(logoRef, logoFile.buffer);
        const logoDownloadURL = await getDownloadURL(logoSnapshot.ref);


        const appFile = req.files['appFile'][0];
        const appRef = ref(storage, `${req.body.packageName}/apps/${req.body.appName}`);
        const appSnapshot = await uploadBytesResumable(appRef, appFile.buffer);
        const appDownloadURL = await getDownloadURL(appSnapshot.ref);

        const photoDownloadUrls = [];
        const photoFiles = req.files['photos'];
        let i=0;
        for (const photo of photoFiles) {
            if(i === 4) break;
            const photoRef = ref(storage, `${req.body.packageName}/photos/${req.body.appName + " " + i++}`);
            const photoSnapshot = await uploadBytesResumable(photoRef, photo.buffer);
            const photoUrl = await getDownloadURL(photoSnapshot.ref);
            photoDownloadUrls.push(photoUrl);
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
    const date = today.getDate() + '-' +  month + '-' + today.getFullYear();
    return date;
};