import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import Poll, { IVoter } from '@/models/Poll';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();

    const resolvedParams = await params;
    const { slug } = resolvedParams;

    const poll = await Poll.findOne({ slug });
    
    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }

    if (!poll.isActive) {
      return NextResponse.json(
        { error: 'This poll is no longer active' },
        { status: 400 }
      );
    }

    const { optionId } = await request.json();

    if (!optionId) {
      return NextResponse.json(
        { error: 'Option ID is required' },
        { status: 400 }
      );
    }

    const { userId } = await auth();
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    const option = poll.options.find(opt => opt._id?.toString() === optionId);
    if (!option) {
      return NextResponse.json(
        { error: 'Invalid option selected' },
        { status: 400 }
      );
    }

    if (!poll.settings.allowMultipleVotes) {
      const hasVoted = poll.voters.some((voter: IVoter) => 
        (userId && voter.userId === userId) || 
        (!userId && voter.ip === ip)
      );
      
      if (hasVoted) {
        return NextResponse.json(
          { error: 'You have already voted on this poll' },
          { status: 400 }
        );
      }
    }

    option.votes += 1;
    poll.totalVotes += 1;
    
    poll.voters.push({
      userId: userId || undefined,
      ip: userId ? undefined : ip,
      optionId,
      votedAt: new Date()
    });

    await poll.save();

    return NextResponse.json({
      success: true,
      message: 'Vote recorded successfully',
      poll: {
        id: poll._id,
        question: poll.question,
        options: poll.options,
        totalVotes: poll.totalVotes,
        hasUserVoted: true
      }
    });

  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}