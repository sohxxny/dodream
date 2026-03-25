import { RECOMMEND_TYPE_LABEL } from '@/constants/post.constant';
import type { RecommendType } from '@/types/post.type';

interface RecommendTagsProps {
  labels: RecommendType[];
}

export default function RecommendTags({ labels }: RecommendTagsProps) {
  return (
    <ul className="flex gap-2">
      {labels.map((label) => (
        <RecommendTag key={label} label={label} />
      ))}
    </ul>
  );
}

interface RecommendTagProps {
  label: RecommendType;
}

/**
 * AI 추천 게시글 타입
 * @param label - 추천 이유 타입
 */
function RecommendTag({ label }: RecommendTagProps) {
  return (
    <li className="text-brand bg-button-ai body-sm-medium py-1 px-3 rounded-md">
      {RECOMMEND_TYPE_LABEL[label]}
    </li>
  );
}
