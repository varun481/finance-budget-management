<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up</title>
    <link rel="stylesheet" href="<%= request.getContextPath() %>/signup.css">
</head>
<body>
    <section>
        <h2>Sign Up</h2>
        <p>Create a new account.</p>
        <% String error = (String) request.getAttribute("error"); %>
        <% if (error != null) { %>
            <p class="error"><%= error %></p>
        <% } %>
        <form id="signup-form" action="<%= request.getContextPath() %>/signupservlete" method="post">
            <div class="fullname-input">
                <label for="fullname">Full Name:</label>
                <input type="text" id="fullname" name="fullname" placeholder="Enter your full name" required>
            </div>
            <div class="email-input">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" required>
            </div>
            <div class="password-input">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" placeholder="Enter your password" required>
            </div>
            <button type="submit" class="signup-button">Sign Up</button>
        </form>
        <p class="login-link">
            Already have an account? <a href="<%= request.getContextPath() %>/login.jsp">Login</a>
        </p>
    </section>
    <script src="<%= request.getContextPath() %>/signup.js"></script>
</body>
</html>