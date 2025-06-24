import { IPoll, IPollOption, IVoter, IPollSettings } from '@/models/Poll';

export type { IPoll, IPollOption, IVoter, IPollSettings };

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  isActive: boolean;
  createdAt: Date;
  slug: string;
  url?: string;
  settings?: {
    allowMultipleVotes: boolean;
    requireAuth: boolean;
    showResults: boolean;
  };
  hasUserVoted?: boolean;
}

export interface CreatePollFormData {
  question: string;
  options: string[];
}

export interface CreatePollFormProps {
  onCreatePoll: (pollData: CreatePollFormData) => void;
  onCancel: () => void;
}

export interface PollPreviewProps {
  poll: Poll;
  onBack: () => void;
}

export interface PollsListProps {
  polls: Poll[];
  onPreviewPoll: (poll: Poll) => void;
}

export interface CreatePollRequest {
  question: string;
  options: string[];
}

export interface CreatePollResponse {
  success: boolean;
  poll: {
    id: string;
    question: string;
    options: IPollOption[];
    slug: string;
    url: string;
    isActive: boolean;
    totalVotes: number;
    createdAt: string;
  };
}

export interface ApiPollData {
  id: string;
  question: string;
  options: IPollOption[];
  slug: string;
  url?: string;
  isActive: boolean;
  totalVotes: number;
  createdAt: string;
}

export interface GetPollsResponse {
  success: boolean;
  polls: ApiPollData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface VoteRequest {
  optionId: string;
}

export interface VoteResponse {
  success: boolean;
  message: string;
  poll: {
    id: string;
    question: string;
    options: IPollOption[];
    totalVotes: number;
    hasUserVoted: boolean;
  };
}

export interface GetPollResponse {
  success: boolean;
  poll: {
    id: string;
    question: string;
    options: IPollOption[];
    slug: string;
    isActive: boolean;
    totalVotes: number;
    showResults: boolean;
    createdAt: string;
    hasUserVoted: boolean;
  };
}

export interface ApiError {
  error: string;
}

export type DashboardView = 'overview' | 'create' | 'preview';

declare global {
  var mongoose: {
    conn: typeof import('mongoose') | null;
    promise: Promise<typeof import('mongoose')> | null;
  };
}
