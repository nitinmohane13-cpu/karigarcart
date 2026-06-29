const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('Admin@123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@karigarcart.in' },
    update: {},
    create: { name: 'Karigar Admin', email: 'admin@karigarcart.in', password: adminPassword, role: 'ADMIN' },
  })

  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  const cats = await Promise.all([
    prisma.category.create({ data: { name: 'Handmade Decor', slug: 'handmade-decor', description: 'Wall hangings, diyas, rangoli, home accessories' } }),
    prisma.category.create({ data: { name: 'Gifts & Hampers', slug: 'gifts-hampers', description: 'Curated gift boxes, festive hampers, personalised gifts' } }),
    prisma.category.create({ data: { name: 'Antiques & Vintage', slug: 'antiques-vintage', description: 'Brass idols, vintage collectibles, heritage pieces' } }),
    prisma.category.create({ data: { name: 'Candles & Aromas', slug: 'candles-aromas', description: 'Soy candles, incense, aromatherapy, dhoop' } }),
    prisma.category.create({ data: { name: 'Pottery & Ceramics', slug: 'pottery-ceramics', description: 'Handthrown pots, mugs, terracotta, blue pottery' } }),
    prisma.category.create({ data: { name: 'Handloom & Textiles', slug: 'handloom-textiles', description: 'Block print, khadi, handwoven dupattas, cushion covers' } }),
  ])

  const [decor, gifts, antiques, candles, pottery, textiles] = cats

  const products = [
    // Handmade Decor
    {
      name: 'Terracotta Diya Set (Set of 12)', slug: 'terracotta-diya-set-12', sku: 'HD-001',
      price: 349, mrp: 450, stock: 80, categoryId: decor.id, isFeatured: true,
      tags: ['diya', 'diwali', 'terracotta'],
      description: 'Hand-painted terracotta diyas from Rajasthan, perfect for Diwali and daily pooja.',
      images: ['https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=600&q=80'],
    },
    {
      name: 'Madhubani Wall Art – Fish Pair', slug: 'madhubani-wall-art-fish', sku: 'HD-002',
      price: 899, mrp: 1200, stock: 25, categoryId: decor.id, isFeatured: true,
      tags: ['madhubani', 'wall art', 'bihar'],
      description: 'Authentic Madhubani painting on handmade paper by artisans of Mithila, Bihar.',
      images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80'],
    },
    {
      name: 'Bamboo Wind Chime 5-Tube', slug: 'bamboo-wind-chime-5tube', sku: 'HD-003',
      price: 449, mrp: 599, stock: 40, categoryId: decor.id,
      tags: ['wind chime', 'bamboo', 'decor'],
      description: 'Handcrafted bamboo wind chime with natural teak finish.',
      images: ['https://images.unsplash.com/photo-1558618047-f4e60cfe3e04?w=600&q=80'],
    },
    {
      name: 'Warli Tribal Art Panel', slug: 'warli-tribal-art-panel', sku: 'HD-004',
      price: 1299, mrp: 1699, stock: 15, categoryId: decor.id, isFeatured: true,
      tags: ['warli', 'tribal', 'maharashtra'],
      description: 'Traditional Warli art on wooden panel by Maharashtra tribal artists.',
      images: ['https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=600&q=80'],
    },

    // Gifts & Hampers
    {
      name: 'Festive Diwali Hamper – Gold', slug: 'festive-diwali-hamper-gold', sku: 'GH-001',
      price: 1499, mrp: 1999, stock: 30, categoryId: gifts.id, isFeatured: true,
      tags: ['hamper', 'diwali', 'gift'],
      description: 'Curated Diwali hamper: 2 diyas, 1 soy candle, dry fruits box, incense sticks and greeting card.',
      images: ['https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&q=80'],
    },
    {
      name: 'Personalised Jute Gift Bag', slug: 'personalised-jute-gift-bag', sku: 'GH-002',
      price: 299, mrp: 399, stock: 100, categoryId: gifts.id,
      tags: ['jute', 'eco', 'personalised'],
      description: 'Eco-friendly jute bag with custom name/message printing.',
      images: ['https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80'],
    },
    {
      name: 'Wedding Return Gift Box (10 pcs)', slug: 'wedding-return-gift-box-10', sku: 'GH-003',
      price: 2499, mrp: 3000, stock: 20, categoryId: gifts.id,
      tags: ['wedding', 'return gift'],
      description: 'Set of 10 handcrafted brass diyas in individual gift boxes.',
      images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80'],
    },

    // Antiques & Vintage
    {
      name: 'Brass Ganesha Idol – 6 inch', slug: 'brass-ganesha-idol-6inch', sku: 'AV-001',
      price: 1899, mrp: 2400, stock: 20, categoryId: antiques.id, isFeatured: true,
      tags: ['brass', 'ganesha', 'idol'],
      description: 'Solid brass Ganesha idol with antique finish. Hand-cast by Moradabad artisans.',
      images: ['https://images.unsplash.com/photo-1509909756405-be0199881695?w=600&q=80'],
    },
    {
      name: 'Vintage Teak Wooden Chest', slug: 'vintage-teak-wooden-chest', sku: 'AV-002',
      price: 4999, mrp: 6500, stock: 5, categoryId: antiques.id,
      tags: ['teak', 'vintage', 'chest'],
      description: 'Genuine antique teak chest from Rajasthan with iron lock fittings. 80+ years old.',
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'],
    },
    {
      name: 'Copper Kalash – Temple Grade', slug: 'copper-kalash-temple-grade', sku: 'AV-003',
      price: 799, mrp: 999, stock: 35, categoryId: antiques.id,
      tags: ['copper', 'kalash', 'pooja'],
      description: 'Pure copper kalash, hand-hammered finish. Used in temples and homes for pooja rituals.',
      images: ['https://images.unsplash.com/photo-1608501078713-8e445a709b39?w=600&q=80'],
    },

    // Candles & Aromas
    {
      name: 'Soy Wax Candle – Rose & Oud', slug: 'soy-candle-rose-oud', sku: 'CA-001',
      price: 549, mrp: 699, stock: 60, categoryId: candles.id, isFeatured: true,
      tags: ['soy', 'candle', 'rose', 'oud'],
      description: 'Hand-poured soy wax candle with rose and oud fragrance. 40-hour burn time.',
      images: ['https://images.unsplash.com/photo-1574106754461-eb8fc7a95d72?w=600&q=80'],
    },
    {
      name: 'Loban Dhoop Cones (50 pcs)', slug: 'loban-dhoop-cones-50', sku: 'CA-002',
      price: 199, mrp: 249, stock: 120, categoryId: candles.id,
      tags: ['dhoop', 'loban', 'incense'],
      description: 'Traditional loban dhoop cones. Pure and natural, no charcoal added.',
      images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80'],
    },
    {
      name: 'Aromatherapy Gift Set – 4 Oils', slug: 'aromatherapy-gift-set-4oils', sku: 'CA-003',
      price: 899, mrp: 1199, stock: 40, categoryId: candles.id,
      tags: ['essential oil', 'aromatherapy'],
      description: 'Set of 4 pure essential oils: Lavender, Eucalyptus, Lemon, Peppermint. 10ml each.',
      images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80'],
    },

    // Pottery & Ceramics
    {
      name: 'Blue Pottery Mug – Hand Painted', slug: 'blue-pottery-mug-handpainted', sku: 'PC-001',
      price: 499, mrp: 649, stock: 45, categoryId: pottery.id, isFeatured: true,
      tags: ['blue pottery', 'mug', 'jaipur'],
      description: 'Authentic Jaipur blue pottery mug, hand-painted with floral motifs. 250ml capacity.',
      images: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80'],
    },
    {
      name: 'Terracotta Planter Set (3 pcs)', slug: 'terracotta-planter-set-3', sku: 'PC-002',
      price: 699, mrp: 899, stock: 30, categoryId: pottery.id,
      tags: ['planter', 'terracotta', 'garden'],
      description: 'Set of 3 handthrown terracotta planters in graduating sizes.',
      images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80'],
    },
    {
      name: 'Khurja Ceramic Dinner Set (6 pcs)', slug: 'khurja-ceramic-dinner-set', sku: 'PC-003',
      price: 2199, mrp: 2999, stock: 12, categoryId: pottery.id,
      tags: ['khurja', 'ceramic', 'dinner set'],
      description: 'Handpainted Khurja ceramic dinner set. 6 plates with traditional blue-white motifs.',
      images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&q=80'],
    },

    // Handloom & Textiles
    {
      name: 'Bagru Block Print Dupatta', slug: 'bagru-block-print-dupatta', sku: 'HT-001',
      price: 799, mrp: 1099, stock: 35, categoryId: textiles.id, isFeatured: true,
      tags: ['block print', 'dupatta', 'bagru'],
      description: 'Hand block printed cotton dupatta using natural dyes. From Bagru, Rajasthan.',
      images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80'],
    },
    {
      name: 'Khadi Cotton Kurta Fabric – 2.5m', slug: 'khadi-cotton-kurta-fabric', sku: 'HT-002',
      price: 649, mrp: 849, stock: 50, categoryId: textiles.id,
      tags: ['khadi', 'cotton', 'fabric'],
      description: 'Hand-spun khadi cotton fabric, 2.5 metres. Natural off-white colour.',
      images: ['https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80'],
    },
    {
      name: 'Ikat Weave Cushion Cover (Set of 2)', slug: 'ikat-cushion-cover-set-2', sku: 'HT-003',
      price: 549, mrp: 699, stock: 40, categoryId: textiles.id,
      tags: ['ikat', 'cushion', 'handloom'],
      description: 'Handwoven ikat cushion covers from Pochampally, Telangana. 16x16 inch.',
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'],
    },
  ]

  for (const p of products) {
    await prisma.product.create({
      data: { ...p, gstRate: 12, weight: null, unit: null },
    })
  }

  const settings = [
    { key: 'store_name', value: 'Karigar Cart' },
    { key: 'store_email', value: 'namaste@karigarcart.in' },
    { key: 'store_phone', value: '+91 98765 43210' },
    { key: 'shipping_charge', value: '99' },
    { key: 'free_shipping_above', value: '999' },
    { key: 'gst_number', value: '27AABCU9603R1ZM' },
  ]
  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s })
  }

  console.log('Karigar Cart seed complete with images')
}

main().catch(console.error).finally(() => prisma.$disconnect())
