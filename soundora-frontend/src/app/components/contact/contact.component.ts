import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * =====================================
 * CONTACT - Composant Nous Contacter
 * =====================================
 * 
 * RÔLE :
 * Affiche les coordonnées et un formulaire de contact
 */
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  
  // Données du formulaire
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  // État du formulaire
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  /**
   * MÉTHODE submitForm()
   * Envoie le formulaire de contact
   */
  submitForm(): void {
    // Validation basique
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.isSubmitting = true;
    
    // Simulation d'envoi (à remplacer par un vrai appel API)
    setTimeout(() => {
      this.isSubmitting = false;
      this.submitSuccess = true;
      
      // Réinitialiser le formulaire
      this.contactForm = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };

      // Cacher le message de succès après 5 secondes
      setTimeout(() => {
        this.submitSuccess = false;
      }, 5000);
    }, 1500);
  }

  // Coordonnées de contact
  contactInfo = [
    {
      title: 'Email',
      value: 'contact&#64;soundora.com',
      link: 'mailto:contact@soundora.com',
      description: 'Réponse sous 24h'
    },
    {
      title: 'Téléphone',
      value: '01 23 45 67 89',
      link: 'tel:0123456789',
      description: 'Lun-Ven 9h-18h'
    },
    {
      title: 'Adresse',
      value: '15 Avenue de la République, 83000 Toulon',
      link: null,
      description: 'Entrepôt - Pas de visite'
    }
  ];

  // Horaires d'ouverture
  hours = [
    { day: 'Lundi - Vendredi', time: '9h00 - 18h00' },
    { day: 'Samedi', time: '10h00 - 17h00' },
    { day: 'Dimanche', time: 'Fermé' }
  ];
}
