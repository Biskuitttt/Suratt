// src/services/firebase.js
import { db } from '../firebase/config';
import { doc, getDoc, collection, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

export class FirebaseService {
  // Test Firebase connection and explore collections
  static async testConnection() {
    try {
      console.log('Testing Firebase connection...');
      console.log('Database instance:', db);
      
      // Try to list all special codes to see what's available
      console.log('Checking specialCodes collection...');
      const allCodes = await this.getAllSpecialCodes();
      console.log('Available special codes:', allCodes);
      
      // If no special codes found, offer to create sample data
      if (allCodes.length === 0) {
        console.log('No special codes found. Collection is empty.');
        console.log('Would you like to create sample data? Available codes will be:');
        console.log('- test (Test Code)');
        console.log('- admin (Admin Code)'); 
        console.log('- guest (Guest Code)');
        console.log('Call FirebaseService.createSampleData() to create them.');
      }
      
      return true;
    } catch (error) {
      console.error('Firebase connection test failed:', error);
      return false;
    }
  }

  // Mengambil data special code dari Firebase (with case-sensitive search)
  static async getSpecialCodeData(code) {
    try {
      console.log('Attempting to get special code:', code);
      console.log('Database:', db);
      
      // First try exact match (case-sensitive)
      console.log('Trying exact match:', code);
      let docRef = doc(db, 'specialCodes', code);
      let docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        console.log('Document exists (exact match), data:', docSnap.data());
        return docSnap.data();
      }
      
      // If not found, try lowercase
      const codeLower = code.toLowerCase();
      if (codeLower !== code) {
        console.log('Trying lowercase:', codeLower);
        docRef = doc(db, 'specialCodes', codeLower);
        docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          console.log('Document exists (lowercase match), data:', docSnap.data());
          return docSnap.data();
        }
      }
      
      // If not found, try capitalized (first letter uppercase)
      const codeCapitalized = code.charAt(0).toUpperCase() + code.slice(1).toLowerCase();
      if (codeCapitalized !== code && codeCapitalized !== codeLower) {
        console.log('Trying capitalized:', codeCapitalized);
        docRef = doc(db, 'specialCodes', codeCapitalized);
        docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          console.log('Document exists (capitalized match), data:', docSnap.data());
          return docSnap.data();
        }
      }
      
      console.log('No document found with any case variation');
      return null;
    } catch (error) {
      console.error('Error getting special code:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      return null;
    }
  }

  // Mengambil semua gambar untuk code tertentu
  static async getImagesForCode(code) {
    try {
      const imagesRef = collection(db, 'specialCodes', code.toLowerCase(), 'images');
      const querySnapshot = await getDocs(imagesRef);
      
      const images = [];
      querySnapshot.forEach((doc) => {
        images.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return images.sort((a, b) => a.order - b.order); // Sort by order field
    } catch (error) {
      console.error('Error getting images:', error);
      return [];
    }
  }

  // Mengambil semua special codes yang tersedia
  static async getAllSpecialCodes() {
    try {
      const codesRef = collection(db, 'specialCodes');
      const querySnapshot = await getDocs(codesRef);
      
      const codes = [];
      querySnapshot.forEach((doc) => {
        codes.push({
          code: doc.id,
          ...doc.data()
        });
      });
      
      return codes;
    } catch (error) {
      console.error('Error getting special codes:', error);
      return [];
    }
  }

  // Validasi special code saja (email divalidasi oleh Firebase Auth)
  static async validateSpecialCode(code) {
    const data = await this.getSpecialCodeData(code);
    return data !== null;
  }

  // Fix existing data - convert document IDs to lowercase
  static async fixExistingData() {
    try {
      console.log('Checking and fixing existing data...');
      
      const allCodes = await this.getAllSpecialCodes();
      const fixes = [];
      
      for (const codeItem of allCodes) {
        const currentId = codeItem.code;
        const correctId = currentId.toLowerCase().replace(/\s+/g, '');
        
        if (currentId !== correctId) {
          console.log(`Fixing: "${currentId}" → "${correctId}"`);
          
          // Create new document with correct ID
          const newDocRef = doc(db, 'specialCodes', correctId);
          const oldDocRef = doc(db, 'specialCodes', currentId);
          
          // Copy data
          const data = {
            name: codeItem.name,
            active: true,
            createdAt: new Date()
          };
          
          await setDoc(newDocRef, data);
          
          // Delete old document (optional - comment out if you want to keep both)
          // await deleteDoc(oldDocRef);
          
          fixes.push({ from: currentId, to: correctId });
        }
      }
      
      if (fixes.length > 0) {
        console.log('=== DATA FIXED ===');
        fixes.forEach(fix => {
          console.log(`✅ ${fix.from} → ${fix.to}`);
        });
      } else {
        console.log('No fixes needed - all data is already correct!');
      }
      
      return fixes;
    } catch (error) {
      console.error('Error fixing data:', error);
      return [];
    }
  }

  // Create group member codes based on names (simplified)
  static async createGroupMemberCodes(memberNames) {
    try {
      console.log('Creating name entries for group members...');
      
      const results = [];
      
      for (const name of memberNames) {
        const codeId = name.toLowerCase().replace(/\s+/g, ''); // Remove spaces and make lowercase
        const docRef = doc(db, 'specialCodes', codeId);
        
        const codeData = {
          name: name,  // Just the name
          active: true,
          createdAt: new Date()
        };
        
        await setDoc(docRef, codeData);
        console.log(`✅ Created entry for ${name}: use "${codeId}" to access`);
        
        results.push({
          name: name,
          code: codeId,
          success: true
        });
      }
      
      console.log('=== GROUP MEMBER NAMES CREATED ===');
      console.log('Members can now access by entering:');
      results.forEach(result => {
        console.log(`- ${result.name} → enter "${result.code}"`);
      });
      
      return results;
    } catch (error) {
      console.error('Error creating group member names:', error);
      return [];
    }
  }

  // Create sample data if collection is empty (for development)
  static async createSampleData() {
    try {
      const sampleCodes = [
        {
          id: 'test',
          data: {
            name: 'Test Code',
            description: 'Test access code',
            active: true,
            createdAt: new Date(),
            type: 'test'
          }
        },
        {
          id: 'admin', 
          data: {
            name: 'Admin Code',
            description: 'Administrator access',
            active: true,
            createdAt: new Date(),
            type: 'admin'
          }
        },
        {
          id: 'guest',
          data: {
            name: 'Guest Code', 
            description: 'Guest access code',
            active: true,
            createdAt: new Date(),
            type: 'guest'
          }
        }
      ];

      console.log('Creating sample special codes...');
      
      for (const codeItem of sampleCodes) {
        const docRef = doc(db, 'specialCodes', codeItem.id);
        await setDoc(docRef, codeItem.data);
        console.log(`Created special code: ${codeItem.id}`);
      }
      
      console.log('Sample data created successfully!');
      return true;
    } catch (error) {
      console.error('Error creating sample data:', error);
      return false;
    }
  }
}