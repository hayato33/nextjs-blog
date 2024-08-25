import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// 記事一覧取得API
export const GET = async (request: NextRequest) => {
  try {
    // Postの一覧をDBから取得
    const posts = await prisma.post.findMany({
      include: {
        // カテゴリーも含めて取得
        postCategories: {
          include: {
            category: {
              // カテゴリーのidとnameだけ取得
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      // 作成日時の降順で取得
      orderBy: {
        createdAt: 'desc',
      },
    });

    // レスポンスを返す
    return NextResponse.json({ status: 'OK', posts: posts }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
