<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password</title>
    <link rel="stylesheet" href="<%= request.getContextPath() %>/forgot.css">
</head>
<body>
    <section>
        <h2>Forgot Password</h2>
        <p>Enter your email to receive a password reset OTP.</p>
        <% String error = (String) request.getAttribute("error"); %>
        <% if (error != null) { %>
            <p class="error"><%= error %></p>
        <% } %>
        <div class="email-input">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" required>
        </div>
        <button id="send-otp" class="send-otp-button">Send OTP</button>
        <div class="otp-section" id="otp-section">
            <div class="otp-input">
                <label for="otp">Enter OTP:</label>
                <input type="text" id="otp" name="otp" placeholder="Enter OTP" required>
            </div>
            <button id="verify-otp" class="verify-button">Verify OTP</button>
        </div>
    </section>
    <script src="<%= request.getContextPath() %>/forgot.js"></script>
</body>
</html>