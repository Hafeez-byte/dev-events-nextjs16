import {NextRequest, NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import {IEvent} from "@/database";
import {Event} from  "@/database"

type RouteParams = {
    params: Promise<{
    slug: string,
    }>;
};

/* GET /api/[slug]
fetches a single events by its slug
 */
export async function GET(
    req: NextRequest,
    {params}: RouteParams
): Promise<NextResponse> {
    try {
        await connectDB();
        const {slug} = await params;

        if (!slug || typeof slug !== 'string' || slug.trim() === '') {
            return NextResponse.json(
                {message: 'Invalid or missing slug parameter'},
                {status: 400}
            );
        }
        const sanitizedSlug = slug.trim().toLowerCase();

        const event: IEvent | null = await Event.findOne({slug: sanitizedSlug}).lean();

        if (!event) {
            return NextResponse.json(
                {message: `Event with slug '${sanitizedSlug}' not found`},
                {status: 404}
            );
        }
        return NextResponse.json(
            {message: 'Event fetched successfully ' , event},
            {status: 200}
        );
    } catch (error) {
        // Log error for debugging (only in development)
        if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching events by slug:', error);
        }

        // Handle specific error types
        if (error instanceof Error) {
            // Handle database connection errors
            if (error.message.includes('MONGODB_URI')) {
                return NextResponse.json(
                    {message: 'Database configuration error'},
                    {status: 500}
                );
            }

            // Return generic error with error message
            return NextResponse.json(
                {message: 'Failed to fetch events', error: error.message},
                {status: 500}
            );
        }
        return NextResponse.json(
            {message: 'An unexpected error occured'},
            {status: 500}
        );
    }
}