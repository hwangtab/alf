import { NextResponse } from 'next/server';
import activitiesData from '@/data/activities.json';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    total: activitiesData.length,
    activities: activitiesData,
  });
}
