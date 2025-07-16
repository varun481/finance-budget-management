<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
    <link rel="stylesheet" href="<%= request.getContextPath() %>/forgot.css">
</head>
<body>
    <section>
        <h2>Reset Password</h2>
        <p>Enter your new password.</p>
        <% String email = request.getParameter("email"); %>
        <form action="<%= request.getContextPath() %>/forgotpassword" method="post">
            <input type="hidden" name="action" value="reset-password">
            <input type="hidden" name="email" value="<%= email %>">
            <div class="password-input">
                <label for="password">New Password:</label>
                <input type="password" id="password" name="password" placeholder="Enter new password" required>
            </div>
            <div class="password-input">
                <label for="confirm-password">Confirm Password:</label>
                <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm new password" required>
            </div>
            <button type="submit" class="verify-button">Reset Password</button>
        </form>
    </section>
</body>
</html>