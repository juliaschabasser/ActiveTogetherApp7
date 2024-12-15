import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { StoreService } from '../../shared/store.service';
import { BackendService } from '../../shared/backend.service';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; 
import { MatDatepickerInput } from '@angular/material/datepicker';
import { MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../../shared/shared.module';
import { MatOption } from '@angular/material/core';


@Component({
  selector: 'app-add-data',
  standalone: true,
  imports: [
    SharedModule,
    MatOption,
    MatFormField,
    MatInputModule,
    MatSelect,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDatepickerInput,
    MatDatepickerToggle
  ],
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.css']
})
export class AddDataComponent implements OnInit {
  constructor(
    private formbuilder: FormBuilder, 
    public storeService: StoreService, 
    private backendService: BackendService
  ) { }

  public registrationForm: any;

  ngOnInit(): void {
    // Initialize the form group
    this.registrationForm = this.formbuilder.group({
      name: ['', [Validators.required]],
      courseId: ['', Validators.required],
      birthdate: [null, Validators.required]
    });

    // Fetch the list of courses
    this.backendService.getCourses();
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      console.log('Form Submitted:', this.registrationForm.value);
      this.backendService.addRegistration(this.registrationForm.value, this.storeService.currentPage);
    }
  }
}
