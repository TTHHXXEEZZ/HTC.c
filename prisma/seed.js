import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: "file:./prisma/dev.db"
});
const prisma = new PrismaClient({ adapter });

const initialWorkplaces = [
  {
    id: 'w1',
    name: 'บริษัท ดิจิทัล ซอฟต์ โซลูชั่น จำกัด',
    category: 'เทคโนโลยีและซอฟต์แวร์',
    description: 'บริษัทพัฒนาซอฟต์แวร์และแอปพลิเคชันมือถือชั้นนำ ทำงานสไตล์ Start-up พี่ๆ เป็นกันเอง ได้ฝึกพัฒนาโค้ดจริงโดยใช้ React และ Node.js และระบบฐานข้อมูล คุยงานด้วยระบบ Agile/Scrum เป็นบริษัทที่เหมาะอย่างยิ่งสำหรับนักศึกษาฝึกงานแผนกไอทีที่ต้องการประสบการณ์จริง',
    address: '123/45 ถ.กาญจนวานิช ต.คอหงส์ อ.หาดใหญ่ จ.สงขลา 90110',
    website: 'https://digitalsoft.co.th',
    phone: '074-123456',
    department: 'เทคโนโลยีสารสนเทศ',
    lat: 7.0084,
    lng: 100.4975,
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    views: 185
  },
  {
    id: 'w2',
    name: 'ธนาคารกรุงเทพ สาขาหาดใหญ่',
    category: 'การเงินและการธนาคาร',
    description: 'สถานประกอบการมาตรฐานระบบงานธนาคาร มีความละเอียดรอบคอบ ได้เรียนรู้งานด้านบัญชี สินเชื่อ ตรวจสอบเอกสาร และบริการลูกค้าอย่างละเอียด มีการติวเข้มทักษะโดยพี่เลี้ยงและสวัสดิการเบี้ยเลี้ยงรายวันให้กับนักศึกษาที่ปฏิบัติงานดี',
    address: '99 ถ.นิพัทธ์อุทิศ 3 ต.หาดใหญ่ อ.หาดใหญ่ จ.สงขลา 90110',
    website: 'https://www.bangkokbank.com',
    phone: '074-235122',
    department: 'การบัญชี',
    lat: 7.0055,
    lng: 100.4721,
    coverImage: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800&auto=format&fit=crop&q=80',
    views: 142
  },
  {
    id: 'w3',
    name: 'บริษัท ยนตรกิจ มอเตอร์ส จำกัด (ศูนย์บริการโตโยต้า)',
    category: 'ยานยนต์และการซ่อมบำรุง',
    description: 'ศูนย์บริการและซ่อมบำรุงรถยนต์มาตรฐานสูงของโตโยต้า ได้ฝึกการวิเคราะห์เครื่องยนต์ด้วยระบบคอมพิวเตอร์ การดูแลเช็กระยะ และการซ่อมแซมส่วนสำคัญของรถยนต์ รวมถึงงานบริการลูกค้าและการบริหารจัดการอะไหล่รถยนต์',
    address: '555 ถ.เพชรเกษม ต.หาดใหญ่ อ.หาดใหญ่ จ.สงขลา 90110',
    website: 'https://toyotayontrakit.com',
    phone: '074-987654',
    department: 'ช่างยนต์',
    lat: 7.0210,
    lng: 100.4560,
    coverImage: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80',
    views: 98
  },
  {
    id: 'w4',
    name: 'การไฟฟ้าส่วนภูมิภาค อำเภอหาดใหญ่',
    category: 'พลังงานและสาธารณูปโภค',
    description: 'ฝึกปฏิบัติงานด้านระบบจำหน่ายไฟฟ้า ทั้งภาคทฤษฎีและปฏิบัติในสนามจริง รวมถึงงานซ่อมบำรุงสายส่งไฟฟ้า และการตรวจสอบมาตรวัดไฟฟ้า พี่ๆ ควบคุมดูแลอย่างใกล้ชิด เน้นระเบียบวินัยและความปลอดภัยสูงสุดในการทำงาน',
    address: '12 ถ.ศรีภูวนารถ ต.หาดใหญ่ อ.หาดใหญ่ จ.สงขลา 90110',
    website: 'https://www.pea.co.th',
    phone: '074-555111',
    department: 'ไฟฟ้ากำลัง',
    lat: 6.9982,
    lng: 100.4795,
    coverImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80',
    views: 73
  },
  {
    id: 'w5',
    name: 'โรงแรมลีการ์เดนส์ พลาซ่า หาดใหญ่',
    category: 'โรงแรมและการท่องเที่ยว',
    description: 'โรงแรมหรูใจกลางเมืองหาดใหญ่ ได้เรียนรู้มาตรฐานงานบริการลูกค้าระดับสากล ทั้งฝ่ายต้อนรับ (Front Office) ฝ่ายจัดเลี้ยง ฝ่ายแม่บ้าน และงานบริการอาหารและเครื่องดื่ม ฝึกแก้ปัญหาเฉพาะหน้าและพัฒนาภาษาอังกฤษอย่างก้าวกระโดด',
    address: '29 ถ.ประชาธิปัตย์ ต.หาดใหญ่ อ.หาดใหญ่ จ.สงขลา 90110',
    website: 'https://www.leegardensplaza.com',
    phone: '074-261111',
    department: 'การท่องเที่ยวและการโรงแรม',
    lat: 7.0062,
    lng: 100.4715,
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
    views: 115
  }
];

const initialReviews = [
  {
    id: 'r1',
    workplaceId: 'w1',
    reviewerName: 'สมศักดิ์ รักเรียน',
    reviewerDept: 'เทคโนโลยีสารสนเทศ',
    rating: 5,
    content: 'ได้รับประสบการณ์ที่ดีมากๆ ครับ พี่ๆ คอยสอนงานตลอด ได้ทำงานกับโปรเจกต์จริง ใช้ React และ Tailwind CSS ครับ สังคมดีเป็นกันเองมาก แนะนำให้มาทำที่นี่เลยครับ'
  },
  {
    id: 'r2',
    workplaceId: 'w1',
    reviewerName: 'มุกดา รัตนพร',
    reviewerDept: 'เทคโนโลยีสารสนเทศ',
    rating: 4,
    content: 'สอนระบบการเทสงานเป็นระบบดีมาก มีเอกสารคู่มือครบถ้วน พี่ๆ คอยเทรนให้อย่างใจเย็น ได้ทำงานใกล้ชิดกับโปรเจกต์เมเนเจอร์ มีบอร์ดเกมให้เล่นคลายเครียดตอนเย็นด้วยค่ะ'
  },
  {
    id: 'r3',
    workplaceId: 'w2',
    reviewerName: 'กิตติพงษ์ สุวรรณ',
    reviewerDept: 'การบัญชี',
    rating: 4,
    content: 'งานส่วนใหญ่เน้นความละเอียดเรียบร้อยของเอกสารภาษีและการทำธุรกรรมครับ แรกๆ อาจจะยากและเครียดนิดหน่อยเนื่องจากเป็นงานธนาคาร แต่พี่ๆ คอยแนะนำอย่างดี มีระเบียบวินัยดีมาก ได้ฝึกฝนตนเองอย่างมีประสิทธิภาพครับ'
  },
  {
    id: 'r4',
    workplaceId: 'w2',
    reviewerName: 'จิราภรณ์ แสงจันทร์',
    reviewerDept: 'การบัญชี',
    rating: 5,
    content: 'ทำงานเป็นระบบมากค่ะ สังคมที่นี่อบอุ่น ปลอดภัย มีสวัสดิการอาหารกลางวันฟรีบางวัน ได้เจอลูกค้าหลากหลาย ช่วยพัฒนาทักษะด้านการติดต่อสื่อสารได้ดีมากเลยค่ะ'
  },
  {
    id: 'r5',
    workplaceId: 'w3',
    reviewerName: 'ธีรเดช นุ่มนวล',
    reviewerDept: 'ช่างยนต์',
    rating: 5,
    content: 'ได้ลงมือซ่อมจริง สัมผัสเครื่องยนต์ระบบไฮบริดตัวใหม่ด้วยครับ พี่ๆ ช่างชำนาญการเก่งมาก ให้คำแนะนำและเทคนิคดีๆ ตลอดการฝึกงาน มีความสุขและคุ้มค่ามากครับสำหรับคนรักรถ'
  },
  {
    id: 'r6',
    workplaceId: 'w4',
    reviewerName: 'ณัฐพล แก้วมณี',
    reviewerDept: 'ไฟฟ้ากำลัง',
    rating: 4,
    content: 'เป็นการทำงานที่มีระเบียบและเน้นความปลอดภัยมากๆ ได้ขึ้นรถเครนออกซ่อมสายและติดตั้งหม้อแปลงไฟฟ้าจริงๆ ลุยๆ สนุกและตื่นเต้นมากครับ ได้ประสบการณ์ที่หาที่อื่นไม่ได้'
  },
  {
    id: 'r7',
    workplaceId: 'w5',
    reviewerName: 'สุภัทรา ชัยชนะ',
    reviewerDept: 'การท่องเที่ยวและการโรงแรม',
    rating: 5,
    content: 'ได้ฝึกการใช้ภาษาอังกฤษและภาษาจีนกับแขกชาวต่างชาติตลอดเวลาค่ะ พี่ๆ สอนระบบบริหารจัดการหน้าฟรอนต์และการเช็คอิน/เช็คเอาต์อย่างมืออาชีพ ประทับใจมากค่ะ'
  }
];

async function main() {
  // Clear tables
  await prisma.review.deleteMany();
  await prisma.workplace.deleteMany();
  await prisma.siteView.deleteMany();
  await prisma.user.deleteMany();

  // Create default site view count
  await prisma.siteView.create({
    data: {
      id: 1,
      count: 412
    }
  });

  // Create workplaces
  for (const wp of initialWorkplaces) {
    await prisma.workplace.create({
      data: { ...wp, approved: true }
    });
  }

  // Create reviews
  for (const rev of initialReviews) {
    await prisma.review.create({
      data: { ...rev, approved: true }
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
