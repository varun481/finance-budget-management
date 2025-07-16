document.addEventListener("DOMContentLoaded", () => {
    const resendButton = document.getElementById("resend");
    const emailInput = document.querySelector("input[name='email']");

    resendButton.addEventListener("click", () => {
        const email = emailInput ? emailInput.value.trim() : "";
        console.log("Resend OTP - Email:", email); // Debugging

        if (!email) {
            alert("Email not found. Please try signing up again.");
            return;
        }

        fetch("<%= request.getContextPath() %>/signupservlete", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "action=resend&email=" + encodeURIComponent(email),
        })
        .then(response => {
            console.log("Resend OTP - Response Status:", response.status); // Debugging
            return response.text();
        })
        .then(data => {
            console.log("Resend OTP - Response Data:", data); // Debugging
            if (data.trim() === "success") {
                alert("A new OTP has been sent to " + email);
            } else {
                alert("Failed to resend OTP. Please try again.");
            }
        })
        .catch(error => {
            console.error("Error resending OTP:", error);
            alert("An error occurred while resending the OTP. Please try again.");
        });
    });
});