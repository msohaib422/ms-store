const Admin = require('../models/Admin');
const Setting = require('../models/Settings');

const DEFAULT_SETTINGS = [
  { key: 'store_name', value: 'M.S. Store' },
  { key: 'store_tagline', value: 'Your Trusted Shopping Destination' },
  { key: 'store_description', value: 'We offer a wide range of quality products at the best prices.' },
  { key: 'phone', value: '03046428782' },
  { key: 'whatsapp', value: '03249503305' },
  { key: 'email', value: 'msohaib.ai.dev@gmail.com' },
  { key: 'address', value: 'Street No. 8, Mohallah Hussain Nagar, 240 Mor, Jaranwala, Faisalabad, Punjab, Pakistan' },
  { key: 'business_hours', value: 'Mon–Sun: 6:00 AM – 9:00 PM' },
  { key: 'facebook', value: '' },
  { key: 'instagram', value: '' },
  { key: 'twitter', value: '' },
  { key: 'youtube', value: '' },
  { key: 'logo_url', value: '' },
  { key: 'hero_title', value: 'Quality Products, Unbeatable Prices' },
  { key: 'hero_subtitle', value: 'Discover our wide range of premium products curated just for you' },
  { key: 'map_embed', value: '' },
];

const seedAdmin = async () => {
  const count = await Admin.countDocuments();
  if (count === 0) {
    await Admin.create({
      email: 'msohaib.ai.dev@gmail.com',
      password: '12345678',
      name: 'Admin',
    });
    console.log('Admin account seeded: msohaib.ai.dev@gmail.com / 12345678');
  }
};

const seedSettings = async () => {
  for (const setting of DEFAULT_SETTINGS) {
    await Setting.findOneAndUpdate(
      { key: setting.key },
      { $setOnInsert: { key: setting.key, value: setting.value } },
      { upsert: true }
    );
  }
};

const seed = async () => {
  try {
    await Promise.all([seedAdmin(), seedSettings()]);
    console.log('Seed complete');
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

module.exports = seed;
