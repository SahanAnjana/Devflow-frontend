import { Component, OnInit } from '@angular/core';
import { AgentCustomerService } from 'src/app/_services/agent-customer.service';
import { DataService } from 'src/app/_services/shared-data/data.service';

@Component({
  selector: 'app-view-agent-customer',
  templateUrl: './view-agent-customer.component.html',
  styleUrls: ['./view-agent-customer.component.sass'],
})
export class ViewAgentCustomerComponent implements OnInit {
  constructor(
    private agentService: AgentCustomerService,
    private dataService: DataService
  ) {}
  ngOnInit(): void {}
}
