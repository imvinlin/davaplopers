import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TripService } from '../services/trip.service';

interface Message { role: 'user' | 'assistant'; text: string; }

@Component({
  selector: 'app-chat',
  imports: [FormsModule, NgFor, NgIf, RouterLink, RouterLinkActive],
  templateUrl: './chat.html',
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  input = '';
  loading = false;
  tripId: number | null = null;

  constructor(private http: HttpClient, private tripSvc: TripService) {}

  ngOnInit() {
    this.tripSvc.getOrCreateTrip().subscribe({
      next: (id) => { this.tripId = id; },
      error: () => {},
    });
  }

  send() {
    const text = this.input.trim();
    if (!text || this.loading) return;
    this.messages.push({ role: 'user', text });
    this.input = '';
    this.loading = true;
    this.http.post<{ message: string }>('http://localhost:8000/api/chat', { message: text, trip_id: this.tripId }).subscribe({
      next: (res) => { this.messages.push({ role: 'assistant', text: res.message }); this.loading = false; },
      error: () => { this.messages.push({ role: 'assistant', text: 'Something went wrong.' }); this.loading = false; },
    });
  }
}