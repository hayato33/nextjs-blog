import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

const prisma = new PrismaClient();

// 管理者_記事一覧取得API
export const GET = async (request: NextRequest) => {
  const token = request.headers.get('Authorization') ?? '';

  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error) return NextResponse.json({ status: error.message }, { status: 400 });

  // tokenが正しい場合、以降が実行される
  try {
    // 以下はこれまで通り
    const posts = await prisma.post.findMany({
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ status: 'OK', posts: posts }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

// 記事作成のリクエストボディの型
interface CreatePostRequestBody {
  title: string;
  content: string;
  categories: { id: number }[];
  thumbnailUrl: string;
}

// 管理者_記事新規作成API
export const POST = async (request: Request, context: any) => {
  const token = request.headers.get('Authorization') ?? '';
  const { error } = await supabase.auth.getUser(token);
  if (error) return NextResponse.json({ status: error.message }, { status: 400 });

  try {
    // リクエストのbodyを取得
    const body = await request.json();

    // bodyの中からtitle, content, categories, thumbnailUrlを取り出す
    const { title, content, categories, thumbnailUrl }: CreatePostRequestBody = body;

    // 投稿をDBに生成
    const data = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailUrl,
      },
    });

    // 記事とカテゴリーの中間テーブルのレコードをDBに生成
    // 本来複数同時生成には、createManyというメソッドがあるが、sqliteではcreateManyが使えないので、for文1つずつ実施
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          categoryId: category.id,
          postId: data.id,
        },
      });
    }

    // レスポンスを返す
    return NextResponse.json({
      status: 'OK',
      message: '作成しました',
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
