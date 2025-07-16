<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Financial Graphs - Finance Management System</title>
    <link rel="stylesheet" href="<%= request.getContextPath() %>/graph.css">
</head>
<body>
    <%
        String userFullname = (String) session.getAttribute("userFullname");
        boolean isLoggedIn = userFullname != null;
        if (!isLoggedIn) {
            response.sendRedirect("login.jsp");
        }
    %>
    <nav class="navbar">
        <div class="navbar-brand">
            <img src="<%= request.getContextPath() %>/api/placeholder/40/40" alt="Logo" class="navbar-logo">
            <span class="navbar-title">FINANCE MANAGEMENT SYSTEM</span>
        </div>
        <div class="navbar-links">
            <a href="<%= request.getContextPath() %>/home.jsp" class="nav-link" id="home-link">Home</a>
            <a href="<%= request.getContextPath() %>/about.jsp" class="nav-link" id="about-link">About Us</a>
            <a href="<%= request.getContextPath() %>/contact.jsp" class="nav-link" id="contact-link">Contact Us</a>
        </div>
        <div class="navbar-status">
            <span class="user-status">
                <%= isLoggedIn ? "Welcome, " + userFullname : "Guest" %>
            </span>
        </div>
        <div class="menu-icon" id="menu-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </div>
    </nav>

    <div id="menu-dropdown" class="dropdown">
        <div class="menu-item" id="home-menu-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Home</span>
        </div>
        <div class="menu-item" id="about-menu-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>About Us</span>
        </div>
        <div class="menu-item" id="contact-menu-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Contact Us</span>
        </div>
        <div class="menu-item" id="graphs-menu-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <span>Graphs</span>
        </div>
        <div class="menu-item" id="profile-menu-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Profile</span>
        </div>
        <div class="menu-item" id="theme-menu-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <span>Theme</span>
        </div>
        <% if (isLoggedIn) { %>
        <div class="menu-item" id="logout-menu-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Log out</span>
        </div>
        <% } else { %>
        <div class="menu-item" id="create-account-menu-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span>Create Account</span>
        </div>
        <% } %>
    </div>

    <div id="profile-modal" class="modal">
        <div class="modal-content">
            <span class="close-button">×</span>
            <iframe id="profile-iframe" src="about:blank"></iframe>
        </div>
    </div>

    <div id="theme-modal" class="modal">
        <div class="modal-content">
            <span class="close-button">×</span>
            <h2>Choose Theme</h2>
            <div class="theme-options">
                <div id="light-theme">
                    <div class="theme-preview light-preview">
                        <span>Light</span>
                    </div>
                    <p>Light Mode</p>
                </div>
                <div id="dark-theme">
                    <div class="theme-preview dark-preview">
                        <span>Dark</span>
                    </div>
                    <p>Dark Mode</p>
                </div>
            </div>
        </div>
    </div>

    <div id="error-message" style="display: none; color: red; text-align: center; margin-bottom: 20px;"></div>

    <div class="filter-container">
        <label for="time-period">Select Time Period:</label>
        <select id="time-period">
            <option value="last30days">Last 30 Days</option>
            <option value="thismonth">This Month</option>
            <option value="custom">Custom Range</option>
        </select>
        <div id="custom-range" style="display: none;">
            <label for="start-date">Start Date:</label>
            <input type="date" id="start-date">
            <label for="end-date">End Date:</label>
            <input type="date" id="end-date">
            <button id="apply-filter">Apply</button>
        </div>
    </div>

    <div class="charts-container">
        <div class="chart-box">
            <h2>Income vs Expenses Over Time</h2>
            <canvas id="line-chart"></canvas>
        </div>
        <div class="chart-box">
            <h2>Credits vs Debits by Category</h2>
            <canvas id="bar-chart"></canvas>
        </div>
        <div class="pie-chart-box">
            <h2>Expense Distribution</h2>
            <canvas id="pie-chart"></canvas>
        </div>
    </div>

    <div class="nav-bar">
        <a href="<%= request.getContextPath() %>/graph.jsp" class="nav-item active">
            <div class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
            </div>
            <span>Graphs</span>
        </a>
        <a href="<%= request.getContextPath() %>/analysis.jsp" class="nav-item">
            <div class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <span>Analysis</span>
        </a>
        <a href="<%= request.getContextPath() %>/history.jsp" class="nav-item">
            <div class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <span>History</span>
        </a>
        <a href="<%= request.getContextPath() %>/reminders.jsp" class="nav-item">
            <div class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            </div>
            <span>Reminders</span>
        </a>
        <a href="<%= request.getContextPath() %>/tracking.jsp" class="nav-item">
            <div class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <span>Money Tracking</span>
        </a>
    </div>

    <script>
        window.contextPath = '<%= request.getContextPath() %>';
        // Highlight active navbar link
        document.addEventListener('DOMContentLoaded', function() {
            const currentPage = window.location.pathname.split('/').pop();
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                const href = link.getAttribute('href').split('/').pop();
                if (href === currentPage) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        });
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
    <script src="<%= request.getContextPath() %>/graph.js"></script>
</body>
</html>