import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  createUser,
  findUserByEmail,
  updateUser,
} from '@/services/dataService';

const AuthContext = createContext(null);

const SESSION_KEY = 'biz_manager_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the existing session when the application starts.
  useEffect(() => {
    const storedSession = localStorage.getItem(SESSION_KEY);

    if (!storedSession) {
      setLoading(false);
      return;
    }

    try {
      const session = JSON.parse(storedSession);

      if (session?.id && session?.email) {
        setUser(session);
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Sign in an existing user.
   */
  const signIn = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    const foundUser = findUserByEmail(normalizedEmail);

    if (!foundUser) {
      throw new Error('No account found with this email address.');
    }

    if (foundUser.password !== password) {
      throw new Error('Incorrect password. Please try again.');
    }

    const session = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      phone: foundUser.phone || '',
      organizationName: foundUser.organizationName || '',
      organizationAddress: foundUser.organizationAddress || '',
      profilePicture: foundUser.profilePicture || '',
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
  };

  /**
   * Create a new user account and start a session.
   */
  const signUp = async (name, email, password) => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      throw new Error('Please enter your name.');
    }

    if (!normalizedEmail) {
      throw new Error('Please enter your email address.');
    }

    if (!password) {
      throw new Error('Please enter a password.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    if (findUserByEmail(normalizedEmail)) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = createUser(
      normalizedName,
      normalizedEmail,
      password
    );

    const session = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone || '',
      organizationName: newUser.organizationName || '',
      organizationAddress: newUser.organizationAddress || '',
      profilePicture: newUser.profilePicture || '',
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
  };

  /**
   * Sign out the current user.
   */
  const signOut = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  /**
   * Update the current user's profile.
   */
  const updateProfile = (
    name,
    email,
    phone,
    organizationName,
    organizationAddress,
    profilePicture
  ) => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      throw new Error('Please enter your name.');
    }

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      throw new Error('Please enter a valid email address.');
    }

    const matchingUser = findUserByEmail(normalizedEmail);

    if (matchingUser && matchingUser.id !== user?.id) {
      throw new Error(
        'An account with this email already exists.'
      );
    }

    const updatedUser = updateUser(user.id, {
      name: normalizedName,
      email: normalizedEmail,
      phone: phone?.trim() || '',
      organizationName: organizationName?.trim() || '',
      organizationAddress: organizationAddress?.trim() || '',
      profilePicture: profilePicture || '',
    });

    const session = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone || '',
      organizationName: updatedUser.organizationName || '',
      organizationAddress: updatedUser.organizationAddress || '',
      profilePicture: updatedUser.profilePicture || '',
    };

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(session)
    );

    setUser(session);
  };

  /**
   * Change the current user's password.
   */
  const changePassword = (currentPassword, nextPassword) => {
    const account = findUserByEmail(user?.email || '');

    if (!account || account.password !== currentPassword) {
      throw new Error('Your current password is incorrect.');
    }

    if (nextPassword.length < 6) {
      throw new Error(
        'Your new password must be at least 6 characters long.'
      );
    }

    updateUser(account.id, {
      password: nextPassword,
    });
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signUp,
      signOut,
      updateProfile,
      changePassword,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error(
      'useAuth must be used within an AuthProvider.'
    );
  }

  return context;
}
