<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Finance Management System</title>
    <link rel="stylesheet" href="<%= request.getContextPath() %>/navbar.css">
    <link rel="stylesheet" href="<%= request.getContextPath() %>/about.css">
    <script>
        window.contextPath = '<%= request.getContextPath() %>';
    </script>
    <script src="<%= request.getContextPath() %>/home.js"></script>
</head>
<body>
    <%@ include file="navbar.jsp" %>

    <div class="about-container">
        <div class="about-hero">
            <div class="about-image-container">
                <img src="<%= request.getContextPath() %>/api/placeholder/600/400" alt="About Image" class="about-image">
            </div>
            <div class="about-info">
                <h2 class="about-title">About Finance Management System</h2>
                <p class="about-text">
                    Welcome to the Finance Management System, your trusted partner in managing personal finances with ease and clarity. Our platform is designed to help you track your income, expenses, and savings effortlessly, empowering you to take control of your financial future.
                </p>
                <p class="about-text">
                    With features like detailed transaction tracking, savings charts, and a user-friendly interface, we make financial management accessible for everyone.
                </p>
            </div>
        </div>

        <div class="why-choose-us">
            <h2 class="why-choose-title">Why Choose Us</h2>
            <div class="why-choose-grid">
                <div class="why-choose-box">
                    <h3 class="box-title">Personalization</h3>
                    <p class="box-text">Tailor your financial tracking experience to suit your unique goals and preferences.</p>
                </div>
                <div class="why-choose-box">
                    <h3 class="box-title">Convenience</h3>
                    <p class="box-text">Access your financial data anytime, anywhere with our intuitive platform.</p>
                </div>
                <div class="why-choose-box">
                    <h3 class="box-title">Trust</h3>
                    <p class="box-text">Rely on our secure system to keep your financial information safe and private.</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>