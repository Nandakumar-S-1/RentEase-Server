# Authentication Flow

The RentEase authentication system is built for security and multi-step verification. It supports standard Email/Password registration with OTP verification, as well as Social Login via Google.

## 🛡 Registration & Verification

1.  **Request Registration**: User submits `email`, `password`, etc.
2.  **Pending State**: The system doesn't save the user to the database immediately. Instead, it stores the data in **Redis** with a `pending_user:` prefix and generates a 6-digit OTP.
3.  **OTP Delivery**: The OTP is sent to the user's email/phone and stored in Redis.
4.  **Verification**: The user submits the 6-digit OTP.
    -   The system checks for maximum attempts (max 5) to prevent brute-forcing.
    -   If valid, the user data is retrieved from Redis and persisted to **PostgreSQL**.
    -   If the user role is `OWNER`, an `OwnerProfile` is automatically created.
5.  **Completion**: Redis data is cleared, and a pair of JWT tokens (Access & Refresh) is returned.

## 🔑 Login & Session Management

-   **Standard Login**: Verifies credentials and returns JWT tokens.
-   **Google Auth**: Handles OAuth2 flow and maps Google profiles to RentEase users.
-   **Refresh Token**: Allows users to stay logged in by swapping a valid refresh token for a new access token.

## 🆘 Recovery

-   **Forgot Password**: Initiates a password reset flow.
-   **Resend OTP**: Allows users to request a new OTP if the previous one expired (handled in Redis).

## 🛠 Technical Details

-   **Storage**: Redis (Volatile sessions/OTP), PostgreSQL (Persistent users).
-   **Security**: Bcrypt for password hashing, JWT for stateless sessions.
-   **Modules involved**:
    -   `CreateUserUseCase`
    -   `VerifyOtpUseCase`
    -   `LoginUserUseCase`
    -   `GoogleAuthUseCase`
    -   `RefreshTokenUseCase`
