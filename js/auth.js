document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
  
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
  
      const officialId = document.getElementById("officialId").value.trim();
      const password = document.getElementById("password").value.trim();
      const submitBtn = document.querySelector("button[type='submit']");
  
      if (!officialId || !password) {
        alert("Please enter both Official ID and Password.");
        return;
      }
  
      submitBtn.disabled = true;
      submitBtn.textContent = "Logging in...";
  
      try {
        const response = await fetch("http://localhost/Final_220Project/backend/api/auth.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            action: "login",
            email: officialId,
            password: password
          })
        });
  
        const data = await response.json();
  
        if (response.ok && data.success) {
          // Save the token to localStorage
          localStorage.setItem("token", data.token);
          alert("Login successful! Redirecting to dashboard...");
          window.location.href = "index.html"; // redirect on success
        } else {
          alert("Login failed: " + (data.error || "Unknown error."));
        }
      } catch (error) {
        console.error("Login Error:", error);
        alert("An error occurred during login. Please try again.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Login";
      }
    });
  });
  
// Registration form handling
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const officialId = document.getElementById('officialId').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://localhost/Final_220Project/backend/api/auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'register',
                    username: fullName,
                    email: email,
                    password: password
                })
            });

            const data = await response.json();
            
            if (data.success) {
                alert('Registration successful! Please login.');
                window.location.href = 'login.html';
            } else {
                alert(data.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during registration');
        }
    });
}
  
// Function to check authentication status and update UI
function updateAuthUI() {
    const token = localStorage.getItem('token');
    const loginLink = document.querySelector('a[href="login.html"]');
    
    if (token) {
        // User is logged in
        if (loginLink) {
            loginLink.textContent = 'Logout';
            loginLink.href = '#';
            loginLink.onclick = function(e) {
                e.preventDefault();
                localStorage.removeItem('token');
                window.location.href = 'login.html';
            };
        }
    } else {
        // User is not logged in
        if (loginLink) {
            loginLink.textContent = 'Login';
            loginLink.href = 'login.html';
            loginLink.onclick = null;
        }
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
});
  