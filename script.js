document.addEventListener('DOMContentLoaded', () => {

   /* --- MENU BURGER --- */
const burger = document.getElementById('menu_burger');
const navUl = document.querySelector('.nav ul');

if (burger) {
    burger.addEventListener('click', () => {
        navUl.classList.toggle('active');   // Affiche/cache le menu
        burger.classList.toggle('active');  // Anime les barres en "X" (Important !)
    });
}

    /* --- EFFET DACTYLO --- */
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
    

    /* --- VALIDATION FORMULAIRE & FETCH --- */
    const form = document.getElementById('contact-form');
    if (form) {
        const inputMessage = document.getElementById('message');
        const compteur = document.getElementById('compteur');
        const btn = document.getElementById('btn-envoyer');
        const tousLesChamps = form.querySelectorAll('input, textarea');

        tousLesChamps.forEach(champ => {
            champ.addEventListener('input', () => {
                // Couleur générale des champs (vert si rempli, bleu si focus via CSS)
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
                    compteur.style.color = "#27ae60"; // Vert
                } else {
                    btn.disabled = true;
                    btn.style.opacity = "0.4";
                    if (longueur > 0) {
                        inputMessage.classList.add('border-error');
                        inputMessage.classList.remove('border-success');
                        compteur.style.color = "#e74c3c"; // Rouge
                    }
                }
            });
        });

        // ENVOI FORMSPREE
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            btn.textContent = "Envoi...";
            fetch("https://formspree.io/f/movgzvyg", {
                method: "POST",
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            }).then(res => {
                if (res.ok) {
                    form.innerHTML = "<h3 style='color:#27ae60; text-align:center;'>Message envoyé ! Je vous réponds vite.</h3>";
                }
            });
        });
    }
});