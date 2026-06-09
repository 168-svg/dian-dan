const foodData = {
        1: [
            { id: 1, name: '宫保鸡丁', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=400&fit=crop', price: 32, desc: '经典川菜，麻辣鲜香', sales: 1256, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '选用新鲜鸡胸肉，配以花生、干辣椒、花椒等食材，经过大火爆炒，鸡肉鲜嫩多汁，花生酥脆，麻辣鲜香，是川菜中的经典之作。' },
            { id: 2, name: '麻辣小龙虾', image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=400&fit=crop', price: 68, desc: '新鲜小龙虾，麻辣过瘾', sales: 986, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '精选鲜活小龙虾，配以秘制麻辣调料，经过精心烹制，虾肉鲜嫩弹牙，麻辣入味，让人欲罢不能。' },
            { id: 3, name: '番茄牛腩面', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop', price: 28, desc: '牛腩软烂，汤汁浓郁', sales: 2341, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '选用上等牛腩，慢火炖煮数小时，牛腩软烂入味，搭配新鲜番茄熬制的浓郁汤汁，配以劲道面条，暖心暖胃。' },
            { id: 4, name: '珍珠奶茶', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop', price: 18, desc: 'Q弹珍珠，丝滑奶茶', sales: 3856, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '手工熬制的黑糖珍珠，Q弹有嚼劲，搭配丝滑香浓的奶茶，甜而不腻，是下午茶的最佳伴侣。' },
            { id: 5, name: '红烧排骨', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop', price: 45, desc: '精选猪小排，酱香浓郁', sales: 768, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '精选优质猪小排，经过焯水、炒糖色、慢炖等多道工序，排骨色泽红亮，肉质酥烂，酱香浓郁，回味无穷。' },
            { id: 6, name: '水果拼盘', image: 'https://images.unsplash.com/photo-1564093497595-593b96d80180?w=400&h=400&fit=crop', price: 22, desc: '新鲜时令水果', sales: 1567, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '精选当季新鲜水果，精心切配摆盘，色彩缤纷，口感清爽，是餐后解腻的最佳选择。' }
        ],
        2: [
            { id: 7, name: '扬州炒饭', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop', price: 22, desc: '经典扬州炒饭，粒粒分明', sales: 2100, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '经典扬州炒饭，选用优质米饭，配以鸡蛋、火腿、虾仁、青豆等食材，大火快炒，粒粒分明，香气四溢。' },
            { id: 8, name: '兰州拉面', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop', price: 20, desc: '手工拉面，汤清味浓', sales: 1890, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '手工现场拉制，面条筋道爽滑，配以牛骨熬制的清汤，撒上香菜、葱花，汤清味浓，一碗下肚暖意融融。' },
            { id: 9, name: '黄焖鸡米饭', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop', price: 26, desc: '鲜嫩鸡肉配米饭', sales: 3021, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '选用鲜嫩鸡腿肉，配以香菇、青椒等食材，经过黄焖工艺烹制，鸡肉鲜嫩多汁，汤汁浓郁，搭配香喷喷的米饭，绝配。' },
            { id: 10, name: '意大利面', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=400&fit=crop', price: 35, desc: '番茄肉酱意面', sales: 654, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '进口意大利面条，搭配自制番茄肉酱，撒上帕玛森芝士，酸甜可口，意式风味十足。' }
        ],
        3: [
                { id: 11, name: '炸鸡翅', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=400&fit=crop', price: 18, desc: '外酥里嫩，金黄诱人', sales: 2980, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '精选鸡中翅，经过秘制腌料腌制后裹粉油炸，外皮金黄酥脆，内里鲜嫩多汁，一口下去满口留香。' },
                { id: 12, name: '薯条', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop', price: 12, desc: '金黄酥脆薯条', sales: 3456, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '精选优质土豆，切成均匀条状，经过两次油炸工艺，外酥里嫩，金黄诱人，搭配番茄酱更美味。' },
                { id: 13, name: '烤串拼盘', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop', price: 38, desc: '多种烤串组合', sales: 1567, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '精选羊肉串、牛肉串、鸡翅、蔬菜串等多种烤串组合，炭火烤制，撒上孜然辣椒，香气扑鼻。' },
                { id: 14, name: '春卷', image: 'https://images.unsplash.com/photo-1548507200-54bddda68ceb?w=400&h=400&fit=crop', price: 16, desc: '酥脆春卷，馅料丰富', sales: 890, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '薄如蝉翼的春卷皮包裹着丰富的馅料，经过油炸至金黄酥脆，蘸上甜辣酱，口感层次丰富。' }
            ],
            4: [
                { id: 15, name: '珍珠奶茶', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop', price: 18, desc: 'Q弹珍珠，丝滑奶茶', sales: 3856, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '手工熬制的黑糖珍珠，Q弹有嚼劲，搭配丝滑香浓的奶茶，甜而不腻。' },
                { id: 16, name: '冰美式', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop', price: 22, desc: '经典美式，提神醒脑', sales: 2100, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '精选阿拉比卡咖啡豆，现磨现萃，搭配冰块，纯粹的黑咖啡风味，提神醒脑。' },
                { id: 17, name: '鲜榨果汁', image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=400&h=400&fit=crop', price: 25, desc: '新鲜水果现榨', sales: 1678, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '选用当季新鲜水果，现场榨汁，不添加任何添加剂，100%纯果汁，健康美味。' },
                { id: 18, name: '柠檬茶', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop', price: 15, desc: '清爽柠檬茶', sales: 2890, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '新鲜柠檬切片，搭配红茶底，酸甜清爽，解腻消暑，是夏日必备饮品。' }
            ],
            5: [
                { id: 19, name: '提拉米苏', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop', price: 32, desc: '经典意大利甜品', sales: 890, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '经典意大利甜品，手指饼干浸泡咖啡液，层层叠加马斯卡彭奶酪，撒上可可粉，入口即化，甜蜜浪漫。' },
                { id: 20, name: '芒果布丁', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop', price: 16, desc: '新鲜芒果制作', sales: 1567, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '选用新鲜成熟的芒果，制作成细腻顺滑的布丁，芒果香气浓郁，口感Q弹爽滑。' },
                { id: 21, name: '芝士蛋糕', image: 'https://images.unsplash.com/photo-1533134242443-d4fd2113f1e5?w=400&h=400&fit=crop', price: 28, desc: '浓郁芝士，入口即化', sales: 2100, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '选用优质奶油芝士，经过低温慢烤，口感绵密细腻，芝士味浓郁，入口即化。' }
            ],
            6: [
                { id: 22, name: '酸辣汤', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop', price: 18, desc: '酸辣开胃', sales: 1230, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '传统酸辣汤，配以豆腐、木耳、鸡蛋、肉丝等食材，酸辣适中，开胃暖身。' },
                { id: 23, name: '玉米排骨汤', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop', price: 28, desc: '清甜滋补', sales: 980, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '精选猪排骨配以甜玉米，慢火炖煮，汤色清亮，味道清甜，营养滋补。' }
            ],
            7: [
                { id: 24, name: '超值单人餐', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop', price: 38, desc: '一荤一素一汤', sales: 3200, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '超值单人套餐，包含一荤一素一汤一米饭，营养均衡，经济实惠，是上班族的午餐首选。' },
                { id: 25, name: '双人套餐', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop', price: 78, desc: '两荤两素两饮品', sales: 1890, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '双人超值套餐，包含两荤两素两饮品两米饭，适合情侣或好友共享，性价比超高。' },
                { id: 26, name: '全家福套餐', image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=400&fit=crop', price: 128, desc: '适合3-4人', sales: 890, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '全家福套餐，包含四荤三素一汤四米饭，适合3-4人享用，家庭聚餐的首选。' }
            ],
            8: [
                { id: 27, name: '菠萝咕咾肉', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop', price: 36, desc: '酸甜可口新品', sales: 560, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '创新菜品，猪里脊肉裹粉炸至金黄，配以新鲜菠萝块，浇上酸甜酱汁，酸甜可口，口感丰富。' },
                { id: 28, name: '椰子鸡汤', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop', price: 42, desc: '浓郁椰子香', sales: 340, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '选用新鲜椰子水和椰肉，配以鲜嫩鸡肉，慢火炖煮，汤色奶白，椰香浓郁，清甜滋补。' },
                { id: 29, name: '抹茶拿铁', image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=400&fit=crop', price: 24, desc: '清新抹茶风味', sales: 780, video: 'https://www.w3schools.com/html/mov_bbb.mp4', detail: '精选日本抹茶粉，搭配丝滑牛奶，抹茶的清新与牛奶的香浓完美融合，口感层次丰富。' }
            ]
        };

        function getAllFoods() {
            const all = [];
            Object.values(foodData).forEach(list => {
                all.push(...list);
            });
            return all;
        }

        function getFoodById(id) {
            const all = getAllFoods();
            return all.find(item => item.id === id);
        }

        module.exports = {
            foodData,
            getAllFoods,
            getFoodById
        };