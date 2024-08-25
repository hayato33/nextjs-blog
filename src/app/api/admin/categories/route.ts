import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// 管理者_カテゴリー一覧取得API
export const GET = async (request: NextRequest) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ status: 'OK', categories: categories }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};

// カテゴリー作成のリクエストボディの型
interface CreateCategoryRequestBody {
  name: string;
}

// 管理者_カテゴリー新規作成API
export const POST = async (request: NextRequest) => {
  try {
    // リクエストのbodyを取得
    const body: CreateCategoryRequestBody = await request.json();

    // bodyの中からnameを取り出す
    const { name } = body;

    // カテゴリーをDBに生成
    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    });

    // レスポンスを返す
    return NextResponse.json(
      {
        status: 'OK',
        message: 'カテゴリーを作成しました',
        category: newCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
