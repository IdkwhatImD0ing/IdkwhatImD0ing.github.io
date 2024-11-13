import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FavoritesService } from '../services/favorites.service';
import { Favorite } from '../models/favorite';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
})
export class FavoritesComponent implements OnInit {
  favorites: Favorite[] = [];
  errorMessage: string = '';
  @Output() favoriteSelected = new EventEmitter<Favorite>();

  constructor(private favoritesService: FavoritesService) { }

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favoritesService.listFavorites().subscribe({
      next: (response) => {
        this.favorites = response.favorites;
      },
      error: (error) => {
        this.errorMessage = error.error.error || 'An error occurred while fetching favorites.';
      },
    });
  }

  viewWeather(favorite: Favorite): void {
    console.log("Emitting favorite:", favorite);
    this.favoriteSelected.emit(favorite);
  }

  removeFavorite(favorite: Favorite): void {
    this.favoritesService.removeFavorite(favorite.city, favorite.state).subscribe({
      next: () => {
        this.loadFavorites();
      },
      error: (error) => {
        this.errorMessage = error.error.error || 'An error occurred while removing favorite.';
      },
    });
  }
}
