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
