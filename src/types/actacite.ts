export interface Evidence {
  exact_quote: string;
  page_reference: string;
}

export interface ExtractedTask {
  id: string;
  task_description: string;
  deadline: string | null;
  eligibility: string;
  required_documents: string[];
  evidence: Evidence;
  needs_review: boolean;
  review_reason: string | null;

  // Interactive student states
  completed?: boolean;
  userNotes?: string;
  resolvedDeadline?: string;
}

export interface ActaCiteResult {
  notice_title: string;
  extracted_tasks: ExtractedTask[];
  source_text?: string;
  extracted_at?: string;
}

export interface PresetNotice {
  id: string;
  title: string;
  category: 'Exams & Fees' | 'Scholarships' | 'Internships & NOC' | 'Hostel & Housing' | 'Convocation';
  institution: string;
  circularNo: string;
  date: string;
  summary: string;
  rawText: string;
  precomputed: {
    notice_title: string;
    extracted_tasks: Omit<ExtractedTask, 'id'>[];
  };
}
