'use server';

import Event from '@/database/event.model';
import connectDB from "@/lib/mongodb";

export const getEvents = async () => {
    try {
        await connectDB();
        const events = await Event.find().sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(events));
    } catch (e) {
        console.error('getEvents failed', e);
        return [];
    }
}

export const getEventBySlug = async (slug: string) => {
    try {
        await connectDB();
        const event = await Event.findOne({ slug }).lean();
        return event ? JSON.parse(JSON.stringify(event)) : null;
    } catch (e) {
        console.error('getEventBySlug failed', e);
        return null;
    }
}

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectDB();
        const event = await Event.findOne({ slug });

        if (!event) return [];

        const similar = await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } }).lean();
        return JSON.parse(JSON.stringify(similar));
    } catch {
        return [];
    }
}
