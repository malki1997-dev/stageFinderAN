import { Component, EventEmitter, Output } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CheckboxModule, DropdownModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  // Filtres pour les cases à cocher
  freeApplications: boolean = false;
  paidInternship: boolean = false;
  onSite: boolean = false;
  remote: boolean = false;
  hybrid: boolean = false;
  fullTime: boolean = false;
  partTime: boolean = false;

  // Options pour les dropdowns
  specialities: DropdownOption[] = [
    { label: 'Finance', value: 'finance' },
    { label: 'Informatique', value: 'informatique' },
    { label: 'Marketing', value: 'marketing' }
  ];

  cities: DropdownOption[] = [
    { label: 'Casablanca', value: 'casablanca' },
    { label: 'Rabat', value: 'rabat' },
    { label: 'Marrakech', value: 'marrakech' }
  ];

  durations: DropdownOption[] = [
    { label: '1 - 3 Mois', value: '1-3' },
    { label: '3 - 6 Mois', value: '3-6' },
    { label: '6+ Mois', value: '6+' }
  ];

  contracts: DropdownOption[] = [
    { label: 'Stage', value: 'stage' },
    { label: 'CDD', value: 'cdd' },
    { label: 'CDI', value: 'cdi' }
  ];

  // Valeurs sélectionnées dans les dropdowns
  selectedSpeciality: DropdownOption | null = null;
  selectedCity: DropdownOption | null = null;
  selectedDuration: DropdownOption | null = null;
  selectedContract: DropdownOption | null = null;

  @Output() filtersChanged = new EventEmitter<any>();

  applyFilters() {
    const filters = {
      freeApplications: this.freeApplications,
      paidInternship: this.paidInternship,
      onSite: this.onSite,
      remote: this.remote,
      hybrid: this.hybrid,
      fullTime: this.fullTime,
      partTime: this.partTime,
      speciality: this.selectedSpeciality?.value,
      city: this.selectedCity?.value,
      duration: this.selectedDuration?.value,
      contract: this.selectedContract?.value
    };
    this.filtersChanged.emit(filters);
  }
}
