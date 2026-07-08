require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const sharp = require('sharp');

const app = express();
const PORT = process.env.PORT || 3000;

// ── JSON Database Fallback ───────────────────────────────────────────────────
const dbPath = path.join(__dirname, 'db.json');

// Initialize db.json with empty default structure if not existing or empty
if (!fs.existsSync(dbPath) || fs.readFileSync(dbPath, 'utf8').trim() === '') {
  const initialData = {
    products: [],
    blogs: [],
    mostsold: [],
    enquiries: [],
    collection: [],
    agents: []
  };
  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
}

function readDb() {
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    if (!data.agents) data.agents = [];
    return data;
  } catch (err) {
    return { products: [], blogs: [], mostsold: [], enquiries: [], collection: [], agents: [] };
  }
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

class MockQuery {
  constructor(items) {
    this.items = items;
  }
  sort(sortObj) {
    const key = Object.keys(sortObj)[0];
    const order = sortObj[key];
    this.items.sort((a, b) => {
      let valA = a[key];
      let valB = b[key];
      if (key === 'createdAt' || key === 'date') {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      if (valA < valB) return order === -1 ? 1 : -1;
      if (valA > valB) return order === -1 ? -1 : 1;
      return 0;
    });
    return this;
  }
  limit(num) {
    this.items = this.items.slice(0, num);
    return this;
  }
  then(onFulfilled, onRejected) {
    if (onFulfilled) onFulfilled(this.items);
  }
}

class MockModel {
  constructor(collectionName, data = {}) {
    this.collectionName = collectionName;
    Object.assign(this, data);
    if (!this._id) {
      this._id = 'mock_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
    if (!this.createdAt) {
      this.createdAt = new Date().toISOString();
    }
  }

  static getCollection(collectionName) {
    const db = readDb();
    return db[collectionName] || [];
  }

  static saveCollection(collectionName, items) {
    const db = readDb();
    db[collectionName] = items;
    writeDb(db);
  }

  async save() {
    const items = MockModel.getCollection(this.collectionName);
    const existingIdx = items.findIndex(i => i._id === this._id);
    if (existingIdx !== -1) {
      items[existingIdx] = { ...this };
    } else {
      items.push({ ...this });
    }
    MockModel.saveCollection(this.collectionName, items);
    return this;
  }

  static find(query = {}) {
    let items = MockModel.getCollection(this.collectionName);
    for (const key of Object.keys(query)) {
      items = items.filter(i => {
        let val = query[key];
        if (val === true || val === 'true') {
          return i[key] === true || i[key] === 'true';
        }
        if (val === false || val === 'false') {
          return i[key] === false || i[key] === 'false' || i[key] === undefined;
        }
        return i[key] === val;
      });
    }
    return new MockQuery(items);
  }

  static async findOne(query = {}) {
    let items = MockModel.getCollection(this.collectionName);
    if (query.slug) {
      return items.find(i => i.slug === query.slug) || null;
    }
    return items[0] || null;
  }

  static async findByIdAndUpdate(id, data, options = {}) {
    let items = MockModel.getCollection(this.collectionName);
    const idx = items.findIndex(i => i._id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...data };
    MockModel.saveCollection(this.collectionName, items);
    return items[idx];
  }

  static async findByIdAndDelete(id) {
    let items = MockModel.getCollection(this.collectionName);
    const item = items.find(i => i._id === id);
    if (!item) return null;
    items = items.filter(i => i._id !== id);
    MockModel.saveCollection(this.collectionName, items);
    return item;
  }

  static async countDocuments(query = {}) {
    let items = MockModel.getCollection(this.collectionName);
    for (const key of Object.keys(query)) {
      items = items.filter(i => {
        let val = query[key];
        if (val === true || val === 'true') {
          return i[key] === true || i[key] === 'true';
        }
        if (val === false || val === 'false') {
          return i[key] === false || i[key] === 'false' || i[key] === undefined;
        }
        return i[key] === val;
      });
    }
    return items.length;
  }
}

class MockProduct extends MockModel {
  static get collectionName() { return 'products'; }
  constructor(data) {
    super('products', data);
    if (this.price !== undefined) this.price = parseFloat(this.price) || 0;
    if (this.oldPrice !== undefined && this.oldPrice !== null) this.oldPrice = parseFloat(this.oldPrice) || null;
  }
}
class MockBlogPost extends MockModel {
  static get collectionName() { return 'blogs'; }
  constructor(data) {
    super('blogs', data);
    if (this.title && !this.slug) {
      this.slug = this.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-') + '-' + Date.now();
    }
  }
}
class MockMostSold extends MockModel {
  static get collectionName() { return 'mostsold'; }
  constructor(data) {
    super('mostsold', data);
    if (this.price !== undefined) this.price = parseFloat(this.price) || 0;
  }
}
class MockEnquiry extends MockModel {
  static get collectionName() { return 'enquiries'; }
  constructor(data) {
    super('enquiries', data);
  }
}
class MockCollectionProduct extends MockModel {
  static get collectionName() { return 'collection'; }
  constructor(data) {
    super('collection', data);
    if (this.price !== undefined) this.price = parseFloat(this.price) || 0;
  }
}
class MockAgent extends MockModel {
  static get collectionName() { return 'agents'; }
  constructor(data) {
    super('agents', data);
  }
}

function useJsonFallback() {
  Product = MockProduct;
  BlogPost = MockBlogPost;
  MostSold = MockMostSold;
  Enquiry = MockEnquiry;
  CollectionProduct = MockCollectionProduct;
  Agent = MockAgent;
}

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, assets) with extension fallback and optimal caching headers
app.use(express.static(path.join(__dirname), {
  extensions: ['html', 'htm'],
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('.htm')) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    } else if (filePath.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|webm|mp4|woff|woff2|ttf|eot)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// Serve uploaded images with caching headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    if (filePath.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=604800'); // 7 days cache for uploads
    }
  }
}));

// Disable buffering so queries fail instantly on connection drop
mongoose.set('bufferCommands', false);

// We will connect and start the server at the bottom of the file
let dbConnected = false;
const connectDb = async () => {
  if (!process.env.MONGO_URI) {
    console.log('⚠️ MONGO_URI not defined, using JSON database');
    useJsonFallback();
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ MongoDB connected');
    dbConnected = true;
  } catch (err) {
    console.error('❌ MongoDB error, falling back to local JSON database:', err.message);
    useJsonFallback();
  }
};

// ── Multer (Image Upload) ─────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/products';
    if (req.originalUrl.includes('blog')) {
      folder = 'uploads/blog';
    } else if (req.originalUrl.includes('agents')) {
      folder = 'uploads/agents';
    }
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

const productUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'bgImage', maxCount: 1 }
]);

// Image compression helper with sharp (compression without losing quality)
async function optimizeImage(filePath) {
  if (!filePath) return;
  const ext = path.extname(filePath).toLowerCase();
  
  // Create a temporary file path
  const tempPath = filePath + '.tmp';
  
  try {
    let pipeline = sharp(filePath);
    
    // Get image metadata to check width/height
    const metadata = await pipeline.metadata();
    
    // Resize if too large (e.g. max width 1200px)
    if (metadata.width > 1200) {
      pipeline = pipeline.resize({ width: 1200, withoutEnlargement: true });
    }
    
    // Apply compression based on format
    if (ext === '.jpg' || ext === '.jpeg') {
      pipeline = pipeline.jpeg({ quality: 82, progressive: true });
    } else if (ext === '.png') {
      pipeline = pipeline.png({ compressionLevel: 8, palette: true });
    } else if (ext === '.webp') {
      pipeline = pipeline.webp({ quality: 80 });
    }
    
    await pipeline.toFile(tempPath);
    
    // Overwrite the original file with the optimized one
    fs.renameSync(tempPath, filePath);
    console.log(`⚡ Optimized image: ${filePath}`);
  } catch (err) {
    console.error(`❌ Failed to optimize image ${filePath}:`, err.message);
    // Cleanup temp file if it exists
    if (fs.existsSync(tempPath)) {
      try { fs.unlinkSync(tempPath); } catch (_) {}
    }
  }
}

// Middleware to automatically compress uploaded files
const optimizeUploadedImages = async (req, res, next) => {
  try {
    // 1. Handle single file (req.file)
    if (req.file) {
      await optimizeImage(req.file.path);
    }
    // 2. Handle multiple files (req.files)
    if (req.files) {
      for (const fieldName of Object.keys(req.files)) {
        const files = req.files[fieldName];
        if (Array.isArray(files)) {
          for (const file of files) {
            await optimizeImage(file.path);
          }
        }
      }
    }
  } catch (err) {
    console.error('Error optimizing uploaded images:', err);
  }
  next();
};

// ── Mongoose Schemas ──────────────────────────────────────────────────────────

const ProductSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  quantity:      { type: Number, required: true },
  unit:          { type: String, enum: ['kg', 'L', 'g', 'ml'], required: true },
  unitPerCarton: { type: Number, default: 1 },
  category:      { type: String, required: true },
  price:         { type: Number, required: true },
  oldPrice:      { type: Number, default: null },
  rating:        { type: Number, min: 1, max: 5, default: 5 },
  badge:         { type: String, enum: ['none', 'discount', 'soldout', 'popular', 'new'], default: 'none' },
  badgeText:     { type: String, default: '' },
  image:         { type: String, default: '' },
  bgImage:       { type: String, default: '' },
  desc:          { type: String, default: '' },
  packaging:     { type: String, default: '' },
  isVisible:     { type: Boolean, default: true },
  createdAt:     { type: Date, default: Date.now }
});

const BlogSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, unique: true, sparse: true },
  excerpt:     { type: String, default: '' },
  content:     { type: String, default: '' },
  category:    { type: String, required: true },
  date:        { type: Date, default: Date.now },
  image:       { type: String, default: '' },
  isPublished: { type: Boolean, default: true },
  createdAt:   { type: Date, default: Date.now }
});

// Auto-generate slug from title
BlogSchema.pre('save', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') + '-' + Date.now();
  }
  next();
});

let Product = mongoose.model('Product', ProductSchema);
let BlogPost = mongoose.model('BlogPost', BlogSchema);

const MostSoldSchema = new mongoose.Schema({
  title:     { type: String, required: true, trim: true },
  subtitle:  { type: String, default: '' },
  price:     { type: Number, required: true },
  label:     { type: String, default: 'MOST SOLD' },
  colors:    { type: String, default: '' }, // Comma-separated list of colors e.g. "#e91e63, #504443"
  image:     { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

let MostSold = mongoose.model('MostSold', MostSoldSchema);

const EnquirySchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  company:   { type: String, required: true, trim: true },
  email:     { type: String, required: true, trim: true },
  phone:     { type: String, required: true, trim: true },
  message:   { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

let Enquiry = mongoose.model('Enquiry', EnquirySchema);

const CollectionProductSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  category:      { type: String, default: 'detergent' },
  price:         { type: Number, default: 0 },
  oldPrice:      { type: Number, default: null },
  rating:        { type: Number, min: 1, max: 5, default: 5 },
  badge:         { type: String, enum: ['none', 'discount', 'soldout', 'popular', 'new'], default: 'none' },
  badgeText:     { type: String, default: '' },
  image:         { type: String, default: '' },
  bgImage:       { type: String, default: '' },
  desc:          { type: String, default: '' },
  packaging:     { type: String, default: '' },
  isVisible:     { type: Boolean, default: true },
  createdAt:     { type: Date, default: Date.now }
});

let CollectionProduct = mongoose.model('CollectionProduct', CollectionProductSchema);

const AgentSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  phone:     { type: String, required: true, trim: true },
  role:      { type: String, default: 'Sales Manager' },
  label:     { type: String, default: 'Chat with Sales' },
  image:     { type: String, default: '' },
  isActive:  { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

let Agent = mongoose.model('Agent', AgentSchema);

// ── Admin Auth Middleware ─────────────────────────────────────────────────────
function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (token === process.env.ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// ── Auth Route ────────────────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true, token: process.env.ADMIN_PASSWORD });
  } else {
    res.status(401).json({ success: false, error: 'Invalid password' });
  }
});

// ── Product Routes ────────────────────────────────────────────────────────────

// GET all products (public — for products.html)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({ isVisible: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all products (admin — includes hidden)
app.get('/api/admin/products', adminAuth, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create product
app.post('/api/products', adminAuth, productUpload, optimizeUploadedImages, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files) {
      if (req.files['image'] && req.files['image'][0]) {
        data.image = '/uploads/products/' + req.files['image'][0].filename;
      }
      if (req.files['bgImage'] && req.files['bgImage'][0]) {
        data.bgImage = '/uploads/products/' + req.files['bgImage'][0].filename;
      }
    }
    // Convert booleans & numbers
    data.isVisible = data.isVisible === 'true' || data.isVisible === true;
    data.quantity   = parseFloat(data.quantity) || 0;
    data.price      = parseFloat(data.price) || 0;
    data.oldPrice   = data.oldPrice ? parseFloat(data.oldPrice) : null;
    data.rating     = parseInt(data.rating) || 5;
    data.unitPerCarton = parseInt(data.unitPerCarton) || 1;

    const product = new Product(data);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update product
app.put('/api/products/:id', adminAuth, productUpload, optimizeUploadedImages, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files) {
      if (req.files['image'] && req.files['image'][0]) {
        data.image = '/uploads/products/' + req.files['image'][0].filename;
      }
      if (req.files['bgImage'] && req.files['bgImage'][0]) {
        data.bgImage = '/uploads/products/' + req.files['bgImage'][0].filename;
      }
    }
    data.isVisible = data.isVisible === 'true' || data.isVisible === true;
    data.quantity   = parseFloat(data.quantity) || 0;
    data.price      = parseFloat(data.price) || 0;
    data.oldPrice   = data.oldPrice ? parseFloat(data.oldPrice) : null;
    data.rating     = parseInt(data.rating) || 5;
    data.unitPerCarton = parseInt(data.unitPerCarton) || 1;

    const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE product
app.delete('/api/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    // Delete image file if local
    if (product.image && product.image.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, product.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    // Delete bgImage file if local
    if (product.bgImage && product.bgImage.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, product.bgImage);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Our Collection Routes ──────────────────────────────────────────────────────
app.get('/api/collection', async (req, res) => {
  try {
    const products = await CollectionProduct.find({ isVisible: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/collection', adminAuth, async (req, res) => {
  try {
    const products = await CollectionProduct.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/collection', adminAuth, productUpload, optimizeUploadedImages, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files) {
      if (req.files['image'] && req.files['image'][0]) {
        data.image = '/uploads/products/' + req.files['image'][0].filename;
      }
      if (req.files['bgImage'] && req.files['bgImage'][0]) {
        data.bgImage = '/uploads/products/' + req.files['bgImage'][0].filename;
      }
    }
    data.isVisible = data.isVisible === 'true' || data.isVisible === true;
    data.price      = parseFloat(data.price) || 0;
    data.oldPrice   = data.oldPrice ? parseFloat(data.oldPrice) : null;
    data.rating     = parseInt(data.rating) || 5;

    const product = new CollectionProduct(data);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/collection/:id', adminAuth, productUpload, optimizeUploadedImages, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files) {
      if (req.files['image'] && req.files['image'][0]) {
        data.image = '/uploads/products/' + req.files['image'][0].filename;
      }
      if (req.files['bgImage'] && req.files['bgImage'][0]) {
        data.bgImage = '/uploads/products/' + req.files['bgImage'][0].filename;
      }
    }
    data.isVisible = data.isVisible === 'true' || data.isVisible === true;
    data.price      = parseFloat(data.price) || 0;
    data.oldPrice   = data.oldPrice ? parseFloat(data.oldPrice) : null;
    data.rating     = parseInt(data.rating) || 5;

    const product = await CollectionProduct.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/collection/:id', adminAuth, async (req, res) => {
  try {
    const product = await CollectionProduct.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.image && product.image.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, product.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    if (product.bgImage && product.bgImage.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, product.bgImage);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Most Sold Product Routes ───────────────────────────────────────────────────
app.get('/api/most-sold', async (req, res) => {
  try {
    const items = await MostSold.find().sort({ createdAt: 1 }).limit(3);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/most-sold', adminAuth, upload.single('image'), optimizeUploadedImages, async (req, res) => {
  try {
    const count = await MostSold.countDocuments();
    if (count >= 3) {
      return res.status(400).json({ error: 'Limit of product reached for this section' });
    }
    const data = { ...req.body };
    if (req.file) data.image = '/uploads/products/' + req.file.filename;
    const item = new MostSold(data);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/most-sold/:id', adminAuth, upload.single('image'), optimizeUploadedImages, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = '/uploads/products/' + req.file.filename;
    const item = await MostSold.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: 'Product not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/most-sold/:id', adminAuth, async (req, res) => {
  try {
    const item = await MostSold.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Product not found' });
    if (item.image && item.image.startsWith('/uploads/')) {
      const p = path.join(__dirname, item.image);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Blog Routes ───────────────────────────────────────────────────────────────

// GET all posts (public)
app.get('/api/blog', async (req, res) => {
  try {
    const posts = await BlogPost.find({ isPublished: true }).sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all posts (admin)
app.get('/api/admin/blog', adminAuth, async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single post by slug (public)
app.get('/api/blog/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, isPublished: true });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create blog post
app.post('/api/blog', adminAuth, upload.single('image'), optimizeUploadedImages, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = '/uploads/blog/' + req.file.filename;
    data.isPublished = data.isPublished === 'true' || data.isPublished === true;
    if (data.date) data.date = new Date(data.date);

    const post = new BlogPost(data);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update blog post
app.put('/api/blog/:id', adminAuth, upload.single('image'), optimizeUploadedImages, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = '/uploads/blog/' + req.file.filename;
    data.isPublished = data.isPublished === 'true' || data.isPublished === true;
    if (data.date) data.date = new Date(data.date);

    const post = await BlogPost.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE blog post
app.delete('/api/blog/:id', adminAuth, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.image && post.image.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, post.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Nodemailer Transporter Setup ──────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: parseInt(process.env.SMTP_PORT) === 465, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// ── Enquiry Routes ────────────────────────────────────────────────────────────

// POST create enquiry (public)
app.post('/api/enquiries', async (req, res) => {
  try {
    const { name, company, email, phone, message } = req.body;

    if (!name || !company || !email || !phone || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const enquiry = new Enquiry({ name, company, email, phone, message });
    await enquiry.save();

    // Send email notification
    const mailOptions = {
      from: `"Blizz UAE Lead System" <${process.env.SMTP_USER}>`,
      to: process.env.TO_EMAIL,
      subject: `New B2B Wholesale Enquiry from ${company}`,
      text: `
You have received a new wholesale enquiry from your website.

--- Contact Details ---
Name: ${name}
Company: ${company}
Email: ${email}
Phone: ${phone}

--- Message / Requirements ---
${message}

-----------------------
Date received: ${new Date().toLocaleString()}
`,
      html: `
<div style="font-family: sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
  <h2 style="color: #0f172a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-top: 0;">New B2B Wholesale Enquiry</h2>
  <p>You have received a new wholesale enquiry from the Blizz UAE website.</p>
  
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr style="background-color: #f8fafc;">
      <td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0; width: 120px;">Name</td>
      <td style="padding: 10px; border: 1px solid #e2e8f0;">${name}</td>
    </tr>
    <tr>
      <td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">Company</td>
      <td style="padding: 10px; border: 1px solid #e2e8f0;">${company}</td>
    </tr>
    <tr style="background-color: #f8fafc;">
      <td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">Email</td>
      <td style="padding: 10px; border: 1px solid #e2e8f0;"><a href="mailto:${email}">${email}</a></td>
    </tr>
    <tr>
      <td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">Phone</td>
      <td style="padding: 10px; border: 1px solid #e2e8f0;">${phone}</td>
    </tr>
  </table>

  <h3 style="color: #0f172a; margin-top: 25px; margin-bottom: 10px;">Message / Requirements</h3>
  <div style="background-color: #f1f5f9; padding: 15px; border-radius: 6px; white-space: pre-wrap; font-size: 0.95rem; color: #334155;">${message}</div>

  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0 15px 0;" />
  <p style="font-size: 0.8rem; color: #64748b; text-align: center; margin: 0;">Sent automatically by Blizz UAE Lead System.</p>
</div>
`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Error sending mail:', error);
      } else {
        console.log('✅ Lead email sent successfully:', info.response);
      }
    });

    res.status(201).json({ success: true, message: 'Enquiry submitted successfully' });
  } catch (err) {
    console.error('Enquiry error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET all enquiries (admin only)
app.get('/api/admin/enquiries', adminAuth, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE enquiry (admin only)
app.delete('/api/admin/enquiries/:id', adminAuth, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Stats Route (Dashboard) ───────────────────────────────────────────────────
app.get('/api/admin/stats', adminAuth, async (req, res) => {
  try {
    const [totalProducts, visibleProducts, soldoutProducts, totalPosts, publishedPosts, totalEnquiries, totalCollection, totalAgents, activeAgents] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isVisible: true }),
      Product.countDocuments({ badge: 'soldout' }),
      BlogPost.countDocuments(),
      BlogPost.countDocuments({ isPublished: true }),
      Enquiry.countDocuments(),
      CollectionProduct.countDocuments(),
      Agent.countDocuments(),
      Agent.countDocuments({ isActive: true })
    ]);
    res.json({ totalProducts, visibleProducts, soldoutProducts, totalPosts, publishedPosts, totalEnquiries, totalCollection, totalAgents, activeAgents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Agent Routes ──────────────────────────────────────────────────────────────

// GET active agents (public)
app.get('/api/agents', async (req, res) => {
  try {
    const agents = await Agent.find({ isActive: true }).sort({ createdAt: 1 });
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all agents (admin only)
app.get('/api/admin/agents', adminAuth, async (req, res) => {
  try {
    const agents = await Agent.find().sort({ createdAt: 1 });
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create agent (admin only)
app.post('/api/agents', adminAuth, upload.single('image'), optimizeUploadedImages, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = '/uploads/agents/' + req.file.filename;
    }
    data.isActive = data.isActive === 'true' || data.isActive === true;
    const agent = new Agent(data);
    await agent.save();
    res.status(201).json(agent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update agent (admin only)
app.put('/api/agents/:id', adminAuth, upload.single('image'), optimizeUploadedImages, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = '/uploads/agents/' + req.file.filename;
    }
    data.isActive = data.isActive === 'true' || data.isActive === true;
    const agent = await Agent.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!agent) return res.status(404).json({ error: 'Agent not found' });
    res.json(agent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE agent (admin only)
app.delete('/api/agents/:id', adminAuth, async (req, res) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });
    if (agent.image && agent.image.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, agent.image);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (_) {}
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Start Server ──────────────────────────────────────────────────────────────
const startServer = async () => {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`🚀 Blizz Admin Server running on http://localhost:${PORT}`);
    console.log(`📦 Admin Panel: http://localhost:${PORT}/admin.html`);
    console.log(`🛍️  Products:    http://localhost:${PORT}/products.html`);
    console.log(`📰 Blog:        http://localhost:${PORT}/blog.html`);
  });
};

startServer();
