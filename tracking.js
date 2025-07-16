document.addEventListener('DOMContentLoaded', function() {
    const contextPath = window.contextPath || '';
    const userId = window.userId || 'unknown';
    const userFullname = window.userFullname || 'User';

    // Dropdown Menu Functionality
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

    // Navigation for dropdown menu items
    const navMenuItems = {
        'home': 'home.jsp',
        'about': 'about.jsp',
        'contact': 'contact.jsp'
    };
    Object.keys(navMenuItems).forEach(item => {
        const menuItem = document.getElementById(`${item}-menu-item`);
        if (menuItem && !menuItem.dataset.listenerAdded) {
            menuItem.dataset.listenerAdded = 'true';
            menuItem.addEventListener('click', function() {
                dropdown.style.display = 'none';
                window.location.href = contextPath + '/' + navMenuItems[item];
            });
        }
    });

    const profileMenuItem = document.getElementById('profile-menu-item');
    if (profileMenuItem && !profileMenuItem.dataset.listenerAdded) {
        profileMenuItem.dataset.listenerAdded = 'true';
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
                            <h1 class="username">${userFullname}</h1>
                        </div>
                        <div class="divider"></div>
                        <div class="info-section">
                            <h2 class="section-title">CONTACT INFORMATION</h2>
                            <div class="info-row"><div class="info-label">Email id:</div><div class="info-value">Not Available</div></div>
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
    if (themeMenuItem && !themeMenuItem.dataset.listenerAdded) {
        themeMenuItem.dataset.listenerAdded = 'true';
        themeMenuItem.addEventListener('click', function() {
            dropdown.style.display = 'none';
            document.getElementById('theme-modal').style.display = 'block';
        });
    }

    const applyTheme = (theme) => {
        const isDark = theme === 'dark';
        document.body.style.background = isDark ? '#1A1E3A' : 'linear-gradient(180deg, #E6E9FF 0%, #A8B1FF 50%, #F7F8FF 100%)';
        document.body.style.color = isDark ? '#FFFFFF' : '#1A1E3A';
        const navbar = document.querySelector('.navbar');
        if (navbar) navbar.style.backgroundColor = isDark ? '#2A2E4A' : '#FFFFFF';
        const container = document.querySelector('.container');
        if (container) container.style.backgroundColor = isDark ? '#2A2E4A' : '#FFFFFF';
        const dropdownMenu = document.querySelector('#menu-dropdown');
        if (dropdownMenu) dropdownMenu.style.backgroundColor = isDark ? '#2A2E4A' : '#FFFFFF';
        document.querySelectorAll('.menu-item').forEach(item => item.style.color = isDark ? '#FFFFFF' : '#1A1E3A');
        const navBar = document.querySelector('.nav-bar');
        if (navBar) navBar.style.backgroundColor = isDark ? '#2A2E4A' : '#FFFFFF';
        document.querySelectorAll('.nav-item').forEach(item => item.style.color = isDark ? '#FFFFFF' : '#1A1E3A');
        document.querySelectorAll('.nav-link').forEach(item => item.style.color = isDark ? '#FFFFFF' : '#1A1E3A');
        document.querySelectorAll('.nav-icon').forEach(icon => {
            const svg = icon.querySelector('svg');
            if (svg) svg.style.stroke = isDark ? '#A8B1FF' : '#5f6FFF';
        });
        document.querySelectorAll('section h2').forEach(h2 => h2.style.color = isDark ? '#FFFFFF' : '#1A1E3A');
        document.querySelectorAll('.goal-item, .debt-item, .challenge-item').forEach(item => {
            item.style.backgroundColor = isDark ? '#3A3E5A' : '#F7F8FF';
            item.style.color = isDark ? '#FFFFFF' : '#1A1E3A';
        });
        localStorage.setItem('theme', theme);
        document.getElementById('theme-modal').style.display = 'none';
    };

    const lightTheme = document.getElementById('light-theme');
    if (lightTheme && !lightTheme.dataset.listenerAdded) {
        lightTheme.dataset.listenerAdded = 'true';
        lightTheme.addEventListener('click', () => applyTheme('light'));
    }

    const darkTheme = document.getElementById('dark-theme');
    if (darkTheme && !darkTheme.dataset.listenerAdded) {
        darkTheme.dataset.listenerAdded = 'true';
        darkTheme.addEventListener('click', () => applyTheme('dark'));
    }

    const logoutMenuItem = document.getElementById('logout-menu-item');
    if (logoutMenuItem && !logoutMenuItem.dataset.listenerAdded) {
        logoutMenuItem.dataset.listenerAdded = 'true';
        logoutMenuItem.addEventListener('click', function() {
            if (confirm('Are you sure you want to log out?')) {
                window.location.href = contextPath + '/logoutservlete';
            }
        });
    }

    // Modal closing
    document.querySelectorAll('.close-button').forEach(button => {
        if (!button.dataset.listenerAdded) {
            button.dataset.listenerAdded = 'true';
            button.addEventListener('click', function() {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
            });
        }
    });

    window.addEventListener('click', function(event) {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Format currency
    function formatCurrency(amount) {
        return '₹' + Math.abs(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    // Calculate estimated completion date for savings goal
    function calculateEstimatedCompletion(goalAmount, currentSavings, monthlySavings, deadline) {
        const remainingAmount = goalAmount - currentSavings;
        if (monthlySavings <= 0) return 'Never (Increase your savings rate)';
        const monthsLeft = remainingAmount / monthlySavings;
        const deadlineDate = new Date(deadline);
        const currentDate = new Date();
        
        // If already past deadline
        if (currentDate > deadlineDate) {
            return 'Deadline passed';
        }

        const estimatedDate = new Date();
        estimatedDate.setMonth(estimatedDate.getMonth() + monthsLeft);
        
        // Compare with deadline
        if (estimatedDate > deadlineDate) {
            return `After deadline (${estimatedDate.toLocaleDateString()})`;
        }
        return estimatedDate.toLocaleDateString();
    }

    // Fetch savings goals
    function fetchSavingsGoals() {
        fetch(`${contextPath}/trackingservlete?type=savingsGoals`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP error ${response.status}: ${text}`);
                    });
                }
                return response.json();
            })
            .then(goals => {
                const goalsList = document.getElementById('savingsGoalsList');
                goalsList.innerHTML = '';
                goals.forEach(goal => {
                    const progress = (goal.currentSavings / goal.goalAmount) * 100;
                    const estimatedCompletion = calculateEstimatedCompletion(
                        goal.goalAmount,
                        goal.currentSavings,
                        goal.monthlySavings,
                        goal.deadline
                    );
                    const goalItem = document.createElement('div');
                    goalItem.className = 'goal-item';
                    goalItem.innerHTML = `
                        <h3>${goal.name}</h3>
                        <p>Target: ${formatCurrency(goal.goalAmount)}</p>
                        <p>Current Savings: ${formatCurrency(goal.currentSavings)}</p>
                        <p>Deadline: ${new Date(goal.deadline).toLocaleDateString()}</p>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${progress}%"></div>
                        </div>
                        <p>Progress: ${progress.toFixed(1)}%</p>
                        <p>Estimated Completion: ${estimatedCompletion}</p>
                    `;
                    goalsList.appendChild(goalItem);
                });
            })
            .catch(error => {
                console.error('Error fetching savings goals:', error.message);
                alert('Failed to fetch savings goals. Check the console for details.');
            });
    }

    // Savings goal form submission
    const savingsGoalForm = document.getElementById('savingsGoalForm');
    if (savingsGoalForm) {
        savingsGoalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const goal = {
                name: document.getElementById('goalName').value,
                goalAmount: parseFloat(document.getElementById('goalAmount').value),
                deadline: document.getElementById('goalDeadline').value,
                currentSavings: parseFloat(document.getElementById('currentSavings').value),
                monthlySavings: parseFloat(document.getElementById('monthlySavings').value)
            };

            const data = new URLSearchParams();
            data.append('action', 'addSavingsGoal');
            data.append('name', goal.name);
            data.append('goalAmount', goal.goalAmount);
            data.append('deadline', goal.deadline);
            data.append('currentSavings', goal.currentSavings);
            data.append('monthlySavings', goal.monthlySavings);
            data.append('userId', userId);

            fetch(`${contextPath}/trackingservlete`, {
                method: 'POST',
                body: data,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP error ${response.status}: ${text}`);
                    });
                }
                return response.json();
            })
            .then(() => {
                fetchSavingsGoals();
                savingsGoalForm.reset();
            })
            .catch(error => {
                console.error('Error saving goal:', error.message);
                alert('Failed to save savings goal. Check the console for details.');
            });
        });
    }

    // Fetch debts
    function fetchDebts() {
        fetch(`${contextPath}/trackingservlete?type=debts`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP error ${response.status}: ${text}`);
                    });
                }
                return response.json();
            })
            .then(debts => {
                const debtList = document.getElementById('debtList');
                debtList.innerHTML = '';
                debts.forEach(debt => {
                    // Calculate monthly interest
                    const monthlyInterestRate = (debt.interestRate / 100) / 12;
                    const monthlyInterest = debt.amount * monthlyInterestRate;
                    const debtItem = document.createElement('div');
                    debtItem.className = 'debt-item';
                    debtItem.innerHTML = `
                        <h3>${debt.name}</h3>
                        <p>Outstanding: ${formatCurrency(debt.amount)}</p>
                        <p>Interest Rate: ${debt.interestRate}%</p>
                        <p>Monthly Interest: ${formatCurrency(monthlyInterest)}</p>
                        <p>EMI: ${formatCurrency(debt.emi)}</p>
                    `;
                    debtList.appendChild(debtItem);
                });
            })
            .catch(error => {
                console.error('Error fetching debts:', error.message);
                alert('Failed to fetch debts. Check the console for details.');
            });
    }

    // Debt form submission
    const debtForm = document.getElementById('debtForm');
    if (debtForm) {
        debtForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const debt = {
                name: document.getElementById('debtName').value,
                amount: parseFloat(document.getElementById('debtAmount').value),
                interestRate: parseFloat(document.getElementById('interestRate').value),
                emi: parseFloat(document.getElementById('emiAmount').value)
            };

            const data = new URLSearchParams();
            data.append('action', 'addDebt');
            data.append('name', debt.name);
            data.append('amount', debt.amount);
            data.append('interestRate', debt.interestRate);
            data.append('emi', debt.emi);
            data.append('userId', userId);

            fetch(`${contextPath}/trackingservlete`, {
                method: 'POST',
                body: data,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP error ${response.status}: ${text}`);
                    });
                }
                return response.json();
            })
            .then(() => {
                fetchDebts();
                debtForm.reset();
            })
            .catch(error => {
                console.error('Error saving debt:', error.message);
                alert('Failed to save debt. Check the console for details.');
            });
        });
    }

    // Fetch spending challenges
    function fetchChallenges() {
        fetch(`${contextPath}/trackingservlete?type=challenges`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP error ${response.status}: ${text}`);
                    });
                }
                return response.json();
            })
            .then(challenges => {
                const challengeList = document.getElementById('challengeList');
                challengeList.innerHTML = '';
                challenges.forEach(challenge => {
                    const endDate = new Date(challenge.endDate);
                    const currentDate = new Date();
                    const isCompleted = challenge.currentSpending <= challenge.limit && currentDate <= endDate;
                    const badge = isCompleted ? '<span class="badge">🎉 Completed!</span>' : '';
                    const challengeItem = document.createElement('div');
                    challengeItem.className = 'challenge-item';
                    challengeItem.innerHTML = `
                        <h3>${challenge.name}</h3>
                        <p>Limit: ${formatCurrency(challenge.limit)}</p>
                        <p>Current Spending: ${formatCurrency(challenge.currentSpending)}</p>
                        <p>End Date: ${endDate.toLocaleDateString()}</p>
                        ${badge}
                    `;
                    challengeList.appendChild(challengeItem);
                });
            })
            .catch(error => {
                console.error('Error fetching challenges:', error.message);
                alert('Failed to fetch challenges. Check the console for details.');
            });
    }

    // Spending challenge form submission
    const challengeForm = document.getElementById('challengeForm');
    if (challengeForm) {
        challengeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const challenge = {
                name: document.getElementById('challengeName').value,
                limit: parseFloat(document.getElementById('challengeLimit').value),
                endDate: document.getElementById('challengeEndDate').value,
                currentSpending: parseFloat(document.getElementById('currentSpending').value)
            };

            const data = new URLSearchParams();
            data.append('action', 'addChallenge');
            data.append('name', challenge.name);
            data.append('limit', challenge.limit);
            data.append('endDate', challenge.endDate);
            data.append('currentSpending', challenge.currentSpending);
            data.append('userId', userId);

            fetch(`${contextPath}/trackingservlete`, {
                method: 'POST',
                body: data,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP error ${response.status}: ${text}`);
                    });
                }
                return response.json();
            })
            .then(() => {
                fetchChallenges();
                challengeForm.reset();
            })
            .catch(error => {
                console.error('Error saving challenge:', error.message);
                alert('Failed to save challenge. Check the console for details.');
            });
        });
    }

    // Initial fetches
    fetchSavingsGoals();
    fetchDebts();
    fetchChallenges();

    // Apply saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
});