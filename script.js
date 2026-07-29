// Fonction pour charger un composant HTML
async function chargerComposant(elementId, fichier) {
    const el = document.getElementById(elementId);
    if (el) {
        const reponse = await fetch(fichier);
        const html = await reponse.text();
        el.innerHTML = html;
    }
}

document.addEventListener('DOMContentLoaded', async () => {

    // 1. Charger le header et le footer
    await chargerComposant('main-header', 'header.html');
    await chargerComposant('main-footer', 'footer.html');

    // 2. FORCER LA LECTURE DES VIDÉOS SUR IOS SAFARI
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        // Sécurité supplémentaire pour iOS
        video.muted = true;
        video.setAttribute('playsinline', '');
        
        // Force le lancement
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay bloqué par le navigateur / mode économie d'énergie :", error);
            });
        }
    });

    // 3. Initialiser le Menu Burger
    const burger = document.getElementById('menu_burger');
    const navUl = document.querySelector('.nav ul');

    if (burger && navUl) {
        burger.addEventListener('click', () => {
            navUl.classList.toggle('active');
            burger.classList.toggle('active');
        });
    }

    // 3. Initialiser L'EFFET DACTYLO (une fois le header chargé)
    const monNom = document.querySelector('#sousTitre');
    if (monNom) {
        const texteNom = "Votre spécialiste en développement web";
        let i = 0;
        monNom.textContent = ""; 
        function taperNom() {
            if (i < texteNom.length) {
                monNom.textContent += texteNom.charAt(i);
                i++;
                setTimeout(taperNom, 150); 
            }
        }
        taperNom();
    }

    const monNom2 = document.querySelector('#sousTitre2');
    if (monNom2) {
        const texteNom2 = "& ingénierie de données";
        let i = 0;
        monNom2.textContent = ""; 
        function taperNom() {
            if (i < texteNom2.length) {
                monNom2.textContent += texteNom2.charAt(i);
                i++;
                setTimeout(taperNom, 150); 
            }
        }
        taperNom();
    }
    

    /* --- VALIDATION FORMULAIRE & CORRECTION ENVOI FORMSPREE --- */
    const form = document.getElementById('contact-form');
    if (form) {
        const inputMessage = document.getElementById('message');
        const compteur = document.getElementById('compteur');
        const btn = document.getElementById('btn-envoyer');
        const tousLesChamps = form.querySelectorAll('input, textarea');

        tousLesChamps.forEach(champ => {
            champ.addEventListener('input', () => {
                // Couleur générale des champs
                if (champ.value.trim().length > 0) {
                    champ.classList.add('border-success');
                    champ.classList.remove('border-error');
                } else {
                    champ.classList.remove('border-success');
                }

                // Logique spécifique au MESSAGE + BOUTON
                const longueur = inputMessage.value.length;
                compteur.textContent = longueur + " / 200";

                if (longueur >= 10 && longueur <= 200) {
                    btn.disabled = false;
                    btn.style.opacity = "1";
                    inputMessage.classList.add('border-success');
                    inputMessage.classList.remove('border-error');
                    compteur.style.color = "#27ae60"; 
                } else {
                    btn.disabled = true;
                    btn.style.opacity = "0.4";
                    if (longueur > 0) {
                        inputMessage.classList.add('border-error');
                        inputMessage.classList.remove('border-success');
                        compteur.style.color = "#e74c3c"; 
                    }
                }
            });
        });

        // ENVOI FORMSPREE CORRIGÉ (JSON)
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            btn.textContent = "Envoi...";
            btn.disabled = true;

            // Envoi propre au format JSON pour éviter que Formspree bloque le mail
            const data = {
                name: document.getElementById('name').value,
                prenom: document.getElementById('prenom').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            fetch("https://formspree.io/f/xaqpddjz", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' 
                }
            }).then(res => {
                if (res.ok) {
                    form.innerHTML = "<h3 style='color:#27ae60; text-align:center; padding: 20px;'>Message envoyé ! Je vous réponds vite.</h3>";
                } else {
                    btn.textContent = "Erreur d'envoi";
                    btn.disabled = false;
                }
            }).catch(err => {
                btn.textContent = "Erreur réseau";
                btn.disabled = false;
            });
        });
    }
});