<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
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

<script>
    window.contextPath = '<%= request.getContextPath() %>';
</script>
<script src="<%= request.getContextPath() %>/navbar.js"></script>