import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutocompleteService } from '../../services/autocomplete.service';
import { SearchResult } from '../../models';
import { GeocodeService } from '../../services/geocode.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {
  @Output() searchCompleted = new EventEmitter<SearchResult>();
  @Output() clear = new EventEmitter<void>();
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
    private autocompleteService: AutocompleteService,
    private geocodeService: GeocodeService
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


  noWhitespaceValidator(control: any) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  onCurrentLocationChange(): void {
    this.searchForm.get('currentLocation')?.valueChanges.subscribe((checked: boolean) => {
      if (checked) {
        this.searchForm.get('street')?.disable();
        this.searchForm.get('city')?.disable();
        this.searchForm.get('state')?.disable();
      } else {
        this.searchForm.get('street')?.enable();
        this.searchForm.get('city')?.enable();
        this.searchForm.get('state')?.enable();
      }
    });
  }


  getCurrentLocation(): void {
    this.isFetchingLocation = true;
    fetch('https://ipinfo.io/json?token=aace562e162468')
      .then((response) => response.json())
      .then((dataLocation) => {
        console.log('Location data:', dataLocation);
        const loc = dataLocation.loc.split(',');
        const latitude = parseFloat(loc[0]);
        const longitude = parseFloat(loc[1]);
        const city = dataLocation.city;
        const state = dataLocation.region;
        this.emitSearchResult(latitude, longitude, city, state);

        this.isFetchingLocation = false;
      })
      .catch((error) => {
        console.error('Error obtaining location:', error);
        this.isFetchingLocation = false;
        this.searchForm.get('currentLocation')?.setValue(false);
      });



  }


  setupCityAutocomplete(): void {
    this.searchForm.get('city')?.valueChanges.subscribe(value => {
      this.autocompleteService.getCityPredictions(value).subscribe(
        (cities: string[]) => {
          this.filteredCities = cities.map(city => city.split(',')[0]);
        },
        (error) => {
          console.error('Autocomplete error:', error);
          this.isAutocompleteEnabled = false;
        }
      );
    });
  }

  onCitySelected(selected: string): void {

    this.searchForm.get('city')?.setValue(selected.split(',')[0]);

  }


  isSearchDisabled(): boolean {
    if (this.searchForm.get('currentLocation')?.value) {
      return this.isFetchingLocation;
    }
    return this.searchForm.invalid;
  }


  onSearch(): void {
    if (this.searchForm.valid) {
      const formData = this.searchForm.value;
      if (formData.currentLocation) {
        this.getCurrentLocation();
      } else {
        const address = `${formData.street}, ${formData.city}, ${formData.state}`;
        this.geocodeService.geocodeAddress(address).subscribe(
          (location: { lat: number, lng: number } | null) => {
            if (location) {
              this.emitSearchResult(location.lat, location.lng, formData.city, formData.state);
            } else {
              console.error('Geocoding failed for address:', address);
            }
          }
        );
      }
    }
  }

  onClear(): void {
    this.searchForm.reset({
      currentLocation: false,
      street: '',
      city: '',
      state: ''
    });
    this.filteredCities = [];
    this.isAutocompleteEnabled = true;
    this.clear.emit();
  }


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

  emitSearchResult(latitude: number, longitude: number, city: string, state: string): void {
    console.log('Emitting search result:', { latitude, longitude, city, state });
    this.searchCompleted.emit({ latitude, longitude, city, state });
  }
}


