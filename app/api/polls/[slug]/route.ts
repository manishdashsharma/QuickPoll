import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import Poll, { IVoter } from '@/models/Poll';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();

    const resolvedParams = await params;
    const { slug } = resolvedParams;

    const poll = await Poll.findOne({ slug }).lean();
    
    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }

    const { userId } = await auth();
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    const hasUserVoted = poll.voters.some((voter: IVoter) => 
      (userId && voter.userId === userId) || 
      (!userId && voter.ip === ip)
    );

    return NextResponse.json({
      success: true,
      poll: {
        id: poll._id,
        question: poll.question,
        options: poll.options,
        slug: poll.slug,
        isActive: poll.isActive,
        totalVotes: poll.totalVotes,
        showResults: poll.settings.showResults,
        createdAt: poll.createdAt,
        hasUserVoted
      }
    });

  } catch (error) {
    console.error('Get poll error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const { slug } = resolvedParams;

    await dbConnect();

    const poll = await Poll.findOne({ slug });
    
    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }

    if (poll.createdBy !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { isActive } = await request.json();

    if (typeof isActive === 'boolean') {
      poll.isActive = isActive;
      await poll.save();
    }

    return NextResponse.json({
      success: true,
      poll: {
        id: poll._id,
        question: poll.question,
        options: poll.options,
        slug: poll.slug,
        isActive: poll.isActive,
        totalVotes: poll.totalVotes,
        createdAt: poll.createdAt
      }
    });

  } catch (error) {
    console.error('Update poll error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const { slug } = resolvedParams;

    await dbConnect();

    const poll = await Poll.findOne({ slug });
    
    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }

    if (poll.createdBy !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await Poll.findByIdAndDelete(poll._id);

    return NextResponse.json({
      success: true,
      message: 'Poll deleted successfully'
    });

  } catch (error) {
    console.error('Delete poll error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}