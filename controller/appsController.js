const apps = require("../models/appsModel");

exports.getAllApps = async (req, resp) => {
    const result = await apps.find();
    resp.send(result);
};

exports.postApp = async (req, resp) => {
    const create = await apps.create(req.body);
    resp.send({'message':'App uploaded successfully'});
};