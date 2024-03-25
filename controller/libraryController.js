const Apps = require("../models/appsModel");
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.getLibrary = async (req, res) => {
    try {
        const projection = { userId: 0, appFile: 0, description: 0, categories: 0, photos: 0, __v: 0, createdAt: 0, whatsNew: 0, developerName: 0 };

        const result = await Apps.find({ userId: req.params.id }, projection);

        res.send({ library: result });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

exports.deleteApp = async (req, res) => {
    try {
        const app = await Apps.findOneAndDelete({ packageName: req.params.packageName });
        //await deleteResources(req, res);
        if (!app) {
            return res.status(404).json({
                success: false,
                message: "App not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "App deleted",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
// TO DO
// const deleteResources = async (req, res) => {
//     const { data, error } = await supabase.storage
//         .from('Appify')
//         .remove([`${req.params.packageName}`]);

//     if (error) {
//         return res.status(400).json({
//             success: false,
//             message: error.message,
//         });
//     }

// }