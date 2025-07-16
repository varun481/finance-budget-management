<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Signup OTP Verification</title>
    <link rel="stylesheet" href="<%= request.getContextPath() %>/signupotp.css">
</head>
<body>
    <section>
        <h2>Signup OTP Verification</h2>
        <% String signupEmail = (String) session.getAttribute("signupEmail"); %>
        <p>We've sent an OTP to <%= signupEmail != null ? signupEmail : "your email" %>.</p>
        <% String error = (String) request.getAttribute("error"); %>
        <% if (error != null) { %>
            <p class="error"><%= error %></p>
        <% } %>
        <form action="<%= request.getContextPath() %>/signupservlete" method="post">
            <input type="hidden" name="action" value="verify-otp">
            <input type="hidden" name="email" value="<%= signupEmail %>">
            <div class="otp-input">
                <label for="otp">Enter OTP:</label>
                <input type="text" id="otp" name="otp" placeholder="Enter OTP" required>
            </div>
            <button type="submit" class="verify-button">Verify</button>
        </form>
        <div class="otp-buttons">
            <button id="resend" class="resend-button">Resend OTP</button>
        </div>
    </section>
    <script src="<%= request.getContextPath() %>/signupotp.js"></script>
</body>
</html>