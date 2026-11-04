import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { wallService } from "@/services/wall.service";
import type { WallDraft, WallKind } from "@/types";

export const wallKeys = {
  all: ["wall"] as const,
  list: (kind?: WallKind) => [...wallKeys.all, "list", kind ?? "todos"] as const,
  comments: (id: string) => [...wallKeys.all, "comments", id] as const,
};

export const useWall = (kind?: WallKind) =>
  useQuery({
    queryKey: wallKeys.list(kind),
    queryFn: () => wallService.list(kind),
  });

export const useWallComments = (id: string, enabled: boolean) =>
  useQuery({
    queryKey: wallKeys.comments(id),
    queryFn: () => wallService.comments(id),
    enabled,
  });

export const usePublishWall = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: WallDraft) => wallService.publish(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: wallKeys.all });
    },
  });
};

export const useSupportWall = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => wallService.support(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: wallKeys.all });
    },
  });
};

export const useCommentWall = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: string }) => wallService.comment(id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: wallKeys.all });
    },
  });
};
