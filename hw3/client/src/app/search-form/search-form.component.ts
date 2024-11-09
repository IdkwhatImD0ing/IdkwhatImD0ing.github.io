import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutocompleteService } from '../services/autocomplete.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {
  searchForm: FormGroup;
  stateOptions: string[] = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
    'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
    'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];
  filteredCities: string[] = [];
  isAutocompleteEnabled: boolean = true;
  isFetchingLocation: boolean = false;

  constructor(
    private fb: FormBuilder,
    private autocompleteService: AutocompleteService
  ) {
    this.searchForm = this.fb.group({
      currentLocation: [false],
      street: ['', [Validators.required, this.noWhitespaceValidator]],
      city: ['', [Validators.required, this.noWhitespaceValidator]],
      state: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.onCurrentLocationChange();
    this.setupCityAutocomplete();
  }

  /**
   * Custom validator to check for non-whitespace input
   */
  noWhitespaceValidator(control: any) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  /**
   * Handle enabling/disabling form fields based on Current Location checkbox
   */
  onCurrentLocationChange(): void {
    this.searchForm.get('currentLocation')?.valueChanges.subscribe((checked: boolean) => {
      if (checked) {
        this.searchForm.get('street')?.disable();
        this.searchForm.get('city')?.disable();
        this.searchForm.get('state')?.disable();
        this.getCurrentLocation();
      } else {
        this.searchForm.get('street')?.enable();
        this.searchForm.get('city')?.enable();
        this.searchForm.get('state')?.enable();
      }
    });
  }

  /**
   * Obtain the user's current location
   */
  getCurrentLocation(): void {
    if (navigator.geolocation) {
      this.isFetchingLocation = true;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Latitude:', position.coords.latitude);
          console.log('Longitude:', position.coords.longitude);
          // Implement reverse geocoding to populate street, city, and state
          // For example, call a reverse geocoding service with the coordinates
          // and update the form fields accordingly.
          // This implementation is left as an exercise.
          this.isFetchingLocation = false;
        },
        (error) => {
          console.error('Error obtaining location:', error);
          this.isFetchingLocation = false;
          // Optionally, uncheck the checkbox or notify the user
          this.searchForm.get('currentLocation')?.setValue(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.searchForm.get('currentLocation')?.setValue(false);
    }
  }

  /**
   * Set up the Autocomplete for the City field
   */
  setupCityAutocomplete(): void {
    this.searchForm.get('city')?.valueChanges.subscribe(value => {
      this.autocompleteService.getCityPredictions(value).subscribe(
        (cities: string[]) => {
          this.filteredCities = cities;
        },
        (error) => {
          console.error('Autocomplete error:', error);
          this.isAutocompleteEnabled = false;
        }
      );
    });
  }

  /**
   * Handle selection of a city from the autocomplete dropdown
   */
  onCitySelected(selected: string): void {
    // Optionally, implement logic to determine and set the state based on selected city
    // This might require additional API calls or a local mapping of cities to states
    console.log('Selected city:', selected);
    // Example placeholder:
    // this.searchForm.get('state')?.setValue(determinedState);
  }

  /**
   * Check if the Search button should be disabled
   */
  isSearchDisabled(): boolean {
    if (this.searchForm.get('currentLocation')?.value) {
      return this.isFetchingLocation; // Disable if location is being fetched
    }
    return this.searchForm.invalid;
  }

  /**
   * Handle the Search button click
   */
  onSearch(): void {
    if (this.searchForm.valid) {
      const formData = this.searchForm.value;
      // Implement the search logic here
      console.log('Search Data:', formData);
      // For example, navigate to the Results tab or fetch data from the backend
    }
  }

  /**
   * Handle the Clear button click
   */
  onClear(): void {
    this.searchForm.reset({
      currentLocation: false,
      street: '',
      city: '',
      state: ''
    });
    this.filteredCities = [];
    this.isAutocompleteEnabled = true;
    // Implement logic to switch to the Results tab and clear results
    // Example:
    // this.switchToResultsTab();
    console.log('Form cleared');
  }

  /**
   * Get error message for the City field
   */
  getCityErrorMessage(): string {
    const cityControl = this.searchForm.get('city');
    if (cityControl?.hasError('required')) {
      return 'City is required';
    }
    if (cityControl?.hasError('whitespace')) {
      return 'City cannot be empty';
    }
    return '';
  }
}
