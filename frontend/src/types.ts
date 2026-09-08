export type PolicyClassification =
  | "ANSWERED"
  | "NOT_COVERED"
  | "CONFLICT";

export interface EvidenceItem {
  text: string;
  source: string;
  section: string;
  page: number | string | null;
  score: number;
}

export interface AskRequest {
  question: string;
}

export interface AskResponse {
  question: string;
  classification: PolicyClassification;
  reason: string;
  supporting_evidence: number[];
  evidence: EvidenceItem[];
}

export interface QueryRecord {
  id: string;
  timestamp: number;
  question: string;
  classification: PolicyClassification;
  response: AskResponse;
}

export type BackendConnectionStatus =
  | "checking"
  | "connected"
  | "unreachable";