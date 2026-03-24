// ============================================================
// BANNER DE COOKIES
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    const privacyPopup = document.getElementById('privacyPopup');
    const privacyClose = document.getElementById('privacyClose');
    const privacyAccept = document.getElementById('privacyAccept');
    const privacyFullAccept = document.getElementById('privacyFullAccept');
    const privacySettings = document.getElementById('privacySettings');
    const privacyLinks = document.querySelectorAll('.privacy-link');
    
    // Verificar se usuário já aceitou os cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    
    // Mostrar banner se ainda não foi aceito
    if (!cookiesAccepted) {
        setTimeout(() => {
            privacyPopup.classList.add('active');
        }, 1000); // Mostra após 1 segundo
    }
    
    // Função para aceitar cookies
    function acceptCookies() {
        localStorage.setItem('cookiesAccepted', 'true');
        privacyPopup.classList.remove('active');
    }
    
    // Função para abrir popup completo
    function openFullPopup() {
        privacyPopup.classList.add('full-popup');
        
        // Foco no título para acessibilidade
        const privacyTitle = document.getElementById('privacyTitle');
        if (privacyTitle) {
            setTimeout(() => privacyTitle.focus(), 100);
        }
    }
    
    // Função para fechar popup completo
    function closeFullPopup() {
        privacyPopup.classList.remove('full-popup');
    }
    
    // Aceitar cookies (banner)
    if (privacyAccept) {
        privacyAccept.addEventListener('click', acceptCookies);
    }
    
    // Aceitar cookies (popup completo)
    if (privacyFullAccept) {
        privacyFullAccept.addEventListener('click', acceptCookies);
    }
    
    // Abrir configurações
    if (privacySettings) {
        privacySettings.addEventListener('click', function(e) {
            e.preventDefault();
            openFullPopup();
        });
    }
    
    // Fechar popup completo
    if (privacyClose) {
        privacyClose.addEventListener('click', closeFullPopup);
    }
    
    // Links de política (abrem popup completo)
    privacyLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (!privacyPopup.classList.contains('full-popup')) {
                openFullPopup();
            }
        });
    });
    
    // Fechar ao clicar no overlay (apenas no popup completo)
    privacyPopup.addEventListener('click', function(e) {
        if (privacyPopup.classList.contains('full-popup') && e.target === privacyPopup) {
            closeFullPopup();
        }
    });
    
    // Fechar com ESC (apenas no popup completo)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && privacyPopup.classList.contains('full-popup')) {
            closeFullPopup();
        }
    });
    
    // Manter foco dentro do popup (trap focus)
    privacyPopup.addEventListener('keydown', function(e) {
        if (e.key === 'Tab' && privacyPopup.classList.contains('full-popup')) {
            const focusableElements = privacyPopup.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
});
