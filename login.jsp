<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
    <link rel="stylesheet" href="login.css">
</head>
<body>
    <%
        String error = (String) request.getAttribute("error");
        if (error != null) {
    %>
    <div id="errorModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="document.getElementById('errorModal').style.display='none'">×</span>
            <h3><%= error %></h3>
        </div>
    </div>
    <script>
        window.onload = () => {
            document.getElementById("errorModal").style.display = "block";
        };
    </script>
    <% } %>

    <form action="<%= request.getContextPath() %>/loginservlete" method="post">
        <h2>Login</h2>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" placeholder="Enter your email" required>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" placeholder="Your password" required>
        <button type="submit">Login</button>
        <a href="<%= request.getContextPath() %>/forgot.jsp">Forgot Password?</a>
        <p>Create Account? <a href="<%= request.getContextPath() %>/signup.jsp">Sign Up</a></p>
    </form>
</body>
</html>