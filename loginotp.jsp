<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
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
        <h2>Enter OTP</h2>
        <p>An OTP has been sent to your email. Please enter it below.</p>
        <label for="otp">OTP:</label>
        <input type="text" id="otp" name="otp" placeholder="Enter OTP" required>
        <input type="hidden" name="action" value="verify-otp">
        <button type="submit">Verify OTP</button>
        <p>
            <a href="#" onclick="resendOTP()">Resend OTP</a>
        </p>
    </form>

    <script>
        function resendOTP() {
            const email = '<%= session.getAttribute("loginEmail") %>';
            fetch('<%= request.getContextPath() %>/loginservlete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=resend&email=' + encodeURIComponent(email)
            })
            .then(response => response.text())
            .then(data => {
                if (data === 'success') {
                    alert('New OTP sent to your email.');
                } else {
                    alert('Failed to resend OTP. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        }
    </script>
</body>
</html>