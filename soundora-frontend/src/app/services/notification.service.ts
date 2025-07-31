import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

// =================================
// INTERFACE DES NOTIFICATIONS
// Définit la structure d'une notification avec tous ses paramètres
// =================================
export interface Notification {
  id: string;                    // Identifiant unique pour chaque notification
  type: 'success' | 'error' | 'warning' | 'info'; // Type de notification (définit couleur/icône)
  title: string;                 // Titre principal de la notification
  message: string;               // Message détaillé à afficher
  duration?: number;             // Durée d'affichage en millisecondes (optionnel)
  autoClose?: boolean;           // Si true, la notification se ferme automatiquement
  action?: {                     // Action optionnelle (bouton dans la notification)
    label: string;               // Texte du bouton
    callback: () => void;        // Fonction à exécuter lors du clic
  };
}

// =================================
// SERVICE DE GESTION DES NOTIFICATIONS
// Service singleton pour gérer toutes les notifications de l'application
// Utilisé pour : confirmations ajout panier, erreurs, messages de succès, etc.
// =================================
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  // =================================
  // PROPRIÉTÉS PRIVÉES - GESTION D'ÉTAT
  // =================================
  
  // Liste réactive de toutes les notifications actives
  // BehaviorSubject = Observable qui garde la dernière valeur émise
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  
  // Compteur pour générer des IDs uniques de notifications
  private idCounter = 0;
  
  // =================================
  // PROPRIÉTÉS PUBLIQUES - API DU SERVICE
  // =================================
  
  // Observable exposé aux composants pour s'abonner aux notifications
  // Les composants peuvent écouter les changements : service.notifications$.subscribe()
  public notifications$ = this.notificationsSubject.asObservable();

  constructor() {
    // LOG DE DÉMARRAGE : Confirme l'initialisation du service
    console.log('🔔 NotificationService initialisé');
  }

  // =================================
  // MÉTHODES PUBLIQUES - AFFICHAGE DES NOTIFICATIONS
  // =================================

  /**
   * MÉTHODE PRINCIPALE : Afficher une notification
   * @param notification - Configuration complète de la notification
   * @returns string - ID de la notification créée (pour suppression manuelle)
   * 
   * UTILISATION :
   * service.show({
   *   type: 'success',
   *   title: 'Produit ajouté',
   *   message: 'Gibson Les Paul ajoutée au panier'
   * });
   */
  show(notification: Omit<Notification, 'id'>): string {
    // GÉNÉRATION D'UN ID UNIQUE
    // Format: "notif_1", "notif_2", etc.
    const id = `notif_${++this.idCounter}`;
    
    // CRÉATION DE LA NOTIFICATION COMPLÈTE
    // Merge des paramètres fournis + valeurs par défaut
    const fullNotification: Notification = {
      id,                           // ID généré automatiquement
      duration: 5000,               // 5 secondes par défaut
      autoClose: true,              // Fermeture automatique par défaut
      ...notification               // Écrase les valeurs par défaut avec les paramètres fournis
    };

    // AJOUT À LA LISTE DES NOTIFICATIONS ACTIVES
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, fullNotification]);

    // LOG DE DEBUG : Confirmation de l'ajout
    console.log(`🔔 Notification ${fullNotification.type} ajoutée:`, fullNotification.title);

    // GESTION DE LA FERMETURE AUTOMATIQUE
    if (fullNotification.autoClose && fullNotification.duration) {
      // setTimeout retarde l'exécution de remove() de X millisecondes
      setTimeout(() => {
        this.remove(id);
      }, fullNotification.duration);
    }

    // RETOURNE L'ID pour permettre la suppression manuelle si besoin
    return id;
  }

  /**
   * MÉTHODES DE RACCOURCI - TYPES SPÉCIFIQUES
   * Simplification des appels pour les types courants de notifications
   */

  /**
   * NOTIFICATION DE SUCCÈS (verte)
   * Usage typique : confirmation d'ajout au panier, sauvegarde réussie
   */
  success(title: string, message: string, duration?: number): string {
    return this.show({
      type: 'success',
      title,
      message,
      duration
    });
  }

  /**
   * NOTIFICATION D'ERREUR (rouge)
   * Usage typique : erreurs API, validation échouée
   */
  error(title: string, message: string, duration?: number): string {
    return this.show({
      type: 'error',
      title,
      message,
      duration: duration || 8000,  // Erreurs affichées plus longtemps
      autoClose: duration !== 0    // Si duration = 0, pas de fermeture auto
    });
  }

  /**
   * NOTIFICATION D'AVERTISSEMENT (orange)
   * Usage typique : stock faible, action requise
   */
  warning(title: string, message: string, duration?: number): string {
    return this.show({
      type: 'warning',
      title,
      message,
      duration
    });
  }

  /**
   * NOTIFICATION D'INFORMATION (bleue)
   * Usage typique : conseils, informations générales
   */
  info(title: string, message: string, duration?: number): string {
    return this.show({
      type: 'info',
      title,
      message,
      duration
    });
  }

  // =================================
  // MÉTHODES DE GESTION - SUPPRESSION
  // =================================

  /**
   * SUPPRIMER UNE NOTIFICATION SPÉCIFIQUE
   * @param id - ID de la notification à supprimer
   * 
   * USAGE : Clic sur bouton "X" ou fermeture automatique
   */
  remove(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    
    // FILTRAGE : Garde toutes les notifications SAUF celle avec l'ID fourni
    const updatedNotifications = currentNotifications.filter(n => n.id !== id);
    
    // MISE À JOUR DE LA LISTE
    this.notificationsSubject.next(updatedNotifications);
    
    // LOG DE DEBUG
    console.log(`🔔 Notification ${id} supprimée`);
  }

  /**
   * VIDER TOUTES LES NOTIFICATIONS
   * Usage : Reset de l'interface, nettoyage général
   */
  clear(): void {
    this.notificationsSubject.next([]);
    console.log('🔔 Toutes les notifications supprimées');
  }

  /**
   * COMPTER LES NOTIFICATIONS ACTIVES
   * Usage : Affichage du nombre dans l'interface
   */
  getCount(): number {
    return this.notificationsSubject.value.length;
  }

  // =================================
  // MÉTHODES SPÉCIALISÉES - AJOUT PANIER
  // =================================

  /**
   * NOTIFICATION SPÉCIFIQUE POUR AJOUT AU PANIER
   * Méthode dédiée avec format standardisé et action "Voir le panier"
   * 
   * @param productName - Nom du produit ajouté
   * @param quantity - Quantité ajoutée (optionnel, défaut = 1)
   * @param onViewCart - Callback pour "Voir le panier" (optionnel)
   */
  showCartAddSuccess(
    productName: string, 
    quantity: number = 1,
    onViewCart?: () => void
  ): string {
    // FORMAT DU MESSAGE SELON LA QUANTITÉ
    const quantityText = quantity > 1 ? `${quantity} x ` : '';
    const pluriel = quantity > 1 ? 's' : '';
    
    return this.show({
      type: 'success',
      title: '🛒 Produit ajouté au panier',
      message: `${quantityText}${productName} ajouté${pluriel} avec succès`,
      duration: 4000,                // Durée optimale pour lire le message
      action: onViewCart ? {         // Bouton optionnel "Voir le panier"
        label: 'Voir le panier',
        callback: onViewCart
      } : undefined
    });
  }

  /**
   * NOTIFICATION D'ERREUR POUR AJOUT AU PANIER
   * Format standardisé pour les erreurs de panier (rupture stock, etc.)
   */
  showCartAddError(productName: string, reason: string): string {
    return this.error(
      '❌ Impossible d\'ajouter au panier',
      `${productName}: ${reason}`
    );
  }
}
