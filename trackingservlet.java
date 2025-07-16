package financce;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;

@WebServlet("/trackingservlete")
public class trackingservlet extends HttpServlet {
    static class SavingsGoal {
        String id;
        String name;
        double goalAmount;
        String deadline;
        double currentSavings;
        double monthlySavings;
        String userId;

        SavingsGoal(String id, String name, double goalAmount, String deadline, double currentSavings, double monthlySavings, String userId) {
            this.id = id;
            this.name = name;
            this.goalAmount = goalAmount;
            this.deadline = deadline;
            this.currentSavings = currentSavings;
            this.monthlySavings = monthlySavings;
            this.userId = userId;
        }
    }

    static class Debt {
        String id;
        String name;
        double amount;
        double interestRate;
        double emi;
        String userId;

        Debt(String id, String name, double amount, double interestRate, double emi, String userId) {
            this.id = id;
            this.name = name;
            this.amount = amount;
            this.interestRate = interestRate;
            this.emi = emi;
            this.userId = userId;
        }
    }

    static class SpendingChallenge {
        String id;
        String name;
        double limit;
        String endDate;
        double currentSpending;
        String userId;

        SpendingChallenge(String id, String name, double limit, String endDate, double currentSpending, String userId) {
            this.id = id;
            this.name = name;
            this.limit = limit;
            this.endDate = endDate;
            this.currentSpending = currentSpending;
            this.userId = userId;
        }
    }

    private static List<SavingsGoal> savingsGoals = new ArrayList<>();
    private static List<Debt> debts = new ArrayList<>();
    private static List<SpendingChallenge> challenges = new ArrayList<>();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String type = request.getParameter("type");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        Gson gson = new Gson();

        if ("savingsGoals".equals(type)) {
            String userId = request.getParameter("userId");
            List<SavingsGoal> userGoals = new ArrayList<>();
            for (SavingsGoal goal : savingsGoals) {
                if (goal.userId.equals(userId)) {
                    userGoals.add(goal);
                }
            }
            gson.toJson(userGoals, response.getWriter());
        } else if ("debts".equals(type)) {
            String userId = request.getParameter("userId");
            List<Debt> userDebts = new ArrayList<>();
            for (Debt debt : debts) {
                if (debt.userId.equals(userId)) {
                    userDebts.add(debt);
                }
            }
            gson.toJson(userDebts, response.getWriter());
        } else if ("challenges".equals(type)) {
            String userId = request.getParameter("userId");
            List<SpendingChallenge> userChallenges = new ArrayList<>();
            for (SpendingChallenge challenge : challenges) {
                if (challenge.userId.equals(userId)) {
                    userChallenges.add(challenge);
                }
            }
            gson.toJson(userChallenges, response.getWriter());
        } else {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid type parameter");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");
        String userId = request.getParameter("userId");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        if ("addSavingsGoal".equals(action)) {
            String id = String.valueOf(savingsGoals.size() + 1);
            SavingsGoal goal = new SavingsGoal(
                id,
                request.getParameter("name"),
                Double.parseDouble(request.getParameter("goalAmount")),
                request.getParameter("deadline"),
                Double.parseDouble(request.getParameter("currentSavings")),
                Double.parseDouble(request.getParameter("monthlySavings")),
                userId
            );
            savingsGoals.add(goal);
            response.getWriter().write("{\"status\":\"success\"}");
        } else if ("addDebt".equals(action)) {
            String id = String.valueOf(debts.size() + 1);
            Debt debt = new Debt(
                id,
                request.getParameter("name"),
                Double.parseDouble(request.getParameter("amount")),
                Double.parseDouble(request.getParameter("interestRate")),
                Double.parseDouble(request.getParameter("emi")),
                userId
            );
            debts.add(debt);
            response.getWriter().write("{\"status\":\"success\"}");
        } else if ("addChallenge".equals(action)) {
            String id = String.valueOf(challenges.size() + 1);
            SpendingChallenge challenge = new SpendingChallenge(
                id,
                request.getParameter("name"),
                Double.parseDouble(request.getParameter("limit")),
                request.getParameter("endDate"),
                Double.parseDouble(request.getParameter("currentSpending")),
                userId
            );
            challenges.add(challenge);
            response.getWriter().write("{\"status\":\"success\"}");
        } else {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid action");
        }
    }
}
