package financce;

import com.google.gson.Gson;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/transactionservlete")
public class transactionservlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final String DB_URL = "jdbc:mysql://localhost:3306/finance?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "@Sujeeth*#Single5";

    static class Transaction {
        int id;
        String type;
        double amount;
        String purpose;
        String date; // Added for graph.js compatibility

        Transaction(int id, String type, double amount, String purpose, String date) {
            this.id = id;
            this.type = type;
            this.amount = amount;
            this.purpose = purpose;
            this.date = date;
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        Integer userId = (session != null) ? (Integer) session.getAttribute("userId") : null;

        if (userId == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"User not logged in\"}");
            return;
        }

        String type = request.getParameter("type");
        String limitParam = request.getParameter("limit"); // New parameter to control limit
        if (type == null || (!type.equalsIgnoreCase("CREDIT") && !type.equalsIgnoreCase("DEBIT"))) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Invalid or missing type parameter\"}");
            return;
        }

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Transaction> transactions = new ArrayList<>();

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
            // Include transaction_date in the query
            String sql = "SELECT id, type, amount, purpose, DATE_FORMAT(transaction_date, '%Y-%m-%d') AS date " +
                        "FROM transactions " +
                        "WHERE user_id = ? AND type = ? " +
                        "AND YEAR(transaction_date) = YEAR(CURRENT_DATE) " +
                        "AND MONTH(transaction_date) = MONTH(CURRENT_DATE) ";
            if ("4".equals(limitParam)) {
                // Apply limit for home.js (Recent Credits/Debits and donut chart)
                if (type.equalsIgnoreCase("CREDIT")) {
                    sql += "ORDER BY amount DESC LIMIT 3";
                } else {
                    sql += "ORDER BY transaction_date DESC LIMIT 3";
                }
            } else {
                // No limit for graph.js, order by transaction_date for consistency
                sql += "ORDER BY transaction_date ASC";
            }
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, userId);
            stmt.setString(2, type.toUpperCase());
            rs = stmt.executeQuery();

            while (rs.next()) {
                transactions.add(new Transaction(
                    rs.getInt("id"),
                    rs.getString("type"),
                    rs.getDouble("amount"),
                    rs.getString("purpose"),
                    rs.getString("date") // Include date
                ));
            }

            // Log the number of transactions fetched
            System.out.println("Fetched " + transactions.size() + " " + type + " transactions for user " + userId +
                              (limitParam != null ? " with limit 4" : " without limit"));

            response.setContentType("application/json");
            new Gson().toJson(transactions, response.getWriter());
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Database driver not found: " + e.getMessage() + "\"}");
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Database error: " + e.getMessage() + "\"}");
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

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        Integer userId = (session != null) ? (Integer) session.getAttribute("userId") : null;

        if (userId == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"User not logged in\"}");
            return;
        }

        String action = request.getParameter("action");
        String type = request.getParameter("type");
        String amountStr = request.getParameter("amount");
        String purpose = request.getParameter("purpose");
        String idStr = request.getParameter("id");

        if (action == null || type == null || amountStr == null || purpose == null ||
            (!type.equalsIgnoreCase("CREDIT") && !type.equalsIgnoreCase("DEBIT")) ||
            (!action.equals("add") && !action.equals("edit"))) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Invalid or missing parameters\"}");
            return;
        }

        double amount;
        try {
            amount = Double.parseDouble(amountStr);
            if (amount <= 0) throw new NumberFormatException("Amount must be positive");
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Invalid amount format\"}");
            return;
        }

        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);

            if (action.equals("add")) {
                String sql = "INSERT INTO transactions (user_id, type, amount, purpose, transaction_date) VALUES (?, ?, ?, ?, NOW())";
                stmt = conn.prepareStatement(sql);
                stmt.setInt(1, userId);
                stmt.setString(2, type.toUpperCase());
                stmt.setDouble(3, amount);
                stmt.setString(4, purpose);
                stmt.executeUpdate();
            } else if (action.equals("edit")) {
                if (idStr == null) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Missing transaction ID for edit\"}");
                    return;
                }
                int id;
                try {
                    id = Integer.parseInt(idStr);
                } catch (NumberFormatException e) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Invalid transaction ID format\"}");
                    return;
                }
                String sql = "UPDATE transactions SET amount = ?, purpose = ? WHERE id = ? AND user_id = ?";
                stmt = conn.prepareStatement(sql);
                stmt.setDouble(1, amount);
                stmt.setString(2, purpose);
                stmt.setInt(3, id);
                stmt.setInt(4, userId);
                int rows = stmt.executeUpdate();
                if (rows == 0) {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Transaction not found or not owned by user\"}");
                    return;
                }
            }

            response.setContentType("application/json");
            response.getWriter().write("{\"status\":\"success\"}");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Database driver not found: " + e.getMessage() + "\"}");
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Database error: " + e.getMessage() + "\"}");
        } finally {
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        Integer userId = (session != null) ? (Integer) session.getAttribute("userId") : null;

        if (userId == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"User not logged in\"}");
            return;
        }

        String idStr = request.getParameter("id");
        if (idStr == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Missing transaction ID\"}");
            return;
        }

        int id;
        try {
            id = Integer.parseInt(idStr);
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Invalid transaction ID format\"}");
            return;
        }

        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
            String sql = "DELETE FROM transactions WHERE id = ? AND user_id = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, id);
            stmt.setInt(2, userId);
            int rows = stmt.executeUpdate();

            if (rows == 0) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Transaction not found or not owned by user\"}");
            } else {
                response.setContentType("application/json");
                response.getWriter().write("{\"status\":\"success\"}");
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Database driver not found: " + e.getMessage() + "\"}");
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Database error: " + e.getMessage() + "\"}");
        } finally {
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}