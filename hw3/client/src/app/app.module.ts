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

// Forms
import { ReactiveFormsModule } from '@angular/forms';
import { SearchFormComponent } from './search-form/search-form.component';

@NgModule({
    declarations: [
        AppComponent,
        SearchFormComponent
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
        MatSelectModule
    ],
    providers: [
        provideHttpClient(withFetch()),
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
