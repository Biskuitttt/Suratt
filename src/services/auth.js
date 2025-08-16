import { auth } from '../firebase/config';
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';

// Action code settings
const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: window.location.origin,
  // This must be true.
  handleCodeInApp: true
};

// Send sign-in link to email
export const sendLoginLink = async (email) => {
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    // Save the email locally so you don't need to ask the user for it again
    window.localStorage.setItem('emailForSignIn', email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Confirm sign-in with email link
export const confirmSignIn = async (email, link) => {
  try {
    if (isSignInWithEmailLink(auth, link)) {
      // Additional state check for email
      email = email || window.localStorage.getItem('emailForSignIn');
      if (!email) {
        return { success: false, error: 'Email not found. Please provide your email again.' };
      }

      const result = await signInWithEmailLink(auth, email, link);
      // Clear email from storage
      window.localStorage.removeItem('emailForSignIn');
      return { success: true, user: result.user };
    } else {
      return { success: false, error: 'Invalid sign-in link' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Sign out
export const signOut = async () => {
  try {
    await auth.signOut();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
