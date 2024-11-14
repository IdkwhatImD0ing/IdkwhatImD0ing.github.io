import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FavoritesService } from '../services/favorites.service';
import { Favorite } from '../models/favorite';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
})
export class FavoritesComponent implements OnInit {
  favorites: Favorite[] = [];
  @Input() errorMessage: string = '';
  @Output() favoriteSelected = new EventEmitter<Favorite>();
  @Output() setErrorMessage = new EventEmitter<string>();
  constructor(private favoritesService: FavoritesService) { }

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favoritesService.listFavorites().subscribe({
      next: (response) => {
        this.favorites = response.favorites;
        this.setErrorMessage.emit('');
      },
      error: (error) => {
        this.setErrorMessage.emit('An error occurred while fetching favorites.');
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
        this.setErrorMessage.emit('');
      },
      error: (error) => {
        this.setErrorMessage.emit('An error occurred while removing favorite.');
      },
    });
  }
}
