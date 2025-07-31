import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../services/notification.service';

// =================================
// COMPOSANT D'AFFICHAGE DES NOTIFICATIONS
// Composant responsable de l'affichage visuel de toutes les notifications
// Position : Fixed en haut à droite de l'écran (toast-style)
// =================================

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- 
      CONTENEUR PRINCIPAL DES NOTIFICATIONS
      Position fixe en haut à droite, z-index élevé pour être au-dessus de tout
      Design responsive : s'adapte aux petits écrans
    -->
    <div class="notification-container">
      
      <!-- 
        BOUCLE SUR TOUTES LES NOTIFICATIONS ACTIVES
        Chaque notification est affichée avec animation CSS
        *ngFor track par ID pour optimiser les performances Angular
      -->
      <div 
        *ngFor="let notification of notifications; trackBy: trackByNotificationId"
        class="notification notification-slide-in"
        [ngClass]="getNotificationClasses(notification)">
        
        <!-- 
          ICÔNE DE LA NOTIFICATION
          Icône différente selon le type (success, error, warning, info)
          Couleur cohérente avec le type de notification
        -->
        <div class="notification-icon">
          <span [innerHTML]="getNotificationIcon(notification.type)"></span>
        </div>
        
        <!-- 
          CONTENU PRINCIPAL DE LA NOTIFICATION
          Titre en gras + message descriptif
        -->
        <div class="notification-content">
          <div class="notification-title">{{ notification.title }}</div>
          <div class="notification-message">{{ notification.message }}</div>
          
          <!-- 
            BOUTON D'ACTION OPTIONNEL
            S'affiche seulement si une action est définie
            Exemple : "Voir le panier" après ajout produit
          -->
          <button 
            *ngIf="notification.action"
            class="notification-action"
            (click)="executeAction(notification)">
            {{ notification.action.label }}
          </button>
        </div>
        
        <!-- 
          BOUTON DE FERMETURE
          Permet à l'utilisateur de fermer manuellement la notification
          Toujours visible même avec fermeture automatique
        -->
        <button 
          class="notification-close"
          (click)="closeNotification(notification.id)"
          aria-label="Fermer la notification">
          ×
        </button>
        
        <!-- 
          BARRE DE PROGRESSION (OPTIONNELLE)
          Indique visuellement le temps restant avant fermeture automatique
          S'affiche seulement si autoClose = true et duration définie
        -->
        <div 
          *ngIf="notification.autoClose && notification.duration"
          class="notification-progress"
          [style.animation-duration]="notification.duration + 'ms'">
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  
  // =================================
  // PROPRIÉTÉS DU COMPOSANT
  // =================================
  
  // Liste des notifications à afficher (mise à jour réactive)
  notifications: Notification[] = [];
  
  // Abonnement RxJS pour écouter les changements de notifications
  // Subscription permet de se désabonner proprement dans ngOnDestroy
  private subscription: Subscription = new Subscription();

  // =================================
  // INJECTION DE DÉPENDANCE
  // =================================
  constructor(private notificationService: NotificationService) {}

  // =================================
  // LIFECYCLE HOOKS ANGULAR
  // =================================

  /**
   * INITIALISATION DU COMPOSANT
   * S'abonne aux changements de notifications du service
   */
  ngOnInit(): void {
    // ABONNEMENT AUX NOTIFICATIONS
    // Chaque fois que le service émet de nouvelles notifications,
    // cette fonction se déclenche et met à jour l'affichage
    this.subscription.add(
      this.notificationService.notifications$.subscribe(
        (notifications: Notification[]) => {
          this.notifications = notifications;
          
          // LOG DE DEBUG : Suivi des changements
          console.log(`🔔 Composant notification : ${notifications.length} notification(s) active(s)`);
        }
      )
    );
  }

  /**
   * NETTOYAGE À LA DESTRUCTION DU COMPOSANT
   * Évite les fuites mémoire en se désabonnant des Observables
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    console.log('🔔 Composant notification détruit et désabonné');
  }

  // =================================
  // MÉTHODES D'AFFICHAGE ET INTERACTION
  // =================================

  /**
   * OPTIMISATION ANGULAR : Fonction de tracking pour *ngFor
   * Permet à Angular de ne re-rendre que les notifications qui changent
   * @param index - Index dans la liste
   * @param item - Notification concernée
   * @returns identifiant unique pour le tracking
   */
  trackByNotificationId(index: number, item: Notification): string {
    return item.id;
  }

  /**
   * GÉNÉRATION DES CLASSES CSS SELON LE TYPE DE NOTIFICATION
   * Applique les couleurs et styles appropriés selon success/error/warning/info
   * 
   * @param notification - Notification à styler
   * @returns object avec les classes CSS à appliquer
   */
  getNotificationClasses(notification: Notification): { [key: string]: boolean } {
    return {
      'notification-success': notification.type === 'success',   // Classe verte
      'notification-error': notification.type === 'error',       // Classe rouge
      'notification-warning': notification.type === 'warning',   // Classe orange
      'notification-info': notification.type === 'info',         // Classe bleue
      'notification-with-action': !!notification.action          // Style spécial si bouton action
    };
  }

  /**
   * SÉLECTION DE L'ICÔNE SELON LE TYPE DE NOTIFICATION
   * Retourne l'emoji ou l'icône HTML appropriée
   * 
   * @param type - Type de notification (success/error/warning/info)
   * @returns string HTML de l'icône à afficher
   */
  getNotificationIcon(type: string): string {
    // DICTIONNAIRE DES ICÔNES PAR TYPE
    const icons = {
      success: '✅',   // Coche verte pour les succès
      error: '❌',     // Croix rouge pour les erreurs
      warning: '⚠️',   // Triangle orange pour les avertissements
      info: 'ℹ️'       // i pour les informations
    };

    // RETOURNE L'ICÔNE CORRESPONDANTE OU UNE ICÔNE PAR DÉFAUT
    return icons[type as keyof typeof icons] || '📢';
  }

  /**
   * FERMETURE MANUELLE D'UNE NOTIFICATION
   * Appelée lors du clic sur le bouton "X"
   * 
   * @param notificationId - ID de la notification à fermer
   */
  closeNotification(notificationId: string): void {
    // DÉLÉGATION AU SERVICE pour maintenir la logique centralisée
    this.notificationService.remove(notificationId);
    
    // LOG DE L'ACTION UTILISATEUR
    console.log(`🔔 Notification ${notificationId} fermée par l'utilisateur`);
  }

  /**
   * EXÉCUTION D'UNE ACTION DE NOTIFICATION
   * Appelée lors du clic sur un bouton d'action (ex: "Voir le panier")
   * 
   * @param notification - Notification contenant l'action à exécuter
   */
  executeAction(notification: Notification): void {
    // VÉRIFICATION DE LA PRÉSENCE DE L'ACTION
    if (notification.action && notification.action.callback) {
      // EXÉCUTION DU CALLBACK défini lors de la création de la notification
      notification.action.callback();
      
      // LOG DE L'ACTION
      console.log(`🔔 Action "${notification.action.label}" exécutée pour notification ${notification.id}`);
      
      // FERMETURE AUTOMATIQUE après exécution de l'action
      // L'utilisateur a agi, plus besoin d'afficher la notification
      this.closeNotification(notification.id);
    }
  }
}
