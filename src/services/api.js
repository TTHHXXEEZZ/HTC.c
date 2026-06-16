// API and Database Service for HTC Workplace Connect
// Mocked client-side database stored in localStorage for zero-config persistence.

export const DEPARTMENTS = [
  'เทคโนโลยีสารสนเทศ',
  'เทคนิคคอมพิวเตอร์',
  'ไฟฟ้ากำลัง',
  'อิเล็กทรอนิกส์',
  'ช่างยนต์',
  'การบัญชี',
  'การตลาด',
  'การจัดการสำนักงาน',
  'คหกรรมศาสตร์',
  'การท่องเที่ยวและการโรงแรม'
];

// Initial mock data with views count pre-populated
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
    averageRating: 4.8,
    totalReviews: 2,
    views: 184 // Initial views count
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
    averageRating: 4.5,
    totalReviews: 2,
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
    averageRating: 4.6,
    totalReviews: 1,
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
    averageRating: 4.0,
    totalReviews: 1,
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
    averageRating: 4.7,
    totalReviews: 1,
    views: 115
  }
];

const initialReviews = [
  {
    id: 'r1',
    workplaceId: 'w1',
    userName: 'สมศักดิ์ รักเรียน',
    userEmail: 'somsak.r@htc.ac.th',
    userPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'เทคโนโลยีสารสนเทศ',
    year: '2568',
    position: 'Web Developer Intern',
    rating: 5,
    comments: 'ได้รับประสบการณ์ที่ดีมากๆ ครับ พี่ๆ คอยสอนงานตลอด ได้ทำงานกับโปรเจกต์จริง ใช้ React และ Tailwind CSS ครับ สังคมดีเป็นกันเองมาก แนะนำให้มาทำที่นี่เลยครับ',
    allowance: 250,
    photos: [
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80'
    ],
    date: '2026-03-15T09:00:00.000Z'
  },
  {
    id: 'r2',
    workplaceId: 'w1',
    userName: 'มุกดา รัตนพร',
    userEmail: 'mookda.r@htc.ac.th',
    userPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: 'เทคโนโลยีสารสนเทศ',
    year: '2568',
    position: 'QA / Tester Intern',
    rating: 4,
    comments: 'สอนระบบการเทสงานเป็นระบบดีมาก มีเอกสารคู่มือครบถ้วน พี่ๆ คอยเทรนให้อย่างใจเย็น ได้ทำงานใกล้ชิดกับโปรเจกต์เมเนเจอร์ มีบอร์ดเกมให้เล่นคลายเครียดตอนเย็นด้วยค่ะ',
    allowance: 200,
    photos: [],
    date: '2026-04-10T14:30:00.000Z'
  },
  {
    id: 'r3',
    workplaceId: 'w2',
    userName: 'กิตติพงษ์ สุวรรณ',
    userEmail: 'kittipong.s@htc.ac.th',
    userPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'การบัญชี',
    year: '2568',
    position: 'ผู้ช่วยงานตรวจสอบเอกสาร',
    rating: 4,
    comments: 'งานส่วนใหญ่เน้นความละเอียดเรียบร้อยของเอกสารภาษีและการทำธุรกรรมครับ แรกๆ อาจจะยากและเครียดนิดหน่อยเนื่องจากเป็นงานธนาคาร แต่พี่ๆ คอยแนะนำอย่างดี มีระเบียบวินัยดีมาก ได้ฝึกฝนตนเองอย่างมีประสิทธิภาพครับ',
    allowance: 300,
    photos: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=80'
    ],
    date: '2026-03-20T10:15:00.000Z'
  },
  {
    id: 'r4',
    workplaceId: 'w2',
    userName: 'จิราภรณ์ แสงจันทร์',
    userEmail: 'jiraporn.s@htc.ac.th',
    userPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'การบัญชี',
    year: '2567',
    position: 'ธุรการบัญชี',
    rating: 5,
    comments: 'ทำงานเป็นระบบมากค่ะ สังคมที่นี่อบอุ่น ปลอดภัย มีสวัสดิการอาหารกลางวันฟรีบางวัน ได้เจอลูกค้าหลากหลาย ช่วยพัฒนาทักษะด้านการติดต่อสื่อสารได้ดีมากเลยค่ะ',
    allowance: 300,
    photos: [],
    date: '2025-11-12T08:30:00.000Z'
  },
  {
    id: 'r5',
    workplaceId: 'w3',
    userName: 'ธีรเดช นุ่มนวล',
    userEmail: 'teeradech.n@htc.ac.th',
    userPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'ช่างยนต์',
    year: '2568',
    position: 'ช่างเทคนิคซ่อมบำรุง',
    rating: 5,
    comments: 'ได้ลงมือซ่อมจริง สัมผัสเครื่องยนต์ระบบไฮบริดตัวใหม่ด้วยครับ พี่ๆ ช่างชำนาญการเก่งมาก ให้คำแนะนำและเทคนิคดีๆ ตลอดการฝึกงาน มีความสุขและคุ้มค่ามากครับสำหรับคนรักรถ',
    allowance: 150,
    photos: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&auto=format&fit=crop&q=80'
    ],
    date: '2026-02-18T16:00:00.000Z'
  },
  {
    id: 'r6',
    workplaceId: 'w4',
    userName: 'ณัฐพล แก้วมณี',
    userEmail: 'nattapon.k@htc.ac.th',
    userPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'ไฟฟ้ากำลัง',
    year: '2568',
    position: 'ช่างไฟฟ้าสนาม',
    rating: 4,
    comments: 'เป็นการทำงานที่มีระเบียบและเน้นความปลอดภัยมากๆ ได้ขึ้นรถเครนออกซ่อมสายและติดตั้งหม้อแปลงไฟฟ้าจริงๆ ลุยๆ สนุกและตื่นเต้นมากครับ ได้ประสบการณ์ที่หาที่อื่นไม่ได้',
    allowance: 200,
    photos: [],
    date: '2026-01-25T11:00:00.000Z'
  },
  {
    id: 'r7',
    workplaceId: 'w5',
    userName: 'สุภัทรา ชัยชนะ',
    userEmail: 'supatra.c@htc.ac.th',
    userPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'การท่องเที่ยวและการโรงแรม',
    year: '2568',
    position: 'Receptionist / พนักงานต้อนรับ',
    rating: 5,
    comments: 'ได้ฝึกการใช้ภาษาอังกฤษและภาษาจีนกับแขกชาวต่างชาติตลอดเวลาค่ะ พี่ๆ สอนระบบบริหารจัดการหน้าฟรอนต์และการเช็คอิน/เช็คเอาต์อย่างมืออาชีพ ประทับใจมากค่ะ',
    allowance: 250,
    photos: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=80'
    ],
    date: '2026-05-02T13:45:00.000Z'
  }
];

// Initialize localStorage databases if they do not exist
const initDb = () => {
  if (!localStorage.getItem('htc_workplaces')) {
    localStorage.setItem('htc_workplaces', JSON.stringify(initialWorkplaces));
  }
  if (!localStorage.getItem('htc_reviews')) {
    localStorage.setItem('htc_reviews', JSON.stringify(initialReviews));
  }
  if (!localStorage.getItem('htc_total_site_views')) {
    localStorage.setItem('htc_total_site_views', '412'); // Realistic starting visitor count
  }
};

initDb();

// Visitor / Views Count Operations
export const getSiteViews = () => {
  initDb();
  return parseInt(localStorage.getItem('htc_total_site_views') || '0');
};

export const incrementSiteViews = () => {
  initDb();
  const current = getSiteViews();
  const next = current + 1;
  localStorage.setItem('htc_total_site_views', next.toString());
  return next;
};

export const incrementWorkplaceViews = (id) => {
  initDb();
  const workplaces = getWorkplaces();
  const idx = workplaces.findIndex(w => w.id === id);
  if (idx !== -1) {
    const currentViews = workplaces[idx].views || 0;
    workplaces[idx].views = currentViews + 1;
    localStorage.setItem('htc_workplaces', JSON.stringify(workplaces));
    return workplaces[idx];
  }
  return null;
};

// API Database Actions
export const getWorkplaces = () => {
  initDb();
  return JSON.parse(localStorage.getItem('htc_workplaces') || '[]')
    .map(w => ({ ...w, views: w.views || 0 })); // ensure views count exists
};

export const getWorkplaceById = (id) => {
  initDb();
  const list = getWorkplaces();
  return list.find(w => w.id === id) || null;
};

export const addWorkplace = (workplace) => {
  initDb();
  const list = getWorkplaces();
  const newId = 'w_' + Date.now();
  const newWorkplace = {
    ...workplace,
    id: newId,
    averageRating: 0,
    totalReviews: 0,
    views: 1, // Start with 1 view on creation
    lat: parseFloat(workplace.lat) || 7.0084,
    lng: parseFloat(workplace.lng) || 100.4975
  };
  list.push(newWorkplace);
  localStorage.setItem('htc_workplaces', JSON.stringify(list));
  return newWorkplace;
};

export const getReviews = (workplaceId) => {
  initDb();
  const list = JSON.parse(localStorage.getItem('htc_reviews') || '[]');
  return list
    .filter(r => r.workplaceId === workplaceId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addReview = (review) => {
  initDb();
  const reviews = JSON.parse(localStorage.getItem('htc_reviews') || '[]');
  const newId = 'r_' + Date.now();
  const newReview = {
    ...review,
    id: newId,
    rating: parseInt(review.rating) || 5,
    allowance: review.allowance ? parseFloat(review.allowance) : null,
    date: new Date().toISOString()
  };
  reviews.push(newReview);
  localStorage.setItem('htc_reviews', JSON.stringify(reviews));

  // Recalculate average rating and review counts for the workplace
  const workplaces = getWorkplaces();
  const workplaceIdx = workplaces.findIndex(w => w.id === review.workplaceId);
  if (workplaceIdx !== -1) {
    const wpReviews = reviews.filter(r => r.workplaceId === review.workplaceId);
    const total = wpReviews.length;
    const avg = wpReviews.reduce((sum, r) => sum + r.rating, 0) / total;
    
    workplaces[workplaceIdx].totalReviews = total;
    workplaces[workplaceIdx].averageRating = parseFloat(avg.toFixed(1));
    
    localStorage.setItem('htc_workplaces', JSON.stringify(workplaces));
  }
  
  return newReview;
};
