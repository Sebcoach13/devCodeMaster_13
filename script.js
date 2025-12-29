document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. LES PETITES ANIMATIONS DE TEXTE --- */
    const titreNom = document.querySelector('h1');
    const sousTitre = document.querySelector('h3');
    
    // Pour mon nom (H1)
    if (titreNom) {
        const monTexte = "DevCodeMaster_13";
        let index = 0;
        titreNom.textContent = ""; 

        function ecrireNom() {
            if (index < monTexte.length) {
                titreNom.textContent += monTexte.charAt(index);
                index++;
                setTimeout(ecrireNom, 145); // Un peu moins que 150 pour faire moins "calculé"
            }
        }
        ecrireNom();
    }

    // Pour la description (H3)
    if (sousTitre) {
        const maPhrase = "Votre spécialiste en développement web";
        let position = 0; 
        sousTitre.textContent = ""; 

        function ecrirePhrase() {
            if (position < maPhrase.length) {
                sousTitre.textContent += maPhrase.charAt(position);
                position++;
                setTimeout(ecrirePhrase, 95); 
            }
        }
        // J'attends 1.8s avant de lancer pour pas que ça se chevauche trop
        setTimeout(ecrirePhrase, 1800); 
    }

    /* --- 2. LE MENU (Souligner la page où on est) --- */
    const tousLesLiens = document.querySelectorAll('.nav a');
    const maPage = window.location.pathname.split("/").pop() || "index.html";
    
    tousLesLiens.forEach(unLien => {
        if (unLien.getAttribute('href') === maPage) {
            unLien.style.color = "#00A3FF"; 
            unLien.style.borderBottom = "2px solid #00A3FF";
        }
    });

    /* --- 3. LE FORMULAIRE DE CONTACT --- */
    const formulaire = document.getElementById('contact-form');
    const leMessage = document.getElementById('message');
    const petitCompteur = document.getElementById('compteur');
    const boutonEnvoyer = document.getElementById('btn-envoyer');
    const lePrenom = document.getElementById('prenom');

    if (formulaire && leMessage) {
        
        // A. Gestion du compteur de caractères
        leMessage.addEventListener('input', () => {
            const total = leMessage.value.length;
            petitCompteur.textContent = total + " / 200"; // Plus court, plus simple
            
            // On gère les couleurs selon la longueur du texte
            if (total >= 10 && total <= 160) {
                boutonEnvoyer.disabled = false;
                boutonEnvoyer.style.opacity = "1";
                leMessage.style.borderColor = "#27ae60"; // Vert sympa
                petitCompteur.style.color = "#27ae60";
            } else if (total > 160 && total <= 200) {
                leMessage.style.borderColor = "#f39c12"; // Orange
                petitCompteur.style.color = "#f39c12";
            } else {
                boutonEnvoyer.disabled = true;
                boutonEnvoyer.style.opacity = "0.4";
                leMessage.style.borderColor = "#e74c3c"; // Rouge
                petitCompteur.style.color = "#e74c3c";
            }
        });

        // B. L'envoi du formulaire
        formulaire.addEventListener('submit', (e) => {
            e.preventDefault(); 

            // Sécu : on vire les espaces vides
            const prenomPropre = lePrenom.value.trim();
            const messagePropre = leMessage.value.trim();

            // Sécu : on bloque si y'a des scripts bizarres
            if (messagePropre.includes("<script") || messagePropre.includes("href=")) {
                alert("Pas de code ou de liens ici, merci !");
                return; 
            }

            // On change le bouton pour montrer que ça bosse
            boutonEnvoyer.textContent = "Un instant...";
            boutonEnvoyer.disabled = true;

            const mesDonnees = new FormData(formulaire);
            mesDonnees.set('prenom', prenomPropre); 
            mesDonnees.set('message', messagePropre);

            // Petit délai pour que l'utilisateur voie le changement du bouton
            setTimeout(() => {
                fetch("https://formspree.io/f/movgzvyg", {
                    method: "POST",
                    body: mesDonnees,
                    headers: { 'Accept': 'application/json' }
                })
                .then(reponse => {
                    if (reponse.ok) {
                        // On affiche le message de succès à la place du formulaire
                        formulaire.innerHTML = `
                            <div style="background-color: #f1fcf4; color: #1e7e34; padding: 40px; border-radius: 12px; text-align: center; border: 1px solid #c3e6cb;">
                                <h3>C'est envoyé !</h3>
                                <p>Merci <strong>${prenomPropre}</strong>, je vous réponds vite.</p>
                                <button onclick="window.location.reload()" style="margin-top: 15px; padding: 8px 15px; cursor: pointer;">Ok</button>
                            </div>
                        `;
                    }
                })
                .catch(err => {
                    console.log("Erreur lors de l'envoi.");
                });
            }, 600); // 0.6s
        });
    }
});