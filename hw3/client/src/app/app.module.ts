import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';

// Matieral stuff
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

// Forms
import { ReactiveFormsModule } from '@angular/forms';
import { SearchFormComponent } from './components/search-form/search-form.component';

// Results
import { ResultsComponent } from './components/results/results.component';
import { DayViewComponent } from './components/day-view/day-view.component';
import { DailyTempChartComponent } from './components/daily-temp-chart/daily-temp-chart.component';
import { MeteogramComponent } from './components/meteogram/meteogram.component';
import { DayDetailComponent } from './components/day-detail/day-detail.component';

// Favorites
import { FavoritesComponent } from './favorites/favorites.component';

// Highcharts
import { HighchartsChartModule } from 'highcharts-angular';

// Google Maps
import { GoogleMapsModule } from '@angular/google-maps';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [
        AppComponent,
        SearchFormComponent,
        ResultsComponent,
        DayViewComponent,
        DailyTempChartComponent,
        MeteogramComponent,
        DayDetailComponent,
        FavoritesComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatTabsModule,
        HighchartsChartModule,
        GoogleMapsModule,
        NgbModule
    ],
    providers: [
        provideHttpClient(withFetch()),
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
