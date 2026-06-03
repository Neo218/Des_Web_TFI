import { Component, OnInit } from '@angular/core';
import { ClientsService } from './clients.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
})
export class ClientsComponent implements OnInit {

  clients: any[] = [];

  constructor(private service: ClientsService) {}

  ngOnInit(): void {
    this.service.getAll().subscribe((data: any) => {
      this.clients = data;
    });
  }
}