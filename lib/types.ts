// Intermediate type used only inside the two-step DeepSeek pipeline
export interface VideoSummary {
  videoId: string;
  title: string;
  views: number;
  publishedDate: string;
  mainTopic: string;
  keyPoints: string[];
  titlePattern: string;
  hook: string;
  whyItWorks: string;
  audienceProblems: string[];
  beliefs: string[];
}

export interface VideoData {
  videoId: string;
  title: string;
  thumbnail: string;
  views: number;
  publishedDate: string;
  length: string;
  description: string;
  likes: number;
  transcript: string;
}

export interface VideoAnalysis {
  videoId: string;
  title: string;
  views: number;
  publishedDate: string;
  mainTopic: string;
  titlePattern: string;
  whyItWorks: string;
  thumbnail?: string;
}

export interface CreatorAnalysis {
  creatorName: string;
  videosAnalyzed: number;
  totalViews: number;
  averageViews: number;
  engagementRate: string;
  mainNiche: string;
  topContentThemes: string[];
  titlePatterns: string[];
  coreBeliefs: string[];
  audiencePainPoints: string[];
  publishingCadence: string;
  videoAnalysis: VideoAnalysis[];
  strategyReport: string;
}
