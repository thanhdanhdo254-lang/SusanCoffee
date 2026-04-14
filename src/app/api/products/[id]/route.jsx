import clientPromise from "@/libs/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// Hàm hỗ trợ kết nối DB để tránh lặp code
async function getDb() {
  const client = await clientPromise;
  return client.db("Susan-Coffee");
}

export async function GET(request, { params }) {
  try {
    const { id } = await params; // Bắt buộc await params
    const db = await getDb();
    if (!ObjectId.isValid(id)) return NextResponse.json({ error: "ID sai" }, { status: 400 });

    const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
    return product ? NextResponse.json(product) : NextResponse.json({ error: "Không thấy" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = await getDb();

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: { name: body.name, price: Number(body.price), status: body.status } }
    );

    return result.matchedCount > 0 
      ? NextResponse.json({ status: "success" }) 
      : NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount > 0 
      ? NextResponse.json({ status: "success" }) 
      : NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}