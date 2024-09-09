import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// 記事詳細取得API
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } } // ここでリクエストパラメータを受け取る
) => {
  // paramsの中にidが入っているので、それを取り出す
  const { id } = params;

  try {
    // idを元にPostをDBから取得
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
      // カテゴリーも含めて取得
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                // カテゴリーのidとnameだけ取得
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    if (!post) return NextResponse.json({ status: 'Not Found' }, { status: 404 });

    // レスポンスを返す
    return NextResponse.json({ status: 'OK', post: post }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
