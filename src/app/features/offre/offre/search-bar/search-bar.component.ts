import { Component, EventEmitter, Output } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [InputTextModule, FormsModule, ButtonModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  searchQuery: string = '';

  @Output() search = new EventEmitter<string>();

  onSearch() {
    const trimmedQuery = this.searchQuery.trim();
    if (trimmedQuery) {
      this.search.emit(trimmedQuery);
    }
  }

  onReset() {
    this.searchQuery = '';
    this.search.emit('');
  }
}
