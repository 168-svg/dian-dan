const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, '..', 'images', 'upload');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + '-' + Math.random().toString(36).slice(2, 8) + ext);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, allowed.includes(ext));
    }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.json({ code: 1, msg: '请选择图片文件' });
    const url = '/images/upload/' + req.file.filename;
    res.json({ code: 0, data: { url } });
});

app.get('/api/categories', (req, res) => {
    res.json({ code: 0, data: db.getCategories() });
});

app.post('/api/categories', (req, res) => {
    const { name, icon, sort_order } = req.body;
    if (!name) return res.json({ code: 1, msg: '分类名称不能为空' });
    const result = db.addCategory(name, icon, sort_order);
    res.json({ code: 0, data: result });
});

app.put('/api/categories/:id', (req, res) => {
    const { name, icon, sort_order } = req.body;
    db.updateCategory(req.params.id, name, icon, sort_order);
    res.json({ code: 0, msg: '更新成功' });
});

app.delete('/api/categories/:id', (req, res) => {
    db.deleteCategory(req.params.id);
    res.json({ code: 0, msg: '删除成功' });
});

app.get('/api/foods', (req, res) => {
    const { category_id, page, page_size } = req.query;
    const p = page ? parseInt(page) : null;
    const ps = page_size ? parseInt(page_size) : null;
    const data = db.getFoods(category_id || null, p, ps);
    const total = db.getFoodsCount(category_id || null);
    res.json({ code: 0, data, total, page: p || 1, page_size: ps || total });
});

app.get('/api/foods/hot', (req, res) => {
    const { limit } = req.query;
    res.json({ code: 0, data: db.getHotFoods(limit ? parseInt(limit) : 6) });
});

app.get('/api/foods/:id', (req, res) => {
    const food = db.getFoodById(req.params.id);
    if (!food) return res.json({ code: 1, msg: '菜品不存在' });
    res.json({ code: 0, data: food });
});

app.post('/api/foods', (req, res) => {
    const { name, category_id, price } = req.body;
    if (!name || !category_id || price === undefined) return res.json({ code: 1, msg: '名称、分类、价格不能为空' });
    const result = db.addFood(req.body);
    res.json({ code: 0, data: result });
});

app.put('/api/foods/:id', (req, res) => {
    db.updateFood(req.params.id, req.body);
    res.json({ code: 0, msg: '更新成功' });
});

app.delete('/api/foods/:id', (req, res) => {
    db.deleteFood(req.params.id);
    res.json({ code: 0, msg: '删除成功' });
});

app.get('/api/orders', (req, res) => {
    const { status, page, page_size } = req.query;
    let orders = db.getOrders(status || null);
    orders = orders.map(o => ({...o, items: JSON.parse(o.items) }));
    const total = orders.length;
    if (page && page_size) {
        const p = parseInt(page),
            ps = parseInt(page_size);
        const start = (p - 1) * ps;
        orders = orders.slice(start, start + ps);
    }
    res.json({ code: 0, data: orders, total, page: page ? parseInt(page) : 1, page_size: page_size ? parseInt(page_size) : total });
});

app.post('/api/orders', (req, res) => {
    const { items, total, remark, table_no } = req.body;
    if (!items || !items.length) return res.json({ code: 1, msg: '订单商品不能为空' });
    const result = db.createOrder({ items, total, remark, table_no });
    res.json({ code: 0, data: result });
});

app.put('/api/orders/:id/status', (req, res) => {
    const { status } = req.body;
    if (!status) return res.json({ code: 1, msg: '状态不能为空' });
    db.updateOrderStatus(req.params.id, status);
    res.json({ code: 0, msg: '更新成功' });
});

app.delete('/api/orders/:id', (req, res) => {
    db.deleteOrder(req.params.id);
    res.json({ code: 0, msg: '删除成功' });
});

app.get('/api/banners', (req, res) => {
    res.json({ code: 0, data: db.getBanners() });
});

app.post('/api/banners', (req, res) => {
    const { image, sort_order } = req.body;
    if (!image) return res.json({ code: 1, msg: '图片不能为空' });
    const result = db.addBanner(image, sort_order);
    res.json({ code: 0, data: result });
});

app.put('/api/banners/:id', (req, res) => {
    const { image, sort_order } = req.body;
    db.updateBanner(req.params.id, image, sort_order);
    res.json({ code: 0, msg: '更新成功' });
});

app.delete('/api/banners/:id', (req, res) => {
    db.deleteBanner(req.params.id);
    res.json({ code: 0, msg: '删除成功' });
});

app.get('/api/dashboard', (req, res) => {
    res.json({ code: 0, data: db.getDashboard() });
});

app.use('/images', express.static(path.join(__dirname, '..', 'images')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

async function start() {
    await db.initDB();
    await db.seedData();

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`点单系统后端服务已启动`);
        console.log(`   API: http://localhost:${PORT}/api`);
        console.log(`   管理后台: http://localhost:${PORT}/admin`);
    });
}

start();