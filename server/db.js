const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.db');

let db;

function safeStr(val, maxLen = 500) {
    if (val === null || val === undefined) return '';
    const s = String(val).trim();
    return s.substring(0, Math.min(s.length, maxLen));
}

function saveDB() {
    try {
        if (db) {
            fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
        }
    } catch (err) {
        console.error('保存数据库失败:', err);
    }
}

function queryAll(sql, params = []) {
    try {
        const stmt = db.prepare(sql);
        if (params.length > 0) stmt.bind(params);
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    } catch (err) {
        console.error('查询失败:', err);
        return [];
    }
}

function queryOne(sql, params = []) {
    try {
        const stmt = db.prepare(sql);
        if (params.length > 0) stmt.bind(params);
        let result = null;
        if (stmt.step()) {
            result = stmt.getAsObject();
        }
        stmt.free();
        return result;
    } catch (err) {
        console.error('查询失败:', err);
        return null;
    }
}

function execute(sql, params = []) {
    try {
        db.run(sql, params);
        saveDB();
    } catch (err) {
        console.error('执行失败:', err);
    }
}

function lastInsertId() {
    const row = queryOne('SELECT last_insert_rowid() as id');
    return row ? row.id : null;
}

async function initDB() {
    const SQL = await initSqlJs();
    if (fs.existsSync(DB_PATH)) {
        try {
            const buffer = fs.readFileSync(DB_PATH);
            db = new SQL.Database(buffer);
        } catch (err) {
            console.error('加载数据库失败，新建数据库', err);
            db = new SQL.Database();
        }
    } else {
        db = new SQL.Database();
    }
    db.run('PRAGMA foreign_keys = ON');

    db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0
    )`);
    db.run(`
    CREATE TABLE IF NOT EXISTS foods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category_id INTEGER NOT NULL,
      image TEXT DEFAULT '',
      price REAL NOT NULL DEFAULT 0,
      desc TEXT DEFAULT '',
      detail TEXT DEFAULT '',
      video TEXT DEFAULT '',
      sales INTEGER DEFAULT 0,
      is_on_sale INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now','localtime')),
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )`);
    db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id INTEGER DEFAULT 0,
      items TEXT NOT NULL,
      total REAL NOT NULL DEFAULT 0,
      status TEXT DEFAULT 'pending',
      remark TEXT DEFAULT '',
      table_no TEXT DEFAULT '',
      create_time TEXT DEFAULT (datetime('now','localtime')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);
    db.run(`
    CREATE TABLE IF NOT EXISTS banners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    )`);
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      nickname TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      avatar TEXT DEFAULT '',
      is_guest INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now','localtime'))
    )`);
    saveDB();
}

async function seedData() {
    const catCount = queryOne('SELECT COUNT(*) as c FROM categories');
    if (catCount && catCount.c > 0) return;

    const cats = [
        { id: 1, name: '招牌推荐', icon: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=150&h=150&fit=crop', sort: 1 },
        { id: 2, name: '主食', icon: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=150&h=150&fit=crop', sort: 2 },
        { id: 3, name: '小吃', icon: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=150&h=150&fit=crop', sort: 3 },
        { id: 4, name: '饮品', icon: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=150&h=150&fit=crop', sort: 4 },
        { id: 5, name: '甜品', icon: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=150&h=150&fit=crop', sort: 5 },
        { id: 6, name: '汤品', icon: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=150&h=150&fit=crop', sort: 6 },
        { id: 7, name: '套餐', icon: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=150&h=150&fit=crop', sort: 7 },
        { id: 8, name: '新品', icon: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=150&h=150&fit=crop', sort: 8 }
    ];

    const foods = [
        { id: 1, name: '宫保鸡丁', cat: 1, img: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=400&fit=crop', price: 32, desc: '经典川菜，麻辣鲜香', detail: '选用新鲜鸡胸肉，配以花生、干辣椒、花椒等食材，经过大火爆炒，鸡肉鲜嫩多汁，花生酥脆，麻辣鲜香。', sales: 1256 },
        { id: 2, name: '麻辣小龙虾', cat: 1, img: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=400&fit=crop', price: 68, desc: '新鲜小龙虾，麻辣过瘾', detail: '精选鲜活小龙虾，配以秘制麻辣调料，虾肉鲜嫩弹牙，麻辣入味。', sales: 986 },
        { id: 3, name: '番茄牛腩面', cat: 1, img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop', price: 28, desc: '牛腩软烂，汤汁浓郁', detail: '选用上等牛腩，慢火炖煮数小时，搭配新鲜番茄熬制的浓郁汤汁，配以劲道面条。', sales: 2341 },
        { id: 4, name: '珍珠奶茶', cat: 1, img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop', price: 18, desc: 'Q弹珍珠，丝滑奶茶', detail: '手工熬制的黑糖珍珠，Q弹有嚼劲，搭配丝滑香浓的奶茶，甜而不腻。', sales: 3856 },
        { id: 5, name: '红烧排骨', cat: 1, img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop', price: 45, desc: '精选猪小排，酱香浓郁', detail: '精选优质猪小排，经过焯水、炒糖色、慢炖等多道工序，排骨色泽红亮，肉质酥烂。', sales: 768 },
        { id: 6, name: '水果拼盘', cat: 1, img: 'https://images.unsplash.com/photo-1564093497595-593b96d80180?w=400&h=400&fit=crop', price: 22, desc: '新鲜时令水果', detail: '精选当季新鲜水果，精心切配摆盘，色彩缤纷，口感清爽。', sales: 1567 },
        { id: 7, name: '扬州炒饭', cat: 2, img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop', price: 22, desc: '经典扬州炒饭，粒粒分明', detail: '经典扬州炒饭，配以鸡蛋、火腿、虾仁、青豆等食材，大火快炒，粒粒分明。', sales: 2100 },
        { id: 8, name: '兰州拉面', cat: 2, img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop', price: 20, desc: '手工拉面，汤清味浓', detail: '手工现场拉制，面条筋道爽滑，配以牛骨熬制的清汤，撒上香菜、葱花。', sales: 1890 },
        { id: 9, name: '黄焖鸡米饭', cat: 2, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop', price: 26, desc: '鲜嫩鸡肉配米饭', detail: '选用鲜嫩鸡腿肉，配以香菇、青椒等食材，鸡肉鲜嫩多汁，汤汁浓郁。', sales: 3021 },
        { id: 10, name: '意大利面', cat: 2, img: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=400&fit=crop', price: 35, desc: '番茄肉酱意面', detail: '进口意大利面条，搭配自制番茄肉酱，撒上帕玛森芝士，酸甜可口。', sales: 654 },
        { id: 11, name: '炸鸡翅', cat: 3, img: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=400&fit=crop', price: 18, desc: '外酥里嫩，金黄诱人', detail: '精选鸡中翅，经过秘制腌料腌制后裹粉油炸，外皮金黄酥脆，内里鲜嫩多汁。', sales: 2980 },
        { id: 12, name: '薯条', cat: 3, img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop', price: 12, desc: '金黄酥脆薯条', detail: '精选优质土豆，切成均匀条状，经过两次油炸工艺，外酥里嫩。', sales: 3456 },
        { id: 13, name: '烤串拼盘', cat: 3, img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop', price: 38, desc: '多种烤串组合', detail: '精选羊肉串、牛肉串、鸡翅、蔬菜串等多种烤串组合，炭火烤制。', sales: 1567 },
        { id: 14, name: '春卷', cat: 3, img: 'https://images.unsplash.com/photo-1548507200-54bddda68ceb?w=400&h=400&fit=crop', price: 16, desc: '酥脆春卷，馅料丰富', detail: '薄如蝉翼的春卷皮包裹着丰富的馅料，经过油炸至金黄酥脆。', sales: 890 },
        { id: 15, name: '珍珠奶茶', cat: 4, img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop', price: 18, desc: 'Q弹珍珠，丝滑奶茶', detail: '手工熬制的黑糖珍珠，Q弹有嚼劲，搭配丝滑香浓的奶茶。', sales: 3856 },
        { id: 16, name: '冰美式', cat: 4, img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop', price: 22, desc: '经典美式，提神醒脑', detail: '精选阿拉比卡咖啡豆，现磨现萃，搭配冰块，纯粹的黑咖啡风味。', sales: 2100 },
        { id: 17, name: '鲜榨果汁', cat: 4, img: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=400&h=400&fit=crop', price: 25, desc: '新鲜水果现榨', detail: '选用当季新鲜水果，现场榨汁，100%纯果汁，健康美味。', sales: 1678 },
        { id: 18, name: '柠檬茶', cat: 4, img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop', price: 15, desc: '清爽柠檬茶', detail: '新鲜柠檬切片，搭配红茶底，酸甜清爽，解腻消暑。', sales: 2890 },
        { id: 19, name: '提拉米苏', cat: 5, img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop', price: 32, desc: '经典意大利甜品', detail: '手指饼干浸泡咖啡液，层层叠加马斯卡彭奶酪，入口即化。', sales: 890 },
        { id: 20, name: '芒果布丁', cat: 5, img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop', price: 16, desc: '新鲜芒果制作', detail: '选用新鲜成熟的芒果，制作成细腻顺滑的布丁，芒果香气浓郁。', sales: 1567 },
        { id: 21, name: '芝士蛋糕', cat: 5, img: 'https://images.unsplash.com/photo-1533134242443-d4fd2113f1e5?w=400&h=400&fit=crop', price: 28, desc: '浓郁芝士，入口即化', detail: '选用优质奶油芝士，经过低温慢烤，口感绵密细腻，芝士味浓郁。', sales: 2100 },
        { id: 22, name: '酸辣汤', cat: 6, img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop', price: 18, desc: '酸辣开胃', detail: '传统酸辣汤，配以豆腐、木耳、鸡蛋、肉丝等食材，酸辣适中。', sales: 1230 },
        { id: 23, name: '玉米排骨汤', cat: 6, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop', price: 28, desc: '清甜滋补', detail: '精选猪排骨配以甜玉米，慢火炖煮，汤色清亮，味道清甜。', sales: 980 },
        { id: 24, name: '超值单人餐', cat: 7, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop', price: 38, desc: '一荤一素一汤', detail: '超值单人套餐，包含一荤一素一汤一米饭，营养均衡。', sales: 3200 },
        { id: 25, name: '双人套餐', cat: 7, img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop', price: 78, desc: '两荤两素两饮品', detail: '双人超值套餐，包含两荤两素两饮品两米饭，性价比超高。', sales: 1890 },
        { id: 26, name: '全家福套餐', cat: 7, img: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=400&fit=crop', price: 128, desc: '适合3-4人', detail: '全家福套餐，包含四荤三素一汤四米饭，适合家庭聚餐。', sales: 890 },
        { id: 27, name: '菠萝咕咾肉', cat: 8, img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop', price: 36, desc: '酸甜可口新品', detail: '猪里脊肉裹粉炸至金黄，配以新鲜菠萝块，浇上酸甜酱汁。', sales: 560 },
        { id: 28, name: '椰子鸡汤', cat: 8, img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop', price: 42, desc: '浓郁椰子香', detail: '选用新鲜椰子水和椰肉，配以鲜嫩鸡肉，慢火炖煮，椰香浓郁。', sales: 340 },
        { id: 29, name: '抹茶拿铁', cat: 8, img: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=400&fit=crop', price: 24, desc: '清新抹茶风味', detail: '精选日本抹茶粉，搭配丝滑牛奶，抹茶的清新与牛奶的香浓完美融合。', sales: 780 }
    ];

    const banners = [
        { image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop', sort: 1 },
        { image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=400&fit=crop', sort: 2 },
        { image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop', sort: 3 }
    ];

    cats.forEach(c => execute('INSERT INTO categories (id, name, icon, sort_order) VALUES (?, ?, ?, ?)', [c.id, c.name, c.icon, c.sort]));
    foods.forEach(f => execute('INSERT INTO foods (id, name, category_id, image, price, desc, detail, video, sales) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [f.id, f.name, f.cat, f.img, f.price, f.desc, f.detail, 'https://www.w3schools.com/html/mov_bbb.mp4', f.sales]));
    banners.forEach(b => execute('INSERT INTO banners (image, sort_order) VALUES (?, ?)', [b.image, b.sort]));

    console.log('数据库初始化完成，已导入种子数据');
}

function getCategories() {
    return queryAll('SELECT * FROM categories ORDER BY sort_order');
}

function addCategory(name, icon, sort_order) {
    const n = safeStr(name, 50);
    const i = safeStr(icon, 255);
    const s = Math.max(0, Math.min(1000, parseInt(sort_order) || 0));
    if (!n) return { id: null, error: '分类名称不能为空' };
    execute('INSERT INTO categories (name, icon, sort_order) VALUES (?, ?, ?)', [n, i, s]);
    return { id: lastInsertId() };
}

function updateCategory(id, name, icon, sort_order) {
    const n = safeStr(name, 50);
    const i = safeStr(icon, 255);
    const s = Math.max(0, Math.min(1000, parseInt(sort_order) || 0));
    if (!n) return;
    execute('UPDATE categories SET name=?, icon=?, sort_order=? WHERE id=?', [n, i, s, id]);
}

function deleteCategory(id) {
    if (!parseInt(id)) return;
    execute('DELETE FROM categories WHERE id=?', [id]);
}

function getFoods(categoryId, page, pageSize) {
    let sql = 'SELECT * FROM foods WHERE is_on_sale=1';
    let params = [];
    if (categoryId) {
        sql += ' AND category_id=?';
        params.push(categoryId);
    }
    sql += ' ORDER BY id';
    if (page && pageSize) {
        const p = Math.max(1, parseInt(page) || 1);
        const ps = Math.max(1, Math.min(200, parseInt(pageSize) || 10));
        sql += ' LIMIT ? OFFSET ?';
        params.push(ps, (p - 1) * ps);
    }
    return queryAll(sql, params);
}

function getFoodsCount(categoryId) {
    if (categoryId) {
        const r = queryOne('SELECT COUNT(*) as c FROM foods WHERE category_id=? AND is_on_sale=1', [categoryId]);
        return r ? r.c : 0;
    }
    const r = queryOne('SELECT COUNT(*) as c FROM foods WHERE is_on_sale=1');
    return r ? r.c : 0;
}

function getFoodById(id) {
    if (!parseInt(id)) return null;
    return queryOne('SELECT * FROM foods WHERE id=?', [id]);
}

function getHotFoods(limit) {
    const l = Math.max(1, Math.min(100, parseInt(limit) || 6));
    return queryAll('SELECT * FROM foods WHERE is_on_sale=1 ORDER BY sales DESC LIMIT ?', [l]);
}

function addFood(data) {
    const d = {
        name: safeStr(data.name, 100),
        category_id: parseInt(data.category_id) || 0,
        image: safeStr(data.image, 255),
        price: Math.max(0, parseFloat(data.price) || 0),
        desc: safeStr(data.desc, 200),
        detail: safeStr(data.detail, 2000),
        video: safeStr(data.video, 255),
        sales: Math.max(0, parseInt(data.sales) || 0),
        is_on_sale: (data.is_on_sale === 0 || data.is_on_sale === '0') ? 0 : 1
    };
    if (!d.name || !d.category_id) return { id: null };
    execute('INSERT INTO foods (name, category_id, image, price, desc, detail, video, sales, is_on_sale) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [d.name, d.category_id, d.image, d.price, d.desc, d.detail, d.video, d.sales, d.is_on_sale]);
    return { id: lastInsertId() };
}

function updateFood(id, data) {
    const fid = parseInt(id);
    if (!fid) return;
    const d = {
        name: safeStr(data.name, 100),
        category_id: parseInt(data.category_id) || 0,
        image: safeStr(data.image, 255),
        price: Math.max(0, parseFloat(data.price) || 0),
        desc: safeStr(data.desc, 200),
        detail: safeStr(data.detail, 2000),
        video: safeStr(data.video, 255),
        sales: Math.max(0, parseInt(data.sales) || 0),
        is_on_sale: (data.is_on_sale === 0 || data.is_on_sale === '0') ? 0 : 1
    };
    if (!d.name || !d.category_id) return;
    execute('UPDATE foods SET name=?, category_id=?, image=?, price=?, desc=?, detail=?, video=?, sales=?, is_on_sale=? WHERE id=?', [d.name, d.category_id, d.image, d.price, d.desc, d.detail, d.video, d.sales, d.is_on_sale, fid]);
}

function deleteFood(id) {
    const fid = parseInt(id);
    if (!fid) return;
    execute('DELETE FROM foods WHERE id=?', [fid]);
}

function getOrders(status, userId) {
    const uid = parseInt(userId) || 0;
    let sql = 'SELECT * FROM orders WHERE 1=1';
    let params = [];
    if (uid > 0) {
        sql += ' AND user_id=?';
        params.push(uid);
    }
    if (status && status !== 'all') {
        sql += ' AND status=?';
        params.push(safeStr(status, 20));
    }
    sql += ' ORDER BY create_time DESC';
    return queryAll(sql, params);
}

function createOrder(data) {
    const id = 'DD' + Date.now() + Math.random().toString(36).slice(2, 6).toUpperCase();
    const userId = parseInt(data.user_id) || 0;
    const total = Math.max(0, parseFloat(data.total) || 0);
    const remark = safeStr(data.remark, 200);
    const tableNo = safeStr(data.table_no, 20);
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
        return { id: null, error: '订单商品不能为空' };
    }
    const items = JSON.stringify(data.items);
    execute('INSERT INTO orders (id, user_id, items, total, status, remark, table_no) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, userId, items, total, 'pending', remark, tableNo]);
    return { id };
}

function updateOrderStatus(id, status) {
    const sid = safeStr(id, 50);
    const ss = safeStr(status, 20);
    if (!sid || !ss) return;
    execute('UPDATE orders SET status=? WHERE id=?', [ss, sid]);
}

function deleteOrder(id) {
    const sid = safeStr(id, 50);
    if (!sid) return;
    execute('DELETE FROM orders WHERE id=?', [sid]);
}

function getBanners() {
    return queryAll('SELECT * FROM banners ORDER BY sort_order');
}

function addBanner(image, sort_order) {
    const img = safeStr(image, 255);
    if (!img) return { id: null };
    const s = Math.max(0, Math.min(1000, parseInt(sort_order) || 0));
    execute('INSERT INTO banners (image, sort_order) VALUES (?, ?)', [img, s]);
    return { id: lastInsertId() };
}

function updateBanner(id, image, sort_order) {
    const bid = parseInt(id);
    if (!bid) return;
    const img = safeStr(image, 255);
    if (!img) return;
    const s = Math.max(0, Math.min(1000, parseInt(sort_order) || 0));
    execute('UPDATE banners SET image=?, sort_order=? WHERE id=?', [img, s, bid]);
}

function deleteBanner(id) {
    const bid = parseInt(id);
    if (!bid) return;
    execute('DELETE FROM banners WHERE id=?', [bid]);
}

function getDashboard() {
    const totalOrders = queryOne('SELECT COUNT(*) as c FROM orders').c || 0;
    const todayOrders = queryOne("SELECT COUNT(*) as c FROM orders WHERE date(create_time)=date('now','localtime')").c || 0;
    const totalRevenue = queryOne("SELECT COALESCE(SUM(total),0) as c FROM orders WHERE status!='cancelled'").c || 0;
    const todayRevenue = queryOne("SELECT COALESCE(SUM(total),0) as c FROM orders WHERE status!='cancelled' AND date(create_time)=date('now','localtime')").c || 0;
    const pendingOrders = queryOne("SELECT COUNT(*) as c FROM orders WHERE status='pending'").c || 0;
    const cookingOrders = queryOne("SELECT COUNT(*) as c FROM orders WHERE status='cooking'").c || 0;
    const completedOrders = queryOne("SELECT COUNT(*) as c FROM orders WHERE status='completed'").c || 0;
    const totalFoods = queryOne('SELECT COUNT(*) as c FROM foods').c || 0;
    const totalCategories = queryOne('SELECT COUNT(*) as c FROM categories').c || 0;

    return {
        totalOrders,
        todayOrders,
        totalRevenue: totalRevenue.toFixed(2),
        todayRevenue: todayRevenue.toFixed(2),
        pendingOrders,
        cookingOrders,
        completedOrders,
        totalFoods,
        totalCategories
    };
}

function getUserById(id) {
    const uid = parseInt(id);
    if (!uid) return null;
    const user = queryOne('SELECT * FROM users WHERE id=?', [uid]);
    if (user) delete user.password;
    return user;
}

function getUserByUsername(username) {
    const u = safeStr(username, 20);
    if (!u) return null;
    return queryOne('SELECT * FROM users WHERE username=?', [u]);
}

function createUser(username, password, nickname = '', phone = '', isGuest = 0) {
    const u = safeStr(username, 20);
    const p = safeStr(password, 100);
    if (!u || !p) return null;
    const nn = safeStr(nickname, 50);
    const ph = safeStr(phone, 20);
    const ig = isGuest ? 1 : 0;
    execute('INSERT INTO users (username, password, nickname, phone, is_guest) VALUES (?, ?, ?, ?, ?)', [u, p, nn, ph, ig]);
    const userId = lastInsertId();
    return getUserById(userId);
}

function updateUser(id, data) {
    const uid = parseInt(id);
    if (!uid || !data) return;
    const fields = [];
    const params = [];
    if (data.nickname !== undefined) { fields.push('nickname=?'); params.push(safeStr(data.nickname, 50)); }
    if (data.phone !== undefined) { fields.push('phone=?'); params.push(safeStr(data.phone, 20)); }
    if (data.avatar !== undefined) { fields.push('avatar=?'); params.push(safeStr(data.avatar, 255)); }
    if (data.password !== undefined) {
        const pw = safeStr(data.password, 100);
        if (pw.length >= 6) {
            fields.push('password=?');
            params.push(pw);
        }
    }
    if (fields.length === 0) return;
    params.push(uid);
    execute(`UPDATE users SET ${fields.join(',')} WHERE id=?`, params);
}

module.exports = {
    initDB,
    seedData,
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getFoods,
    getFoodsCount,
    getFoodById,
    getHotFoods,
    addFood,
    updateFood,
    deleteFood,
    getOrders,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    getBanners,
    addBanner,
    updateBanner,
    deleteBanner,
    getDashboard,
    getUserById,
    getUserByUsername,
    createUser,
    updateUser
};
