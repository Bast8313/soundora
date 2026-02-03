import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * =====================================
 * FAQ - Composant Questions Fréquentes
 * =====================================
 * 
 * RÔLE :
 * Affiche les questions fréquemment posées par les clients
 * avec système d'accordéon (clic pour ouvrir/fermer)
 */
@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  // Liste des FAQ avec index de la question ouverte (-1 = aucune ouverte)
  openIndex: number = -1;

  // Questions fréquentes organisées par catégories
  faqCategories = [
    {
      title: 'Commandes & Livraison',
      questions: [
        {
          question: 'Quels sont les délais de livraison ?',
          answer: 'Nos délais de livraison sont de 2 à 5 jours ouvrés en France métropolitaine. Pour les DOM-TOM et l\'international, comptez entre 7 et 14 jours ouvrés.'
        },
        {
          question: 'Puis-je suivre ma commande ?',
          answer: 'Oui ! Dès l\'expédition de votre commande, vous recevrez un email avec un numéro de suivi. Vous pourrez suivre votre colis en temps réel sur le site du transporteur.'
        },
        {
          question: 'Les frais de port sont-ils gratuits ?',
          answer: 'Oui, la livraison est gratuite en France métropolitaine pour toute commande supérieure à 50€. En dessous, les frais de port sont de 6,90€.'
        }
      ]
    },
    {
      title: 'Paiement & Sécurité',
      questions: [
        {
          question: 'Quels moyens de paiement acceptez-vous ?',
          answer: 'Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), PayPal, et le paiement en 3x ou 4x sans frais via notre partenaire Stripe.'
        },
        {
          question: 'Le paiement est-il sécurisé ?',
          answer: 'Absolument ! Toutes les transactions sont sécurisées via SSL et notre partenaire Stripe, certifié PCI-DSS niveau 1. Vos données bancaires ne sont jamais stockées sur nos serveurs.'
        },
        {
          question: 'Puis-je payer en plusieurs fois ?',
          answer: 'Oui, le paiement en 3x ou 4x sans frais est disponible pour tout achat supérieur à 100€. L\'option apparaît automatiquement au moment du paiement.'
        }
      ]
    },
    {
      title: 'Retours & Garanties',
      questions: [
        {
          question: 'Quel est le délai de rétractation ?',
          answer: 'Vous disposez de 30 jours pour nous retourner un produit qui ne vous convient pas. Le produit doit être dans son état d\'origine avec tous ses accessoires.'
        },
        {
          question: 'Comment effectuer un retour ?',
          answer: 'Contactez notre service client par email à contact@soundora.com. Nous vous enverrons une étiquette de retour prépayée. Une fois le colis reçu et vérifié, vous serez remboursé sous 7 jours.'
        },
        {
          question: 'Les produits sont-ils garantis ?',
          answer: 'Oui ! Tous nos produits bénéficient de la garantie constructeur (généralement 2 ans). En cas de problème, contactez-nous et nous gérons le SAV pour vous.'
        }
      ]
    },
    {
      title: 'Produits & Stock',
      questions: [
        {
          question: 'Les produits sont-ils neufs ?',
          answer: 'Oui, tous nos produits sont 100% neufs et proviennent directement des distributeurs officiels. Nous ne vendons pas d\'occasion sauf mention contraire.'
        },
        {
          question: 'Un produit est en rupture, quand sera-t-il disponible ?',
          answer: 'Nous nous efforçons de réapprovisionner rapidement. Vous pouvez vous inscrire à l\'alerte de disponibilité sur la page produit. Vous recevrez un email dès le retour en stock.'
        },
        {
          question: 'Proposez-vous des conseils pour choisir mon matériel ?',
          answer: 'Absolument ! Notre équipe de musiciens passionnés est à votre disposition par email, téléphone ou chat. N\'hésitez pas à nous contacter, nous serons ravis de vous aider.'
        }
      ]
    },
    {
      title: 'Contact & Support',
      questions: [
        {
          question: 'Comment vous contacter ?',
          answer: 'Vous pouvez nous joindre par email à contact@soundora.com, par téléphone au 01 23 45 67 89 (lundi-vendredi 9h-18h), ou via notre formulaire de contact.'
        },
        {
          question: 'Avez-vous une boutique physique ?',
          answer: 'Nous sommes actuellement une boutique 100% en ligne, ce qui nous permet de vous proposer les meilleurs prix. Toutefois, nous organisons régulièrement des salons et événements où vous pouvez nous rencontrer.'
        },
        {
          question: 'Proposez-vous des réductions pour les étudiants ou professionnels ?',
          answer: 'Oui ! Nous offrons une réduction de 10% pour les étudiants en musique et les musiciens professionnels. Contactez-nous avec un justificatif pour obtenir votre code promo.'
        }
      ]
    }
  ];

  /**
   * MÉTHODE toggleQuestion()
   * Ouvre ou ferme une question dans l'accordéon
   * 
   * @param index - Index de la question à ouvrir/fermer
   */
  toggleQuestion(index: number): void {
    // Si on clique sur la question déjà ouverte, on la ferme
    // Sinon, on ouvre la nouvelle question
    this.openIndex = this.openIndex === index ? -1 : index;
  }

  /**
   * MÉTHODE isOpen()
   * Vérifie si une question est ouverte
   * 
   * @param index - Index de la question
   * @returns true si la question est ouverte
   */
  isOpen(index: number): boolean {
    return this.openIndex === index;
  }
}
