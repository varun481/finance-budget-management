package financce;

import com.google.gson.Gson;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/summaryservlete")
public class summaryservlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final String DB_URL = "jdbc:mysql://localhost:3306/finance?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "@Sujeeth*#Single5";

    static class Summary {
        double totalPurchases;
        double totalIncome;
        double savingsAmount;

        Summary(double totalPurchases, double totalIncome, double savingsAmount) {
            this.totalPurchases = totalPurchases;
            this.totalIncome = totalIncome;
            this.savingsAmount = savingsAmount;
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

        Connection conn = null;
        PreparedStatement stmtPurchases = null;
        PreparedStatement stmtIncome = null;
        PreparedStatement stmtAllCredits = null;
        PreparedStatement stmtAllDebits = null;
        ResultSet rsPurchases = null;
        ResultSet rsIncome = null;
        ResultSet rsAllCredits = null;
        ResultSet rsAllDebits = null;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);

            // Current month purchases (DEBIT)
            String sqlPurchases = "SELECT COALESCE(SUM(amount), 0) AS total FROM transactions " +
                                 "WHERE user_id = ? AND type = 'DEBIT' " +
                                 "AND YEAR(transaction_date) = YEAR(CURRENT_DATE) " +
                                 "AND MONTH(transaction_date) = MONTH(CURRENT_DATE)";
            stmtPurchases = conn.prepareStatement(sqlPurchases);
            stmtPurchases.setInt(1, userId);
            rsPurchases = stmtPurchases.executeQuery();
            double totalPurchases = rsPurchases.next() ? rsPurchases.getDouble("total") : 0;

            // Current month income (CREDIT)
            String sqlIncome = "SELECT COALESCE(SUM(amount), 0) AS total FROM transactions " +
                              "WHERE user_id = ? AND type = 'CREDIT' " +
                              "AND YEAR(transaction_date) = YEAR(CURRENT_DATE) " +
                              "AND MONTH(transaction_date) = MONTH(CURRENT_DATE)";
            stmtIncome = conn.prepareStatement(sqlIncome);
            stmtIncome.setInt(1, userId);
            rsIncome = stmtIncome.executeQuery();
            double totalIncome = rsIncome.next() ? rsIncome.getDouble("total") : 0;

            // All-time credits
            String sqlAllCredits = "SELECT COALESCE(SUM(amount), 0) AS total FROM transactions " +
                                  "WHERE user_id = ? AND type = 'CREDIT'";
            stmtAllCredits = conn.prepareStatement(sqlAllCredits);
            stmtAllCredits.setInt(1, userId);
            rsAllCredits = stmtAllCredits.executeQuery();
            double allTimeCredits = rsAllCredits.next() ? rsAllCredits.getDouble("total") : 0;

            // All-time debits
            String sqlAllDebits = "SELECT COALESCE(SUM(amount), 0) AS total FROM transactions " +
                                 "WHERE user_id = ? AND type = 'DEBIT'";
            stmtAllDebits = conn.prepareStatement(sqlAllDebits);
            stmtAllDebits.setInt(1, userId);
            rsAllDebits = stmtAllDebits.executeQuery();
            double allTimeDebits = rsAllDebits.next() ? rsAllDebits.getDouble("total") : 0;

            // Calculate savings (all-time credits - all-time debits)
            double savingsAmount = allTimeCredits - allTimeDebits;

            // Return summary as JSON
            Summary summary = new Summary(totalPurchases, totalIncome, savingsAmount);
            response.setContentType("application/json");
            new Gson().toJson(summary, response.getWriter());
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
                if (rsPurchases != null) rsPurchases.close();
                if (rsIncome != null) rsIncome.close();
                if (rsAllCredits != null) rsAllCredits.close();
                if (rsAllDebits != null) rsAllDebits.close();
                if (stmtPurchases != null) stmtPurchases.close();
                if (stmtIncome != null) stmtIncome.close();
                if (stmtAllCredits != null) stmtAllCredits.close();
                if (stmtAllDebits != null) stmtAllDebits.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}