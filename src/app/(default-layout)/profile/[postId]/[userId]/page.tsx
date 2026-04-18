import ProfileContent from '@/components/features/profile/profile-content';
import { serverApis } from '@/services/server.api';

interface ApplicantProfilePageProps {
  params: Promise<{
    userId: string;
    postId: string;
  }>;
}

export default async function ApplicantProfilePage({
  params,
}: ApplicantProfilePageProps) {
  const { userId, postId } = await params;

  const profile = await serverApis.profile.getMyPostApplicantProfile(
    BigInt(postId),
    BigInt(userId),
  );

  return (
    <ProfileContent
      userId={BigInt(userId)}
      nickname={profile.nickname}
      profileImage={profile.profileImageCode}
      role={profile.roles[0].name}
      experience={profile.experience}
      introText={profile.introText}
      interests={profile.interestKeywords}
      activityMode={profile.activityMode}
      profileUrls={profile.profileUrls}
      techSkills={profile.techSkills.map((stack) => stack.name)}
    />
  );
}
