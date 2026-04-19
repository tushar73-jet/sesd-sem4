import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Cleaning Database ---');
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('--- Creating Seed Users ---');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const alice = await prisma.user.create({
    data: { name: 'Alice Stanford', email: 'alice@stanford.edu', password: hashedPassword, role: 'STUDENT' },
  });

  const bob = await prisma.user.create({
    data: { name: 'Bob Berkeley', email: 'bob@berkeley.edu', password: hashedPassword, role: 'STUDENT' },
  });

  const admin = await prisma.user.create({
    data: { name: 'System Admin', email: 'admin@campuskart.edu', password: hashedPassword, role: 'ADMIN' },
  });

  console.log('--- Fetching Real Products from DummyJSON ---');
  try {
    const response = await fetch('https://dummyjson.com/products?limit=100');
    const data: any = await response.json();
    const externalProducts = data.products;

    console.log(`Found ${externalProducts.length} products to import.`);

    const categoryMap: Record<string, string> = {
      'smartphones': 'Electronics',
      'laptops': 'Electronics',
      'fragrances': 'Other',
      'skincare': 'Other',
      'groceries': 'Other',
      'home-decoration': 'Furniture',
      'furniture': 'Furniture',
      'tops': 'Clothing',
      'womens-dresses': 'Clothing',
      'womens-shoes': 'Clothing',
      'mens-shirts': 'Clothing',
      'mens-shoes': 'Clothing',
      'mens-watches': 'Other',
      'womens-watches': 'Other',
      'womens-bags': 'Other',
      'womens-jewellery': 'Other',
      'sunglasses': 'Other',
      'automotive': 'Other',
      'motorcycle': 'Other',
      'lighting': 'Other'
    };

    for (const p of externalProducts) {
      // Map category or default to 'Other'
      const category = categoryMap[p.category] || 'Other';
      const sellerId = Math.random() > 0.5 ? alice.id : bob.id;

      await prisma.product.create({
        data: {
          title: p.title,
          description: p.description,
          price: p.price,
          category: category,
          imageUrl: p.thumbnail,
          status: 'AVAILABLE',
          sellerId: sellerId,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)) // Random past dates
        }
      });
    }

    console.log('--- Seeding Complete Successfully ---');
    console.log('Stats:');
    console.log(`- Users: 3`);
    console.log(`- Products: ${externalProducts.length}`);
    console.log('\nUse password123 for all accounts.');
  } catch (error) {
    console.error('Failed to fetch from external API:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
