import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IPollOption {
  _id?: mongoose.Types.ObjectId;
  text: string;
  votes: number;
}

export interface IVoter {
  userId?: string;
  ip?: string;
  votedAt: Date;
  optionId: mongoose.Types.ObjectId;
}

export interface IPollSettings {
  allowMultipleVotes: boolean;
  requireAuth: boolean;
  showResults: boolean;
}

export interface IPoll extends Document {
  question: string;
  options: IPollOption[];
  slug: string;
  createdBy: string;
  isActive: boolean;
  totalVotes: number;
  settings: IPollSettings;
  voters: IVoter[];
  createdAt: Date;
  updatedAt: Date;
  url: string;
  generateSlug(): string;
  vote(optionId: string, userId?: string, ip?: string): Promise<IPoll>;
}

const PollOptionSchema = new Schema<IPollOption>({
  text: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  votes: {
    type: Number,
    default: 0,
    min: 0
  }
});

const VoterSchema = new Schema<IVoter>({
  userId: {
    type: String,
    required: false
  },
  ip: {
    type: String,
    required: false
  },
  votedAt: {
    type: Date,
    default: Date.now
  },
  optionId: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

const PollSettingsSchema = new Schema<IPollSettings>({
  allowMultipleVotes: {
    type: Boolean,
    default: false
  },
  requireAuth: {
    type: Boolean,
    default: false
  },
  showResults: {
    type: Boolean,
    default: true
  }
});

const PollSchema = new Schema<IPoll>({
  question: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500
  },
  options: [PollOptionSchema],
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  createdBy: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalVotes: {
    type: Number,
    default: 0,
    min: 0
  },
  settings: {
    type: PollSettingsSchema,
    default: () => ({
      allowMultipleVotes: false,
      requireAuth: false,
      showResults: true
    })
  },
  voters: [VoterSchema]
}, {
  timestamps: true
});

PollSchema.index({ createdBy: 1, createdAt: -1 });
PollSchema.index({ isActive: 1 });

PollSchema.virtual('url').get(function(this: IPoll) {
  return `${process.env.NEXT_PUBLIC_URL}/${this.slug}`;
});

PollSchema.methods.generateSlug = function(this: IPoll): string {
  const baseSlug = this.question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
  
  return `${baseSlug}-${Date.now()}`;
};

PollSchema.methods.vote = async function(
  this: IPoll, 
  optionId: string, 
  userId?: string, 
  ip?: string
): Promise<IPoll> {
  if (!this.settings.allowMultipleVotes) {
    const hasVoted = this.voters.some((voter: IVoter) => 
      voter.userId === userId || voter.ip === ip
    );
    if (hasVoted) {
      throw new Error('User has already voted');
    }
  }

  const option = this.options.find(opt => opt._id?.toString() === optionId);
  if (!option) {
    throw new Error('Option not found');
  }

  option.votes += 1;
  this.totalVotes += 1;
  
  this.voters.push({
    userId,
    ip,
    optionId: new mongoose.Types.ObjectId(optionId),
    votedAt: new Date()
  });

  return this.save();
};

const Poll: Model<IPoll> = mongoose.models.Poll || mongoose.model<IPoll>('Poll', PollSchema);

export default Poll;