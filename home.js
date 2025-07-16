document.addEventListener('DOMContentLoaded', function() {
    const contextPath = window.contextPath || '';
    console.log('Context Path:', contextPath);

    const chartColors = [
        '#2d4b5a', '#3a7b8f', '#5eacbe', '#c5e1e8'
    ];
    const noDataColor = '#B0BEC5';

    const ctx = document.getElementById('savings-chart').getContext('2d');
    const savingsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: $${value.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });

    function updatePieChart(transactions) {
        let chartData = [];
        let chartLabels = [];
        let chartColorsUsed = [];

        if (transactions.length === 0) {
            chartData = [1];
            chartLabels = ['No Credits'];
            chartColorsUsed = [noDataColor];
        } else {
            const topCredits = transactions.slice(0, 4);
            chartData = topCredits.map(t => t.amount);
            chartLabels = topCredits.map(t => t.purpose);
            chartColorsUsed = chartColors.slice(0, topCredits.length);
        }

        savingsChart.data.labels = chartLabels;
        savingsChart.data.datasets[0].data = chartData;
        savingsChart.data.datasets[0].backgroundColor = chartColorsUsed;
        savingsChart.update();
    }

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            console.log('Nav item clicked, href:', href);
            if (href && href !== '#') {
                navItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                window.location.href = href;
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

    const themeMenuItem = document.getElementById('theme-menu-item');
    if (themeMenuItem) {
        themeMenuItem.addEventListener('click', function() {
            dropdown.style.display = 'none';
            document.getElementById('theme-modal').style.display = 'block';
        });
    }

    const applyTheme = (theme) => {
        const isDark = theme === 'dark';
        document.body.style.background = isDark ? '#1A1E3A' : 'linear-gradient(180deg, #E6E9FF 0%, #A8B1FF 50%, #F7F8FF 100%)';
        document.body.style.color = isDark ? '#FFFFFF' : '#1A1E3A';
        document.querySelector('.navbar').style.backgroundColor = isDark ? '#2A2E4A' : '#FFFFFF';
        document.querySelectorAll('.card').forEach(card => card.style.backgroundColor = isDark ? '#2A2E4A' : '#FFFFFF');
        document.querySelectorAll('.card-title').forEach(item => item.style.color = isDark ? '#A8B1FF' : '#5f6FFF');
        document.querySelectorAll('.card-value').forEach(item => item.style.color = isDark ? '#FFFFFF' : '#1A1E3A');
        document.querySelector('#menu-dropdown').style.backgroundColor = isDark ? '#2A2E4A' : '#FFFFFF';
        document.querySelectorAll('.menu-item').forEach(item => item.style.color = isDark ? '#FFFFFF' : '#1A1E3A');
        document.querySelector('.nav-bar').style.backgroundColor = isDark ? '#2A2E4A' : '#FFFFFF';
        document.querySelectorAll('.nav-item').forEach(item => item.style.color = isDark ? '#FFFFFF' : '#1A1E3A');
        document.querySelectorAll('.nav-link').forEach(item => item.style.color = isDark ? '#FFFFFF' : '#1A1E3A');
        document.querySelectorAll('.nav-icon').forEach(icon => icon.querySelector('svg').style.stroke = isDark ? '#A8B1FF' : '#5f6FFF');
        document.querySelector('.chart-label p').style.color = isDark ? '#A8B1FF' : '#FF6B6B';
        document.querySelectorAll('.transaction-box').forEach(box => box.style.backgroundColor = isDark ? '#2A2E4A' : '#FFFFFF');
        document.querySelectorAll('.transaction-title').forEach(title => title.style.color = isDark ? '#FFFFFF' : '#1A1E3A');
        document.querySelectorAll('.transaction-list li').forEach(item => item.style.color = isDark ? '#E6E9FF' : '#1A1E3A');
        localStorage.setItem('theme', theme);
        document.getElementById('theme-modal').style.display = 'none';
    };

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
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
            resetModal('credit');
            resetModal('debit');
        });
    });

    window.addEventListener('click', function(event) {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
                resetModal('credit');
                resetModal('debit');
            }
        });
    });

    let editingId = null;
    let editingType = null;

    function formatCurrency(amount) {
        return '$' + Math.abs(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    function updateTransactionList(type, listId, transactions) {
        const list = document.getElementById(listId);
        if (!list) return;
        list.innerHTML = '';
        transactions.slice(0, 4).forEach(transaction => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="transaction-amount">${formatCurrency(transaction.amount)}</span>
                <span class="transaction-purpose">${transaction.purpose}</span>
                <div class="transaction-actions">
                    <svg class="delete-icon" data-type="${type}" data-id="${transaction.id}" xmlns="http://www.w3.org/2000/svg" fill="#DC3545" viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                    <button class="edit-button" data-type="${type}" data-id="${transaction.id}">Edit</button>
                </div>
            `;
            list.appendChild(li);
        });

        document.querySelectorAll(`#${listId} .delete-icon`).forEach(icon => {
            icon.addEventListener('click', function() {
                const type = this.dataset.type;
                const id = parseInt(this.dataset.id);
                console.log(`Deleting transaction: ${contextPath}/transactionservlete?id=${id}`);
                fetch(`${contextPath}/transactionservlete?id=${id}`, {
                    method: 'DELETE'
                }).then(response => {
                    if (!response.ok) {
                        return response.text().then(text => {
                            throw new Error(`HTTP error ${response.status}: ${text}`);
                        });
                    }
                    return response.json();
                }).then(data => {
                    fetchTransactions(type);
                    fetchSummary();
                }).catch(error => {
                    console.error('Delete error:', error);
                    alert('Error deleting transaction: ' + error.message);
                });
            });
        });

        document.querySelectorAll(`#${listId} .edit-button`).forEach(button => {
            button.addEventListener('click', function() {
                editingType = this.dataset.type;
                editingId = parseInt(this.dataset.id);
                const transaction = transactions.find(t => t.id === editingId);
                const modal = document.getElementById(`${editingType}-modal`);
                const amountInput = document.getElementById(`${editingType}-amount`);
                const purposeInput = document.getElementById(`${editingType}-purpose`);
                const modalTitle = document.getElementById(`${editingType}-modal-title`);

                amountInput.value = transaction.amount;
                purposeInput.value = transaction.purpose;
                modalTitle.textContent = `Edit ${editingType.charAt(0).toUpperCase() + editingType.slice(1)}`;
                modal.style.display = 'block';
            });
        });
    }

    function resetModal(type) {
        const amountInput = document.getElementById(`${type}-amount`);
        const purposeInput = document.getElementById(`${type}-purpose`);
        const modalTitle = document.getElementById(`${type}-modal-title`);
        amountInput.value = '';
        purposeInput.value = '';
        modalTitle.textContent = `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        editingId = null;
        editingType = null;
    }

    function fetchTransactions(type) {
        const url = `${contextPath}/transactionservlete?type=${type.toUpperCase()}&limit=4`;
        console.log(`Fetching transactions: ${url}`);
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP error ${response.status}: ${text}`);
                    });
                }
                return response.json();
            })
            .then(transactions => {
                updateTransactionList(type, `${type}-list`, transactions);
                if (type === 'credit') {
                    updatePieChart(transactions);
                }
            })
            .catch(error => {
                console.error(`Error fetching ${type} transactions:`, error);
                alert(`Error fetching ${type} transactions: ${error.message}`);
            });
    }

    function fetchSummary() {
        console.log(`Fetching summary: ${contextPath}/summaryservlete`);
        fetch(`${contextPath}/summaryservlete`)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP error ${response.status}: ${text}`);
                    });
                }
                return response.json();
            })
            .then(summary => {
                document.getElementById('total-purchases').textContent = formatCurrency(summary.totalPurchases);
                document.getElementById('total-income').textContent = formatCurrency(summary.totalIncome);
                const savingsAmount = document.getElementById('savings-amount');
                savingsAmount.textContent = (summary.savingsAmount < 0 ? '-' : '') + formatCurrency(summary.savingsAmount);
                savingsAmount.style.color = summary.savingsAmount >= 0 ? '#28A745' : '#DC3545';
                document.getElementById('remaining-balance').textContent = formatCurrency(summary.totalIncome - summary.totalPurchases);
            })
            .catch(error => {
                console.error('Error fetching summary:', error);
                alert('Error fetching summary: ' + error.message);
            });
    }

    fetchTransactions('credit');
    fetchTransactions('debit');
    fetchSummary();

    const creditButton = document.getElementById('credit-button');
    if (creditButton) {
        creditButton.addEventListener('click', function() {
            resetModal('credit');
            document.getElementById('credit-modal').style.display = 'block';
        });
    }

    const submitCredit = document.getElementById('submit-credit');
    if (submitCredit) {
        submitCredit.addEventListener('click', function() {
            const amountInput = document.getElementById('credit-amount');
            const purposeInput = document.getElementById('credit-purpose');
            const amount = parseFloat(amountInput.value);
            const purpose = purposeInput.value.trim();
            if (isNaN(amount) || amount <= 0) {
                alert('Please enter a valid amount.');
                return;
            }
            if (!purpose) {
                alert('Please enter a purpose.');
                return;
            }

            const action = editingId !== null ? 'edit' : 'add';
            const data = new URLSearchParams();
            data.append('action', action);
            data.append('type', 'CREDIT');
            data.append('amount', amount);
            data.append('purpose', purpose);
            if (editingId !== null) {
                data.append('id', editingId);
            }

            console.log(`Submitting credit: ${contextPath}/transactionservlete`);
            fetch(`${contextPath}/transactionservlete`, {
                method: 'POST',
                body: data
            }).then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP error ${response.status}: ${text}`);
                    });
                }
                return response.json();
            }).then(data => {
                fetchTransactions('credit');
                fetchSummary();
                document.getElementById('credit-modal').style.display = 'none';
                resetModal('credit');
            }).catch(error => {
                console.error('Error saving credit:', error);
                alert('Error saving credit transaction: ' + error.message);
            });
        });
    }

    const debitButton = document.getElementById('debit-button');
    if (debitButton) {
        debitButton.addEventListener('click', function() {
            resetModal('debit');
            document.getElementById('debit-modal').style.display = 'block';
        });
    }

    const submitDebit = document.getElementById('submit-debit');
    if (submitDebit) {
        submitDebit.addEventListener('click', function() {
            const amountInput = document.getElementById('debit-amount');
            const purposeInput = document.getElementById('debit-purpose');
            const amount = parseFloat(amountInput.value);
            const purpose = purposeInput.value.trim();
            if (isNaN(amount) || amount <= 0) {
                alert('Please enter a valid amount.');
                return;
            }
            if (!purpose) {
                alert('Please enter a purpose.');
                return;
            }

            const action = editingId !== null ? 'edit' : 'add';
            const data = new URLSearchParams();
            data.append('action', action);
            data.append('type', 'DEBIT');
            data.append('amount', amount);
            data.append('purpose', purpose);
            if (editingId !== null) {
                data.append('id', editingId);
            }

            console.log(`Submitting debit: ${contextPath}/transactionservlete`);
            fetch(`${contextPath}/transactionservlete`, {
                method: 'POST',
                body: data
            }).then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP error ${response.status}: ${text}`);
                    });
                }
                return response.json();
            }).then(data => {
                fetchTransactions('debit');
                fetchSummary();
                document.getElementById('debit-modal').style.display = 'none';
                resetModal('debit');
            }).catch(error => {
                console.error('Error saving debit:', error);
                alert('Error saving debit transaction: ' + error.message);
            });
        });
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
});