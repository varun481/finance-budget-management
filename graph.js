document.addEventListener('DOMContentLoaded', function() {
    const contextPath = window.contextPath || '';
    console.log('Context Path:', contextPath);

    const chartColors = {
        credits: '#28A745',
        debits: '#DC3545',
        categories: [
            '#5f6FFF', '#FF6B6B', '#A8B1FF', '#7B8CFF',
            '#28A745', '#DC3545', '#FFD700', '#20B2AA',
            '#FF4500', '#9932CC', '#00CED1', '#FF69B4',
            '#228B22', '#FFA500', '#4682B4', '#9ACD32',
            '#BA55D3', '#00FA9A', '#8B0000', '#1E90FF'
        ],
        noData: '#B0BEC5'
    };

    // Error message display
    const errorMessageDiv = document.getElementById('error-message');

    function showError(message) {
        if (errorMessageDiv) {
            errorMessageDiv.textContent = message;
            errorMessageDiv.style.display = 'block';
            errorMessageDiv.style.color = 'red';
        }
    }

    function clearError() {
        if (errorMessageDiv) {
            errorMessageDiv.textContent = '';
            errorMessageDiv.style.display = 'none';
        }
    }

    function showWarning(message) {
        if (errorMessageDiv) {
            errorMessageDiv.textContent = message;
            errorMessageDiv.style.display = 'block';
            errorMessageDiv.style.color = 'orange';
        }
    }

    // Theme application function
    function applyTheme(theme) {
        try {
            const isDark = theme === 'dark-theme';
            document.body.classList.remove('light-theme', 'dark-theme');
            document.body.classList.add(theme);
            document.body.style.background = isDark ? '#1A1E3A' : 'linear-gradient(180deg, #E6E9FF 0%, #A8B1FF 50%, #F7F8FF 100%)';
            document.body.style.color = isDark ? '#FFFFFF' : '#1A1E3A';
            document.querySelector('.navbar').style.backgroundColor = isDark ? '#2A2E4A' : '#FFFFFF';
            document.querySelectorAll('.nav-link').forEach(item => item.style.color = isDark ? '#FFFFFF' : '#1A1E3A');
            document.querySelector('#menu-dropdown').style.backgroundColor = isDark ? '#2A2E4A' : '#FFFFFF';
            document.querySelectorAll('.menu-item').forEach(item => item.style.color = isDark ? '#FFFFFF' : '#1A1E3A');
            document.querySelectorAll('.menu-item svg').forEach(svg => svg.style.color = isDark ? '#A8B1FF' : '#5f6FFF');
            document.querySelector('.nav-bar').style.backgroundColor = isDark ? '#2A2E4A' : '#FFFFFF';
            document.querySelectorAll('.nav-item').forEach(item => item.style.color = isDark ? '#FFFFFF' : '#1A1E3A');
            document.querySelectorAll('.nav-icon svg').forEach(svg => svg.style.stroke = isDark ? '#A8B1FF' : '#5f6FFF');
            document.querySelector('.filter-container').style.backgroundColor = isDark ? '#2A2E4A' : '#FFFFFF';
            document.querySelectorAll('.chart-box').forEach(box => box.style.background = isDark ? 'linear-gradient(145deg, #2A2E4A, #3A3E5A)' : 'linear-gradient(145deg, #FFFFFF, #F7F8FF)');
            document.querySelector('.pie-chart-box').style.background = isDark ? 'linear-gradient(145deg, #2A2E4A, #3A3E5A)' : 'linear-gradient(145deg, #FFFFFF, #F7F8FF)';
            localStorage.setItem('theme', theme);
            document.getElementById('theme-modal').style.display = 'none';
            // Dispatch a storage event to notify other tabs
            localStorage.setItem('themeChange', Date.now());
        } catch (error) {
            console.error('Error applying theme:', error);
        }
    }

    // Listen for storage events to sync theme across tabs
    window.addEventListener('storage', function(event) {
        if (event.key === 'theme') {
            const newTheme = event.newValue;
            if (newTheme && (newTheme === 'light-theme' || newTheme === 'dark-theme')) {
                applyTheme(newTheme);
            }
        }
    });

    // Line Chart: Income vs Expenses Over Time
    let lineChart;
    try {
        const lineChartCtx = document.getElementById('line-chart').getContext('2d');
        lineChart = new Chart(lineChartCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Income',
                        data: [],
                        borderColor: chartColors.credits,
                        fill: false,
                        tension: 0.1,
                        pointRadius: 5,
                        pointHoverRadius: 8
                    },
                    {
                        label: 'Expenses',
                        data: [],
                        borderColor: chartColors.debits,
                        fill: false,
                        tension: 0.1,
                        pointRadius: 5,
                        pointHoverRadius: 8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { title: { display: true, text: 'Date' } },
                    y: { title: { display: true, text: 'Amount ($)' }, beginAtZero: true }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: $${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error initializing line chart:', error);
        showError('Failed to initialize line chart.');
    }

    // Bar Chart: Credits vs Debits by Category
    let barChart;
    try {
        const barChartCtx = document.getElementById('bar-chart').getContext('2d');
        barChart = new Chart(barChartCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Credits',
                        data: [],
                        backgroundColor: chartColors.credits
                    },
                    {
                        label: 'Debits',
                        data: [],
                        backgroundColor: chartColors.debits
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { title: { display: true, text: 'Category' } },
                    y: { title: { display: true, text: 'Amount ($)' }, beginAtZero: true }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: $${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error initializing bar chart:', error);
        showError('Failed to initialize bar chart.');
    }

    // Pie Chart: Expense Distribution
    let pieChart;
    let isUpdatingPieChart = false;
    try {
        const pieChartCtx = document.getElementById('pie-chart').getContext('2d');
        pieChart = new Chart(pieChartCtx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            padding: 10,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
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
    } catch (error) {
        console.error('Error initializing pie chart:', error);
        showError('Failed to initialize pie chart.');
    }

    // Filter Handling
    const timePeriodSelect = document.getElementById('time-period');
    const customRangeDiv = document.getElementById('custom-range');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const applyFilterButton = document.getElementById('apply-filter');

    if (timePeriodSelect) {
        timePeriodSelect.addEventListener('change', function() {
            try {
                if (this.value === 'custom') {
                    customRangeDiv.style.display = 'block';
                } else {
                    customRangeDiv.style.display = 'none';
                    fetchAndUpdateCharts(this.value);
                }
            } catch (error) {
                console.error('Error in time period select handler:', error);
                showError('Failed to handle time period selection.');
            }
        });
    } else {
        console.error('Time period select element not found.');
        showError('Filter functionality unavailable: select element missing.');
    }

    if (applyFilterButton) {
        applyFilterButton.addEventListener('click', function() {
            try {
                const startDate = startDateInput.value;
                const endDate = endDateInput.value;
                if (startDate && endDate) {
                    if (new Date(startDate) > new Date(endDate)) {
                        showError('Start date must be before end date.');
                        return;
                    }
                    fetchAndUpdateCharts('custom', startDate, endDate);
                } else {
                    showError('Please select both start and end dates.');
                }
            } catch (error) {
                console.error('Error in apply filter handler:', error);
                showError('Failed to apply date filter.');
            }
        });
    } else {
        console.error('Apply filter button not found.');
    }

    let isFetching = false;
    async function fetchAndUpdateCharts(period, startDate, endDate) {
        if (isFetching) {
            console.log('Fetch already in progress, skipping...');
            return;
        }
        isFetching = true;
        clearError();
        let baseUrl = `${contextPath}/transactionservlete`;
        let params = '';
        try {
            if (period === 'last30days') {
                const end = new Date();
                const start = new Date();
                start.setDate(end.getDate() - 30);
                params = `startDate=${start.toISOString().split('T')[0]}&endDate=${end.toISOString().split('T')[0]}`;
            } else if (period === 'thismonth') {
                const today = new Date();
                const start = new Date(today.getFullYear(), today.getMonth(), 1);
                const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                params = `startDate=${start.toISOString().split('T')[0]}&endDate=${end.toISOString().split('T')[0]}`;
                console.log(`This month range: ${start.toISOString().split('T')[0]} to ${end.toISOString().split('T')[0]}`);
            } else if (period === 'custom' && startDate && endDate) {
                params = `startDate=${startDate}&endDate=${endDate}`;
            }

            // Fetch CREDIT transactions
            const creditUrl = `${baseUrl}?type=CREDIT${params ? '&' + params : ''}`;
            console.log(`Fetching CREDIT transactions: ${creditUrl}`);
            const creditResponse = await fetch(creditUrl);
            if (!creditResponse.ok) {
                const text = await creditResponse.text();
                throw new Error(`Failed to fetch CREDIT transactions: HTTP ${creditResponse.status}: ${text}`);
            }
            let creditTransactions;
            try {
                creditTransactions = await creditResponse.json();
            } catch (jsonError) {
                throw new Error(`Invalid JSON response for CREDIT transactions: ${jsonError.message}`);
            }
            console.log(`CREDIT transactions count: ${creditTransactions.length}`, creditTransactions);

            // Fetch DEBIT transactions
            const debitUrl = `${baseUrl}?type=DEBIT${params ? '&' + params : ''}`;
            console.log(`Fetching DEBIT transactions: ${debitUrl}`);
            const debitResponse = await fetch(debitUrl);
            if (!debitResponse.ok) {
                const text = await debitResponse.text();
                throw new Error(`Failed to fetch DEBIT transactions: HTTP ${debitResponse.status}: ${text}`);
            }
            let debitTransactions;
            try {
                debitTransactions = await debitResponse.json();
            } catch (jsonError) {
                throw new Error(`Invalid JSON response for DEBIT transactions: ${jsonError.message}`);
            }
            console.log(`DEBIT transactions count: ${debitTransactions.length}`, debitTransactions);

            // Combine transactions
            const transactions = [...(creditTransactions || []), ...(debitTransactions || [])];
            console.log(`Total transactions count: ${transactions.length}`, transactions);

            // Validate and filter transactions
            const validTransactions = [];
            const invalidTransactions = [];
            const today = new Date().toISOString().split('T')[0];
            transactions.forEach(t => {
                const isValid = t &&
                    typeof t.type === 'string' && ['CREDIT', 'DEBIT'].includes(t.type) &&
                    typeof t.amount === 'number' &&
                    typeof t.purpose === 'string' &&
                    typeof t.date === 'string';
                if (isValid) {
                    // Validate date format (YYYY-MM-DD)
                    const parsedDate = new Date(t.date);
                    if (!isNaN(parsedDate.getTime())) {
                        t.date = parsedDate.toISOString().split('T')[0];
                    } else {
                        t.date = today; // Fallback to today if date is invalid
                    }
                    validTransactions.push(t);
                } else {
                    invalidTransactions.push(t);
                }
            });

            if (invalidTransactions.length > 0) {
                console.warn(`Invalid transactions count: ${invalidTransactions.length}`, invalidTransactions);
                showWarning(`Warning: ${invalidTransactions.length} invalid transactions were ignored.`);
            }

            console.log(`Valid transactions count: ${validTransactions.length}`, validTransactions);

            if (validTransactions.length === 0) {
                showError('No valid transactions found to display.');
                updateLineChart([]);
                updateBarChart([]);
                updatePieChart([]);
                return;
            }

            updateLineChart(validTransactions);
            updateBarChart(validTransactions);
            updatePieChart(validTransactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            showError(`Error fetching transactions: ${error.message}`);
        } finally {
            isFetching = false;
        }
    }

    function updateLineChart(transactions) {
        if (!lineChart) return;
        try {
            if (!transactions || transactions.length === 0) {
                lineChart.data.labels = ['No Data'];
                lineChart.data.datasets[0].data = [0];
                lineChart.data.datasets[1].data = [0];
                lineChart.update();
                showWarning('No transaction data available for the line chart.');
                return;
            }

            const credits = transactions.filter(t => t.type === 'CREDIT');
            const debits = transactions.filter(t => t.type === 'DEBIT');
            console.log(`Line chart - Credits count: ${credits.length}`, credits);
            console.log(`Line chart - Debits count: ${debits.length}`, debits);

            // Group by date
            const datesSet = new Set([
                ...credits.map(t => t.date),
                ...debits.map(t => t.date)
            ]);
            const dates = Array.from(datesSet).sort();
            console.log(`Line chart dates count: ${dates.length}`, dates);

            if (dates.length < 3) {
                showWarning('Not enough data points to display a meaningful line chart (minimum 3 dates required).');
            }

            const creditData = dates.map(date => {
                const amount = credits.filter(t => t.date === date).reduce((sum, t) => sum + t.amount, 0);
                console.log(`Credit amount for ${date}: ${amount}`);
                return amount;
            });
            const debitData = dates.map(date => {
                const amount = debits.filter(t => t.date === date).reduce((sum, t) => sum + t.amount, 0);
                console.log(`Debit amount for ${date}: ${amount}`);
                return amount;
            });

            lineChart.data.labels = dates;
            lineChart.data.datasets[0].data = creditData;
            lineChart.data.datasets[1].data = debitData;
            lineChart.update();
        } catch (error) {
            console.error('Error updating line chart:', error);
            showError('Failed to update line chart.');
        }
    }

    function updateBarChart(transactions) {
        if (!barChart) return;
        try {
            if (!transactions || transactions.length === 0) {
                barChart.data.labels = ['No Data'];
                barChart.data.datasets[0].data = [0];
                barChart.data.datasets[1].data = [0];
                barChart.update();
                return;
            }

            const categoriesSet = new Set(transactions.map(t => t.purpose));
            const categories = Array.from(categoriesSet);
            console.log(`Bar chart categories count: ${categories.length}`, categories);

            const creditData = categories.map(category => {
                const amount = transactions.filter(t => t.type === 'CREDIT' && t.purpose === category)
                    .reduce((sum, t) => sum + t.amount, 0);
                console.log(`Credit amount for ${category}: ${amount}`);
                return amount;
            });
            const debitData = categories.map(category => {
                const amount = transactions.filter(t => t.type === 'DEBIT' && t.purpose === category)
                    .reduce((sum, t) => sum + t.amount, 0);
                console.log(`Debit amount for ${category}: ${amount}`);
                return amount;
            });

            barChart.data.labels = categories;
            barChart.data.datasets[0].data = creditData;
            barChart.data.datasets[1].data = debitData;
            barChart.update();
        } catch (error) {
            console.error('Error updating bar chart:', error);
            showError('Failed to update bar chart.');
        }
    }

    function updatePieChart(transactions) {
        if (!pieChart || isUpdatingPieChart) return;
        isUpdatingPieChart = true;
        try {
            const debits = transactions.filter(t => t.type === 'DEBIT');
            console.log(`Pie chart - Debits count: ${debits.length}`, debits);

            if (!debits || debits.length === 0) {
                pieChart.data.labels = ['No Expenses'];
                pieChart.data.datasets[0].data = [1];
                pieChart.data.datasets[0].backgroundColor = [chartColors.noData];
                pieChart.update();
            } else {
                const categoriesSet = new Set(debits.map(t => t.purpose || 'Unknown'));
                const categories = Array.from(categoriesSet);
                console.log(`Pie chart categories count: ${categories.length}`, categories);

                const data = categories.map(category => {
                    const amount = debits.filter(t => (t.purpose || 'Unknown') === category)
                        .reduce((sum, t) => sum + t.amount, 0);
                    console.log(`Debit amount for ${category}: ${amount}`);
                    return amount;
                });

                // Assign colors, cycling through the palette if necessary
                const colors = categories.map((_, index) => chartColors.categories[index % chartColors.categories.length]);

                pieChart.data.labels = categories;
                pieChart.data.datasets[0].data = data;
                pieChart.data.datasets[0].backgroundColor = colors;
                pieChart.update();
            }

            const canvas = document.getElementById('pie-chart');
            const parent = canvas.parentElement;
            console.log('Pie chart dimensions after update:', {
                canvasWidth: canvas.width,
                canvasHeight: canvas.height,
                parentWidth: parent.offsetWidth,
                parentHeight: parent.offsetHeight
            });
        } catch (error) {
            console.error('Error updating pie chart:', error);
            showError('Failed to update pie chart.');
        } finally {
            isUpdatingPieChart = false;
        }
    }

    // Initial fetch (this month by default)
    fetchAndUpdateCharts('thismonth');

    // Navigation items (bottom nav-bar)
    const navItems = document.querySelectorAll('.nav-item');
    if (navItems.length > 0) {
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                try {
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
                } catch (error) {
                    console.error('Error in nav item click handler:', error);
                }
            });
        });
    } else {
        console.warn('No nav items found in the bottom navigation bar.');
    }

    // Hamburger menu
    const menuIcon = document.getElementById('menu-icon');
    const dropdown = document.getElementById('menu-dropdown');
    if (menuIcon && dropdown) {
        menuIcon.addEventListener('click', function(e) {
            try {
                e.stopPropagation();
                dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            } catch (error) {
                console.error('Error in menu icon click handler:', error);
            }
        });

        document.addEventListener('click', function(e) {
            try {
                const target = e.target;
                let isMenuIcon = false;
                let isDropdown = false;
                let el = target;
                while (el) {
                    if (el.id === 'menu-icon') {
                        isMenuIcon = true;
                        break;
                    }
                    if (el.id === 'menu-dropdown') {
                        isDropdown = true;
                        break;
                    }
                    el = el.parentElement;
                }
                if (!isMenuIcon && !isDropdown) {
                    dropdown.style.display = 'none';
                }
            } catch (error) {
                console.error('Error in document click handler for dropdown:', error);
            }
        });
    } else {
        console.error('Hamburger menu elements not found.');
    }

    const navMenuItems = {
        'home': 'home.jsp',
        'about': 'about.jsp',
        'contact': 'contact.jsp',
        'graphs': 'graph.jsp',
        'create-account': 'signup.jsp'
    };
    Object.keys(navMenuItems).forEach(item => {
        const menuItem = document.getElementById(`${item}-menu-item`);
        if (menuItem) {
            menuItem.addEventListener('click', function() {
                try {
                    dropdown.style.display = 'none';
                    window.location.href = contextPath + '/' + navMenuItems[item];
                } catch (error) {
                    console.error(`Error in ${item}-menu-item click handler:`, error);
                }
            });
        }
    });

    const profileMenuItem = document.getElementById('profile-menu-item');
    if (profileMenuItem) {
        profileMenuItem.addEventListener('click', function() {
            try {
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
            } catch (error) {
                console.error('Error in profile menu item click handler:', error);
            }
        });
    }

    const themeMenuItem = document.getElementById('theme-menu-item');
    if (themeMenuItem) {
        themeMenuItem.addEventListener('click', function() {
            try {
                dropdown.style.display = 'none';
                document.getElementById('theme-modal').style.display = 'block';
            } catch (error) {
                console.error('Error in theme menu item click handler:', error);
            }
        });
    }

    const lightTheme = document.getElementById('light-theme');
    if (lightTheme) {
        lightTheme.addEventListener('click', function() {
            applyTheme('light-theme');
        });
    }

    const darkTheme = document.getElementById('dark-theme');
    if (darkTheme) {
        darkTheme.addEventListener('click', function() {
            applyTheme('dark-theme');
        });
    }

    const logoutMenuItem = document.getElementById('logout-menu-item');
    if (logoutMenuItem) {
        logoutMenuItem.addEventListener('click', function() {
            try {
                if (confirm('Are you sure you want to log out?')) {
                    window.location.href = contextPath + '/logoutservlete';
                }
            } catch (error) {
                console.error('Error in logout menu item click handler:', error);
            }
        });
    }

    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', function() {
            try {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
            } catch (error) {
                console.error('Error in close button click handler:', error);
            }
        });
    });

    window.addEventListener('click', function(event) {
        try {
            document.querySelectorAll('.modal').forEach(modal => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        } catch (error) {
            console.error('Error in window click handler for modals:', error);
        }
    });

    // Apply.saved theme on page load
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    applyTheme(savedTheme);
});