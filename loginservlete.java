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

@WebServlet("/loginservlete")
public class loginservlete extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final String DB_URL = "jdbc:mysql://localhost:3306/finance?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "VARUN.a@7981";
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
                session.setAttribute("loginOtp", generatedOTP);
                session.setAttribute("loginOtpTimestamp", System.currentTimeMillis());
                response.getWriter().write("success");
            } catch (MessagingException e) {
                e.printStackTrace();
                response.getWriter().write("error");
            }
            return;
        }

        if ("verify-otp".equals(action)) {
            String otp = request.getParameter("otp") != null ? request.getParameter("otp").trim() : "";
            String sessionOTP = (String) session.getAttribute("loginOtp");
            Long otpTimestamp = (Long) session.getAttribute("loginOtpTimestamp");
            email = (String) session.getAttribute("loginEmail");
            Integer userId = (Integer) session.getAttribute("loginUserId");
            String fullname = (String) session.getAttribute("loginFullname");

            System.out.println("Entered OTP: '" + otp + "'");
            System.out.println("Session OTP: '" + sessionOTP + "'");

            if (otp.isEmpty() || sessionOTP == null) {
                request.setAttribute("error", "OTP or session data missing. Please try again.");
                request.getRequestDispatcher("/loginotp.jsp").forward(request, response);
                return;
            }

            if (otpTimestamp == null || (System.currentTimeMillis() - otpTimestamp) > OTP_VALIDITY_DURATION) {
                session.removeAttribute("loginOtp");
                session.removeAttribute("loginOtpTimestamp");
                request.setAttribute("error", "OTP has expired. Please try again.");
                request.getRequestDispatcher("/loginotp.jsp").forward(request, response);
                return;
            }

            if (otp.equals(sessionOTP)) {
                session.setAttribute("userId", userId);
                session.setAttribute("userEmail", email);
                session.setAttribute("userFullname", fullname);
                session.setAttribute("authenticated", true);

                session.removeAttribute("loginOtp");
                session.removeAttribute("loginOtpTimestamp");
                session.removeAttribute("loginEmail");
                session.removeAttribute("loginUserId");
                session.removeAttribute("loginFullname");

                response.sendRedirect(request.getContextPath() + "/home.jsp");
            } else {
                request.setAttribute("error", "Invalid OTP. Please try again.");
                request.getRequestDispatcher("/loginotp.jsp").forward(request, response);
            }
            return;
        }

        if (email == null || password == null || email.isEmpty() || password.isEmpty()) {
            request.setAttribute("error", "Email and password are required.");
            request.getRequestDispatcher("/login.jsp").forward(request, response);
            return;
        }

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);

            String sql = "SELECT id, fullname FROM users WHERE email = ? AND password = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, email);
            stmt.setString(2, password);
            rs = stmt.executeQuery();

            if (rs.next()) {
                int userId = rs.getInt("id");
                String fullname = rs.getString("fullname");

                String generatedOTP = String.format("%06d", new Random().nextInt(999999));
                sendOTPEmail(email, generatedOTP);

                session.setAttribute("loginOtp", generatedOTP);
                session.setAttribute("loginOtpTimestamp", System.currentTimeMillis());
                session.setAttribute("loginEmail", email);
                session.setAttribute("loginUserId", userId);
                session.setAttribute("loginFullname", fullname);

                request.getRequestDispatcher("/loginotp.jsp").forward(request, response);
            } else {
                request.setAttribute("error", "Invalid email or password.");
                request.getRequestDispatcher("/login.jsp").forward(request, response);
            }
        } catch (ClassNotFoundException | SQLException | MessagingException e) {
            e.printStackTrace();
            request.setAttribute("error", "Exception: " + e.getMessage());
            request.getRequestDispatcher("/login.jsp").forward(request, response);
        } finally {
            try {
                if (rs != null) rs.close();
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
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
        message.setSubject("Your Login OTP");
        message.setText("Your OTP code is: " + otp + "\n\nValid for 5 minutes.");

        Transport.send(message);
    }
}