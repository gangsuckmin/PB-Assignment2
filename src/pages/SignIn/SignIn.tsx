import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./SignIn.css";

export default function SignIn()
{
    const navigate = useNavigate();
    const { login, register } = useAuth();

    const [isLoginVisible, setIsLoginVisible] = useState(true);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [rememberMe, setRememberMe] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);

    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isRegisterEmailFocused, setIsRegisterEmailFocused] = useState(false);
    const [isRegisterPasswordFocused, setIsRegisterPasswordFocused] = useState(false);
    const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

    const isLoginFormValid = useMemo(() => {
        return !!email && !!password;
    }, [email, password]);

    const isRegisterFormValid = useMemo(() => {
        return (
            !!registerEmail &&
            !!registerPassword &&
            !!confirmPassword &&
            registerPassword === confirmPassword &&
            acceptTerms
        );
    }, [registerEmail, registerPassword, confirmPassword, acceptTerms]);

    // ===== Angular toggleCard =====
    const toggleCard = () => {
        setIsLoginVisible((prev) => !prev);

        setTimeout(() => {
            document.getElementById("register")?.classList.toggle("register-swap");
            document.getElementById("login")?.classList.toggle("login-swap");
        }, 50);
    };

    const focusInput = (name: string) => {
        switch (name) {
            case "email": setIsEmailFocused(true); break;
            case "password": setIsPasswordFocused(true); break;
            case "registerEmail": setIsRegisterEmailFocused(true); break;
            case "registerPassword": setIsRegisterPasswordFocused(true); break;
            case "confirmPassword": setIsConfirmPasswordFocused(true); break;
        }
    };

    const blurInput = (name: string) => {
        switch (name) {
            case "email": setIsEmailFocused(false); break;
            case "password": setIsPasswordFocused(false); break;
            case "registerEmail": setIsRegisterEmailFocused(false); break;
            case "registerPassword": setIsRegisterPasswordFocused(false); break;
            case "confirmPassword": setIsConfirmPasswordFocused(false); break;
        }
    };

    const handleLogin = async () => {
        try {
            await Promise.resolve(login(email, password, rememberMe));
            navigate("/", { replace: true });
        } catch (e: any) {
            alert(e?.message || "Login failed");
        }
    };

    const handleRegister = async () => {
        try {
            await Promise.resolve(register(registerEmail, registerPassword, acceptTerms));
            // 성공 시 로그인 화면으로 전환
            toggleCard();
        } catch (e: any) {
            alert(e?.message || "Register failed");
        }
    };

    return (
        <div>
            <div className="bg-image"></div>

            <div className="container">
                <div id="phone">
                    <div id="content-wrapper">

                        {/* LOGIN */}
                        <div id="login" className={`card ${isLoginVisible ? "" : "hidden"}`}>
                            <form onSubmit={async (e) => { e.preventDefault(); await handleLogin(); }}>
                                <h1>Sign in</h1>

                                <div className={`input ${(isEmailFocused || email) ? "active" : ""}`}>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => focusInput("email")}
                                        onBlur={() => blurInput("email")}
                                        className={isEmailFocused ? "line-active" : ""}
                                    />
                                    <label className={`${(isEmailFocused || email) ? "label-active" : ""} ${isEmailFocused ? "label-blue" : ""}`}>
                                        Username or Email
                                    </label>
                                </div>

                                <div className={`input ${(isPasswordFocused || password) ? "active" : ""}`}>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => focusInput("password")}
                                        onBlur={() => blurInput("password")}
                                        className={isPasswordFocused ? "line-active" : ""}
                                    />
                                    <label className={`${(isPasswordFocused || password) ? "label-active" : ""} ${isPasswordFocused ? "label-blue" : ""}`}>
                                        Password
                                    </label>
                                </div>

                                <span className="checkbox remember">
                                  <input
                                    id="remember"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                  />
                                  <label htmlFor="remember" className="read-text">Remember me</label>
                                </span>

                                <button type="submit" disabled={!isLoginFormValid}>Login</button>
                            </form>

                            <button
                                type="button"
                                className="account-check"
                                onClick={toggleCard}
                            >
                                Already an account? <b>Sign in</b>
                            </button>
                        </div>

                        {/* REGISTER */}
                        <div id="register" className={`card ${isLoginVisible ? "hidden" : ""}`}>
                            <form onSubmit={async (e) => { e.preventDefault(); await handleRegister(); }}>
                                <h1>Sign up</h1>

                                <div className={`input ${(isRegisterEmailFocused || registerEmail) ? "active" : ""}`}>
                                    <input
                                        type="email"
                                        value={registerEmail}
                                        onChange={(e) => setRegisterEmail(e.target.value)}
                                        onFocus={() => focusInput("registerEmail")}
                                        onBlur={() => blurInput("registerEmail")}
                                    />
                                    <label className={`${(isRegisterEmailFocused || registerEmail) ? "label-active" : ""}`}>
                                        Email
                                    </label>
                                </div>

                                <div className={`input ${(isRegisterPasswordFocused || registerPassword) ? "active" : ""}`}>
                                    <input
                                        type="password"
                                        value={registerPassword}
                                        onChange={(e) => setRegisterPassword(e.target.value)}
                                        onFocus={() => focusInput("registerPassword")}
                                        onBlur={() => blurInput("registerPassword")}
                                    />
                                    <label className={`${(isRegisterPasswordFocused || registerPassword) ? "label-active" : ""}`}>
                                        Password
                                    </label>
                                </div>

                                <div className={`input ${(isConfirmPasswordFocused || confirmPassword) ? "active" : ""}`}>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        onFocus={() => focusInput("confirmPassword")}
                                        onBlur={() => blurInput("confirmPassword")}
                                    />
                                    <label className={`${(isConfirmPasswordFocused || confirmPassword) ? "label-active" : ""}`}>
                                        Confirm Password
                                    </label>
                                </div>

                                <span className="checkbox remember">
                                  <input
                                    id="terms"
                                    type="checkbox"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                  />
                                  <label htmlFor="terms" className="read-text">
                                    I have read <b>Terms and Conditions</b>
                                  </label>
                                </span>

                                <button type="submit" disabled={!isRegisterFormValid}>Register</button>
                            </form>

                            <button
                                type="button"
                                className="account-check"
                                onClick={toggleCard}
                            >
                                Don't have an account? <b>Sign up</b>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
