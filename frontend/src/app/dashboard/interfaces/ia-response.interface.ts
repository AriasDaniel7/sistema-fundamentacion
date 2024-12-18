export interface IaResponse {
  response: Response;
}

export interface Response {
  candidates:    Candidate[];
  usageMetadata: UsageMetadata;
  modelVersion:  string;
}

export interface Candidate {
  content:       Content;
  finishReason:  string;
  safetyRatings: SafetyRating[];
  avgLogprobs:   number;
}

export interface Content {
  parts: Part[];
  role:  string;
}

export interface Part {
  text: string;
}

export interface SafetyRating {
  category:    string;
  probability: string;
}

export interface UsageMetadata {
  promptTokenCount:     number;
  candidatesTokenCount: number;
  totalTokenCount:      number;
}
