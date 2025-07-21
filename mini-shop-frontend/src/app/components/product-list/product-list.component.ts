import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importation du module commun pour les directives Angular de base
import { RouterModule } from '@angular/router'; // Importation du module de routage pour les liens
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true, // Indique que ce composant est autonome
  imports: [CommonModule, RouterModule], // Importation des modules nécessaires pour le composant
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
products: any[] = [];

constructor(private productService: ProductService) {}

ngOnInit() {
  this.productService.getProducts().subscribe(data => this.products = data);

}
}