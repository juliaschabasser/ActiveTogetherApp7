import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { StoreService } from '../../shared/store.service';
import { BackendService } from '../../shared/backend.service';
import { FormsModule } from '@angular/forms';
import { Course } from '../../shared/Interfaces/Course';

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [SharedModule, FormsModule],
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
})
export class DataComponent {
  // Filterkriterien
  public filter = {
    courseName: '',
    instructorName: '',
    date: '',
  };

  // Sortieroptionen
  public sortKey: keyof Course | undefined;
  public sortOrder: 'asc' | 'desc' = 'asc';

  // Gefilterte und sortierte Kurse
  public filteredCourses: Course[] = [];

  // Paginierung
  public page: number = 1; // Aktuelle Seite
  public totalPages: number = 0; // Gesamtseitenanzahl

  constructor(public storeService: StoreService, private backendService: BackendService) {}

  ngOnInit() {
    // Initialisiere die gefilterten Kurse
    this.filteredCourses = [...this.storeService.courses];

    // Lade die erste Seite der Registrierungen
    this.loadRegistrations(this.page);
  }

  // Filter-Logik
  applyFilters() {
    this.filteredCourses = this.storeService.courses.filter((course) => {
      const matchesCourseName = this.filter.courseName
        ? course.name.toLowerCase().includes(this.filter.courseName.toLowerCase())
        : true;

      const matchesInstructorName = this.filter.instructorName
        ? course.instructor.toLowerCase().includes(this.filter.instructorName.toLowerCase())
        : true;

      const matchesDate = this.filter.date
        ? course.dates.some(
            (date) => new Date(date.begin).toDateString() === new Date(this.filter.date).toDateString()
          )
        : true;

      return matchesCourseName && matchesInstructorName && matchesDate;
    });

    this.applySorting(); // Nach Filterung sortieren
  }

  // Sortier-Logik
  applySorting() {
    if (this.sortKey) {
      this.filteredCourses.sort((a, b) => {
        let valA: any;
        let valB: any;

        // Besondere Behandlung für 'dates', da es ein Array ist
        if (this.sortKey === 'dates') {
          valA = a.dates[0]?.begin || '';
          valB = b.dates[0]?.begin || '';
        } else {
          valA = a[this.sortKey!];
          valB = b[this.sortKey!];
        }

        // Falls der Sortierwert ein String ist, wird er normalisiert
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return this.sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }

  // Sortierung ändern
  changeSorting(key: keyof Course) {
    if (this.sortKey === key) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortOrder = 'asc';
    }

    this.applySorting();
  }

  // Registrierungen laden (Paginierung)
  loadRegistrations(page: number) {
  // Ruft getRegistrations auf, aber keine Subscription notwendig, da der Service die Daten selbst speichert
  this.backendService.getRegistrations(page);
  this.totalPages = Math.ceil(this.storeService.registrationTotalCount / 3); // Gesamtseitenanzahl berechnen
}


  // Seiten wechseln
  selectPage(page: number) {
    this.page = page; // Aktuelle Seite setzen
    this.loadRegistrations(page); // Daten für die gewählte Seite laden
  }

  // Seitenanzahl berechnen
  returnAllPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1); // Seitenzahlen generieren
  }
}
