import { Dish, OrderHistory } from '../types';

export const mockDishes: Dish[] = [
  {
    id: '1',
    name: '手撕包菜',
    price: 18,
    tags: ['辣', '蔬菜', '下饭'],
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
    restaurant: '川湘阁'
  },
  {
    id: '2',
    name: '农家一碗香',
    price: 28,
    tags: ['辣', '下饭', '家常'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    restaurant: '农家小炒'
  },
  {
    id: '3',
    name: '爆炒猪肝',
    price: 32,
    tags: ['辣', '荤菜', '家常'],
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
    restaurant: '老味道'
  },
  {
    id: '4',
    name: '西蓝花炒虾仁',
    price: 45,
    tags: ['清淡', '海鲜', '健康'],
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400',
    restaurant: '海鲜港'
  },
  {
    id: '5',
    name: '蔬菜沙拉',
    price: 15,
    tags: ['清淡', '健康', '蔬菜'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    restaurant: '轻食屋'
  },
  {
    id: '6',
    name: '糖醋里脊',
    price: 36,
    tags: ['酸甜', '荤菜', '经典'],
    image: 'https://images.unsplash.com/photo-1606502285603-7f2b14a3b4d7?w=400',
    restaurant: '东北人家'
  },
  {
    id: '7',
    name: '小炒黄牛肉',
    price: 42,
    tags: ['辣', '牛肉', '下饭'],
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400',
    restaurant: '湘味馆'
  },
  {
    id: '8',
    name: '水煮鱼',
    price: 58,
    tags: ['辣', '鱼类', '经典'],
    image: 'https://images.unsplash.com/photo-1534938665420-4193effeacc4?w=400',
    restaurant: '川香苑'
  },
  {
    id: '9',
    name: '清蒸鲈鱼',
    price: 68,
    tags: ['清淡', '鱼类', '健康'],
    image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400',
    restaurant: '粤菜轩'
  },
  {
    id: '10',
    name: '菠萝咕咾肉',
    price: 38,
    tags: ['酸甜', '荤菜', '经典'],
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400',
    restaurant: '港式茶餐厅'
  },
  {
    id: '11',
    name: '宫保鸡丁',
    price: 29,
    tags: ['辣', '鸡肉', '下饭'],
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400',
    restaurant: '川湘阁'
  },
  {
    id: '12',
    name: '清炒时蔬',
    price: 16,
    tags: ['清淡', '蔬菜', '健康'],
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=400',
    restaurant: '素心斋'
  },
  {
    id: '13',
    name: '红烧肉',
    price: 35,
    tags: ['甜', '荤菜', '经典'],
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400',
    restaurant: '本帮菜馆'
  },
  {
    id: '14',
    name: '辣子鸡',
    price: 48,
    tags: ['辣', '鸡肉', '下饭'],
    image: 'https://images.unsplash.com/photo-1606131731446-5568d87113aa?w=400',
    restaurant: '川香苑'
  },
  {
    id: '15',
    name: '糖醋排骨',
    price: 52,
    tags: ['酸甜', '荤菜', '经典'],
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400',
    restaurant: '沪上人家'
  },
  {
    id: '16',
    name: '鱼香肉丝',
    price: 26,
    tags: ['辣', '下饭', '经典'],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    restaurant: '川湘阁'
  },
  {
    id: '17',
    name: '白灼虾',
    price: 55,
    tags: ['清淡', '海鲜', '健康'],
    image: 'https://images.unsplash.com/photo-1626804475297-411dbe631934?w=400',
    restaurant: '海鲜港'
  },
  {
    id: '18',
    name: '酸菜鱼',
    price: 48,
    tags: ['辣', '鱼类', '下饭'],
    image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400',
    restaurant: '川湘阁'
  },
  {
    id: '19',
    name: '麻婆豆腐',
    price: 18,
    tags: ['辣', '下饭', '经典'],
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
    restaurant: '川香苑'
  },
  {
    id: '20',
    name: '蒸蛋羹',
    price: 12,
    tags: ['清淡', '健康', '家常'],
    image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=400',
    restaurant: '家常菜馆'
  }
];

export const mockOrderHistory: OrderHistory[] = [
  {
    id: '1',
    dishName: '手撕包菜',
    tags: ['辣', '蔬菜', '下饭'],
    orderDate: '2026-01-12'
  },
  {
    id: '2',
    dishName: '小炒黄牛肉',
    tags: ['辣', '牛肉', '下饭'],
    orderDate: '2026-01-10'
  },
  {
    id: '3',
    dishName: '糖醋里脊',
    tags: ['酸甜', '荤菜', '经典'],
    orderDate: '2026-01-08'
  },
  {
    id: '4',
    dishName: '西蓝花炒虾仁',
    tags: ['清淡', '海鲜', '健康'],
    orderDate: '2026-01-05'
  },
  {
    id: '5',
    dishName: '宫保鸡丁',
    tags: ['辣', '鸡肉', '下饭'],
    orderDate: '2026-01-03'
  },
  {
    id: '6',
    dishName: '蔬菜沙拉',
    tags: ['清淡', '健康', '蔬菜'],
    orderDate: '2025-12-30'
  },
  {
    id: '7',
    dishName: '爆炒猪肝',
    tags: ['辣', '荤菜', '家常'],
    orderDate: '2025-12-28'
  },
  {
    id: '8',
    dishName: '农家一碗香',
    tags: ['辣', '下饭', '家常'],
    orderDate: '2025-12-25'
  }
];
