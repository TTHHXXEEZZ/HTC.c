"use server";
import { prisma } from "../services/db";
import { revalidatePath } from "next/cache";

export async function addWorkplaceAction(data) {
  const wp = await prisma.workplace.create({
    data: {
      name: data.name,
      category: data.category,
      description: data.description,
      address: data.address,
      website: data.website || "",
      phone: data.phone || "",
      department: data.department,
      lat: parseFloat(data.lat) || 7.0084,
      lng: parseFloat(data.lng) || 100.4975,
      coverImage: data.coverImage || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
      views: 0
    }
  });
  revalidatePath("/");
  revalidatePath("/dashboard");
  return JSON.parse(JSON.stringify(wp));
}

export async function addReviewAction(data) {
  const review = await prisma.review.create({
    data: {
      workplaceId: data.workplaceId,
      reviewerName: data.reviewerName,
      reviewerDept: data.reviewerDept,
      rating: parseInt(data.rating) || 5,
      content: data.content
    }
  });
  revalidatePath(`/workplace/${data.workplaceId}`);
  revalidatePath("/dashboard");
  revalidatePath("/");
  return JSON.parse(JSON.stringify(review));
}

export async function incrementWorkplaceViewsAction(id) {
  await prisma.workplace.update({
    where: { id },
    data: { views: { increment: 1 } }
  });
  revalidatePath(`/workplace/${id}`);
  revalidatePath("/dashboard");
  revalidatePath("/");
}

// 1. Voting system for reviews
export async function voteReviewAction(reviewId, voteType) {
  const updateData = {};
  if (voteType === "agree") {
    updateData.agreeCount = { increment: 1 };
  } else if (voteType === "disagree") {
    updateData.disagreeCount = { increment: 1 };
  } else {
    throw new Error("Invalid vote type");
  }

  const review = await prisma.review.update({
    where: { id: reviewId },
    data: updateData
  });

  revalidatePath(`/workplace/${review.workplaceId}`);
  return JSON.parse(JSON.stringify(review));
}

// 2. Internship Job Announcements
export async function addInternshipJobAction(data) {
  const job = await prisma.internshipJob.create({
    data: {
      title: data.title,
      companyName: data.companyName,
      description: data.description,
      requirements: data.requirements,
      contact: data.contact,
      department: data.department,
      salary: data.salary || ""
    }
  });
  revalidatePath("/jobs");
  return JSON.parse(JSON.stringify(job));
}

export async function deleteInternshipJobAction(id) {
  await prisma.internshipJob.delete({ where: { id } });
  revalidatePath("/jobs");
}

// 3. Student Profile Directories
export async function addStudentProfileAction(data) {
  const profile = await prisma.studentProfile.upsert({
    where: { email: data.email },
    update: {
      name: data.name,
      department: data.department,
      bio: data.bio,
      skills: data.skills,
      portfolioUrl: data.portfolioUrl || "",
      contact: data.contact,
      certificateImage: data.certificateImage || ""
    },
    create: {
      name: data.name,
      email: data.email,
      department: data.department,
      bio: data.bio,
      skills: data.skills,
      portfolioUrl: data.portfolioUrl || "",
      contact: data.contact,
      certificateImage: data.certificateImage || ""
    }
  });
  revalidatePath("/interns");
  return JSON.parse(JSON.stringify(profile));
}

export async function deleteStudentProfileAction(id) {
  await prisma.studentProfile.delete({ where: { id } });
  revalidatePath("/interns");
}

// 4. Admin Management Controls
export async function deleteWorkplaceAction(id) {
  await prisma.workplace.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/dashboard");
}

export async function deleteReviewAction(id) {
  const review = await prisma.review.delete({ where: { id } });
  revalidatePath(`/workplace/${review.workplaceId}`);
}

export async function approveWorkplaceAction(id) {
  await prisma.workplace.update({
    where: { id },
    data: { approved: true }
  });
  revalidatePath("/");
  revalidatePath("/dashboard");
}

export async function approveReviewAction(id) {
  const review = await prisma.review.update({
    where: { id },
    data: { approved: true }
  });
  revalidatePath(`/workplace/${review.workplaceId}`);
}

export async function addAdminEmailAction(email) {
  const admin = await prisma.adminEmail.create({
    data: { email }
  });
  return JSON.parse(JSON.stringify(admin));
}

export async function deleteAdminEmailAction(id) {
  await prisma.adminEmail.delete({ where: { id } });
}

export async function checkIsAdminAction(email) {
  if (!email) return false;
  if (email === "67219010003@htc.ac.th") return true;
  const match = await prisma.adminEmail.findUnique({
    where: { email }
  });
  return !!match;
}

// Keyless Google Maps POI geocoding/search proxy
export async function searchGoogleMapsPlacesAction(query) {
  if (!query || !query.trim()) return [];
  
  let queryTerm = query.trim();
  // Bias: Append "หาดใหญ่" if search term does not contain local keywords
  if (!queryTerm.includes('หาดใหญ่') && !queryTerm.includes('สงขลา') && !queryTerm.includes('ไทย') && !queryTerm.includes('thailand')) {
    queryTerm = `${queryTerm} หาดใหญ่`;
  }
  
  try {
    const url = `https://www.google.com/search?tbm=map&hl=th&gl=th&q=${encodeURIComponent(queryTerm)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from Google Search: ${response.status}`);
    }
    
    const text = await response.text();
    let jsonText = text.trim();
    if (jsonText.startsWith(")]}'")) {
      jsonText = jsonText.substring(4).trim();
    }
    
    const data = JSON.parse(jsonText);
    const results = [];
    
    function traverse(obj) {
      if (!obj || typeof obj !== 'object') return;
      
      if (Array.isArray(obj)) {
        let lat = null, lng = null;
        
        for (const child of obj) {
          if (Array.isArray(child) && child.length === 4 && child[0] === null && child[1] === null && typeof child[2] === 'number' && typeof child[3] === 'number') {
            lat = child[2];
            lng = child[3];
          }
        }
        
        if (lat !== null && lng !== null) {
          // Collect all strings recursively inside this candidate container for phone and website ONLY
          const allStrings = [];
          function collectStrings(item) {
            if (typeof item === 'string') {
              allStrings.push(item);
            } else if (Array.isArray(item)) {
              for (const child of item) {
                collectStrings(child);
              }
            } else if (item && typeof item === 'object') {
              for (const k in item) {
                collectStrings(item[k]);
              }
            }
          }
          collectStrings(obj);
          
          let name = null;
          let address = null;
          let website = '';
          let phone = '';
          
          // 1. Parse name and address from IMMEDIATE children ONLY to prevent capturing UI/action phrases
          for (const child of obj) {
            if (typeof child === 'string' && child.length > 2) {
              const isHash = /^[A-Za-z0-9_-]+$/.test(child) && child.length > 10;
              
              if ((child.includes('ถ.') || child.includes('ต.') || child.includes('อ.') || child.includes('สงขลา') || child.includes('หาดใหญ่') || child.includes('คอหงส์') || child.includes('90110')) && !child.includes('http') && !child.includes('google.com')) {
                if (!address || child.length > address.length) {
                  address = child;
                }
              } else if (!isHash && !child.startsWith('0x') && !child.includes('/') && !child.includes('http') && child.length < 150) {
                if (!name || child.length > name.length) {
                  name = child;
                }
              }
            }
          }
          
          // 2. Parse website and phone from RECURSIVELY collected strings
          for (const str of allStrings) {
            const trimmed = str.trim();
            if (trimmed.length <= 2) continue;
            
            const isGoogleDomain = trimmed.includes('google.com') || trimmed.includes('googleusercontent') || trimmed.includes('ggpht.com') || trimmed.includes('gstatic.com') || trimmed.includes('schema.org');
            const isImage = trimmed.match(/\.(jpg|jpeg|png|gif|webp|svg)/i);
            
            if ((trimmed.startsWith('http://') || trimmed.startsWith('https://')) && !isGoogleDomain && !isImage) {
              website = trimmed;
            } else if ((trimmed.includes('.com') || trimmed.includes('.co.th') || trimmed.includes('.net') || trimmed.includes('.org')) && !trimmed.includes('@') && !trimmed.includes(' ') && !isGoogleDomain && !isImage && !website) {
              website = trimmed;
            }
            
            if (/^(\+66|0)[0-9\s-]{7,15}$/.test(trimmed)) {
              phone = trimmed;
            }
          }
          
          if (name) {
            results.push({ 
              name, 
              lat, 
              lng, 
              address: address || name,
              website: website || '',
              phone: phone || ''
            });
          }
        }
        
        for (const child of obj) {
          traverse(child);
        }
      } else {
        for (const key in obj) {
          traverse(obj[key]);
        }
      }
    }
    
    traverse(data);
    
    const uniqueResults = [];
    const seen = new Set();
    for (const r of results) {
      const key = `${r.lat.toFixed(5)},${r.lng.toFixed(5)}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueResults.push(r);
      }
    }
    
    return uniqueResults;
  } catch (err) {
    console.error("Error in searchGoogleMapsPlacesAction:", err);
    return [];
  }
}


