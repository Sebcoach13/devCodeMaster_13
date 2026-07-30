// Fonction pour charger un composant HTML avec anti-cache Safari
async function chargerComposant(elementId, fichier) {
    const el = document.getElementById(elementId);
    if (!el) return;

    try {
        const reponse = await fetch(fichier, { cache: 'no-cache' });
        if (!reponse.ok) throw new Error(`Erreur statut ${reponse.status}`);
        const html = await reponse.text();
        el.innerHTML = html;
    } catch (err) {
        console.error(`Erreur de chargement pour ${fichier} :`, err);
    }
}

document.addEventListener('DOMContentLoaded', async () => {

    // 1. Charger le header et le footer
    await chargerComposant('main-header', 'header.html');
    await chargerComposant('main_footer', 'footer.html');

    // 2. FORCER LA LECTURE DES VIDÉOS SUR IOS SAFARI
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.muted = true;
        video.setAttribute('playsinline', '');
        
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay bloqué par le navigateur / mode économie d'énergie :", error);
            });
        }
    });

    // 3. MENU BURGER (Délégué pour garantir le fonctionnement après fetch)
    document.addEventListener('click', (e) => {
        const burger = e.target.closest('#menu_burger');
        if (burger) {
            const navUl = document.querySelector('.nav ul');
            if (navUl) {
                navUl.classList.toggle('active');
                burger.classList.toggle('active');
            }
        }
    });

    // 4. INITIALISER L'EFFET DACTYLO
    const monNom = document.querySelector('#sousTitre');
    if (monNom) {
        const texteNom = "Votre spécialiste en développement web";
        let i = 0;
        monNom.textContent = ""; 
        function taperNom1() {
            if (i < texteNom.length) {
                monNom.textContent += texteNom.charAt(i);
                i++;
                setTimeout(taperNom1, 150); 
            }
        }
        taperNom1();
    }

    const monNom2 = document.querySelector('#sousTitre2');
    if (monNom2) {
        const texteNom2 = "& ingénierie de données";
        let j = 0;
        monNom2.textContent = ""; 
        function taperNom2() {
            if (j < texteNom2.length) {
                monNom2.textContent += texteNom2.charAt(j);
                j++;
                setTimeout(taperNom2, 150); 
            }
        }
        taperNom2();
    }

    // 5. VALIDATION FORMULAIRE & CORRECTION ENVOI FORMSPREE
    const form = document.getElementById('contact-form');
    if (form) {
        const inputMessage = document.getElementById('message');
        const compteur = document.getElementById('compteur');
        const btn = document.getElementById('btn-envoyer');
        const tousLesChamps = form.querySelectorAll('input, textarea');

        tousLesChamps.forEach(champ => {
            champ.addEventListener('input', () => {
                if (champ.value.trim().length > 0) {
                    champ.classList.add('border-success');
                    champ.classList.remove('border-error');
                } else {
                    champ.classList.remove('border-success');
                }

                if (inputMessage && compteur && btn) {
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
                }
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            btn.textContent = "Envoi...";
            btn.disabled = true;

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
            }).catch(() => {
                btn.textContent = "Erreur réseau";
                btn.disabled = false;
            });
        });
    }
});

// Maj Vercel