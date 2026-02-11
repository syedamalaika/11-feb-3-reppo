document.addEventListener('DOMContentLoaded', () => {
    // --- State Variables ---
    let isYearly = false;
    let currentPlan = 'Pro'; // Default active plan

    // --- Selectors ---
    const billingToggle = document.getElementById('billingCycleToggle');
    const monthlyLabel = document.getElementById('monthlyLabel');
    const yearlyLabel = document.getElementById('yearlyLabel');
    const amounts = document.querySelectorAll('.amount');
    const pricingCards = document.querySelectorAll('.pricing-card');

    // Modals
    const cancelModal = document.getElementById('cancelModal');
    const upgradeModal = document.getElementById('upgradeModal');
    const addCardModal = document.getElementById('addCardModal');

    // Buttons
    const cancelPlanBtn = document.getElementById('cancelPlanBtn');
    const addCardBtn = document.getElementById('addCardBtn');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const selectPlanBtns = document.querySelectorAll('.select-plan-btn');
    const confirmCancelBtn = document.getElementById('confirmCancel');
    const confirmUpgradeBtn = document.getElementById('confirmUpgrade');
    const saveCardBtn = document.getElementById('saveCardBtn');
    const removeCardBtns = document.querySelectorAll('.remove-card-btn');

    // --- Billing Cycle Toggle Logic ---
    billingToggle.addEventListener('change', () => {
        isYearly = billingToggle.checked;
        updatePricingDisplay();
        updateToggleLabels();
    });

    function updatePricingDisplay() {
        amounts.forEach(amount => {
            const monthlyPrice = amount.getAttribute('data-monthly');
            const yearlyPrice = amount.getAttribute('data-yearly');

            // Animate number change
            animateValue(amount, isYearly ? parseInt(yearlyPrice) : parseInt(monthlyPrice), 500);
        });
    }

    function updateToggleLabels() {
        if (isYearly) {
            yearlyLabel.classList.add('active');
            monthlyLabel.classList.remove('active');
        } else {
            monthlyLabel.classList.add('active');
            yearlyLabel.classList.remove('active');
        }
    }

    // Number Animation Helper
    function animateValue(obj, end, duration) {
        let startTimestamp = null;
        const start = parseInt(obj.innerHTML);
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // --- Modal Logic ---
    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // General Close Modal Event
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal-overlay');
            closeModal(modal);
        });
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal(e.target);
        }
    });

    // Specific Modal Triggers
    if (cancelPlanBtn) {
        cancelPlanBtn.addEventListener('click', () => openModal(cancelModal));
    }

    addCardBtn.addEventListener('click', () => openModal(addCardModal));

    selectPlanBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const planName = e.target.getAttribute('data-plan');

            if (planName === currentPlan) return; // Already on this plan

            // Populate upgrade modal
            document.getElementById('upgradePlanName').innerText = planName;
            const price = e.target.closest('.pricing-card').querySelector('.amount').innerText;
            document.getElementById('upgradePlanPrice').innerText = `$${price}/${isYearly ? 'year' : 'month'}`;

            openModal(upgradeModal);
        });
    });

    // --- Action Button Logic (Simulation) ---
    confirmCancelBtn.addEventListener('click', () => {
        alert('Subscription has been cancelled. (Simulation)');
        closeModal(cancelModal);
    });

    confirmUpgradeBtn.addEventListener('click', () => {
        const newPlan = document.getElementById('upgradePlanName').innerText;
        alert(`Successfully upgraded to ${newPlan} plan!`);
        currentPlan = newPlan;
        closeModal(upgradeModal);

        // Update UI to reflect change (Simple Simulation)
        document.querySelector('.active-plan-card h3').innerText = newPlan + ' Plan';
    });

    saveCardBtn.addEventListener('click', () => {
        alert('New card added successfully! (Simulation)');
        closeModal(addCardModal);
        // Here we would append the new card HTML to .cards-grid
    });

    removeCardBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            if (confirm('Are you sure you want to remove this card?')) {
                this.closest('.credit-card').remove();
            }
        });
    });

});
