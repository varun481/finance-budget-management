document.addEventListener("DOMContentLoaded", () => {
    const sendOtpButton = document.getElementById("send-otp");
    const verifyOtpButton = document.getElementById("verify-otp");
    const emailInput = document.getElementById("email");
    const otpInput = document.getElementById("otp");
    const otpSection = document.getElementById("otp-section");

    sendOtpButton.addEventListener("click", () => {
        const email = emailInput.value.trim();
        if (!email) {
            alert("Please enter your email address.");
            return;
        }

        // Make an AJAX request to send the OTP
        fetch("<%= request.getContextPath() %>/forgotpassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "action=send-otp&email=" + encodeURIComponent(email),
        })
        .then(response => response.text())
        .then(data => {
            if (data.trim() === "success") {
                alert("An OTP has been sent to " + email);
                otpSection.style.display = "block";
            } else if (data.trim() === "not-found") {
                alert("Email not found. Please check your email address.");
            } else {
                alert("Failed to send OTP. Please try again.");
            }
        })
        .catch(error => {
            console.error("Error sending OTP:", error);
            alert("An error occurred while sending the OTP. Please try again.");
        });
    });

    verifyOtpButton.addEventListener("click", () => {
        const email = emailInput.value.trim();
        const otp = otpInput.value.trim();
        if (!otp) {
            alert("Please enter the OTP.");
            return;
        }

        // Make an AJAX request to verify the OTP
        fetch("<%= request.getContextPath() %>/forgotpassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "action=verify-otp&email=" + encodeURIComponent(email) + "&otp=" + encodeURIComponent(otp),
        })
        .then(response => response.text())
        .then(data => {
            if (data.trim() === "success") {
                // Redirect to the reset password page
                window.location.href = "<%= request.getContextPath() %>/resetpassword.jsp?email=" + encodeURIComponent(email);
            } else {
                alert("Invalid OTP. Please try again.");
            }
        })
        .catch(error => {
            console.error("Error verifying OTP:", error);
            alert("An error occurred while verifying the OTP. Please try again.");
        });
    });
});