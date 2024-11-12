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
import { SearchFormComponent } from './search-form/search-form.component';

// Results
import { ResultsComponent } from './results/results.component';
import { DayViewComponent } from './day-view/day-view.component';
import { DailyTempChartComponent } from './daily-temp-chart/daily-temp-chart.component';
import { MeteogramComponent } from './meteogram/meteogram.component';
// Highcharts
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
    declarations: [
        AppComponent,
        SearchFormComponent,
        ResultsComponent,
        DayViewComponent,
        DailyTempChartComponent,
        MeteogramComponent
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
        HighchartsChartModule
    ],
    providers: [
        provideHttpClient(withFetch()),
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
