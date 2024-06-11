import mongoose from 'mongoose';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventModel, { IEvent } from './models/Event';
import { SortOrder } from 'mongoose';

class EventService {

  async getEventById(id: string): Promise<IEvent | null> {
    return await EventModel.findById(id).exec();
  }

  async getEvents(page: number, limit: number, sortBy: string, sortDirection: string): Promise<{ events: IEvent[], totalPages: number, currentPage: number }> {
    const sortOption: { [key: string]: SortOrder } = { [sortBy]: sortDirection === 'desc' ? -1 : 1 };
    const events = await EventModel.find()
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const totalEvents = await EventModel.countDocuments().exec();
    return {
      events,
      totalPages: Math.ceil(totalEvents / limit),
      currentPage: page
    };
  }

  async createEvent(createEventDto: CreateEventDto): Promise<IEvent> {
    const { name, description, date, location, duration } = createEventDto;
    const newEvent = new EventModel({
      name,
      description,
      date: new Date(date),
      location,
      duration
    });

    await newEvent.save();
    return newEvent;
  }
}

export default EventService;
