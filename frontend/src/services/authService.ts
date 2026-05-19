import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db, handleFirestoreError } from './firebase';
import { User, OperationType } from '../types';

class AuthService {
  private user: User | null = null;
  private impersonatedUser: User | null = null;
  private authInitialized: boolean = false;
  private mockOTPs: Record<string, string> = {};

  constructor() {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await this.syncUser(firebaseUser);
      } else {
        this.user = null;
        this.impersonatedUser = null;
      }
      this.authInitialized = true;
    });
  }

  // Impersonation for Admin Proxy
  impersonate(user: User) {
    this.impersonatedUser = user;
  }

  stopImpersonating() {
    this.impersonatedUser = null;
  }

  isImpersonating(): boolean {
    return !!this.impersonatedUser;
  }

  // --- OTP MOCK METHODS ---
  async sendOTP(phone: string, email: string): Promise<boolean> {
    console.log(`Sending OTP to ${phone} and checking email ${email}`);
    
    // Check if user already exists with this phone or email across all collections
    const collections = ['users', 'drivers', 'carOwners'];
    
    for (const collName of collections) {
      const collRef = collection(db, collName);
      
      // Check phone
      const qPhone = query(collRef, where('phone', '==', phone));
      const phoneSnap = await getDocs(qPhone);
      if (!phoneSnap.empty) {
        throw new Error(`Phone number ${phone} is already registered. Please log in.`);
      }

      // Check email
      const qEmail = query(collRef, where('email', '==', email));
      const emailSnap = await getDocs(qEmail);
      if (!emailSnap.empty) {
        throw new Error(`Email ${email} is already registered. Please log in.`);
      }
    }

    // Mock OTP generation: 1234
    const otp = "1234";
    this.mockOTPs[phone] = otp;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }

  async sendLoginOTP(identifier: string): Promise<boolean> {
    console.log(`Sending Login OTP to ${identifier}`);
    
    // Check if user exists
    const collections = ['users', 'drivers', 'carOwners'];
    let userFound = false;
    
    for (const collName of collections) {
      const collRef = collection(db, collName);
      
      // Check identifier as email or phone
      const field = identifier.includes('@') ? 'email' : 'phone';
      const q = query(collRef, where(field, '==', identifier));
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        userFound = true;
        break;
      }
    }

    if (!userFound) {
      throw new Error(`Profile not found for ${identifier}. Please sign up first.`);
    }

    // Mock OTP generation: 1234
    const otp = "1234";
    this.mockOTPs[identifier] = otp;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }

  async verifyOTP(identifier: string, otp: string): Promise<boolean> {
    const savedOtp = this.mockOTPs[identifier];
    if (savedOtp && savedOtp === otp) {
      delete this.mockOTPs[identifier];
      return true;
    }
    return false;
  }
  // --- END OTP METHODS ---

  private async syncUser(firebaseUser: FirebaseUser) {
    const collections = ['users', 'drivers', 'carOwners'];
    for (const collName of collections) {
      const userDoc = await getDoc(doc(db, collName, firebaseUser.uid));
      if (userDoc.exists()) {
        this.user = userDoc.data() as User;
        return;
      }
    }
    this.user = null;
  }

  async signupAfterVerification(name: string, email: string, phone: string, role: User['role'] = 'user'): Promise<User> {
    try {
      // Use a default password for simplicity since user requested identifier-based login later
      const defaultPassword = "GoYatariUser@2025"; 
      
      const result = await createUserWithEmailAndPassword(auth, email, defaultPassword);
      const firebaseUser = result.user;

      const collectionName = this.getCollectionByRole(role);
      const userRef = doc(db, collectionName, firebaseUser.uid);
      
      const newUser: any = {
        id: firebaseUser.uid,
        userId: firebaseUser.uid,
        name: name,
        email: email,
        phone: phone,
        role: role,
        status: 'active',
        walletBalance: 0,
        createdAt: serverTimestamp()
      };

      await setDoc(userRef, newUser);
      this.user = newUser as User;
      return this.user;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please log in.');
      }
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const collections = ['users', 'drivers', 'carOwners'];

      // Standard sign-in attempt
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = result.user;

        // Find profile by UID
        for (const collName of collections) {
          const userDoc = await getDoc(doc(db, collName, firebaseUser.uid));
          if (userDoc.exists()) {
            this.user = userDoc.data() as User;
            return this.user;
          }
        }

        // Fallback: find by email
        for (const collName of collections) {
          const q = query(collection(db, collName), where('email', '==', email));
          const snap = await getDocs(q);
          if (!snap.empty) {
            this.user = snap.docs[0].data() as User;
            return this.user;
          }
        }

        throw new Error('User profile not found in database.');
      } catch (authError: any) {
        // Repair path for prototype: if auth account missing but profile exists, try to re-create
        if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential' || authError.code === 'auth/wrong-password') {
          for (const collName of collections) {
            const collRef = collection(db, collName);
            const q = query(collRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              const foundUser = querySnapshot.docs[0].data();
              try {
                await createUserWithEmailAndPassword(auth, email, password);
                this.user = foundUser as User;
                return this.user;
              } catch (ce: any) {
                if (ce.code === 'auth/email-already-in-use') {
                  const otherPass = password === 'GoYatariUser@2025' ? 'defaultPassword123' : 'GoYatariUser@2025';
                  try {
                    await signInWithEmailAndPassword(auth, email, otherPass);
                    this.user = foundUser as User;
                    return this.user;
                  } catch (se) {}
                }
              }
            }
          }
        }
        throw authError;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        throw new Error('Incorrect credentials. Please verify your identity.');
      }
      throw error;
    }
  }

  async loginByEmailOrPhone(identifier: string): Promise<User> {
    try {
      const collections = ['users', 'drivers', 'carOwners'];
      let foundUser: any = null;
      let userColl: string = '';
      
      // Always find the user in Firestore first to get the correct email and role
      for (const collName of collections) {
        const collRef = collection(db, collName);
        const field = identifier.includes('@') ? 'email' : 'phone';
        const q = query(collRef, where(field, '==', identifier));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          foundUser = querySnapshot.docs[0].data();
          userColl = collName;
          break;
        }
      }
      
      if (!foundUser) {
        throw new Error(`Profile not found for ${identifier}. Please sign up first.`);
      }

      const email = foundUser.email;
      const defaultPassword = "GoYatariUser@2025";

      // Attempt to sign in
      try {
        const result = await signInWithEmailAndPassword(auth, email, defaultPassword);
        this.user = foundUser as User;
        return this.user;
      } catch (authError: any) {
        // If user not found in Auth but exists in Firestore (sync issue), or wrong password,
        // since we verified OTP, we can potentially re-sync or just report clearly.
        // For this demo environment, we'll try to re-create the auth account if it doesn't exist
        if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential' || authError.code === 'auth/wrong-password') {
          try {
            // Attempt to login with old password first
            try {
              const oldResult = await signInWithEmailAndPassword(auth, email, "defaultPassword123");
              this.user = foundUser as User;
              return this.user;
            } catch (innerErr) {
              // If still failing, it might be a missing Auth account or password mismatch.
              // Since OTP was verified (pre-requisite for this method in common flow), 
              // we can safely attempt to create/reset the account in this prototype environment.
              const isMissingOrInvalid = 
                authError.code === 'auth/user-not-found' || 
                authError.code === 'auth/invalid-credential' ||
                (innerErr as any).code === 'auth/user-not-found' ||
                (innerErr as any).code === 'auth/invalid-credential';

              if (isMissingOrInvalid) {
                try {
                  // Attempt to create the user. If they already exist, this might fail with email-already-in-use
                  // but we already know they exist in Firestore but auth won't let us in.
                  const createResult = await createUserWithEmailAndPassword(auth, email, defaultPassword);
                  this.user = foundUser as User;
                  return this.user;
                } catch (createErr: any) {
                  // Fallback: if they exist, maybe it's just a truly different password?
                  // In a real app we'd trigger a password reset. Here we'll just report the failure.
                  if (createErr.code === 'auth/email-already-in-use') {
                    throw new Error("Authentication failed (Account exists but password mismatch). Please register again to reset your access.");
                  }
                  throw new Error("Authentication failed and auto-repair failed. Please sign up again.");
                }
              }
              throw new Error("Authentication failed. If you are a test user, please register again to reset your access.");
            }
          } catch (repairErr: any) {
            throw repairErr;
          }
        }
        throw authError;
      }
    } catch (error: any) {
      console.error('Detailed Login Error:', error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        throw new Error('Incorrect credentials or account out of sync. Try registering again.');
      }
      throw error;
    }
  }

  async loginWithGoogle(role: User['role'] = 'user'): Promise<User> {
    const provider = new GoogleAuthProvider();
    let firebaseUser: FirebaseUser;
    
    try {
      const result = await signInWithPopup(auth, provider);
      firebaseUser = result.user;
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Authentication cancelled by user');
      }
      throw error;
    }

    const collectionName = this.getCollectionByRole(role);
    try {
      // Check if user exists in their respective collection
      const userRef = doc(db, collectionName, firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new user record if they don't exist
        const newUser: any = {
          id: firebaseUser.uid,
          userId: firebaseUser.uid, // Required by rules
          name: firebaseUser.displayName || 'New User',
          email: firebaseUser.email || '',
          phone: firebaseUser.phoneNumber || '',
          role: role,
          avatar: firebaseUser.photoURL || '',
          status: 'active',
          walletBalance: 0,
          createdAt: serverTimestamp()
        };

        // Add role-specific fields required by rules
        if (role === 'driver') {
          newUser.driverId = firebaseUser.uid;
          newUser.cashCollected = 0;
          newUser.rating = 5.0;
          newUser.isKycVerified = false;
        } else if (role === 'owner') {
          newUser.ownerId = firebaseUser.uid;
          newUser.verificationStatus = 'PENDING';
        }

        await setDoc(userRef, newUser);
        this.user = newUser as User;
      } else {
        this.user = userSnap.data() as User;
      }

      return this.user;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, collectionName);
      throw error;
    }
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    if (!this.user) throw new Error('No user logged in');
    
    const role = this.user.role;
    const collectionName = this.getCollectionByRole(role);
    const userRef = doc(db, collectionName, this.user.id);
    
    try {
      await setDoc(userRef, { ...updates, updatedAt: serverTimestamp() }, { merge: true });
      this.user = { ...this.user, ...updates };
      return this.user;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, collectionName);
      throw error;
    }
  }

  private getCollectionByRole(role: User['role']): string {
    switch (role) {
      case 'driver': return 'drivers';
      case 'owner': return 'carOwners';
      default: return 'users';
    }
  }

  getCurrentUser(): User | null {
    return this.impersonatedUser || this.user;
  }

  getRealUser(): User | null {
    return this.user;
  }

  async logout() {
    await signOut(auth);
    this.user = null;
  }
  
  isInitialized(): boolean {
    return this.authInitialized;
  }
}

export const authService = new AuthService();
