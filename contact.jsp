<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Finance Management System</title>
    <link rel="stylesheet" href="<%= request.getContextPath() %>/navbar.css">
    <link rel="stylesheet" href="<%= request.getContextPath() %>/contact.css">
    <script>
        window.contextPath = '<%= request.getContextPath() %>';
    </script>
    <script src="<%= request.getContextPath() %>/home.js"></script>
</head>
<body>
    <%@ include file="navbar.jsp" %>

    <div class="contact-container">
        <div class="contact-hero">
            <div class="contact-image-container">
                <img src="<%= request.getContextPath() %>/api/placeholder/600/400" alt="Contact Image" class="contact-image">
            </div>
            <div class="contact-info">
                <h2 class="contact-title">Contact Us</h2>
                <p class="contact-text">
                    We're here to help you with any questions or support you need for the Finance Management System. Reach out to us, and we'll get back to you as soon as possible.
                </p>
                <p class="contact-text">
                    Email: support@financemanagementsystem.com<br>
                    Phone: +91 7981953997<br>
                    Address: GIET COLLEGE
                </p>
            </div>
        </div>
    </div>
</body>

</html>
