import { clone, respond } from "./api-client";
import { CONVERSATIONS } from "@/data/conversations.mock";
import type { Conversation, ConversationStatus, ReportCategoryId } from "@/types";

export interface ConversationFilters {
  categories?: ReportCategoryId[];
  status?: ConversationStatus[];
  query?: string;
}

const matches = (conversation: Conversation, filters: ConversationFilters = {}) => {
  const { categories, status, query } = filters;
  if (categories?.length && !categories.includes(conversation.category)) return false;
  if (status?.length && !status.includes(conversation.status)) return false;
  if (query) {
    const haystack = `${conversation.question} ${conversation.summary} ${conversation.barrios.join(" ")}`.toLowerCase();
    if (!haystack.includes(query.toLowerCase())) return false;
  }
  return true;
};

export const conversationsService = {
  async list(filters?: ConversationFilters): Promise<Conversation[]> {
    return respond(() =>
      clone(CONVERSATIONS.filter((conversation) => matches(conversation, filters))),
    );
  },

  async listTrending(limit = 4): Promise<Conversation[]> {
    return respond(() =>
      clone(
        [...CONVERSATIONS]
          .sort((a, b) => b.participants - a.participants)
          .slice(0, limit),
      ),
    );
  },

  async getById(id: string): Promise<Conversation | null> {
    return respond(() => {
      const conversation = CONVERSATIONS.find((item) => item.id === id);
      return conversation ? clone(conversation) : null;
    });
  },
};
