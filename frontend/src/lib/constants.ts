export const APPROVAL_THRESHOLD = 6;
export const QUESTIONS_PER_MODULE = 10;
export const TOTAL_MODULES = 4;
export const TOTAL_QUESTIONS = QUESTIONS_PER_MODULE * TOTAL_MODULES;
export const PHONE_DIGITS_LENGTH = 11;

export const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"|,.<>?\/\\`~]).{6,}$/;

export const LETTER_RANKS = ['S+', 'A', 'B', 'C', 'D'] as const;

// ---------------------------------------------------------------------------
// Role constants
// ---------------------------------------------------------------------------

export const E_ROLE = {
  ADMINISTRATOR: 'ADMINISTRATOR',
  STUDENT: 'STUDENT',
} as const;

export type ValueOf<T> = T[keyof T];

export type UserRole = ValueOf<typeof E_ROLE>;

export const USER_ROLE_MAPPER: Record<UserRole, string> = {
  ADMINISTRATOR: 'Administrador',
  STUDENT: 'Aluno',
};

export const USER_ROLE_OPTIONS = Object.entries(USER_ROLE_MAPPER).map(
  ([value, label]) => ({ value: value as UserRole, label }),
);
