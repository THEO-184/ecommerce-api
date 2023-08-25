import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const productsData: Prisma.ProductCreateInput[] = [
  {
    description:
      "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.",
    image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg',
    price: 234.45,
    quantity: 54,
    title: "John Hardy Women's Legends Naga Gold & Silver",
    cartegory: {
      create: {
        title: 'jewelery',
      },
    },
  },
  {
    description:
      'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    price: 135.34,
    quantity: 32,
    title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
    cartegory: {
      create: {
        title: 'clothing',
      },
    },
  },
  {
    description:
      'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.',
    image:
      'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
    price: 22.4,
    quantity: 65,
    title: 'Mens Casual Premium Slim Fit T-Shirts',
    cartegory: {
      create: {
        title: 'clothing',
      },
    },
  },
  {
    description:
      'great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.',
    image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    price: 55.99,
    quantity: 42,
    title: 'Mens Cotton Jacket',
    cartegory: {
      create: {
        title: 'clothing',
      },
    },
  },
  {
    price: 695,
    description:
      "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.",
    image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg',
    quantity: 100,
    title:
      "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    cartegory: {
      create: {
        title: 'jewelery',
      },
    },
  },
  {
    price: 25.86,
    description:
      'Satisfaction Guaranteed. Return or exchange any order within 30 days.Designed and sold by Hafeez Center in the United States. Satisfaction Guaranteed. Return or exchange any order within 30 days.',
    image: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg',
    quantity: 122,
    title: 'Solid Gold Petite Micropave ',
    cartegory: {
      create: {
        title: 'jewelery',
      },
    },
  },
  {
    title: 'White Gold Plated Princess',
    price: 9.99,
    quantity: 100,
    description:
      "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love more for Engagement, Wedding, Anniversary, Valentine's Day...",
    image: 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg',
    cartegory: {
      create: {
        title: 'jewelery',
      },
    },
  },
  {
    title: 'Pierced Owl Rose Gold Plated Stainless Steel Double',
    price: 10.99,
    quantity: 59,
    description:
      'Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel',
    image: 'https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg',
    cartegory: {
      create: {
        title: 'jewelery',
      },
    },
  },
  {
    title: 'WD 2TB Elements Portable External Hard Drive - USB 3.0 ',
    price: 64,
    description:
      'USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system',
    quantity: 150,
    image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
    cartegory: {
      create: {
        title: 'electronics',
      },
    },
  },
  {
    title: 'SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s',
    price: 109,
    description:
      'Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5” hard drive; Based on published specifications and internal benchmarking tests using PCMark vantage scores) Boosts burst write performance, making it ideal for typical PC workloads The perfect balance of performance and reliability Read/write speeds of up to 535MB/s/450MB/s (Based on internal testing; Performance may vary depending upon drive capacity, host device, OS and application.)',
    quantity: 78,
    image: 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg',
    cartegory: {
      create: {
        title: 'electronics',
      },
    },
  },
  {
    title:
      'Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5',
    price: 109,
    description:
      '3D NAND flash are applied to deliver high transfer speeds Remarkable transfer speeds that enable faster bootup and improved overall system performance. The advanced SLC Cache Technology allows performance boost and longer lifespan 7mm slim design suitable for Ultrabooks and Ultra-slim notebooks. Supports TRIM command, Garbage Collection technology, RAID, and ECC (Error Checking & Correction) to provide the optimized performance and enhanced reliability.',
    quantity: 111,
    image: 'https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg',
    cartegory: {
      create: {
        title: 'electronics',
      },
    },
  },
  {
    title:
      'WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive',
    price: 114,
    description:
      "Expand your PS4 gaming experience, Play anywhere Fast and easy, setup Sleek design with high capacity, 3-year manufacturer's limited warranty",
    image: 'https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg',
    quantity: 67,
    cartegory: {
      create: {
        title: 'electronics',
      },
    },
  },
  {
    title: 'Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin',
    price: 599,
    description:
      '21. 5 inches Full HD (1920 x 1080) widescreen IPS display And Radeon free Sync technology. No compatibility for VESA Mount Refresh Rate: 75Hz - Using HDMI port Zero-frame design | ultra-thin | 4ms response time | IPS panel Aspect ratio - 16: 9. Color Supported - 16. 7 million colors. Brightness - 250 nit Tilt angle -5 degree to 15 degree. Horizontal viewing angle-178 degree. Vertical viewing angle-178 degree 75 hertz',
    quantity: 145,
    image: 'https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg',
    cartegory: {
      create: {
        title: 'electronics',
      },
    },
  },
  {
    title:
      'Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED ',
    price: 999.99,
    description:
      '49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side QUANTUM DOT (QLED) TECHNOLOGY, HDR support and factory calibration provides stunningly realistic and accurate color and contrast 144HZ HIGH REFRESH RATE and 1ms ultra fast response time work to eliminate motion blur, ghosting, and reduce input lag',
    quantity: 34,
    image: 'https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg',
    cartegory: {
      create: {
        title: 'electronics',
      },
    },
  },
];
async function main() {
  console.log(`Starting seeding...`);
  for (const p of productsData) {
    const categoryTitle = p.cartegory.create.title;

    const existingCategory = await prisma.category.findUnique({
      where: { title: categoryTitle },
    });

    let categoryId;

    if (existingCategory) {
      categoryId = existingCategory.id;
    } else {
      const newCategory = await prisma.category.create({
        data: { title: categoryTitle },
      });

      categoryId = newCategory.id;
    }

    delete p.cartegory;
    const product = await prisma.product.create({
      data: {
        ...p,
        categoryId: categoryId as never,
      },
    });

    console.log(`created product with id: ${product.id}`);
  }

  console.log(`seeding completed!!`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    process.exit(1);
  });
