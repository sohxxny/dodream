import { mockUser } from '@/mocks/data/user';

export async function GET() {
  return Response.json(mockUser);
}
