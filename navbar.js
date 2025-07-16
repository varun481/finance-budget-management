document.addEventListener('DOMContentLoaded', function() {
    // Ensure contextPath is defined
    const contextPath = window.contextPath || '';
    console.log('Context Path:', contextPath); // Debug

    // Hamburger menu
    const menuIcon = document.getElementById('menu-icon');
    const dropdown = document.getElementById('menu-dropdown');
    if (menuIcon && dropdown) {
        menuIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'none' || dropdown.style.display === '' ? 'block' : 'none';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('#menu-icon') && !e.target.closest('#menu-dropdown')) {
                dropdown.style.display = 'none';
            }
        });
    }

    // Dropdown navigation
    const navMenuItems = {
        'home': 'home.jsp',
        'about': 'about.jsp',
        'contact': 'contact.jsp',
        'create-account': 'signup.jsp'
    };
    Object.keys(navMenuItems).forEach(item => {
        const menuItem = document.getElementById(`${item}-menu-item`);
        if (menuItem) {
            menuItem.addEventListener('click', function() {
                dropdown.style.display = 'none';
                window.location.href = contextPath + '/' + navMenuItems[item];
            });
        }
    });

    // Profile modal
    const profileMenuItem = document.getElementById('profile-menu-item');
    if (profileMenuItem) {
        profileMenuItem.addEventListener('click', function() {
            dropdown.style.display = 'none';
            const modal = document.getElementById('profile-modal');
            const iframe = document.getElementById('profile-iframe');
            iframe.srcdoc = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>User Profile</title>
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
                        body { background-color: #F7F8FF; min-height: 100vh; padding: 20px; }
                        .profile-container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 15px; overflow: hidden; box-shadow: 0 2px 8px rgba(95, 111, 255, 0.1); }
                        .profile-header { text-align: center; padding: 30px 20px; }
                        .profile-image-container { width: 220px; height: 120px; margin: 0 auto 20px; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(95, 111, 255, 0.2); }
                        .profile-image { width: 100%; height: 100%; object-fit: cover; }
                        .username { font-size: 28px; font-weight: 500; color: #1A1E3A; margin-bottom: 5px; }
                        .divider { height: 1px; background-color: #E6E9FF; margin: 0 20px; }
                        .info-section { padding: 20px; }
                        .section-title { font-size: 18px; font-weight: 500; color: #5f6FFF; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; text-decoration: underline; }
                        .info-row { display: flex; margin-bottom: 25px; }
                        .info-label { flex: 0 0 120px; font-size: 18px; color: #1A1E3A; }
                        .info-value { flex: 1; font-size: 18px; color: #7B8CFF; text-align: right; }
                        .edit-button { display: block; width: 180px; height: 50px; margin: 40px auto 20px; background-color: #5f6FFF; border: none; border-radius: 50px; color: #FFFFFF; font-size: 18px; cursor: pointer; transition: background-color 0.3s ease; }
                        .edit-button:hover { background-color: #7B8CFF; }
                    </style>
                </head>
                <body>
                    <div class="profile-container">
                        <div class="profile-header">
                            <div class="profile-image-container">
                                <img src="${contextPath}/api/placeholder/220/120" alt="Profile Image" class="profile-image">
                            </div>
                            <h1 class="username">${sessionScope.userFullname}</h1>
                        </div>
                        <div class="divider"></div>
                        <div class="info-section">
                            <h2 class="section-title">CONTACT INFORMATION</h2>
                            <div class="info-row"><div class="info-label">Email id:</div><div class="info-value">${sessionScope.userEmail}</div></div>
                            <div class="info-row"><div class="info-label">Phone:</div><div class="info-value">8978683569</div></div>
                            <div class="info-row"><div class="info-label">Address:</div><div class="info-value">janthacolony<br>sriharipuram</div></div>
                        </div>
                        <div class="divider"></div>
                        <div class="info-section">
                            <h2 class="section-title">BASIC INFORMATION</h2>
                            <div class="info-row"><div class="info-label">Gender:</div><div class="info-value">Not Selected</div></div>
                            <div class="info-row"><div class="info-label">Birthday:</div><div class="info-value">2005-05-02</div></div>
                        </div>
                        <button class="edit-button">Edit</button>
                    </div>
                </body>
                </html>
            `;
            modal.style.display = 'block';
        });
    }

    // Theme modal
    const themeMenuItem = document.getElementById('theme-menu-item');
    if (themeMenuItem) {
        themeMenuItem.addEventListener('click', function() {
            dropdown.style.display = 'none';
            document.getElementById('theme-modal').style.display = 'block';
            updateThemeModal();
        });
    }

    // Function to update theme modal visual feedback
    function updateThemeModal() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const lightThemeDiv = document.getElementById('light-theme');
        const darkThemeDiv = document.getElementById('dark-theme');
        if (lightThemeDiv && darkThemeDiv) {
            lightThemeDiv.classList.remove('theme-active');
            darkThemeDiv.classList.remove('theme-active');
            if (currentTheme === 'dark') {
                darkThemeDiv.classList.add('theme-active');
            } else {
                lightThemeDiv.classList.add('theme-active');
            }
        }
    }

    // Apply theme function
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.style.background = '#1A1E3A';
            document.body.style.color = '#FFFFFF';
            const navbar = document.querySelector('.navbar');
            if (navbar) navbar.style.backgroundColor = '#2A2E4A';
            document.querySelectorAll('.nav-link').forEach(item => item.style.color = '#FFFFFF');
            const userStatus = document.querySelector('.user-status');
            if (userStatus) userStatus.style.color = '#FFFFFF';
            document.querySelectorAll('.menu-item').forEach(item => item.style.color = '#FFFFFF');
            const dropdownEl = document.querySelector('.dropdown');
            if (dropdownEl) dropdownEl.style.backgroundColor = '#2A2E4A';
            const modalContent = document.querySelector('.modal-content');
            if (modalContent) modalContent.style.backgroundColor = '#2A2E4A';
            const modalTitle = document.querySelector('.modal h2');
            if (modalTitle) modalTitle.style.color = '#FFFFFF';
            document.querySelectorAll('.close-button').forEach(button => button.style.color = '#FFFFFF');
            document.querySelectorAll('.theme-options p').forEach(p => p.style.color = '#FFFFFF');
            // About page elements
            if (document.querySelector('.about-title')) {
                document.querySelector('.about-title').style.color = '#A8B1FF';
            }
            if (document.querySelectorAll('.about-text').length > 0) {
                document.querySelectorAll('.about-text').forEach(text => text.style.color = '#FFFFFF');
            }
            if (document.querySelector('.why-choose-title')) {
                document.querySelector('.why-choose-title').style.color = '#A8B1FF';
            }
            if (document.querySelectorAll('.box-title').length > 0) {
                document.querySelectorAll('.box-title').forEach(title => title.style.color = '#A8B1FF');
            }
            if (document.querySelectorAll('.box-text').length > 0) {
                document.querySelectorAll('.box-text').forEach(text => text.style.color = '#000000');
            }
            // Contact page elements
            if (document.querySelector('.contact-title')) {
                document.querySelector('.contact-title').style.color = '#A8B1FF';
            }
            if (document.querySelectorAll('.contact-text').length > 0) {
                document.querySelectorAll('.contact-text').forEach(text => text.style.color = '#FFFFFF');
            }
            // Home page elements
            if (document.querySelectorAll('.card').length > 0) {
                document.querySelectorAll('.card').forEach(card => card.style.backgroundColor = '#2A2E4A');
            }
            if (document.querySelectorAll('.card-title').length > 0) {
                document.querySelectorAll('.card-title').forEach(item => item.style.color = '#A8B1FF');
            }
            if (document.querySelectorAll('.card-value').length > 0) {
                document.querySelectorAll('.card-value').forEach(item => item.style.color = '#FFFFFF');
            }
            if (document.querySelector('.nav-bar')) {
                document.querySelector('.nav-bar').style.backgroundColor = '#2A2E4A';
            }
            if (document.querySelectorAll('.nav-item').length > 0) {
                document.querySelectorAll('.nav-item').forEach(item => item.style.color = '#FFFFFF');
            }
            if (document.querySelectorAll('.nav-icon').length > 0) {
                document.querySelectorAll('.nav-icon').forEach(icon => icon.style.color = '#A8B1FF');
            }
            if (document.querySelector('.chart-label p')) {
                document.querySelector('.chart-label p').style.color = '#A8B1FF';
            }
            if (document.querySelector('.chart-label h2')) {
                const savingsAmount = document.querySelector('.chart-label h2');
                if (savingsAmount.classList.contains('positive')) {
                    savingsAmount.style.color = '#28A745';
                } else if (savingsAmount.classList.contains('negative')) {
                    savingsAmount.style.color = '#DC3545';
                } else {
                    savingsAmount.style.color = '#FFFFFF';
                }
            }
            if (document.querySelectorAll('.transaction-box').length > 0) {
                document.querySelectorAll('.transaction-box').forEach(box => box.style.backgroundColor = '#2A2E4A');
            }
            if (document.querySelectorAll('.transaction-title').length > 0) {
                document.querySelectorAll('.transaction-title').forEach(title => title.style.color = '#FFFFFF');
            }
        } else {
            document.body.style.background = 'linear-gradient(180deg, #E6E9FF 0%, #A8B1FF 50%, #F7F8FF 100%)';
            document.body.style.color = '#1A1E3A';
            const navbar = document.querySelector('.navbar');
            if (navbar) navbar.style.backgroundColor = '#FFFFFF';
            document.querySelectorAll('.nav-link').forEach(item => item.style.color = '#1A1E3A');
            const userStatus = document.querySelector('.user-status');
            if (userStatus) userStatus.style.color = '#1A1E3A';
            document.querySelectorAll('.menu-item').forEach(item => item.style.color = '#1A1E3A');
            const dropdownEl = document.querySelector('.dropdown');
            if (dropdownEl) dropdownEl.style.backgroundColor = '#FFFFFF';
            const modalContent = document.querySelector('.modal-content');
            if (modalContent) modalContent.style.backgroundColor = '#FFFFFF';
            const modalTitle = document.querySelector('.modal h2');
            if (modalTitle) modalTitle.style.color = '#1A1E3A';
            document.querySelectorAll('.close-button').forEach(button => button.style.color = '#1A1E3A');
            document.querySelectorAll('.theme-options p').forEach(p => p.style.color = '#1A1E3A');
            // About page elements
            if (document.querySelector('.about-title')) {
                document.querySelector('.about-title').style.color = '#5F6FFF';
            }
            if (document.querySelectorAll('.about-text').length > 0) {
                document.querySelectorAll('.about-text').forEach(text => text.style.color = '#333');
            }
            if (document.querySelector('.why-choose-title')) {
                document.querySelector('.why-choose-title').style.color = '#5F6FFF';
            }
            if (document.querySelectorAll('.box-title').length > 0) {
                document.querySelectorAll('.box-title').forEach(title => title.style.color = '#5F6FFF');
            }
            if (document.querySelectorAll('.box-text').length > 0) {
                document.querySelectorAll('.box-text').forEach(text => text.style.color = '#333');
            }
            // Contact page elements
            if (document.querySelector('.contact-title')) {
                document.querySelector('.contact-title').style.color = '#5F6FFF';
            }
            if (document.querySelectorAll('.contact-text').length > 0) {
                document.querySelectorAll('.contact-text').forEach(text => text.style.color = '#333');
            }
            // Home page elements
            if (document.querySelectorAll('.card').length > 0) {
                document.querySelectorAll('.card').forEach(card => card.style.backgroundColor = '#FFFFFF');
            }
            if (document.querySelectorAll('.card-title').length > 0) {
                document.querySelectorAll('.card-title').forEach(item => item.style.color = '#5F6FFF');
            }
            if (document.querySelectorAll('.card-value').length > 0) {
                document.querySelectorAll('.card-value').forEach(item => item.style.color = '#1A1E3A');
            }
            if (document.querySelector('.nav-bar')) {
                document.querySelector('.nav-bar').style.backgroundColor = '#FFFFFF';
            }
            if (document.querySelectorAll('.nav-item').length > 0) {
                document.querySelectorAll('.nav-item').forEach(item => item.style.color = '#1A1E3A');
            }
            if (document.querySelectorAll('.nav-icon').length > 0) {
                document.querySelectorAll('.nav-icon').forEach(icon => icon.style.color = '#5F6FFF');
            }
            if (document.querySelector('.chart-label p')) {
                document.querySelector('.chart-label p').style.color = '#FF6B6B';
            }
            if (document.querySelector('.chart-label h2')) {
                document.querySelector('.chart-label h2').style.color = '#1A1E3A';
            }
            if (document.querySelectorAll('.transaction-box').length > 0) {
                document.querySelectorAll('.transaction-box').forEach(box => box.style.backgroundColor = '#FFFFFF');
            }
            if (document.querySelectorAll('.transaction-title').length > 0) {
                document.querySelectorAll('.transaction-title').forEach(title => title.style.color = '#1A1E3A');
            }
        }
        localStorage.setItem('theme', theme);
        updateThemeModal();
    }

    // Theme selection
    const lightTheme = document.getElementById('light-theme');
    if (lightTheme) {
        lightTheme.addEventListener('click', function() {
            applyTheme('light');
            document.getElementById('theme-modal').style.display = 'none';
        });
    }

    const darkTheme = document.getElementById('dark-theme');
    if (darkTheme) {
        darkTheme.addEventListener('click', function() {
            applyTheme('dark');
            document.getElementById('theme-modal').style.display = 'none';
        });
    }

    // Logout
    const logoutMenuItem = document.getElementById('logout-menu-item');
    if (logoutMenuItem) {
        logoutMenuItem.addEventListener('click', function() {
            if (confirm('Are you sure you want to log out?')) {
                window.location.href = contextPath + '/logoutservlete';
            }
        });
    }

    // Close modals
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    window.addEventListener('click', function(event) {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Apply saved theme on page load
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
});