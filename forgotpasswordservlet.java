package financce;

import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
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

@WebServlet("/forgotpassword")
public class forgotpasswordservlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final String DB_URL = "jdbc:mysql://localhost:3306/finance?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
    private static final String DB_USER = "root";
    private static final String DB_PASS = "VARUN.a@7981";
    private static final String EMAIL_FROM = "varun798195@gmail.com";
    private static final String EMAIL_PASS = "my password";
    private static final String SMTP_HOST = "smtp.gmail.com";
    private static final int SMTP_PORT = 587;
    private static final long OTP_VALIDITY_DURATION = 5 * 60 * 1000;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession();
        String action = request.getParameter("action");
        String email = request.getParameter("email");

        if ("send-otp".equals(action)) {
            if (email == null || email.isEmpty()) {
                response.getWriter().write("error");
                return;
            }

            Connection conn = null;
            PreparedStatement stmt = null;
            ResultSet rs = null;

            try {
                Class.forName("com.mysql.cj.jdbc.Driver");
                conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);

                // Check if email exists
                String sql = "SELECT id FROM users WHERE email = ?";
                stmt = conn.prepareStatement(sql);
                stmt.setString(1, email);
                rs = stmt.executeQuery();

                if (rs.next()) {
                    // Email exists, generate and send OTP
                    String generatedOTP = String.format("%06d", new Random().nextInt(999999));
                    sendOTPEmail(email, generatedOTP);

                    // Store OTP and email in session
                    session.setAttribute("resetOtp", generatedOTP);
                    session.setAttribute("resetOtpTimestamp", System.currentTimeMillis());
                    session.setAttribute("resetEmail", email);

                    response.getWriter().write("success");
                } else {
                    // Email not found
                    response.getWriter().write("not-found");
                }
            } catch (ClassNotFoundException | SQLException | MessagingException e) {
                e.printStackTrace();
                response.getWriter().write("error");
            } finally {
                try {
                    if (rs != null) rs.close();
                    if (stmt != null) stmt.close();
                    if (conn != null) conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        } else if ("verify-otp".equals(action)) {
            String otp = request.getParameter("otp");
            String sessionOTP = (String) session.getAttribute("resetOtp");
            Long otpTimestamp = (Long) session.getAttribute("resetOtpTimestamp");

            if (otpTimestamp == null || (System.currentTimeMillis() - otpTimestamp) > OTP_VALIDITY_DURATION) {
                session.removeAttribute("resetOtp");
                session.removeAttribute("resetOtpTimestamp");
                response.getWriter().write("expired");
                return;
            }

            if (otp.equals(sessionOTP)) {
                response.getWriter().write("success");
            } else {
                response.getWriter().write("error");
            }
        } else if ("reset-password".equals(action)) {
            String password = request.getParameter("password");
            String confirmPassword = request.getParameter("confirm-password");
            String resetEmail = (String) session.getAttribute("resetEmail");

            if (email == null || !email.equals(resetEmail)) {
                request.setAttribute("error", "Invalid session. Please try again.");
                request.getRequestDispatcher("/forgotpassword.jsp").forward(request, response);
                return;
            }

            if (!password.equals(confirmPassword)) {
                request.setAttribute("error", "Passwords do not match.");
                request.getRequestDispatcher("/resetpassword.jsp").forward(request, response);
                return;
            }

            Connection conn = null;
            PreparedStatement stmt = null;

            try {
                Class.forName("com.mysql.cj.jdbc.Driver");
                conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);

                // Update the password
                String hashedPassword = hashPassword(password);
                String sql = "UPDATE users SET password = ? WHERE email = ?";
                stmt = conn.prepareStatement(sql);
                stmt.setString(1, hashedPassword);
                stmt.setString(2, email);
                int rowsUpdated = stmt.executeUpdate();

                if (rowsUpdated > 0) {
                    // Clear session attributes
                    session.removeAttribute("resetOtp");
                    session.removeAttribute("resetOtpTimestamp");
                    session.removeAttribute("resetEmail");

                    // Redirect to login page with success message
                    request.setAttribute("message", "Password reset successfully. Please log in.");
                    request.getRequestDispatcher("/login.jsp").forward(request, response);
                } else {
                    request.setAttribute("error", "Failed to reset password. Please try again.");
                    request.getRequestDispatcher("/resetpassword.jsp").forward(request, response);
                }
            } catch (ClassNotFoundException | SQLException | NoSuchAlgorithmException e) {
                e.printStackTrace();
                request.setAttribute("error", "Error resetting password: " + e.getMessage());
                request.getRequestDispatcher("/resetpassword.jsp").forward(request, response);
            } finally {
                try {
                    if (stmt != null) stmt.close();
                    if (conn != null) conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        } else {
            response.getWriter().write("error");
        }
    }

    private String hashPassword(String password) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(password.getBytes());
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
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
        message.setSubject("Password Reset OTP");
        message.setText("Your password reset OTP is: " + otp + "\n\nValid for 5 minutes.");

        Transport.send(message);
    }
}
