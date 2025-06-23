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
}

export interface CreatePollFormProps {
  onCreatePoll: (pollData: { question: string; options: string[] }) => void;
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