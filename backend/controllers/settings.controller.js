const Setting = require('../models/Settings');
const { success } = require('../utils/response');

const getSettings = async (req, res) => {
  const settings = await Setting.find();
  const map = {};
  settings.forEach(s => { map[s.key] = s.value; });
  return success(res, { settings: map });
};

const updateSettings = async (req, res) => {
  const updates = req.body; // { key: value, ... }
  const ops = Object.entries(updates).map(([key, value]) =>
    Setting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true })
  );
  await Promise.all(ops);
  return success(res, null, 'Settings saved');
};

module.exports = { getSettings, updateSettings };
