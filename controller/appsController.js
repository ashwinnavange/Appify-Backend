const apps = require("../models/appsModel");
const multer = require("multer");
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.getAllApps = async (req, resp) => {
    try {
        const projection = { userId: 0, appFile: 0, description: 0, categories: 0, photos: 0, __v: 0, createdAt: 0, whatsNew: 0 };

        const result = await apps.find({ type: "App" }, projection);

        resp.send({ apps: result });
    } catch (error) {
        return resp.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getAllGames = async (req, resp) => {
    try {
        const projection = { userId: 0, appFile: 0, description: 0, categories: 0, photos: 0, __v: 0, createdAt: 0, whatsNew: 0 };

        const result = await apps.find({ type: "Game" }, projection);

        resp.send({ apps: result });
    } catch (error) {
        return resp.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getApp = async (req, resp) => {
    try {
        const app = await apps.findOne({ packageName: req.params.packageName });
        if (!app) {
            return resp.status(400).json({
                success: false,
                message: "App not found",
            });
        }
        resp.status(200).json(app);
    } catch (error) {
        return resp.status(400).json({
            success: false,
            message: error.message,
        });
    }
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

        const appName = req.body.appName;
        const packageName = req.body.packageName;
        const photoDownloadUrls = [];
        const photoFiles = req.files['photos'];

        const logoFile = req.files['logo'][0];
        const appAPK = req.files['appFile'][0];


        const logoDownloadURL = await uploadFile(logoFile.buffer, `${packageName}/logos/${appName}.${getMimetypeExtension(logoFile)}`);
        const appDownloadURL = await uploadFile(appAPK.buffer, `${packageName}/apps/${appName}.apk`);

        if (!logoDownloadURL || !appDownloadURL) {
            return resp.status(400).json({
                success: false,
                message: "Error uploading logo or app",
            });
        }

        for (let i = 0; i < photoFiles.length; i++) {
            if (i === 4) break;
            const photoDownloadUrl = await uploadFile(photoFiles[i].buffer, `${packageName}/photos/${appName}_${i}.${getMimetypeExtension(photoFiles[i])}`);
            if (!photoDownloadUrl) {
                return resp.status(400).json({
                    success: false,
                    message: "Error uploading photos",
                });
            }
            photoDownloadUrls.push(photoDownloadUrl);
        }

        const { logo, appFile, photos, categories, ...newAppData } = req.body;
        const newApp = new apps({
            ...newAppData,
            logo: logoDownloadURL,
            appFile: appDownloadURL,
            createdAt: giveCurrentDateTime(),
            categories: categories ? categories.split(',') : [],
            photos: photoDownloadUrls,
        });

        // Save the new app document to MongoDB
        const savedApp = await newApp.save();

        resp.status(201).json(savedApp);
    } catch (error) {
        return resp.status(400).send(error)
    }
};


const giveCurrentDateTime = () => {
    const today = new Date();
    let month = today.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    const date = today.getDate() + '-' + month + '-' + today.getFullYear();
    return date;
};

const getMimetypeExtension = (file) => {
    const mimeTypeParts = file.mimetype.split('/');
    if (mimeTypeParts.length === 2) {
        return mimeTypeParts[1];
    }
    return '';
};

const uploadFile = async (file, fileOutputName) => {
    try {
        const blob = new Blob([file]);
        const { data, error } = await supabase.storage.from('Appify').upload(fileOutputName, blob,{ upsert: true });
        if (error) {
            console.error('Error uploading file:', error.message);
            return null;
        }
        return `${process.env.SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`;
    } catch (error) {
        console.error('Error uploading file:', error.message);
        return null;
    }
};



