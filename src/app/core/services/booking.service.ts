import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {SlotRequest} from '../models/bookings/slot-request.interface';
import {Slot, SlotState} from '../models/bookings/slot.interface';


@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) { }

  getSlots(start: Date, end: Date, state?: SlotState) {
    let url = `api/slots?startDate=${start.toISOString()}&endDate=${end.toISOString()}`;

    if (state) {
      url+=`&state=${state}`;
    }

    return this.http.get<Slot[]>(url);
  }


  createSlot(slot: SlotRequest) {
    return this.http.post(`api/slots`, slot)
  }

  updateSlot(id: number, slot: Partial<SlotRequest>) {
    return this.http.put(`api/slots/${id}`, slot)
  }

  publishSlot(id: number) {
    return this.http.post(`api/slots/${id}/publish`, {})
  }

  deleteOrCancelSlot(id: number) {
    return this.http.delete(`api/slots/${id}`)
  }

  assignStudent(slotId: number, studentId: number) {
    return this.http.post(`api/slots/${slotId}/assign/${studentId}`, {})
  }

  unassignStudent(slotId: number) {
    return this.http.post(`api/slots/${slotId}/unassign`, {})
  }

  reserveSlot(slotId: number) {
    return this.http.post(`api/slots/${slotId}/reserve`, {})
  }

  cancelSlotReservation(slotId: number) {
    return this.http.post(`api/slots/${slotId}/cancel`, {})
  }

}
