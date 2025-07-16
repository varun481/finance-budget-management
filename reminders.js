(function() {
    // Apply theme immediately to prevent modal flicker
    const savedTheme = localStorage.getItem('theme') || 'light';
    const isDark = savedTheme === 'dark';
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(isDark ? 'dark-theme' : 'light-theme');
    document.body.style.background = isDark ? '#1A1E3A' : 'linear-gradient(180deg, #E6E9FF 0%, #A8B1FF 50%, #F7F8FF 100%)';
    // Ensure modals are hidden
    const themeModal = document.getElementById('theme-modal');
    if (themeModal) themeModal.style.display = 'none';
    const profileModal = document.getElementById('profile-modal');
    if (profileModal) profileModal.style.display = 'none';
    // Show the page after applying styles
    document.body.style.visibility = 'visible';
})();

document.addEventListener('DOMContentLoaded', function() {
    // Normalize contextPath to ensure it starts with '/' and has no trailing '/'
    let contextPath = window.contextPath || '';
    contextPath = contextPath.replace(/^\/+|\/+$/g, '');
    if (contextPath) contextPath = '/' + contextPath;
    console.log('Normalized Context Path:', contextPath);

    // Highlight active nav-item based on current page
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-item').forEach(item => {
        const href = item.getAttribute('href').split('/').pop();
        if (href === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Dropdown menu toggle
    const menuIcon = document.getElementById('menu-icon');
    const dropdown = document.getElementById('menu-dropdown');
    if (menuIcon && dropdown) {
        menuIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Menu icon clicked, toggling dropdown');
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });

        document.addEventListener('click', function(e) {
            if (!e.target.closest('#menu-icon') && !e.target.closest('#menu-dropdown')) {
                console.log('Clicked outside, hiding dropdown');
                dropdown.style.display = 'none';
            }
        });
    }

    // Navigation menu items
    const navMenuItems = {
        'home-menu-item': 'home.jsp',
        'about-menu-item': 'about.jsp',
        'contact-menu-item': 'contact.jsp',
        'create-account-menu-item': 'signup.jsp'
    };
    Object.keys(navMenuItems).forEach(itemId => {
        const menuItem = document.getElementById(itemId);
        if (menuItem) {
            menuItem.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.style.display = 'none';
                const targetPage = navMenuItems[itemId];
                const url = contextPath + '/' + targetPage;
                console.log('Navigating to:', url);
                window.location.href = url;
            });
        } else {
            console.warn('Menu item not found:', itemId);
        }
    });

    // Profile modal
    const profileMenuItem = document.getElementById('profile-menu-item');
    if (profileMenuItem) {
        profileMenuItem.addEventListener('click', function() {
            console.log('Profile menu item clicked');
            dropdown.style.display = 'none';
            const modal = document.getElementById('profile-modal');
            const iframe = document.getElementById('profile-iframe');
            if (modal && iframe) {
                const userFullname = (typeof sessionScope !== 'undefined' && sessionScope.userFullname) || 'User';
                const userEmail = (typeof sessionScope !== 'undefined' && sessionScope.userEmail) || 'email@example.com';
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
                                <h1 class="username">${userFullname.replace(/</g, '<').replace(/>/g, '>')}</h1>
                            </div>
                            <div class="divider"></div>
                            <div class="info-section">
                                <h2 class="section-title">CONTACT INFORMATION</h2>
                                <div class="info-row"><div class="info-label">Email id:</div><div class="info-value">${userEmail.replace(/</g, '<').replace(/>/g, '>')}</div></div>
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
            }
        });
    }

    // Theme modal
    const themeMenuItem = document.getElementById('theme-menu-item');
    if (themeMenuItem) {
        themeMenuItem.addEventListener('click', function() {
            console.log('Theme menu item clicked');
            dropdown.style.display = 'none';
            const themeModal = document.getElementById('theme-modal');
            if (themeModal) themeModal.style.display = 'flex';
        });
    }

    const applyTheme = (theme) => {
        const isDark = theme === 'dark';
        document.body.classList.remove('dark-theme', 'light-theme');
        document.body.classList.add(isDark ? 'dark-theme' : 'light-theme');
        document.body.style.background = isDark ? '#1A1E3A' : 'linear-gradient(180deg, #E6E9FF 0%, #A8B1FF 50%, #F7F8FF 100%)';
        const themeModal = document.getElementById('theme-modal');
        if (themeModal) themeModal.style.display = 'none';
        const profileModal = document.getElementById('profile-modal');
        if (profileModal && profileModal.style.display !== 'block') profileModal.style.display = 'none';
        localStorage.setItem('theme', theme);
    };

    const lightTheme = document.getElementById('light-theme');
    if (lightTheme) {
        lightTheme.addEventListener('click', () => {
            console.log('Applying light theme');
            applyTheme('light');
        });
    }

    const darkTheme = document.getElementById('dark-theme');
    if (darkTheme) {
        darkTheme.addEventListener('click', () => {
            console.log('Applying dark theme');
            applyTheme('dark');
        });
    }

    // Logout
    const logoutMenuItem = document.getElementById('logout-menu-item');
    if (logoutMenuItem) {
        logoutMenuItem.addEventListener('click', function() {
            console.log('Logout menu item clicked');
            if (confirm('Are you sure you want to log out?')) {
                const url = contextPath + '/logoutservlete';
                console.log('Navigating to logout:', url);
                window.location.href = url;
            }
        });
    }

    // Modal close buttons
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                console.log('Closing modal');
                modal.classList.add('closing');
                setTimeout(() => {
                    modal.style.display = 'none';
                    modal.classList.remove('closing');
                }, 300);
            }
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                console.log('Clicked outside modal, closing');
                modal.classList.add('closing');
                setTimeout(() => {
                    modal.style.display = 'none';
                    modal.classList.remove('closing');
                }, 300);
            }
        });
    });

    // Reminder functionality
    window.addReminder = function() {
        const titleInput = document.getElementById('reminderTitle');
        const amountInput = document.getElementById('reminderAmount');
        const dueDateInput = document.getElementById('reminderDueDate');

        if (!titleInput.value || !amountInput.value || !dueDateInput.value) {
            alert('Please fill in all fields.');
            return;
        }

        const reminder = {
            title: titleInput.value,
            amount: parseFloat(amountInput.value).toFixed(2),
            dueDate: dueDateInput.value
        };

        fetch(contextPath + '/reminderservlete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=add&title=${encodeURIComponent(reminder.title)}&amount=${reminder.amount}&dueDate=${reminder.dueDate}`
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                titleInput.value = '';
                amountInput.value = '';
                dueDateInput.value = '';
                displayReminders();
            } else {
                alert('Failed to add reminder: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error adding reminder:', error);
            alert('Error adding reminder: ' + error.message);
        });
    };

    function displayReminders() {
        const reminderList = document.getElementById('reminder-list');
        const completedReminderList = document.getElementById('completed-reminder-list');

        fetch(contextPath + '/reminderservlete')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(reminders => {
            reminderList.innerHTML = '';
            completedReminderList.innerHTML = '';

            reminders.forEach(reminder => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="reminder-details ${reminder.completed ? 'completed' : ''}">
                        <span>${reminder.title}</span>
                        <span>$${reminder.amount.toFixed(2)} - Due: ${reminder.dueDate}</span>
                    </div>
                    <div class="reminder-actions">
                        ${!reminder.completed ? `<button class="complete-button" onclick="completeReminder(${reminder.id})">Complete</button>` : ''}
                        <button class="delete-button" onclick="deleteReminder(${reminder.id})">Delete</button>
                    </div>
                `;
                if (reminder.completed) {
                    completedReminderList.appendChild(li);
                } else {
                    reminderList.appendChild(li);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching reminders:', error);
            alert('Error fetching reminders: ' + error.message);
        });
    }

    window.completeReminder = function(id) {
        fetch(contextPath + '/reminderservlete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=complete&id=${id}`
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                displayReminders();
            } else {
                alert('Failed to complete reminder: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error completing reminder:', error);
            alert('Error completing reminder: ' + error.message);
        });
    };

    window.deleteReminder = function(id) {
        fetch(contextPath + '/reminderservlete?id=' + id, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                displayReminders();
            } else {
                alert('Failed to delete reminder: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error deleting reminder:', error);
            alert('Error deleting reminder: ' + error.message);
        });
    };

    // Initialize reminders
    displayReminders();
});