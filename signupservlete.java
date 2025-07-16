package financce;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Properties;
import java.util.Random;
import javax.mail.*;
import javax.mail.internet.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/signupservlete")
public class signupservlete extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final String DB_URL = "jdbc:mysql://localhost:3306/finance?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
    private static final String DB_USER = "root";
    private static final String DB_PASS = "@Sujeeth*#Single5";
    private static final String EMAIL_FROM = "varun798195@gmail.com";
    private static final String EMAIL_PASS = "gvlo qwuu tnha yohq";
    private static final String SMTP_HOST = "smtp.gmail.com";
    private static final int SMTP_PORT = 587;
    private static final long OTP_VALIDITY_DURATION = 5 * 60 * 1000;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession();
        String action = request.getParameter("action");
        String fullname = request.getParameter("fullname");
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        if ("resend".equals(action)) {
            if (email == null || email.isEmpty()) {
                response.getWriter().write("error");
                return;
            }

            try {
                String generatedOTP = String.format("%06d", new Random().nextInt(999999));
                sendOTPEmail(email, generatedOTP);
                session.setAttribute("signupOtp", generatedOTP);
                session.setAttribute("signupOtpTimestamp", System.currentTimeMillis());
                session.setAttribute("signupEmail", email);
                response.getWriter().write("success");
            } catch (MessagingException e) {
                e.printStackTrace();
                response.getWriter().write("error");
            }
            return;
        }

        if ("verify-otp".equals(action)) {
            String otp = request.getParameter("otp") != null ? request.getParameter("otp").trim() : "";
            String sessionOTP = (String) session.getAttribute("signupOtp");
            Long otpTimestamp = (Long) session.getAttribute("signupOtpTimestamp");
            email = (String) session.getAttribute("signupEmail");
            fullname = (String) session.getAttribute("signupFullname");
            password = (String) session.getAttribute("signupPassword");

            // Debugging: Log the OTP values
            System.out.println("Entered OTP: '" + otp + "'");
            System.out.println("Session OTP: '" + sessionOTP + "'");

            if (otp.isEmpty() || sessionOTP == null) {
                request.setAttribute("error", "OTP or session data missing. Please try again.");
                request.getRequestDispatcher("/signupotp.jsp").forward(request, response);
                return;
            }

            if (otpTimestamp == null || (System.currentTimeMillis() - otpTimestamp) > OTP_VALIDITY_DURATION) {
                session.removeAttribute("signupOtp");
                session.removeAttribute("signupOtpTimestamp");
                request.setAttribute("error", "OTP has expired. Please try again.");
                request.getRequestDispatcher("/signupotp.jsp").forward(request, response);
                return;
            }

            if (otp.equals(sessionOTP)) {
                Connection con = null;
                PreparedStatement insertStmt = null;
                ResultSet generatedKeys = null;

                try {
                    Class.forName("com.mysql.cj.jdbc.Driver");
                    con = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);

                    insertStmt = con.prepareStatement(
                        "INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)",
                        java.sql.Statement.RETURN_GENERATED_KEYS);
                    insertStmt.setString(1, fullname);
                    insertStmt.setString(2, email);
                    insertStmt.setString(3, password);

                    int result = insertStmt.executeUpdate();
                    if (result > 0) {
                        generatedKeys = insertStmt.getGeneratedKeys();
                        int userId = -1;
                        if (generatedKeys.next()) {
                            userId = generatedKeys.getInt(1);
                        }

                        session.setAttribute("userId", userId);
                        session.setAttribute("userEmail", email);
                        session.setAttribute("userFullname", fullname);
                        session.setAttribute("authenticated", true);

                        session.removeAttribute("signupOtp");
                        session.removeAttribute("signupOtpTimestamp");
                        session.removeAttribute("signupEmail");
                        session.removeAttribute("signupFullname");
                        session.removeAttribute("signupPassword");

                        response.sendRedirect(request.getContextPath() + "/home.jsp");
                    } else {
                        request.setAttribute("error", "Error creating account. Try again.");
                        request.getRequestDispatcher("/signupotp.jsp").forward(request, response);
                    }
                } catch (ClassNotFoundException | SQLException e) {
                    e.printStackTrace();
                    request.setAttribute("error", "Exception: " + e.getMessage());
                    request.getRequestDispatcher("/signupotp.jsp").forward(request, response);
                } finally {
                    try {
                        if (generatedKeys != null) generatedKeys.close();
                        if (insertStmt != null) insertStmt.close();
                        if (con != null) con.close();
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }
                }
            } else {
                request.setAttribute("error", "Invalid OTP. Please try again.");
                request.getRequestDispatcher("/signupotp.jsp").forward(request, response);
            }
            return;
        }

        if (fullname == null || email == null || password == null ||
            fullname.isEmpty() || email.isEmpty() || password.isEmpty()) {
            request.setAttribute("error", "All fields are required.");
            request.getRequestDispatcher("/signup.jsp").forward(request, response);
            return;
        }

        Connection con = null;
        PreparedStatement checkStmt = null;
        ResultSet rs = null;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            con = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);

            checkStmt = con.prepareStatement("SELECT * FROM users WHERE email = ?");
            checkStmt.setString(1, email);
            rs = checkStmt.executeQuery();

            if (rs.next()) {
                request.setAttribute("error", "Account already exists. Please log in.");
                request.getRequestDispatcher("/signup.jsp").forward(request, response);
            } else {
                String generatedOTP = String.format("%06d", new Random().nextInt(999999));
                sendOTPEmail(email, generatedOTP);

                session.setAttribute("signupOtp", generatedOTP);
                session.setAttribute("signupOtpTimestamp", System.currentTimeMillis());
                session.setAttribute("signupEmail", email);
                session.setAttribute("signupFullname", fullname);
                session.setAttribute("signupPassword", password);

                request.getRequestDispatcher("/signupotp.jsp").forward(request, response);
            }
        } catch (ClassNotFoundException | SQLException | MessagingException e) {
            e.printStackTrace();
            request.setAttribute("error", "Exception: " + e.getMessage());
            request.getRequestDispatcher("/signup.jsp").forward(request, response);
        } finally {
            try {
                if (rs != null) rs.close();
                if (checkStmt != null) checkStmt.close();
                if (con != null) con.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    private void sendOTPEmail(String toEmail, String otp) throws MessagingException {
        Properties props = new Properties();
        props.put("mail.smtp.host", SMTP_HOST);
        props.put("mail.smtp.port", SMTP_PORT);
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");

        Session mailSession = Session.getInstance(props, new javax.mail.Authenticator() {
            protected javax.mail.PasswordAuthentication getPasswordAuthentication() {
                return new javax.mail.PasswordAuthentication(EMAIL_FROM, EMAIL_PASS);
            }
        });

        Message message = new MimeMessage(mailSession);
        message.setFrom(new InternetAddress(EMAIL_FROM));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
        message.setSubject("Your Signup OTP");
        message.setText("Your OTP code is: " + otp + "\n\nValid for 5 minutes.");

        Transport.send(message);
    }
}