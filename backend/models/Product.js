const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, default: null },
}, { _id: false });

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    price: { type: Number, default: 0, min: 0 },
    discountPrice: { type: Number, default: null },
    variants: { type: [variantSchema], default: [] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    brand: { type: String, default: '' },
    sku: { type: String, default: '' },
    stock: { type: Number, default: 0, min: 0 },
    images: [{ type: String }],
    imagePublicIds: [{ type: String }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    isFeatured: { type: Boolean, default: false },
    tags: [{ type: String }],
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    searchKeywords: { type: String, default: '' },
  },
  { timestamps: true }
);

productSchema.index({ status: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', searchKeywords: 'text' });

module.exports = mongoose.model('Product', productSchema);
