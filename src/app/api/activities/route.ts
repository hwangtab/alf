import { NextResponse } from 'next/server';
import activitiesData from '@/data/activities.json';

export const revalidate = 3600;

export async function GET() {
  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    total: activitiesData.length,
    activities: activitiesData,
  });
}
