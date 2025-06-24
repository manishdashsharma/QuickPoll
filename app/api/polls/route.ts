import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import Poll from '@/models/Poll';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { question, options } = await request.json();

    if (!question || !options || !Array.isArray(options)) {
      return NextResponse.json(
        { error: 'Question and options are required' },
        { status: 400 }
      );
    }

    if (question.trim().length === 0) {
      return NextResponse.json(
        { error: 'Question cannot be empty' },
        { status: 400 }
      );
    }

    if (question.trim().length > 500) {
      return NextResponse.json(
        { error: 'Question must be less than 500 characters' },
        { status: 400 }
      );
    }

    const validOptions = options
    .filter((option): option is string => typeof option === 'string' && option.trim().length > 0);

    if (validOptions.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 options are required' },
        { status: 400 }
      );
    }

    if (validOptions.length > 6) {
      return NextResponse.json(
        { error: 'Maximum 6 options allowed' },
        { status: 400 }
      );
    }

    if (validOptions.some((option: string) => option.trim().length > 200)) {
      return NextResponse.json(
        { error: 'Each option must be less than 200 characters' },
        { status: 400 }
      );
    }

    const pollData = {
      question: question.trim(),
      options: validOptions.map((option: string) => ({
        text: option.trim(),
        votes: 0
      })),
      createdBy: userId,
      isActive: true,
      totalVotes: 0
    };

    const poll = new Poll(pollData);
    poll.slug = poll.generateSlug();
    
    let slugExists = await Poll.findOne({ slug: poll.slug });
    let attempts = 0;
    
    while (slugExists && attempts < 5) {
      poll.slug = poll.generateSlug();
      slugExists = await Poll.findOne({ slug: poll.slug });
      attempts++;
    }

    if (slugExists) {
      return NextResponse.json(
        { error: 'Unable to generate unique poll URL. Please try again.' },
        { status: 500 }
      );
    }

    await poll.save();

    return NextResponse.json({
      success: true,
      poll: {
        id: poll._id,
        question: poll.question,
        options: poll.options,
        slug: poll.slug,
        url: poll.url,
        isActive: poll.isActive,
        totalVotes: poll.totalVotes,
        createdAt: poll.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Create poll error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const polls = await Poll.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Poll.countDocuments({ createdBy: userId });

    return NextResponse.json({
      success: true,
      polls: polls.map(poll => ({
        id: poll._id,
        question: poll.question,
        options: poll.options,
        slug: poll.slug,
        url: `${process.env.NEXT_PUBLIC_URL}/${poll.slug}`,
        isActive: poll.isActive,
        totalVotes: poll.totalVotes,
        createdAt: poll.createdAt
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get polls error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}