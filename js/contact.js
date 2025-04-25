document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        setTimeout(() => {
            alert('Thank you for your message! We will respond within 3 working days.');
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Query';
        }, 1500);
    });
});