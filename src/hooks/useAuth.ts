type User = { id: string; password: string };

// LocalStorage keys (과제 체크용: 최소 3개 이상)
const USERS_KEY = "users";              // 가입 유저 목록
const AUTH_KEY = "auth";               // 로그인 상태(keep login 포함)
const TMDB_KEY = "TMDb-Key";            // TMDB API Key (과제 예시에서는 비밀번호 역할)
const REMEMBER_EMAIL_KEY = "rememberEmail"; // Remember me용 이메일 저장

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const loadUsers = (): User[] => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as User[];
  } catch {
    return [];
  }
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

type AuthState = {
  email: string;
  loggedIn: boolean;
  remember: boolean;
};

const setAuth = (state: AuthState) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(state));
};

const getAuth = (): AuthState | null => {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthState) : null;
  } catch {
    return null;
  }
};

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

    // 과제 요구(로그인 여부/키 저장)
    localStorage.setItem(TMDB_KEY, user.password);
    setAuth({ email, loggedIn: true, remember });

    // Remember me: 이메일 저장(자동완성/표시 용)
    if (remember) localStorage.setItem(REMEMBER_EMAIL_KEY, email);
    else localStorage.removeItem(REMEMBER_EMAIL_KEY);

    return true;
  };

  const logout = () => {
    // 🔥 중요: 로그아웃 시 인증 관련 키를 같이 지워야 실제로 로그아웃됨
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TMDB_KEY);
    // REMEMBER_EMAIL_KEY는 UX상 유지하고 싶으면 남겨도 되고, 완전 로그아웃이면 지워도 됨.
    // 여기서는 남겨서 다음 로그인 화면에 email 자동 입력 가능하게 둠.
  };

  const isAuthenticated = (): boolean => {
    const tmdb = localStorage.getItem(TMDB_KEY);
    const auth = getAuth();
    return !!tmdb && !!auth?.loggedIn;
  };

  const getRememberEmail = (): string => {
    return localStorage.getItem(REMEMBER_EMAIL_KEY) || "";
  };

  return { register, login, logout, isAuthenticated, getRememberEmail };
}

// (선택) 라우터 가드/ProtectedRoute에서 바로 쓰고 싶으면 유지
export function isAuthenticated(): boolean {
  const tmdb = localStorage.getItem(TMDB_KEY);
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    const auth = raw ? (JSON.parse(raw) as AuthState) : null;
    return !!tmdb && !!auth?.loggedIn;
  } catch {
    return false;
  }
}