type User = { id: string; password: string };

const USERS_KEY = "users";
const AUTH_KEY = "auth";
const TMDB_KEY = "TMDb-Key";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const loadUsers = (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
const saveUsers = (users: User[]) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

export function useAuth() {
  const register = (email: string, apiKey: string, agree: boolean) => {
    if (!isEmail(email)) throw new Error("이메일 형식이 올바르지 않습니다.");
    if (!agree) throw new Error("필수 약관에 동의해주세요.");
    if (!apiKey) throw new Error("TMDB API Key(비밀번호)를 입력해주세요.");

    const users = loadUsers();
    if (users.some((u) => u.id === email)) throw new Error("이미 존재하는 계정입니다.");

    users.push({ id: email, password: apiKey });
    saveUsers(users);
    return true;
  };

  const login = (email: string, apiKey: string, remember: boolean) => {
    if (!isEmail(email)) throw new Error("이메일 형식이 올바르지 않습니다.");

    const users = loadUsers();
    const user = users.find((u) => u.id === email && u.password === apiKey);
    if (!user) throw new Error("이메일 또는 API Key가 올바르지 않습니다.");

    localStorage.setItem(TMDB_KEY, user.password);
    localStorage.setItem(AUTH_KEY, JSON.stringify({ email, loggedIn: true, remember }));

    if (remember) localStorage.setItem("rememberEmail", email);
    else localStorage.removeItem("rememberEmail");

    return true;
  };

  const logout = () => localStorage.removeItem(AUTH_KEY);

  return { register, login, logout };
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(TMDB_KEY) !== null;
}