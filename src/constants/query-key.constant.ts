export const QUERY_KEY = {
  /** 로그인 하지 않아도 사용 가능 */
  user: 'user',
  posts: 'posts',
  postMembers: 'postMembers',
  userReviews: 'userReviews',

  /** 로그인 후 사용 - auth 붙이기 */
  auth: 'auth',
  profileExists: 'profileExists',
  profile: 'profile',
  profileSettings: 'profileSettings',
  aiPost: 'aiPost',
  postDetail: 'postDetail',

  /** 북마크 관련 */
  myBookmarkedPosts: 'myBookmarkedPosts',
  bookmarkIds: 'bookmarkIds',

  /** 내 참여 내역 관련 */
  myAppliedPosts: 'myAppliedPosts',
  myApplicationDetail: 'myApplicationDetail',
  mySuggestedPosts: 'mySuggestedPosts',
  myMatchedPosts: 'myMatchedPosts',

  /** 내 모집글 관련 */
  myPosts: 'myPosts',
  myPostApplications: 'myPostApplications',
  myPostApplicantDetail: 'myPostApplicantDetail',
  myPostApplicantProfile: 'myPostApplicantProfile',
  myPostRecommendedUsers: 'myPostRecommendedUsers',
  myPostRecommendedApplicants: 'myPostRecommendedApplicants',
  myPostOffers: 'myPostOffers',

  /** 채팅 관련 */
  chatList: 'chatList',
  chatHistory: 'chatHistory',

  /** 알림 관련 */
  notifications: 'notifications',

  /** 리뷰 관련 */
  reviews: 'reviews',
  reviewMembers: 'reviewMembers',
} as const;
