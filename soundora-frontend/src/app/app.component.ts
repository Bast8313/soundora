import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Composant racine de l'application
 * 
 * Structure :
 * - Header (en-tête)
 * - Main avec <router-outlet> (contenu dynamique)
 * - Footer (pied de page)
 */
@Component({
  selector: 'app-root',           // Balise HTML : <app-root>
  standalone: true,               // Composant standalone (moderne)
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Soundora';
  isLoading = false;

  /**
   * Lifecycle hook : appelé une fois après la création du composant
   * Idéal pour initialiser les données
   */
  ngOnInit(): void {
    console.log('✓ AppComponent initialisé');
  }
}
