(function() {
    // Apply theme immediately to prevent modal flicker
    const savedTheme = localStorage.getItem('theme') || 'light';
    const isDark = savedTheme === 'dark';
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(isDark ? 'dark-theme' : 'light-theme');
    document.body.style.background = isDark ? '#1A1E3A' : 'linear-gradient(180deg, #E6E9FF 0%, #A8B1FF 50%, #F7F8FF 100%)';
    // Ensure theme modal is hidden
    const themeModal = document.getElementById('theme-modal');
    if (themeModal) themeModal.style.display = 'none';
})();

document.addEventListener('DOMContentLoaded', function() {
    const contextPath = window.contextPath || '';
    console.log('Context Path:', contextPath);

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

    const errorMessageDiv = document.getElementById('error-message');

    function showError(message) {
        if (errorMessageDiv) {
            errorMessageDiv.textContent = message;
            errorMessageDiv.style.display = 'block';
        }
    }

    function clearError() {
        if (errorMessageDiv) {
            errorMessageDiv.textContent = '';
            errorMessageDiv.style.display = 'none';
        }
    }

    function formatCurrency(amount) {
        return '$' + Math.abs(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    const applyTheme = (theme) => {
        const isDark = theme === 'dark';
        document.body.classList.remove('dark-theme', 'light-theme');
        document.body.classList.add(isDark ? 'dark-theme' : 'light-theme');
        document.body.style.background = isDark ? '#1A1E3A' : 'linear-gradient(180deg, #E6E9FF 0%, #A8B1FF 50%, #F7F8FF 100%)';
        const themeModal = document.getElementById('theme-modal');
        if (themeModal) {
            themeModal.style.display = 'none';
        }
        const profileModal = document.getElementById('profile-modal');
        if (profileModal && profileModal.style.display !== 'block') profileModal.style.display = 'none';
        localStorage.setItem('theme', theme);
    };
	
    async function fetchAndDisplayHistory() {
        clearError();
        const historyTablesDiv = document.getElementById('history-tables');
        if (!historyTablesDiv) return;

        try {
            const historyUrl = `${contextPath}/historyservlete`;
            console.log(`Fetching transactions: ${historyUrl}`);
            const response = await fetch(historyUrl);
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Failed to fetch transactions: HTTP ${response.status}: ${text}`);
            }
            let transactions;
            try {
                transactions = await response.json();
            } catch (jsonError) {
                throw new Error(`Invalid JSON response: ${jsonError.message}`);
            }
            console.log(`Total transactions count: ${transactions.length}`, transactions);

            const validTransactions = [];
            const invalidTransactions = [];
            transactions.forEach(t => {
                const isValid = t &&
                    typeof t.id === 'number' &&
                    typeof t.type === 'string' && ['CREDIT', 'DEBIT'].includes(t.type) &&
                    typeof t.amount === 'number' &&
                    typeof t.purpose === 'string' &&
                    typeof t.date === 'string';
                if (isValid) {
                    const parsedDate = new Date(t.date);
                    if (!isNaN(parsedDate.getTime())) {
                        t.date = parsedDate.toISOString().split('T')[0];
                        validTransactions.push(t);
                    } else {
                        invalidTransactions.push(t);
                    }
                } else {
                    invalidTransactions.push(t);
                }
            });

            if (invalidTransactions.length > 0) {
                console.warn(`Invalid transactions count: ${invalidTransactions.length}`, invalidTransactions);
                showError(`Warning: ${invalidTransactions.length} invalid transactions were ignored.`);
            }

            if (validTransactions.length === 0) {
                historyTablesDiv.innerHTML = '<p class="no-transactions">No transactions found.</p>';
                document.getElementById('total-savings').textContent = formatCurrency(0);
                document.getElementById('total-credits').textContent = formatCurrency(0);
                document.getElementById('total-debits').textContent = formatCurrency(0);
                return;
            }

            const monthGroups = {};
            validTransactions.forEach(t => {
                const date = new Date(t.date);
                const year = date.getFullYear();
                const month = date.toLocaleString('default', { month: 'long' });
                const key = `${month} ${year}`;
                if (!monthGroups[key]) {
                    monthGroups[key] = { year, month, credits: [], debits: [] };
                }
                if (t.type === 'CREDIT') {
                    monthGroups[key].credits.push(t);
                } else {
                    monthGroups[key].debits.push(t);
                }
            });

            let totalCredits = 0;
            let totalDebits = 0;
            validTransactions.forEach(t => {
                if (t.type === 'CREDIT') {
                    totalCredits += t.amount;
                } else {
                    totalDebits += t.amount;
                }
            });
            const totalSavings = totalCredits - totalDebits;

            document.getElementById('total-savings').textContent = (totalSavings < 0 ? '-' : '') + formatCurrency(totalSavings);
            document.getElementById('total-credits').textContent = formatCurrency(totalCredits);
            document.getElementById('total-debits').textContent = formatCurrency(totalDebits);

            historyTablesDiv.innerHTML = '';
            Object.keys(monthGroups).sort((a, b) => {
                const [monthA, yearA] = a.split(' ');
                const [monthB, yearB] = b.split(' ');
                const dateA = new Date(`${monthA} 1, ${yearA}`);
                const dateB = new Date(`${monthB} 1, ${yearB}`);
                return dateB - dateA;
            }).forEach(key => {
                const group = monthGroups[key];
                const credits = group.credits;
                const debits = group.debits;
                const creditTotal = credits.reduce((sum, t) => sum + t.amount, 0);
                const debitTotal = debits.reduce((sum, t) => sum + t.amount, 0);
                const savings = creditTotal - debitTotal;

                const tableHtml = `
                    <div class="month-section">
                        <h2>${key}</h2>
                        <table class="history-table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Purpose</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${credits.concat(debits).sort((a, b) => new Date(a.date) - new Date(b.date)).map(t => `
                                    <tr>
                                        <td>${t.type}</td>
                                        <td>${formatCurrency(t.amount)}</td>
                                        <td>${t.purpose}</td>
                                        <td>${t.date}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        <div class="month-summary">
                            <p>Total Credits: ${formatCurrency(creditTotal)}</p>
                            <p>Total Debits: ${formatCurrency(debitTotal)}</p>
                            <p>Savings: ${(savings < 0 ? '-' : '') + formatCurrency(savings)}</p>
                        </div>
                    </div>
                `;
                historyTablesDiv.insertAdjacentHTML('beforeend', tableHtml);
            });
        } catch (error) {
            console.error('Error fetching history:', error);
            showError(`Error loading transaction history: ${error.message}`);
            historyTablesDiv.innerHTML = '<p class="no-transactions">Unable to load transactions.</p>';
        }
    }

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            console.log('Nav item clicked:', { text: this.textContent.trim(), href });
            if (href && href !== '#') {
                navItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            } else {
                e.preventDefault();
                console.log('Navigation prevented for href:', href);
            }
        });
    });

    const menuIcon = document.getElementById('menu-icon');
    const dropdown = document.getElementById('menu-dropdown');
    if (menuIcon && dropdown) {
        menuIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });

        document.addEventListener('click', function(e) {
            if (!e.target.closest('#menu-icon') && !e.target.closest('#menu-dropdown')) {
                dropdown.style.display = 'none';
            }
        });
    }

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

    const profileMenuItem = document.getElementById('profile-menu-item');
    if (profileMenuItem) {
        profileMenuItem.addEventListener('click', function() {
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

    const themeMenuItem = document.getElementById('theme-menu-item');
    if (themeMenuItem) {
        themeMenuItem.addEventListener('click', function() {
            dropdown.style.display = 'none';
            const themeModal = document.getElementById('theme-modal');
            if (themeModal) themeModal.style.display = 'flex';
        });
    }

    const lightTheme = document.getElementById('light-theme');
    if (lightTheme) {
        lightTheme.addEventListener('click', () => applyTheme('light'));
    }

    const darkTheme = document.getElementById('dark-theme');
    if (darkTheme) {
        darkTheme.addEventListener('click', () => applyTheme('dark'));
    }

    const logoutMenuItem = document.getElementById('logout-menu-item');
    if (logoutMenuItem) {
        logoutMenuItem.addEventListener('click', function() {
            if (confirm('Are you sure you want to log out?')) {
                window.location.href = contextPath + '/logoutservlete';
            }
        });
    }

    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.add('closing');
                setTimeout(() => {
                    modal.style.display = 'none';
                    modal.classList.remove('closing');
                }, 300);
            }
        });
    });

    window.addEventListener('click', function(event) {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                modal.classList.add('closing');
                setTimeout(() => {
                    modal.style.display = 'none';
                    modal.classList.remove('closing');
                }, 300);
            }
        });
    });

    fetchAndDisplayHistory();
});