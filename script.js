'use strict';

/* ============================================================
   Mobile menu
   ============================================================ */
(() => {
    const menu = document.getElementById('mobile_menu');
    const openBtn = document.getElementById('menu_btn');
    const closeBtn = document.getElementById('close');
    const links = document.querySelectorAll('#mobile_list .mobile_link');

    const open = () => {
        menu.style.width = '100vw';
        document.body.style.overflow = 'hidden';
        openBtn.setAttribute('aria-expanded', 'true');
    };

    const close = () => {
        menu.style.width = '0';
        document.body.style.overflow = '';
        openBtn.setAttribute('aria-expanded', 'false');
    };

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    links.forEach((link) => link.addEventListener('click', close));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });
})();

/* ============================================================
   Scroll UI — sticky header, progress bar, back-to-top
   ============================================================ */
(() => {
    const header = document.getElementById('site_header');
    const bar = document.getElementById('progress_bar');
    const toTop = document.getElementById('to_top');

    const onScroll = () => {
        const scrolled = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;

        if (header) header.classList.toggle('scrolled', scrolled > 40);
        if (bar) bar.style.width = `${progress}%`;
        if (toTop) toTop.classList.toggle('visible', scrolled > 600);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (toTop) {
        toTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
})();

/* ============================================================
   Scrollspy — highlight active nav link
   ============================================================ */
(() => {
    if (!('IntersectionObserver' in window)) return;

    const links = Array.from(document.querySelectorAll('.navbar_link a, .mobile_link'));
    if (!links.length) return;

    const byId = new Map();
    links.forEach((link) => {
        const id = link.getAttribute('href');
        if (!id || !id.startsWith('#')) return;
        const section = document.querySelector(id);
        if (!section) return;
        if (!byId.has(section)) byId.set(section, []);
        byId.get(section).push(link);
    });

    const setActive = (section) => {
        links.forEach((l) => l.classList.remove('active'));
        (byId.get(section) || []).forEach((l) => l.classList.add('active'));
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(entry.target);
        });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    byId.forEach((_, section) => observer.observe(section));
})();

/* ============================================================
   Trainers carousel
   ============================================================ */
(() => {
    const track = document.getElementById('trainers_cards');
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
    if (!track || !prev || !next) return;

    const step = () => {
        const card = track.querySelector('.train_card');
        if (!card) return track.clientWidth;
        const gap = parseInt(getComputedStyle(track).columnGap) || 40;
        return card.getBoundingClientRect().width + gap;
    };

    const updateButtons = () => {
        const maxScroll = track.scrollWidth - track.clientWidth - 1;
        prev.disabled = track.scrollLeft <= 0;
        next.disabled = track.scrollLeft >= maxScroll;
    };

    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));

    track.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    updateButtons();
})();

/* ============================================================
   Trainer modal ("Подробнее")
   ============================================================ */
(() => {
    const modal = document.getElementById('trainer_modal');
    if (!modal) return;

    const photo = document.getElementById('modal_photo');
    const nameEl = document.getElementById('modal_name');
    const roleEl = document.getElementById('modal_role');
    const bioEl = document.getElementById('modal_bio');
    const closeEls = modal.querySelectorAll('[data-close]');
    let lastFocused = null;

    const openModal = (card) => {
        const img = card.querySelector('.trainer_photo');
        nameEl.textContent = card.dataset.name || '';
        roleEl.textContent = card.dataset.role || '';
        bioEl.textContent = card.dataset.bio || '';
        photo.src = img ? img.getAttribute('src') : '';
        photo.alt = card.dataset.name || '';

        lastFocused = document.activeElement;
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        modal.querySelector('.modal_close').focus();
    };

    const closeModal = () => {
        modal.hidden = true;
        document.body.style.overflow = '';
        if (lastFocused) lastFocused.focus();
    };

    document.querySelectorAll('.train_card .more').forEach((btn) => {
        btn.addEventListener('click', () => openModal(btn.closest('.train_card')));
    });

    closeEls.forEach((el) => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.hidden) closeModal();
    });
})();

/* ============================================================
   Scroll-reveal animations
   ============================================================ */
(() => {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry, i) => {
            if (!entry.isIntersecting) return;
            entry.target.style.transitionDelay = `${(i % 4) * 80}ms`;
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.15 });

    items.forEach((el) => observer.observe(el));
})();

/* ============================================================
   Animated counters
   ============================================================ */
(() => {
    const digits = document.querySelectorAll('.digit[data-target]');
    if (!digits.length) return;

    const format = (n) => n.toLocaleString('ru-RU');

    const animate = (el) => {
        const target = parseInt(el.dataset.target, 10);
        const duration = 1400;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = format(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) {
        digits.forEach(animate);
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animate(entry.target);
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.6 });

    digits.forEach((el) => observer.observe(el));
})();

/* ============================================================
   FAQ accordion
   ============================================================ */
(() => {
    const items = document.querySelectorAll('.faq_item');
    if (!items.length) return;

    const collapse = (panel, btn) => {
        panel.style.maxHeight = null;
        btn.setAttribute('aria-expanded', 'false');
    };

    const expand = (panel, btn) => {
        panel.style.maxHeight = `${panel.scrollHeight}px`;
        btn.setAttribute('aria-expanded', 'true');
    };

    items.forEach((item) => {
        const btn = item.querySelector('.faq_q');
        const panel = item.querySelector('.faq_a');

        btn.addEventListener('click', () => {
            const isOpen = btn.getAttribute('aria-expanded') === 'true';

            // Close every panel (single-open accordion)
            items.forEach((other) => {
                collapse(other.querySelector('.faq_a'), other.querySelector('.faq_q'));
            });

            if (!isOpen) expand(panel, btn);
        });
    });

    // Keep an open panel sized correctly on resize
    window.addEventListener('resize', () => {
        items.forEach((item) => {
            const btn = item.querySelector('.faq_q');
            const panel = item.querySelector('.faq_a');
            if (btn.getAttribute('aria-expanded') === 'true') {
                panel.style.maxHeight = `${panel.scrollHeight}px`;
            }
        });
    });
})();

/* ============================================================
   Form validation
   ============================================================ */
(() => {
    const form = document.getElementById('sign_up_form');
    if (!form) return;

    const success = document.getElementById('form_success');
    const fields = {
        name: form.querySelector('#name'),
        phone: form.querySelector('#phone'),
        email: form.querySelector('#email'),
    };

    const errorEl = (name) => form.querySelector(`.field_error[data-for="${name}"]`);

    const validators = {
        name: (v) => (v.trim().length >= 2 ? '' : 'Введите имя (минимум 2 символа)'),
        phone: (v) => (v.replace(/\D/g, '').length === 11 ? '' : 'Введите телефон полностью'),
        email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Введите корректный e-mail'),
    };

    // Phone mask: +7 (XXX) XXX-XX-XX
    const formatPhone = (value) => {
        let d = value.replace(/\D/g, '');
        if (d.length && (d[0] === '7' || d[0] === '8')) d = d.slice(1);
        d = d.slice(0, 10);
        if (!d.length) return '';
        let out = '+7 (' + d.slice(0, 3);
        if (d.length >= 3) out += ')';
        if (d.length > 3) out += ' ' + d.slice(3, 6);
        if (d.length > 6) out += '-' + d.slice(6, 8);
        if (d.length > 8) out += '-' + d.slice(8, 10);
        return out;
    };

    fields.phone.addEventListener('input', () => {
        fields.phone.value = formatPhone(fields.phone.value);
    });

    const validateField = (name) => {
        const input = fields[name];
        const message = validators[name](input.value);
        errorEl(name).textContent = message;
        input.classList.toggle('invalid', Boolean(message));
        input.setAttribute('aria-invalid', message ? 'true' : 'false');
        return !message;
    };

    Object.keys(fields).forEach((name) => {
        fields[name].addEventListener('input', () => {
            if (fields[name].classList.contains('invalid')) validateField(name);
            success.hidden = true;
        });
        fields[name].addEventListener('blur', () => validateField(name));
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const valid = Object.keys(fields).map(validateField).every(Boolean);
        if (!valid) {
            const firstInvalid = form.querySelector('.inp.invalid');
            if (firstInvalid) firstInvalid.focus();
            return;
        }
        success.hidden = false;
        form.reset();
    });
})();
