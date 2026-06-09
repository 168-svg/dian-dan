const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const uploadDir = path.join(__dirname, '..', 'images', 'upload');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
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

function safeStr(val, maxLen = 500) {
    if (val === null || val === undefined) return '';
    const s = String(val).trim();
    return s.substring(0, maxLen);
}

function safeInt(val, min, max) {
    const n = parseInt(val);
    if (isNaN(n)) return null;
    if (min !== undefined && n < min) return min;
    if (max !== undefined && n > max) return max;
    return n;
}

function safeFloat(val, min = 0) {
    const n = parseFloat(val);
    if (isNaN(n)) return null;
    return n < min ? min : n;
}

app.use((err, req, res, next) => {
    if (err) {
        console.error('[ERROR]', err.message);
        res.json({ code: 1, msg: '服务器内部错误' });
    } else {
        next();
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
    const name = safeStr(req.body.name, 50);
    if (!name) return res.json({ code: 1, msg: '分类名称不能为空' });
    const icon = safeStr(req.body.icon, 255);
    const sortOrder = safeInt(req.body.sort_order, 0, 1000) || 0;
    const result = db.addCategory(name, icon, sortOrder);
    res.json({ code: 0, data: result });
});

app.put('/api/categories/:id', (req, res) => {
    const id = safeInt(req.params.id, 1);
    if (!id) return res.json({ code: 1, msg: '参数错误' });
    const name = safeStr(req.body.name, 50);
    if (!name) return res.json({ code: 1, msg: '分类名称不能为空' });
    const icon = safeStr(req.body.icon, 255);
    const sortOrder = safeInt(req.body.sort_order, 0, 1000) || 0;
    db.updateCategory(id, name, icon, sortOrder);
    res.json({ code: 0, msg: '更新成功' });
});

app.delete('/api/categories/:id', (req, res) => {
    const id = safeInt(req.params.id, 1);
    if (!id) return res.json({ code: 1, msg: '参数错误' });
    db.deleteCategory(id);
    res.json({ code: 0, msg: '删除成功' });
});

app.get('/api/foods', (req, res) => {
    const categoryId = safeInt(req.query.category_id, 1);
    const page = safeInt(req.query.page, 1);
    const pageSize = safeInt(req.query.page_size, 1, 100);
    const data = db.getFoods(categoryId || null, page || null, pageSize || null);
    const total = db.getFoodsCount(categoryId || null);
    res.json({ code: 0, data, total, page: page || 1, page_size: pageSize || total });
});

app.get('/api/foods/hot', (req, res) => {
    const limit = safeInt(req.query.limit, 1, 50) || 6;
    res.json({ code: 0, data: db.getHotFoods(limit) });
});

app.get('/api/foods/:id', (req, res) => {
    const id = safeInt(req.params.id, 1);
    if (!id) return res.json({ code: 1, msg: '参数错误' });
    const food = db.getFoodById(id);
    if (!food) return res.json({ code: 1, msg: '菜品不存在' });
    res.json({ code: 0, data: food });
});

app.post('/api/foods', (req, res) => {
    const name = safeStr(req.body.name, 100);
    const categoryId = safeInt(req.body.category_id, 1);
    const price = safeFloat(req.body.price, 0);
    if (!name || !categoryId || price === null) return res.json({ code: 1, msg: '名称、分类、价格不能为空' });
    const data = {
        name,
        category_id: categoryId,
        price,
        image: safeStr(req.body.image, 255),
        desc: safeStr(req.body.desc, 200),
        detail: safeStr(req.body.detail, 2000),
        video: safeStr(req.body.video, 255),
        sales: safeInt(req.body.sales, 0) || 0,
        is_on_sale: safeInt(req.body.is_on_sale, 0, 1)
    };
    if (data.is_on_sale === null) data.is_on_sale = 1;
    const result = db.addFood(data);
    res.json({ code: 0, data: result });
});

app.put('/api/foods/:id', (req, res) => {
    const id = safeInt(req.params.id, 1);
    if (!id) return res.json({ code: 1, msg: '参数错误' });
    const name = safeStr(req.body.name, 100);
    const categoryId = safeInt(req.body.category_id, 1);
    const price = safeFloat(req.body.price, 0);
    if (!name || !categoryId || price === null) return res.json({ code: 1, msg: '名称、分类、价格不能为空' });
    const data = {
        name,
        category_id: categoryId,
        price,
        image: safeStr(req.body.image, 255),
        desc: safeStr(req.body.desc, 200),
        detail: safeStr(req.body.detail, 2000),
        video: safeStr(req.body.video, 255),
        sales: safeInt(req.body.sales, 0) || 0,
        is_on_sale: safeInt(req.body.is_on_sale, 0, 1)
    };
    if (data.is_on_sale === null) data.is_on_sale = 1;
    db.updateFood(id, data);
    res.json({ code: 0, msg: '更新成功' });
});

app.delete('/api/foods/:id', (req, res) => {
    const id = safeInt(req.params.id, 1);
    if (!id) return res.json({ code: 1, msg: '参数错误' });
    db.deleteFood(id);
    res.json({ code: 0, msg: '删除成功' });
});

app.get('/api/orders', (req, res) => {
    const status = safeStr(req.query.status, 20);
    const page = safeInt(req.query.page, 1);
    const pageSize = safeInt(req.query.page_size, 1, 100);
    const userId = safeInt(req.query.user_id, 0);
    if (userId === null || userId === undefined) {
        return res.json({ code: 1, msg: '需要用户信息' });
    }
    let orders = db.getOrders(status || null, userId);
    orders = orders.map(o => {
        let items = [];
        try {
            items = JSON.parse(o.items);
        } catch (e) {
            items = [];
        }
        return { ...o, items };
    });
    const total = orders.length;
    if (page && pageSize) {
        const start = (page - 1) * pageSize;
        orders = orders.slice(start, start + pageSize);
    }
    res.json({ code: 0, data: orders, total, page: page || 1, page_size: pageSize || total });
});

app.post('/api/orders', (req, res) => {
    const userId = safeInt(req.body.user_id, 0);
    if (userId === null || userId === undefined || userId === 0) {
        return res.json({ code: 1, msg: '请先登录再下单' });
    }
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.json({ code: 1, msg: '订单商品不能为空' });
    }
    const validatedItems = items.map(item => ({
        id: safeInt(item.id, 1),
        name: safeStr(item.name, 100),
        price: safeFloat(item.price, 0),
        count: safeInt(item.count, 1, 999)
    })).filter(item => item.id && item.name && item.price !== null && item.count);

    if (validatedItems.length === 0) {
        return res.json({ code: 1, msg: '订单商品无效' });
    }
    const total = safeFloat(req.body.total, 0);
    if (total === null || total <= 0) {
        return res.json({ code: 1, msg: '订单金额无效' });
    }
    const remark = safeStr(req.body.remark, 200);
    const tableNo = safeStr(req.body.table_no, 20);
    const result = db.createOrder({ items: validatedItems, total, remark, table_no: tableNo, user_id: userId });
    res.json({ code: 0, data: result });
});

app.put('/api/orders/:id/status', (req, res) => {
    const id = safeStr(req.params.id, 50);
    if (!id) return res.json({ code: 1, msg: '参数错误' });
    const status = safeStr(req.body.status, 20);
    if (!status) return res.json({ code: 1, msg: '状态不能为空' });
    const validStatus = ['pending', 'cooking', 'completed', 'cancelled'];
    if (!validStatus.includes(status)) return res.json({ code: 1, msg: '无效的订单状态' });
    db.updateOrderStatus(id, status);
    res.json({ code: 0, msg: '更新成功' });
});

app.delete('/api/orders/:id', (req, res) => {
    const id = safeStr(req.params.id, 50);
    if (!id) return res.json({ code: 1, msg: '参数错误' });
    db.deleteOrder(id);
    res.json({ code: 0, msg: '删除成功' });
});

app.get('/api/banners', (req, res) => {
    res.json({ code: 0, data: db.getBanners() });
});

app.post('/api/banners', (req, res) => {
    const image = safeStr(req.body.image, 255);
    if (!image) return res.json({ code: 1, msg: '图片不能为空' });
    const sortOrder = safeInt(req.body.sort_order, 0, 1000) || 0;
    const result = db.addBanner(image, sortOrder);
    res.json({ code: 0, data: result });
});

app.put('/api/banners/:id', (req, res) => {
    const id = safeInt(req.params.id, 1);
    if (!id) return res.json({ code: 1, msg: '参数错误' });
    const image = safeStr(req.body.image, 255);
    if (!image) return res.json({ code: 1, msg: '图片不能为空' });
    const sortOrder = safeInt(req.body.sort_order, 0, 1000) || 0;
    db.updateBanner(id, image, sortOrder);
    res.json({ code: 0, msg: '更新成功' });
});

app.delete('/api/banners/:id', (req, res) => {
    const id = safeInt(req.params.id, 1);
    if (!id) return res.json({ code: 1, msg: '参数错误' });
    db.deleteBanner(id);
    res.json({ code: 0, msg: '删除成功' });
});

app.get('/api/dashboard', (req, res) => {
    res.json({ code: 0, data: db.getDashboard() });
});

app.post('/api/users/register', (req, res) => {
    const username = safeStr(req.body.username, 20);
    const password = safeStr(req.body.password, 100);
    if (!username || !password) {
        return res.json({ code: 1, msg: '用户名和密码不能为空' });
    }
    if (username.length < 3 || username.length > 20) {
        return res.json({ code: 1, msg: '用户名长度必须在3-20个字符之间' });
    }
    if (password.length < 6 || password.length > 100) {
        return res.json({ code: 1, msg: '密码长度必须在6-100个字符之间' });
    }
    const existing = db.getUserByUsername(username);
    if (existing) {
        return res.json({ code: 1, msg: '用户名已存在' });
    }
    const nickname = safeStr(req.body.nickname, 50);
    const phone = safeStr(req.body.phone, 20);
    const user = db.createUser(username, password, nickname, phone, 0);
    res.json({ code: 0, data: user, msg: '注册成功' });
});

app.post('/api/users/login', (req, res) => {
    const username = safeStr(req.body.username, 20);
    const password = safeStr(req.body.password, 100);
    if (!username || !password) {
        return res.json({ code: 1, msg: '用户名和密码不能为空' });
    }
    const user = db.getUserByUsername(username);
    if (!user) {
        return res.json({ code: 1, msg: '用户名不存在' });
    }
    if (user.password !== password) {
        return res.json({ code: 1, msg: '密码错误' });
    }
    delete user.password;
    res.json({ code: 0, data: user, msg: '登录成功' });
});

app.post('/api/users/guest-login', (req, res) => {
    const guestUsername = 'guest_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    const guestPassword = 'guest_' + Math.random().toString(36).slice(2, 10);
    const user = db.createUser(guestUsername, guestPassword, '游客', '', 1);
    res.json({ code: 0, data: user, msg: '游客登录成功' });
});

app.get('/api/users/:id', (req, res) => {
    const id = safeInt(req.params.id, 1);
    if (!id) return res.json({ code: 1, msg: '参数错误' });
    const user = db.getUserById(id);
    if (!user) {
        return res.json({ code: 1, msg: '用户不存在' });
    }
    res.json({ code: 0, data: user });
});

app.put('/api/users/:id', (req, res) => {
    const id = safeInt(req.params.id, 1);
    if (!id) return res.json({ code: 1, msg: '参数错误' });
    const data = {};
    if (req.body.nickname !== undefined) data.nickname = safeStr(req.body.nickname, 50);
    if (req.body.phone !== undefined) data.phone = safeStr(req.body.phone, 20);
    if (req.body.avatar !== undefined) data.avatar = safeStr(req.body.avatar, 255);
    if (req.body.password !== undefined) {
        const pw = safeStr(req.body.password, 100);
        if (pw.length >= 6) data.password = pw;
    }
    db.updateUser(id, data);
    const user = db.getUserById(id);
    res.json({ code: 0, data: user, msg: '更新成功' });
});

app.use('/images', express.static(path.join(__dirname, '..', 'images'), { maxAge: '1h' }));
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use('/web', express.static(path.join(__dirname, 'web')));

app.get('/', (req, res) => {
    res.send('点单系统 API 服务正常运行');
});

async function start() {
    try {
        await db.initDB();
        await db.seedData();
        app.listen(PORT, () => {
            console.log(`点单系统后端服务已启动`);
            console.log(`   端口: ${PORT}`);
            console.log(`   API: http://localhost:${PORT}/api`);
            console.log(`   管理后台: http://localhost:${PORT}/admin`);
            console.log(`   用户端: http://localhost:${PORT}/web`);
        });
    } catch (err) {
        console.error('启动失败:', err);
        process.exit(1);
    }
}

start();
