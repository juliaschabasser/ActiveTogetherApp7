import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { StoreService } from '../../shared/store.service';
import { BackendService } from '../../shared/backend.service';

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent {

  constructor(public storeService: StoreService, private backendService: BackendService) {}

  public page: number = 0;

  selectPage(i: number) {
    this.page = i;
    this.storeService.currentPage = i;
    this.backendService.getRegistrations(i);
  }

  public returnAllPages() {
    const pagesCount = Math.ceil(this.storeService.registrationTotalCount / 2);
    const res: number[] = [];
    for (let i = 0; i < pagesCount; i++) {
      res.push(i + 1);
    }
    return res;
  }
}
